import Image from "next/image";
import { renderRichText } from "@/lib/richText";

// Rendu des blocs de contenu libres d'une page catégorie (titres, paragraphes, photos,
// tableaux, FAQ), dans l'ordre choisi dans l'admin.
export default function CategoryContentBlocks({ blocks }) {
  if (!blocks?.length) return null;

  return (
    <section className="section category-content">
      {blocks.map((block) => {
        if (block.type === "heading") {
          return block.text ? (
            <h2 className="reco-title category-content-heading" key={block.id}>
              {block.text}
            </h2>
          ) : null;
        }

        if (block.type === "paragraph") {
          return block.text ? (
            <p
              className="category-content-paragraph"
              key={block.id}
              dangerouslySetInnerHTML={{ __html: renderRichText(block.text) }}
            />
          ) : null;
        }

        if (block.type === "image") {
          return block.image?.url ? (
            <figure className="category-content-figure" key={block.id}>
              <div className="category-content-image">
                <Image
                  src={block.image.url}
                  alt={block.image.alt || ""}
                  fill
                  sizes="(max-width: 960px) 100vw, 800px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              {block.caption ? <figcaption>{block.caption}</figcaption> : null}
            </figure>
          ) : null;
        }

        if (block.type === "table") {
          const rows = (block.rows || []).filter((r) => r.label || r.value);
          if (!rows.length) return null;
          return (
            <div className="category-content-table-wrap" key={block.id}>
              {block.title ? <h2 className="reco-title category-content-heading">{block.title}</h2> : null}
              {block.intro ? (
                <p
                  className="category-content-paragraph"
                  dangerouslySetInnerHTML={{ __html: renderRichText(block.intro) }}
                />
              ) : null}
              <table className="category-content-table">
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <th>{row.label}</th>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "faq") {
          const items = (block.items || []).filter((f) => f.question && f.answer);
          if (!items.length) return null;
          return (
            <div className="faq-list" key={block.id}>
              {items.map((item, i) => (
                <details className="faq-item" key={i}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          );
        }

        return null;
      })}
    </section>
  );
}
