import { NextResponse } from "next/server";
import { sendEmail, emailEnabled } from "@/lib/email";
import { getSettings } from "@/lib/settings";
import { wrapEmailTemplate } from "@/lib/emailTemplate";
import { CHECKOUT_DOMAIN } from "@/lib/gtag";

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

    // Applique directement le code (via le domaine Shopify du checkout) plutôt que de compter sur
    // un copier-coller manuel — impossible à automatiser dans un e-mail (les clients mail
    // suppriment tout JavaScript). Si le domaine n'est pas configuré (NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN
    // absent), le bouton retombe simplement sur la page produits, code à saisir à la main.
    const applyUrl = CHECKOUT_DOMAIN
      ? `https://${CHECKOUT_DOMAIN}/discount/${encodeURIComponent(code)}?redirect=${encodeURIComponent("/produits")}`
      : `${siteUrl}/produits`;

    const bodyHtml = `
      <h2 style="font-size:22px;font-weight:800;color:${accentColor};margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;">Voici votre code promo !</h2>
      <p style="font-size:15px;line-height:1.6;color:#333333;margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;">
        Merci de votre intérêt pour ${escapeHtml(siteTitle)}. Utilisez ce code lors de votre prochaine commande pour profiter de votre réduction.
      </p>
      <div style="text-align:center;margin:0 0 20px;">
        <span style="display:inline-block;border:2px dashed ${accentColor};border-radius:8px;padding:14px 32px;font-size:22px;font-weight:800;letter-spacing:2px;color:${accentColor};font-family:Arial,Helvetica,sans-serif;">${escapeHtml(code)}</span>
      </div>
      <div style="text-align:center;margin:0 0 14px;">
        <a href="${applyUrl}" style="display:inline-block;background:${accentColor};color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 30px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;">
          Utiliser mon code maintenant
        </a>
      </div>
      <div style="text-align:center;margin:0 0 20px;">
        <a href="${siteUrl}" style="color:${accentColor};text-decoration:underline;font-weight:600;font-size:13px;font-family:Arial,Helvetica,sans-serif;">
          ← Retour sur le site
        </a>
      </div>
      <p style="font-size:13px;line-height:1.5;color:#8a938c;margin:0;font-family:Arial,Helvetica,sans-serif;">
        Code à usage unique par client, non cumulable avec une autre offre en cours. Le bouton ci-dessus applique
        automatiquement le code — pas besoin de le recopier.
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
