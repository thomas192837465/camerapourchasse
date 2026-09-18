"use client";

import { TrashIcon, StarIcon } from "@/components/Icons";
import SingleImageField from "./SingleImageField";

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          style={{ background: "none", border: "none", padding: 2, cursor: "pointer" }}
        >
          <StarIcon
            style={{ width: 20, height: 20, fill: n <= value ? "#00b67a" : "var(--border)", stroke: "none" }}
          />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsEditor({ testimonials, onChange }) {
  function update(index, patch) {
    onChange(testimonials.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }

  function add() {
    onChange([
      ...testimonials,
      { id: `temoignage-${Date.now()}`, name: "", rating: 5, title: "", text: "", image: { url: "", alt: "" } },
    ]);
  }

  function remove(index) {
    onChange(testimonials.filter((_, i) => i !== index));
  }

  return (
    <div>
      {testimonials.map((item, i) => (
        <div className="admin-card" style={{ background: "var(--bg)", marginBottom: 14 }} key={item.id || i}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <strong style={{ fontSize: "0.85rem" }}>Témoignage {i + 1}</strong>
            <button type="button" className="icon-btn" onClick={() => remove(i)} aria-label="Supprimer">
              <TrashIcon />
            </button>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Nom du client</label>
              <input value={item.name} onChange={(e) => update(i, { name: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Note</label>
              <StarPicker value={item.rating} onChange={(rating) => update(i, { rating })} />
            </div>
          </div>

          <div className="form-field" style={{ marginTop: 10 }}>
            <label>Titre court (ex : "Alertes reçues rapidement")</label>
            <input value={item.title} onChange={(e) => update(i, { title: e.target.value })} />
          </div>

          <div className="form-field" style={{ marginTop: 10 }}>
            <label>Témoignage</label>
            <textarea rows={3} value={item.text} onChange={(e) => update(i, { text: e.target.value })} />
          </div>

          <div className="form-field" style={{ marginTop: 10 }}>
            <label>Photo (optionnelle — ex : capture envoyée par le client)</label>
            <SingleImageField value={item.image} onChange={(image) => update(i, { image })} />
          </div>
        </div>
      ))}
      <button type="button" className="add-row-btn" onClick={add}>
        + Ajouter un témoignage
      </button>
    </div>
  );
}
