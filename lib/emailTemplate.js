import { renderRichText } from "./richText";

// Pas de HTML brut injecté depuis l'admin pour les titres/légendes (contrairement aux paragraphes,
// qui passent par renderRichText — même règle que le rendu du site, voir lib/richText.js).
function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const FONT = "font-family:Arial,Helvetica,sans-serif;";

function renderBlock(block, accentColor) {
  if (block.type === "heading" && block.text) {
    return `<h2 style="font-size:22px;font-weight:800;color:${accentColor};margin:26px 0 10px;${FONT}">${escapeHtml(block.text)}</h2>`;
  }
  if (block.type === "subheading" && block.text) {
    return `<h3 style="font-size:17px;font-weight:700;color:#202822;margin:20px 0 8px;${FONT}">${escapeHtml(block.text)}</h3>`;
  }
  if (block.type === "paragraph" && block.text) {
    return `<p style="font-size:15px;line-height:1.6;color:#333333;margin:0 0 16px;${FONT}">${renderRichText(block.text)}</p>`;
  }
  if (block.type === "image" && block.image?.url) {
    return `<div style="margin:0 0 16px;">
      <img src="${block.image.url}" alt="${escapeHtml(block.image.alt)}" width="544" style="max-width:100%;height:auto;border-radius:8px;display:block;" />
      ${block.caption ? `<p style="font-size:12px;color:#8a938c;margin:6px 0 0;${FONT}">${escapeHtml(block.caption)}</p>` : ""}
    </div>`;
  }
  if (block.type === "table" && block.rows?.some((r) => r.label || r.value)) {
    const rows = block.rows
      .filter((r) => r.label || r.value)
      .map(
        (r) =>
          `<tr><td style="padding:8px 12px;font-weight:700;border-bottom:1px solid #e6e2d8;${FONT}font-size:14px;">${escapeHtml(r.label)}</td><td style="padding:8px 12px;border-bottom:1px solid #e6e2d8;${FONT}font-size:14px;">${escapeHtml(r.value)}</td></tr>`
      )
      .join("");
    return `${block.title ? `<h2 style="font-size:22px;font-weight:800;color:${accentColor};margin:26px 0 10px;${FONT}">${escapeHtml(block.title)}</h2>` : ""}
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 16px;">${rows}</table>`;
  }
  if (block.type === "faq" && block.items?.some((i) => i.question && i.answer)) {
    return block.items
      .filter((i) => i.question && i.answer)
      .map(
        (i) =>
          `<p style="margin:0 0 4px;font-weight:700;color:#202822;${FONT}font-size:15px;">${escapeHtml(i.question)}</p><p style="margin:0 0 16px;color:#333333;${FONT}font-size:15px;line-height:1.6;">${escapeHtml(i.answer)}</p>`
      )
      .join("");
  }
  return "";
}

export function renderBlocksToEmailHtml(blocks, accentColor) {
  return (blocks || []).map((b) => renderBlock(b, accentColor)).join("\n");
}

/** Habillage e-mail complet : logo/couleur du site en en-tête, contenu, pied avec désinscription
 * obligatoire (RGPD) — tout tiré automatiquement des réglages du site, rien à styliser à la main. */
export function wrapEmailTemplate({ bodyHtml, siteTitle, logoUrl, accentColor, unsubscribeUrl }) {
  const headerContent = logoUrl
    ? `<img src="${logoUrl}" alt="${escapeHtml(siteTitle)}" style="max-height:48px;" />`
    : `<span style="color:#ffffff;font-size:20px;font-weight:800;${FONT}">${escapeHtml(siteTitle)}</span>`;

  return `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:0;background:#f4f2ec;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ec;padding:24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
            <tr>
              <td style="background:${accentColor};padding:24px;text-align:center;">
                ${headerContent}
              </td>
            </tr>
            <tr>
              <td style="padding:28px 28px 8px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 28px;border-top:1px solid #e6e2d8;text-align:center;">
                <p style="font-size:12px;color:#8a938c;margin:0;${FONT}">
                  Vous recevez cet e-mail car vous êtes inscrit(e) à la newsletter de ${escapeHtml(siteTitle)}.
                  <br/><a href="${unsubscribeUrl}" style="color:#8a938c;">Se désinscrire</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
