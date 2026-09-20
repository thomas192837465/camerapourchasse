import { Webhook } from "svix";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Reçoit les évènements Resend (ouverture d'e-mail, etc.) — à configurer dans Resend →
// Webhooks → Add Endpoint avec cette URL, événement "email.opened" au minimum. Resend signe
// chaque appel (protocole Svix) : RESEND_WEBHOOK_SECRET (donné par Resend à la création du
// webhook) permet de vérifier que l'appel vient bien de Resend et n'a pas été forgé.
export async function POST(request) {
  const payload = await request.text();
  const svixHeaders = {
    "svix-id": request.headers.get("svix-id"),
    "svix-timestamp": request.headers.get("svix-timestamp"),
    "svix-signature": request.headers.get("svix-signature"),
  };

  if (!process.env.RESEND_WEBHOOK_SECRET) {
    return new Response("RESEND_WEBHOOK_SECRET manquant.", { status: 500 });
  }

  let event;
  try {
    const wh = new Webhook(process.env.RESEND_WEBHOOK_SECRET);
    event = wh.verify(payload, svixHeaders);
  } catch {
    return new Response("Signature invalide.", { status: 401 });
  }

  if (event.type === "email.opened") {
    const emailId = event.data?.email_id;
    if (emailId) {
      try {
        // emailEvents est réservé à l'admin (voir firestore.rules) — ce webhook s'y connecte
        // avec un compte admin existant, comme app/api/cron/abandoned-carts.
        await signInWithEmailAndPassword(auth, process.env.CRON_ADMIN_EMAIL, process.env.CRON_ADMIN_PASSWORD);
        await setDoc(doc(db, "emailEvents", emailId), { opened: true, openedAt: serverTimestamp() }, { merge: true });
      } catch (err) {
        console.error("Échec de l'enregistrement de l'ouverture :", err);
      }
    }
  }

  return new Response("ok");
}
