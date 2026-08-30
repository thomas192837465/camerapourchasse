"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { shopifyGidToDocId, getAllShopifyProductContent } from "@/lib/shopifyContent";

export default function AdminShopifyProductsPage() {
  const [products, setProducts] = useState([]);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/shopify/products").then((r) => r.json()),
      getAllShopifyProductContent(),
    ])
      .then(([productsRes, contentMap]) => {
        if (productsRes.error) {
          setError(productsRes.error);
        } else {
          setProducts(productsRes.products);
        }
        setContent(contentMap);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Produits Shopify</h1>
          <p>
            {loading ? "Chargement…" : `${products.length} produit(s)`} — le nom, le prix et le stock viennent de
            Shopify. Clique sur un produit pour ajouter tes photos, la FAQ et le SEO.
          </p>
        </div>
      </div>

      {error ? (
        <div className="banner error">
          Impossible de charger les produits Shopify : {error}. Vérifie SHOPIFY_STORE_DOMAIN /
          SHOPIFY_STOREFRONT_TOKEN dans .env.local.
        </div>
      ) : null}

      <div className="admin-card">
        {products.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix</th>
                <th>Disponibilité</th>
                <th>Contenu du site</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const docId = shopifyGidToDocId(p.id);
                const enriched = Boolean(content[docId]?.images?.length);
                return (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>
                      €{Number(p.priceRange.minVariantPrice.amount).toFixed(2).replace(".", ",")}
                    </td>
                    <td>
                      <span className={`status-pill ${p.availableForSale ? "" : "draft"}`}>
                        {p.availableForSale ? "En stock" : "Indisponible"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${enriched ? "" : "draft"}`}>
                        {enriched ? "Complété" : "À compléter"}
                      </span>
                    </td>
                    <td className="row-actions">
                      <Link href={`/admin/shopify-products/${docId}`}>Modifier</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>
            {loading
              ? "Chargement…"
              : error
                ? null
                : "Aucun produit trouvé — crée un produit dans Shopify et publie-le sur le canal Headless."}
          </p>
        )}
      </div>
    </>
  );
}
