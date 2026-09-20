import { NextResponse } from "next/server";
import { sendEmail, emailEnabled } from "@/lib/email";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

/**
 * Vérifie que le jeton envoyé par le navigateur appelant est un jeton Firebase Auth valide ET que
 * son titulaire est bien un admin — sans firebase-admin (non configuré ici, pas de compte de
 * service). "accounts:lookup" valide l'authenticité/l'expiration du jeton et renvoie l'UID ; la
 * lecture de admins/{uid} avec ce même jeton n'aboutit que si la règle Firestore l'autorise (donc
 * seulement si ce uid est bien admin) — voir firestore.rules.
 */
async function verifyAdmin(idToken) {
  if (!idToken) return null;
  const lookupRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!lookupRes.ok) return null;
  const lookupData = await lookupRes.json();
  const uid = lookupData.users?.[0]?.localId;
  if (!uid) return null;

  const adminRes = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/admins/${uid}`,
    { headers: { Authorization: `Bearer ${idToken}` } }
  );
  return adminRes.status === 200 ? uid : null;
}

/** Liste tous les e-mails inscrits, via l'API REST Firestore (même jeton admin déjà vérifié). */
async function listSubscriberEmails(idToken) {
  const emails = [];
  let pageToken;
  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/subscribers`
    );
    url.searchParams.set("pageSize", "300");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` } });
    if (!res.ok) break;
    const data = await res.json();
    for (const doc of data.documents || []) {
      const email = doc.fields?.email?.stringValue;
      if (email) emails.push(email);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);
  return emails;
}

export async function POST(request) {
  try {
    const { idToken, subject, message } = await request.json();

    const uid = await verifyAdmin(idToken);
    if (!uid) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    if (!emailEnabled) {
      return NextResponse.json({ error: "Resend n'est pas configuré (RESEND_API_KEY / RESEND_FROM_EMAIL)." }, { status: 503 });
    }
    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Sujet et message sont requis." }, { status: 400 });
    }

    const emails = await listSubscriberEmails(idToken);
    if (!emails.length) {
      return NextResponse.json({ sent: 0, total: 0 });
    }

    const html = message
      .split("\n")
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join("");

    let sent = 0;
    for (const email of emails) {
      // Envoi séquentiel volontaire : reste sous la limite de fréquence de l'API Resend, et une
      // erreur sur un destinataire ne doit pas empêcher l'envoi aux suivants.
      const result = await sendEmail({ to: email, subject, html });
      if (!result.error) sent += 1;
    }

    return NextResponse.json({ sent, total: emails.length });
  } catch (err) {
    console.error("Échec de l'envoi groupé :", err);
    return NextResponse.json({ error: "Une erreur est survenue, réessayez." }, { status: 500 });
  }
}
