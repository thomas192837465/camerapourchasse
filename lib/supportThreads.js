import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  onSnapshot,
  orderBy,
  query,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";

const COL = "supportThreads";
const MSG_SUBCOL = "messages";

/** Normalise une adresse e-mail en identifiant de document Firestore (même convention que
 * lib/subscribers.js) : un fil de discussion par adresse cliente. */
function threadIdFor(email) {
  return (email || "").trim().toLowerCase();
}

/** "Jean Dupont <jean@mail.com>" → { name: "Jean Dupont", email: "jean@mail.com" }. */
function parseFromHeader(from) {
  const match = (from || "").match(/^\s*"?([^"<]*)"?\s*<([^>]+)>\s*$/);
  if (match) return { name: match[1].trim(), email: match[2].trim().toLowerCase() };
  return { name: "", email: (from || "").trim().toLowerCase() };
}

function wrapMessageId(id) {
  if (!id) return "";
  return id.startsWith("<") ? id : `<${id}>`;
}

function mapMessageDoc(d) {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
  };
}

/** Enregistre un e-mail entrant (appelé depuis le webhook Resend email.received) et met à jour
 * le fil correspondant — un nouveau client crée son propre fil, un client connu y ajoute un message. */
export async function recordInboundEmail({ from, subject, html, text, resendEmailId, resendMessageId }) {
  const { name, email } = parseFromHeader(from);
  if (!email) return;
  const threadId = threadIdFor(email);
  const preview = (text || html || "").replace(/\s+/g, " ").trim().slice(0, 140);

  await setDoc(
    doc(db, COL, threadId),
    {
      customerEmail: email,
      customerName: name || email,
      lastMessageAt: serverTimestamp(),
      lastMessagePreview: preview,
      lastDirection: "inbound",
      unread: true,
    },
    { merge: true }
  );

  await addDoc(collection(db, COL, threadId, MSG_SUBCOL), {
    direction: "inbound",
    subject: subject || "",
    html: html || "",
    text: text || "",
    resendEmailId: resendEmailId || "",
    resendMessageId: resendMessageId || "",
    createdAt: serverTimestamp(),
  });
}

/** Flux temps réel de la liste des fils, les plus récents d'abord (réservé à l'admin). */
export function subscribeToThreads(callback, max = 100) {
  if (!firebaseEnabled) return () => {};
  const q = query(collection(db, COL), orderBy("lastMessageAt", "desc"), limit(max));
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          lastMessageAt: data.lastMessageAt?.toDate ? data.lastMessageAt.toDate().toISOString() : null,
        };
      })
    );
  });
}

export async function getThread(threadId) {
  if (!firebaseEnabled) return null;
  const snap = await getDoc(doc(db, COL, threadId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Flux temps réel des messages d'un fil, du plus ancien au plus récent. */
export function subscribeToThreadMessages(threadId, callback) {
  if (!firebaseEnabled) return () => {};
  const q = query(collection(db, COL, threadId, MSG_SUBCOL), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => callback(snap.docs.map(mapMessageDoc)));
}

export async function markThreadRead(threadId) {
  if (!firebaseEnabled) return;
  await setDoc(doc(db, COL, threadId), { unread: false }, { merge: true });
}

/** Envoie réellement l'e-mail (via app/api/admin/messages/send — pas lib/email.js directement :
 * ce module est "use client", et RESEND_API_KEY (variable serveur) y vaudrait toujours undefined
 * dans le bundle navigateur, ce qui faisait échouer l'envoi en silence) puis enregistre le message
 * sortant dans le fil, en créant celui-ci au passage s'il n'existait pas encore (`setDoc` avec
 * merge — utilisé aussi bien pour répondre à un fil existant que pour écrire en premier à un
 * client qui n'a jamais contacté le support). */
async function sendAndRecordOutbound(threadId, { to, customerName, subject, html, text, headers, idToken }) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");

  const res = await fetch("/api/admin/messages/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, to, subject, html, headers }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Échec de l'envoi.");

  await addDoc(collection(db, COL, threadId, MSG_SUBCOL), {
    direction: "outbound",
    subject: subject || "",
    html: html || "",
    text: text || "",
    resendMessageId: result?.id || "",
    createdAt: serverTimestamp(),
  });

  await setDoc(
    doc(db, COL, threadId),
    {
      customerEmail: to,
      ...(customerName ? { customerName } : {}),
      lastMessageAt: serverTimestamp(),
      lastMessagePreview: (text || html || "").replace(/\s+/g, " ").trim().slice(0, 140),
      lastDirection: "outbound",
      unread: false,
    },
    { merge: true }
  );

  return result;
}

/** Répond au client : envoie l'e-mail via Resend (avec In-Reply-To/References pour que ça reste
 * dans le même fil chez le client, pas un nouveau message isolé) et enregistre la réponse dans le
 * fil — pour garder l'historique complet visible côté admin, comme une vraie conversation.
 * `idToken` (Firebase Auth de l'admin connecté, via `user.getIdToken()`) est requis. */
export async function replyToThread(threadId, { html, text, subject, idToken }) {
  const thread = await getThread(threadId);
  if (!thread) throw new Error("Fil introuvable.");

  // Dernier message du fil (dans l'un ou l'autre sens) : on y chaîne la réponse (In-Reply-To) et on
  // reprend son sujet pour le préfixer "Re:", pour que ça s'affiche comme un seul fil chez le client.
  const lastMessageSnap = await getDocs(
    query(collection(db, COL, threadId, MSG_SUBCOL), orderBy("createdAt", "desc"), limit(1))
  );
  const lastMessage = lastMessageSnap.docs[0] ? mapMessageDoc(lastMessageSnap.docs[0]) : null;
  const refId = wrapMessageId(lastMessage?.resendMessageId);

  const originalSubject = lastMessage?.subject || "";
  const replySubject = subject || (originalSubject.startsWith("Re:") ? originalSubject : `Re: ${originalSubject || "votre message"}`);

  return sendAndRecordOutbound(threadId, {
    to: thread.customerEmail,
    subject: replySubject,
    html,
    text,
    headers: refId ? { "In-Reply-To": refId, References: refId } : undefined,
    idToken,
  });
}

/** Écrit en premier à un client (ex: depuis la liste des clients ayant commandé) — objet libre,
 * pas de fil existant requis : `sendAndRecordOutbound` crée le fil s'il n'existe pas déjà. */
export async function sendNewMessage({ customerEmail, customerName, subject, html, text, idToken }) {
  const threadId = threadIdFor(customerEmail);
  if (!threadId) throw new Error("Adresse e-mail du destinataire manquante.");

  return sendAndRecordOutbound(threadId, {
    to: customerEmail,
    customerName,
    subject,
    html,
    text,
    idToken,
  });
}
