import Image from "next/image";
import { renderRichText } from "@/lib/richText";

function renderTextBlock(block) {
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

  return null;
}

function renderStandaloneBlock(block) {
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
            <p dangerouslySetInnerHTML={{ __html: renderRichText(item.answer) }} />
          </details>
        ))}
      </div>
    );
  }

  return null;
}

// Rendu des blocs de contenu libres (titres, paragraphes, photos, tableaux, FAQ), dans l'ordre
// choisi dans l'admin — utilisé aussi bien sur les pages catégorie que sur les fiches produit.
// Chaque bloc "image" vient se glisser à côté du texte qui le précède (titre/sous-titre/paragraphe
// accumulés depuis le dernier élément posé), en alternant photo à gauche / à droite d'une image à
// l'autre — un texte ou tableau/FAQ sans photo associée reste affiché pleine largeur.
export default function ContentBlocks({ blocks }) {
  if (!blocks?.length) return null;

  const rows = [];
  let buffer = [];
  let imageCount = 0;

  function flushText() {
    if (buffer.length) {
      rows.push({ kind: "text", key: `text-${rows.length}`, text: buffer });
      buffer = [];
    }
  }

  blocks.forEach((block) => {
    if (block.type === "image") {
      if (!block.image?.url) return;
      rows.push({ kind: "media", key: block.id, text: buffer, image: block, index: imageCount });
      imageCount += 1;
      buffer = [];
    } else if (block.type === "table" || block.type === "faq") {
      flushText();
      rows.push({ kind: "standalone", key: block.id, block });
    } else {
      buffer.push(block);
    }
  });
  flushText();

  return (
    <section className="section content-blocks">
      {rows.map((row) => {
        if (row.kind === "standalone") return renderStandaloneBlock(row.block);

        if (row.kind === "media") {
          if (!row.text.length) {
            return (
              <figure className="content-blocks-image-only" key={row.key}>
                <div className="content-blocks-image">
                  <Image
                    src={row.image.image.url}
                    alt={row.image.image.alt || ""}
                    fill
                    sizes="(max-width: 960px) 100vw, 1100px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                {row.image.caption ? <figcaption>{row.image.caption}</figcaption> : null}
              </figure>
            );
          }
          return (
            <div className={`content-blocks-row${row.index % 2 === 1 ? " content-blocks-row-reverse" : ""}`} key={row.key}>
              <div className="content-blocks-row-text">{row.text.map(renderTextBlock)}</div>
              <figure className="content-blocks-row-media">
                <div className="content-blocks-image">
                  <Image
                    src={row.image.image.url}
                    alt={row.image.image.alt || ""}
                    fill
                    sizes="(max-width: 960px) 100vw, 560px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                {row.image.caption ? <figcaption>{row.image.caption}</figcaption> : null}
              </figure>
            </div>
          );
        }

        return (
          <div className="content-blocks-text-only" key={row.key}>
            {row.text.map(renderTextBlock)}
          </div>
        );
      })}
    </section>
  );
}
