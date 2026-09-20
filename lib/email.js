import { Resend } from "resend";

const API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
// Nom affiché comme expéditeur dans la boîte mail du destinataire (ex: "WildTrail" au lieu de la
// partie avant le "@" de l'adresse, que les clients mail affichent par défaut quand seule une
// adresse brute est fournie). Réglable sans redéploiement via RESEND_FROM_NAME sur Vercel.
const FROM_NAME = process.env.RESEND_FROM_NAME || "WildTrail";

export const emailEnabled = Boolean(API_KEY && FROM_EMAIL);

let client = null;
function getClient() {
  if (!client) client = new Resend(API_KEY);
  return client;
}

/** Envoi générique — utilisé côté serveur uniquement (clé API privée). N'échoue jamais bruyamment
 * pour l'appelant : une erreur d'envoi ne doit jamais faire planter une inscription ou une commande. */
export async function sendEmail({ to, subject, html }) {
  if (!emailEnabled) {
    console.warn("Resend n'est pas configuré (RESEND_API_KEY / RESEND_FROM_EMAIL manquants) — e-mail non envoyé.");
    return { skipped: true };
  }
  try {
    const { data, error } = await getClient().emails.send({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to, subject, html });
    if (error) throw error;
    return { id: data?.id };
  } catch (err) {
    console.error("Échec de l'envoi d'e-mail :", err);
    return { error: err.message || "Échec de l'envoi." };
  }
}
