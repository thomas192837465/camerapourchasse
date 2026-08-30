"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import { getSettings } from "@/lib/settings";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [general, setGeneral] = useState({ productImageWidth: 1200, productImageHeight: 1200 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([getCategories(), getSettings("general")]).then(([c, g]) => {
      setCategories(c);
      setGeneral(g);
      setReady(true);
    });
  }, []);

  async function handleSubmit(data) {
    const ref = await createProduct(data);
    router.push(`/admin/products/${ref.id}`);
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Nouveau produit</h1>
          <p>Renseignez les informations, ajoutez des photos, puis enregistrez.</p>
        </div>
      </div>
      {ready ? (
        <ProductForm categories={categories} generalSettings={general} onSubmit={handleSubmit} />
      ) : (
        <p>Chargement…</p>
      )}
    </>
  );
}
