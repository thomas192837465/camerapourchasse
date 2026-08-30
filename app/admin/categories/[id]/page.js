"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import { getCategoryById, updateCategory, deleteCategory } from "@/lib/categories";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getCategoryById(id).then((c) => {
      setCategory(c);
      setReady(true);
    });
  }, [id]);

  async function handleSubmit(data) {
    await updateCategory(id, data);
    router.push("/admin/categories");
  }

  async function handleDelete() {
    await deleteCategory(id);
    router.push("/admin/categories");
  }

  if (!ready) return <p>Chargement…</p>;
  if (!category) return <p>Catégorie introuvable.</p>;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Modifier « {category.name} »</h1>
        </div>
      </div>
      <CategoryForm initialCategory={{ ...category, id }} onSubmit={handleSubmit} onDelete={handleDelete} />
    </>
  );
}
