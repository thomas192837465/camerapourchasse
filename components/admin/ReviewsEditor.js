"use client";

import { TrashIcon, StarIcon } from "@/components/Icons";
import SingleImageField from "./SingleImageField";
import ReviewPhotosField from "./ReviewPhotosField";

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

export default function ReviewsEditor({ reviews, onChange }) {
  function update(index, patch) {
    onChange(reviews.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function add() {
    onChange([
      ...reviews,
      { id: `avis-${Date.now()}`, name: "", avatar: { url: "", alt: "" }, rating: 5, text: "", photos: [] },
    ]);
  }

  function remove(index) {
    onChange(reviews.filter((_, i) => i !== index));
  }

  return (
    <div>
      <p className="form-hint" style={{ marginBottom: 10 }}>
        La note moyenne affichée sur la fiche produit est calculée automatiquement à partir de ces avis.
      </p>
      {reviews.map((review, i) => (
        <div className="admin-card" style={{ background: "var(--bg)", marginBottom: 14 }} key={review.id || i}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <strong style={{ fontSize: "0.85rem" }}>Avis {i + 1}</strong>
            <button type="button" className="icon-btn" onClick={() => remove(i)} aria-label="Supprimer">
              <TrashIcon />
            </button>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Nom du client</label>
              <input value={review.name} onChange={(e) => update(i, { name: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Note</label>
              <StarPicker value={review.rating} onChange={(rating) => update(i, { rating })} />
            </div>
          </div>

          <div className="form-field" style={{ marginTop: 10 }}>
            <label>Photo de profil (optionnelle — sinon initiales du nom)</label>
            <SingleImageField value={review.avatar} onChange={(avatar) => update(i, { avatar })} />
          </div>

          <div className="form-field" style={{ marginTop: 10 }}>
            <label>Avis</label>
            <textarea rows={3} value={review.text} onChange={(e) => update(i, { text: e.target.value })} />
          </div>

          <div className="form-field" style={{ marginTop: 10 }}>
            <label>Photos jointes par le client (optionnelles)</label>
            <ReviewPhotosField photos={review.photos || []} onChange={(photos) => update(i, { photos })} />
          </div>
        </div>
      ))}
      <button type="button" className="add-row-btn" onClick={add}>
        + Ajouter un avis
      </button>
    </div>
  );
}
