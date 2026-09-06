// Pas de "use client" ici volontairement : cette fonction est une simple manipulation de chaîne,
// utilisable aussi bien depuis des Server Components (ReviewsList, Header...) que des Client
// Components — contrairement au reste de lib/cloudinary.js qui appelle des API navigateur.

/**
 * Insère une transformation Cloudinary (ex: "w_500,q_auto,f_auto") dans une URL déjà envoyée —
 * pour servir une version réduite/compressée là où la pleine résolution ne sert à rien
 * (avatar, vignette, image de fond floutée...), sans re-télécharger le fichier.
 */
export function cloudinaryTransform(url, transform) {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
}
