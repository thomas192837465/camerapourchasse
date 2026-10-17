import { NextResponse } from "next/server";
import { sendEmail, emailEnabled } from "@/lib/email";
import { verifyAdmin } from "@/lib/adminAuth";

// Envoie réellement l'e-mail de réponse via Resend — exécuté côté serveur, où RESEND_API_KEY est
// disponible (lib/supportThreads.js appelle cette route au lieu d'importer lib/email.js : ce
// module est "use client", et une clé API serveur y vaudrait toujours undefined dans le bundle
// navigateur, ce qui faisait échouer l'envoi en silence — voir lib/supportThreads.js).
export async function POST(request) {
  try {
    const { idToken, to, subject, html, headers } = await request.json();

    const uid = await verifyAdmin(idToken);
    if (!uid) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    if (!emailEnabled) {
      return NextResponse.json({ error: "Resend n'est pas configuré (RESEND_API_KEY / RESEND_FROM_EMAIL)." }, { status: 503 });
    }
    if (!to || !html) {
      return NextResponse.json({ error: "Destinataire et contenu requis." }, { status: 400 });
    }

    const result = await sendEmail({ to, subject, html, headers });
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({ id: result.id });
  } catch (err) {
    console.error("Échec de l'envoi de la réponse :", err);
    return NextResponse.json({ error: "Une erreur est survenue, réessayez." }, { status: 500 });
  }
}
