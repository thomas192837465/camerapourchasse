"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ShopifyContentForm from "@/components/admin/ShopifyContentForm";
import { getCategories } from "@/lib/categories";
import { getSettings } from "@/lib/settings";
import { shopifyGidToDocId, getShopifyProductContent, saveShopifyProductContent } from "@/lib/shopifyContent";

export default function EditShopifyProductPage() {
  const { id } = useParams();
  const [shopifyProduct, setShopifyProduct] = useState(null);
  const [content, setContent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [general, setGeneral] = useState({ productImageWidth: 1200, productImageHeight: 1200 });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/shopify/products").then((r) => r.json()),
      getShopifyProductContent(id),
      getCategories(),
      getSettings("general"),
    ])
      .then(([productsRes, contentData, c, g]) => {
        if (productsRes.error) {
          setError(productsRes.error);
        } else {
          const found = productsRes.products.find((p) => shopifyGidToDocId(p.id) === id);
          setShopifyProduct(found || null);
        }
        setContent(contentData);
        setCategories(c);
        setGeneral(g);
      })
      .catch((err) => setError(err.message))
      .finally(() => setReady(true));
  }, [id]);

  async function handleSubmit(data) {
    await saveShopifyProductContent(id, data);
  }

  if (!ready) return <p>Chargement…</p>;
  if (error) return <div className="banner error">Erreur : {error}</div>;
  if (!shopifyProduct) return <p>Produit Shopify introuvable (a-t-il été supprimé ou dépublié ?).</p>;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Modifier « {shopifyProduct.title} »</h1>
        </div>
      </div>
      <ShopifyContentForm
        shopifyProduct={shopifyProduct}
        initialContent={content}
        categories={categories}
        generalSettings={general}
        onSubmit={handleSubmit}
      />
    </>
  );
}
