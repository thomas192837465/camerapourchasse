/**
 * Construit le JSON-LD FAQPage à partir des blocs "faq" d'un contenu (articles de blog, pages
 * catégorie, pages statiques) — les mêmes blocs que ceux affichés visuellement par <ContentBlocks>.
 * Retourne null s'il n'y a aucune question valide, pour ne jamais injecter un schéma vide.
 */
export function buildFaqJsonLd(blocks) {
  const items = (blocks || [])
    .filter((b) => b.type === "faq")
    .flatMap((b) => b.items || [])
    .filter((f) => f.question && f.answer);

  if (!items.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
