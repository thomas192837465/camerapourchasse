"use client";

import { useEffect, useState } from "react";
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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  function update(index, patch) {
    onChange(testimonials.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }

  function add() {
    onChange([
      ...testimonials,
      {
        id: `temoignage-${Date.now()}`,
        name: "",
        rating: 5,
        title: "",
        text: "",
        avatar: { url: "", alt: "" },
        image: { url: "", alt: "" },
        product: null,
      },
    ]);
  }

  function remove(index) {
    onChange(testimonials.filter((_, i) => i !== index));
  }

  function setProduct(index, slug) {
    if (!slug) return update(index, { product: null });
    const p = products.find((prod) => prod.slug === slug);
    if (!p) return;
    update(index, { product: { slug: p.slug, categoryId: p.categoryId, name: p.name } });
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
            <label>Photo de profil (optionnelle — sinon initiales du nom)</label>
            <SingleImageField value={item.avatar} onChange={(avatar) => update(i, { avatar })} />
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
            <label>Photo jointe (optionnelle — ex : capture d'écran envoyée par le client)</label>
            <SingleImageField value={item.image} onChange={(image) => update(i, { image })} />
          </div>

          <div className="form-field" style={{ marginTop: 10 }}>
            <label>Produit acheté (affiche "Achat vérifié" avec un lien vers la fiche produit)</label>
            <select value={item.product?.slug || ""} onChange={(e) => setProduct(i, e.target.value)}>
              <option value="">Aucun — ne pas afficher "Achat vérifié"</option>
              {products.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
      <button type="button" className="add-row-btn" onClick={add}>
        + Ajouter un témoignage
      </button>
    </div>
  );
}
