"use client";

import { useEffect, useState } from "react";

// Sélecteur de produits à mettre en avant dans un article de blog — passe par /api/admin/products
// (route serveur) plutôt que d'appeler getPublishedProducts() directement : le token Shopify est
// privé (server-only), un composant client ne peut donc pas interroger Shopify lui-même.
export default function RelatedProductsField({ value, onChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        setProducts(data.products || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const selected = value || [];

  function toggle(slug) {
    onChange(selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug]);
  }

  const filtered = search ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())) : products;

  return (
    <div className="admin-picker-field">
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {error ? <p className="form-hint">Impossible de charger les produits : {error}</p> : null}
      {loading ? (
        <p className="form-hint">Chargement des produits…</p>
      ) : (
        <div className="admin-picker-list">
          {filtered.length ? (
            filtered.map((p) => (
              <label key={p.id} className="admin-picker-item">
                <input type="checkbox" checked={selected.includes(p.slug)} onChange={() => toggle(p.slug)} />
                <span>{p.name}</span>
              </label>
            ))
          ) : (
            <p className="form-hint">Aucun produit trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
}
