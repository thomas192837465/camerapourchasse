"use client";

import { useEffect, useState } from "react";

const EMPTY_PACK = {
  enabled: false,
  bundledProductId: "",
  bundledVariantId: "",
  soloTitle: "",
  soloSubtitle: "",
  packTitle: "",
  packSubtitle: "",
  packBadge: "",
};

// Pack croisé avec un AUTRE produit Shopify déjà publié sur le site (ex : ce boîtier caméra +
// une carte SD vendue comme produit séparé, éventuellement fournie par un autre fournisseur).
// À la sélection du pack sur la fiche produit, les deux produits sont ajoutés au panier comme deux
// lignes Shopify distinctes — chacune peut ensuite être fournie et suivie séparément (voir DSers).
export default function PackConfigEditor({ value, onChange, excludeProductId }) {
  const pack = { ...EMPTY_PACK, ...value };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => setProducts((data.products || []).filter((p) => p.id !== excludeProductId)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [excludeProductId]);

  function set(patch) {
    onChange({ ...pack, ...patch });
  }

  const bundledProduct = products.find((p) => p.id === pack.bundledProductId);

  function handleProductChange(productId) {
    const p = products.find((prod) => prod.id === productId);
    set({
      bundledProductId: productId,
      bundledVariantId: p?.variants?.length === 1 ? p.variants[0].id : "",
    });
  }

  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <input type="checkbox" checked={pack.enabled} onChange={(e) => set({ enabled: e.target.checked })} />
        Proposer un pack avec un autre produit sur cette fiche
      </label>

      {pack.enabled ? (
        <>
          <div className="form-grid">
            <div className="form-field">
              <label>Produit à ajouter au pack (ex : une carte SD vendue séparément)</label>
              {loading ? (
                <p className="form-hint">Chargement des produits…</p>
              ) : (
                <select value={pack.bundledProductId} onChange={(e) => handleProductChange(e.target.value)}>
                  <option value="">— Choisir un produit —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {bundledProduct?.variants?.length > 1 ? (
              <div className="form-field">
                <label>Variante à inclure (ex : capacité de la carte SD)</label>
                <select value={pack.bundledVariantId} onChange={(e) => set({ bundledVariantId: e.target.value })}>
                  <option value="">— Choisir —</option>
                  {bundledProduct.variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title} — €{v.price.toFixed(2).replace(".", ",")}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          <p className="form-hint" style={{ margin: "10px 0" }}>
            Le prix du pack est calculé automatiquement (prix de cette fiche + prix du produit ajouté, tous deux
            réels Shopify) — rien à saisir à la main.
          </p>

          <div className="form-grid">
            <div className="form-field">
              <label>Titre de l'option "seule"</label>
              <input placeholder="ex : Caméra seule" value={pack.soloTitle} onChange={(e) => set({ soloTitle: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Sous-titre de l'option "seule"</label>
              <input
                placeholder="ex : Utilisez vos propres accessoires."
                value={pack.soloSubtitle}
                onChange={(e) => set({ soloSubtitle: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Titre du pack</label>
              <input
                placeholder="ex : Pack Prêt à filmer"
                value={pack.packTitle}
                onChange={(e) => set({ packTitle: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Sous-titre du pack</label>
              <input
                placeholder="ex : Pour commencer dès réception."
                value={pack.packSubtitle}
                onChange={(e) => set({ packSubtitle: e.target.value })}
              />
            </div>
            <div className="form-field full">
              <label>Badge du pack (laisser vide pour n'en afficher aucun)</label>
              <input
                placeholder='ex : "LE PLUS CHOISI"'
                value={pack.packBadge}
                onChange={(e) => set({ packBadge: e.target.value })}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
