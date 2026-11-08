"use client";

import { useEffect, useState } from "react";

// Liste partagée entre tous les blocs « Caméra » de la page : un seul appel à /api/admin/products.
let productsPromise = null;
function loadProducts() {
  if (!productsPromise) {
    productsPromise = fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => data.products || [])
      .catch(() => {
        productsPromise = null;
        return [];
      });
  }
  return productsPromise;
}

/** Bloc « Caméra » : carte produit placée à cet endroit précis du texte. */
export default function ProductBlockEditor({ block, onChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts().then((list) => {
      setProducts(list);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div className="form-field">
        <label>Produit</label>
        <select value={block.productSlug || ""} onChange={(e) => onChange({ productSlug: e.target.value })}>
          <option value="">{loading ? "Chargement…" : "— Choisir un produit —"}</option>
          {products.map((p) => (
            <option key={p.id} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field" style={{ marginTop: 10 }}>
        <label>Texte de la carte (facultatif)</label>
        <textarea
          rows={2}
          placeholder="ex : Notre choix pour surveiller un poste d'agrainage sans changer les piles."
          value={block.note || ""}
          onChange={(e) => onChange({ note: e.target.value })}
        />
        <p className="form-hint">Vide : la description courte du produit est utilisée.</p>
      </div>
    </>
  );
}
