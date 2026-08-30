"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById, updateProduct, deleteProduct } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import { getSettings } from "@/lib/settings";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [general, setGeneral] = useState({ productImageWidth: 1200, productImageHeight: 1200 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([getProductById(id), getCategories(), getSettings("general")]).then(([p, c, g]) => {
      setProduct(p);
      setCategories(c);
      setGeneral(g);
      setReady(true);
    });
  }, [id]);

  async function handleSubmit(data) {
    await updateProduct(id, data);
    router.push("/admin/products");
  }

  async function handleDelete() {
    await deleteProduct({ ...product, id });
    router.push("/admin/products");
  }

  if (!ready) return <p>Chargement…</p>;
  if (!product) return <p>Produit introuvable.</p>;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Modifier « {product.name} »</h1>
        </div>
      </div>
      <ProductForm
        initialProduct={{ ...product, id }}
        categories={categories}
        generalSettings={general}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </>
  );
}
