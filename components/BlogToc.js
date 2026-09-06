// Sommaire généré automatiquement à partir des blocs "Titre (H2)" et "Sous-titre (H3)" de
// l'article — chaque bloc correspondant porte déjà l'id utilisé ici comme ancre (voir ContentBlocks).
export default function BlogToc({ blocks }) {
  const headings = (blocks || []).filter((b) => (b.type === "heading" || b.type === "subheading") && b.text);
  if (headings.length < 2) return null;

  return (
    <nav className="blog-toc" aria-label="Sommaire">
      <strong className="blog-toc-title">Sommaire</strong>
      <ol>
        {headings.map((h) => (
          <li key={h.id} className={h.type === "subheading" ? "blog-toc-sub" : ""}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
