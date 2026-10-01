import crypto from "node:crypto";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getReceivedEmail } from "@/lib/email";
import { recordInboundEmail } from "@/lib/supportThreads";

// Vérifie la signature "Svix" que Resend appose sur chaque appel de webhook, à la main plutôt
// qu'avec le package svix (dont Webhook.verify() renvoyait `undefined` sans lever d'erreur dans
// cet environnement de build — un souci de compatibilité, pas une erreur d'usage). L'algorithme
// est documenté publiquement par Svix : https://docs.svix.com/receiving/verifying-payloads/how-manual
function verifySvixSignature(secret, payload, svixId, svixTimestamp, svixSignature) {
  if (!secret || !svixId || !svixTimestamp || !svixSignature) return false;

  // Le secret est fourni au format "whsec_<base64>".
  const secretBytes = Buffer.from(secret.startsWith("whsec_") ? secret.slice(6) : secret, "base64");
  const signedContent = `${svixId}.${svixTimestamp}.${payload}`;
  const expected = crypto.createHmac("sha256", secretBytes).update(signedContent).digest("base64");

  // L'en-tête peut contenir plusieurs signatures séparées par un espace (ex : "v1,abc v1,def") —
  // une seule doit correspondre.
  return svixSignature.split(" ").some((entry) => {
    const [, sig] = entry.split(",");
    if (!sig) return false;
    try {
      const a = Buffer.from(sig, "base64");
      const b = Buffer.from(expected, "base64");
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });
}

// Reçoit les évènements Resend (ouverture d'e-mail, messagerie entrante, etc.) — à configurer dans
// Resend → Webhooks → Add Endpoint avec cette URL, événements "email.opened" et "email.received"
// (c'est ce second événement qui alimente Admin → Messages clients, voir lib/supportThreads.js).
export async function POST(request) {
  const payload = await request.text();
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  console.log("[resend webhook] appel reçu, en-têtes svix présents :", {
    id: !!svixId,
    timestamp: !!svixTimestamp,
    signature: !!svixSignature,
  });

  if (!process.env.RESEND_WEBHOOK_SECRET) {
    console.error("[resend webhook] RESEND_WEBHOOK_SECRET manquant.");
    return new Response("RESEND_WEBHOOK_SECRET manquant.", { status: 500 });
  }

  const valid = verifySvixSignature(process.env.RESEND_WEBHOOK_SECRET, payload, svixId, svixTimestamp, svixSignature);
  if (!valid) {
    console.error("[resend webhook] signature invalide.");
    return new Response("Signature invalide.", { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch (err) {
    console.error("[resend webhook] payload JSON invalide :", err.message);
    return new Response("Payload invalide.", { status: 400 });
  }

  console.log("[resend webhook] évènement vérifié :", event?.type, "email_id:", event?.data?.email_id);

  if (event?.type === "email.received") {
    const emailId = event.data?.email_id;
    if (!emailId) {
      console.error("[resend webhook] email.received sans email_id dans le payload :", JSON.stringify(event.data));
    } else {
      try {
        // Le webhook ne transmet que des métadonnées (expéditeur, sujet) : le corps du message se
        // récupère à part via l'API Resend.
        const full = await getReceivedEmail(emailId);
        if (full) {
          await signInWithEmailAndPassword(auth, process.env.CRON_ADMIN_EMAIL, process.env.CRON_ADMIN_PASSWORD);
          await recordInboundEmail({
            from: full.from,
            subject: full.subject,
            html: full.html,
            text: full.text,
            resendEmailId: emailId,
            resendMessageId: full.message_id,
          });
          console.log("[resend webhook] e-mail entrant enregistré pour", full.from);
        } else {
          console.error("[resend webhook] échec de la récupération du corps de l'e-mail", emailId);
        }
      } catch (err) {
        console.error("[resend webhook] échec de l'enregistrement de l'e-mail entrant :", err.message);
      }
    }
  }

  if (event?.type === "email.opened") {
    const emailId = event.data?.email_id;
    if (!emailId) {
      console.error("[resend webhook] email.opened sans email_id dans le payload :", JSON.stringify(event.data));
    } else {
      try {
        // emailEvents est réservé à l'admin (voir firestore.rules) — ce webhook s'y connecte
        // avec un compte admin existant, comme app/api/cron/abandoned-carts.
        await signInWithEmailAndPassword(auth, process.env.CRON_ADMIN_EMAIL, process.env.CRON_ADMIN_PASSWORD);
        await setDoc(doc(db, "emailEvents", emailId), { opened: true, openedAt: serverTimestamp() }, { merge: true });
        console.log("[resend webhook] emailEvents/" + emailId + " marqué ouvert.");
      } catch (err) {
        console.error("[resend webhook] échec de l'enregistrement de l'ouverture :", err.message);
      }
    }
  }

  return new Response("ok");
}
