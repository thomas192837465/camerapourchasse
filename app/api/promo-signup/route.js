import { NextResponse } from "next/server";
import { sendEmail, emailEnabled } from "@/lib/email";
import { getSettings } from "@/lib/settings";
import { wrapEmailTemplate } from "@/lib/emailTemplate";

// Envoie le code de réduction promis par la popup d'accueil (voir components/PromoPopup.js).
// L'inscription à la liste e-mail elle-même se fait côté client (lib/subscribers.js), comme pour
// les autres formulaires du site — cette route ne s'occupe que de l'envoi, qui nécessite la clé
// Resend (privée, jamais exposée au navigateur).
export async function POST(request) {
  try {
    const { email } = await request.json();
    const clean = (email || "").trim().toLowerCase();
    if (!clean || !clean.includes("@") || clean.includes("/")) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
    }

    if (!emailEnabled) {
      return NextResponse.json({ error: "Resend n'est pas configuré." }, { status: 503 });
    }

    const [theme, content, seo] = await Promise.all([
      getSettings("theme"),
      getSettings("content"),
      getSettings("seo"),
    ]);
    const accentColor = theme.green900 || "#16301f";
    const logoUrl = content.logoImage?.url || "";
    const siteTitle = seo.siteTitle || `${content.logoLine1 || ""} ${content.logoLine2 || ""}`.trim() || "Notre boutique";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    const code = content.promoPopupCode || "BIENVENUE5";

    const bodyHtml = `
      <h2 style="font-size:22px;font-weight:800;color:${accentColor};margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;">Voici votre code promo !</h2>
      <p style="font-size:15px;line-height:1.6;color:#333333;margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;">
        Merci de votre intérêt pour ${escapeHtml(siteTitle)}. Utilisez ce code lors de votre prochaine commande pour profiter de votre réduction.
      </p>
      <div style="text-align:center;margin:0 0 20px;">
        <span style="display:inline-block;border:2px dashed ${accentColor};border-radius:8px;padding:14px 32px;font-size:22px;font-weight:800;letter-spacing:2px;color:${accentColor};font-family:Arial,Helvetica,sans-serif;">${escapeHtml(code)}</span>
      </div>
      <p style="font-size:13px;line-height:1.5;color:#8a938c;margin:0;font-family:Arial,Helvetica,sans-serif;">
        Code à usage unique par client, non cumulable avec une autre offre en cours.
      </p>
    `;

    const html = wrapEmailTemplate({
      bodyHtml,
      siteTitle,
      logoUrl,
      accentColor,
      unsubscribeUrl: `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(clean)}`,
    });

    const result = await sendEmail({ to: clean, subject: "Votre code promo -5€", html });
    if (result.error) {
      return NextResponse.json({ error: "Échec de l'envoi de l'e-mail." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Échec de l'envoi du code promo :", err);
    return NextResponse.json({ error: "Une erreur est survenue, réessayez." }, { status: 500 });
  }
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
