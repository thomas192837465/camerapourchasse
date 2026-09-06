import Image from "next/image";
import { renderRichText } from "@/lib/richText";

// Rendu des blocs de contenu libres (titres, paragraphes, photos, tableaux, FAQ), dans l'ordre
// choisi dans l'admin — utilisé aussi bien sur les pages catégorie que sur les fiches produit.
export default function ContentBlocks({ blocks }) {
  if (!blocks?.length) return null;

  return (
    <section className="section content-blocks">
      {blocks.map((block) => {
        if (block.type === "heading") {
          return block.text ? (
            <h2 id={block.id} className="reco-title content-blocks-heading" key={block.id}>
              {block.text}
            </h2>
          ) : null;
        }

        if (block.type === "subheading") {
          return block.text ? (
            <h3 id={block.id} className="content-blocks-subheading" key={block.id}>
              {block.text}
            </h3>
          ) : null;
        }

        if (block.type === "paragraph") {
          return block.text ? (
            <p
              className="content-blocks-paragraph"
              key={block.id}
              dangerouslySetInnerHTML={{ __html: renderRichText(block.text) }}
            />
          ) : null;
        }

        if (block.type === "image") {
          return block.image?.url ? (
            <figure className="content-blocks-figure" key={block.id}>
              <div className="content-blocks-image">
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
            <div className="content-blocks-table-wrap" key={block.id}>
              {block.title ? <h2 className="reco-title content-blocks-heading">{block.title}</h2> : null}
              {block.intro ? (
                <p
                  className="content-blocks-paragraph"
                  dangerouslySetInnerHTML={{ __html: renderRichText(block.intro) }}
                />
              ) : null}
              <table className="content-blocks-table">
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
