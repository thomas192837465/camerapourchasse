"use client";

import { TrashIcon } from "@/components/Icons";
import SingleImageField from "./SingleImageField";

const BLOCK_LABELS = {
  heading: "Titre (H2)",
  subheading: "Sous-titre (H3)",
  paragraph: "Paragraphe",
  image: "Photo",
  table: "Tableau",
  faq: "FAQ",
};

function makeBlock(type) {
  const id = `blk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const extra = {
    heading: { text: "" },
    subheading: { text: "" },
    paragraph: { text: "" },
    image: { image: { url: "", alt: "" }, caption: "" },
    table: { title: "", intro: "", rows: [] },
    faq: { items: [] },
  }[type];
  return { id, type, ...extra };
}

export default function ContentBlocksEditor({ blocks, onChange }) {
  function update(index, patch) {
    onChange(blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  }

  function remove(index) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function move(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function add(type) {
    onChange([...blocks, makeBlock(type)]);
  }

  return (
    <div>
      {blocks.map((block, i) => (
        <div className="admin-card" style={{ background: "var(--bg)", marginBottom: 14 }} key={block.id}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <strong style={{ fontSize: "0.85rem" }}>{BLOCK_LABELS[block.type]}</strong>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter">
                ↑
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => move(i, 1)}
                disabled={i === blocks.length - 1}
                aria-label="Descendre"
              >
                ↓
              </button>
              <button type="button" className="icon-btn" onClick={() => remove(i)} aria-label="Supprimer">
                <TrashIcon />
              </button>
            </div>
          </div>

          {block.type === "heading" || block.type === "subheading" ? (
            <input
              placeholder={
                block.type === "heading" ? "ex : Comment choisir sa caméra solaire ?" : "ex : Panneau intégré ou externe"
              }
              value={block.text}
              onChange={(e) => update(i, { text: e.target.value })}
            />
          ) : null}

          {block.type === "paragraph" ? (
            <>
              <textarea
                rows={4}
                placeholder="Texte du paragraphe…"
                value={block.text}
                onChange={(e) => update(i, { text: e.target.value })}
              />
              <p className="form-hint" style={{ marginTop: 6 }}>
                **texte** pour du gras, [texte](https://...) pour un lien.
              </p>
            </>
          ) : null}

          {block.type === "image" ? (
            <>
              <SingleImageField
                value={block.image}
                onChange={(img) => update(i, { image: img })}
                altPlaceholder="Texte alternatif (SEO)"
              />
              <div className="form-field" style={{ marginTop: 10 }}>
                <label>Légende (optionnelle)</label>
                <input value={block.caption} onChange={(e) => update(i, { caption: e.target.value })} />
              </div>
            </>
          ) : null}

          {block.type === "table" ? (
            <TableBlockEditor block={block} onChange={(patch) => update(i, patch)} />
          ) : null}

          {block.type === "faq" ? <FaqBlockEditor block={block} onChange={(patch) => update(i, patch)} /> : null}
        </div>
      ))}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.entries(BLOCK_LABELS).map(([type, label]) => (
          <button key={type} type="button" className="btn btn-outline btn-sm" onClick={() => add(type)}>
            + {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TableBlockEditor({ block, onChange }) {
  function updateRow(index, field, value) {
    onChange({ rows: block.rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)) });
  }

  function addRow() {
    onChange({ rows: [...block.rows, { label: "", value: "" }] });
  }

  function removeRow(index) {
    onChange({ rows: block.rows.filter((_, i) => i !== index) });
  }

  return (
    <>
      <div className="form-field">
        <label>Titre du tableau</label>
        <input
          placeholder="ex : Panneau intégré ou externe ?"
          value={block.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>
      <div className="form-field" style={{ marginTop: 8 }}>
        <label>Paragraphe d'intro (optionnel)</label>
        <textarea rows={2} value={block.intro} onChange={(e) => onChange({ intro: e.target.value })} />
      </div>

      <label className="form-hint" style={{ display: "block", margin: "12px 0 8px" }}>
        Lignes du tableau
      </label>
      {block.rows.map((row, ri) => (
        <div className="repeatable-row" key={ri}>
          <div className="form-field">
            <input placeholder="Libellé" value={row.label} onChange={(e) => updateRow(ri, "label", e.target.value)} />
          </div>
          <div className="form-field">
            <input placeholder="Valeur" value={row.value} onChange={(e) => updateRow(ri, "value", e.target.value)} />
          </div>
          <button type="button" className="icon-btn" onClick={() => removeRow(ri)} aria-label="Supprimer">
            <TrashIcon />
          </button>
        </div>
      ))}
      <button type="button" className="add-row-btn" onClick={addRow}>
        + Ajouter une ligne
      </button>
    </>
  );
}

function FaqBlockEditor({ block, onChange }) {
  function updateItem(index, field, value) {
    onChange({ items: block.items.map((it, i) => (i === index ? { ...it, [field]: value } : it)) });
  }

  function addItem() {
    onChange({ items: [...block.items, { question: "", answer: "" }] });
  }

  function removeItem(index) {
    onChange({ items: block.items.filter((_, i) => i !== index) });
  }

  return (
    <>
      {block.items.map((item, ii) => (
        <div className="repeatable-row" key={ii}>
          <div className="form-field">
            <input
              placeholder="Question"
              value={item.question}
              onChange={(e) => updateItem(ii, "question", e.target.value)}
            />
            <textarea
              rows={2}
              placeholder="Réponse"
              value={item.answer}
              onChange={(e) => updateItem(ii, "answer", e.target.value)}
              style={{ marginTop: 6 }}
            />
          </div>
          <button type="button" className="icon-btn" onClick={() => removeItem(ii)} aria-label="Supprimer">
            <TrashIcon />
          </button>
        </div>
      ))}
      <button type="button" className="add-row-btn" onClick={addItem}>
        + Ajouter une question
      </button>
    </>
  );
}
