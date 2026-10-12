// Code de réduction obtenu par inscription (popup de bienvenue ou encart de la fiche produit),
// mémorisé dans le navigateur pour être appliqué automatiquement au paiement Shopify.
const KEY = "wt_discount_code";

export function getStoredDiscountCode() {
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export function storeDiscountCode(code) {
  try {
    if (code) localStorage.setItem(KEY, code);
  } catch {}
}
