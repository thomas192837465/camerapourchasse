import { doc, setDoc } from "firebase/firestore";
import { db, firebaseEnabled } from "@/lib/firebase";

function page(title, text) {
  return new Response(
    `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>${title}</title></head>
    <body style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;color:#202822;">
      <h1 style="font-size:22px;">${title}</h1>
      <p style="color:#55605a;">${text}</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

// Lien de désinscription inclus dans chaque e-mail groupé (voir lib/emailTemplate.js) — mise à
// jour publique volontaire (firestore.rules autorise déjà l'écriture publique sur "subscribers",
// utilisée à l'inscription ; on s'en sert ici pour repasser le même document à `unsubscribed: true`
// plutôt que de le supprimer, pour garder une trace honnête plutôt qu'un simple oubli silencieux).
export async function GET(request) {
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase();

  if (!email || !firebaseEnabled) {
    return page("Lien invalide", "Cette adresse de désinscription n'est pas valide.");
  }

  try {
    await setDoc(doc(db, "subscribers", email), { unsubscribed: true }, { merge: true });
  } catch {
    return page("Une erreur est survenue", "Réessayez dans quelques instants.");
  }

  return page("Désinscription confirmée", `${email} ne recevra plus nos e-mails.`);
}
