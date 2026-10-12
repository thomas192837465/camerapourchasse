/**
 * Prix au format français : "74,99 €" (espace insécable avant le symbole, virgule décimale).
 * Utilisé partout sur la vitrine pour un affichage cohérent (cartes, fiche, panier, e-mails).
 */
export function formatPrice(value) {
  const n = Number(value) || 0;
  return `${n.toFixed(2).replace(".", ",")} €`;
}

/** Remplace {prix}, {produit}, {email}… dans un texte saisi dans l'admin. */
export function fill(text = "", vars = {}) {
  return String(text || "").replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}
