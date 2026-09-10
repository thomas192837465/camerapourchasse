const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.wildtrail.fr";

/**
 * Construit alternates.canonical + un openGraph complet (url, locale, type inclus) pour une page.
 * Next.js remplace entièrement l'objet openGraph hérité du layout racine dès qu'un segment enfant
 * en déclare un (fusion "shallow" par clé, pas récursive — voir
 * node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md,
 * section "Merging"), donc chaque page doit redéclarer ces champs plutôt que compter sur l'héritage.
 *
 * title/description ne sont ajoutés que s'ils sont fournis, pour ne jamais écraser silencieusement
 * le titre par défaut du layout racine avec une valeur vide.
 */
export function pageMetadata(path, { title, description, images, type = "website" } = {}) {
  const meta = {
    alternates: { canonical: path },
    openGraph: {
      url: `${SITE_URL}${path}`,
      locale: "fr_FR",
      type,
    },
  };
  if (title) {
    meta.title = title;
    meta.openGraph.title = title;
  }
  if (description) {
    meta.description = description;
    meta.openGraph.description = description;
  }
  if (images && images.length) {
    meta.openGraph.images = images;
  }
  return meta;
}
