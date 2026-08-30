"use client";

import { useRouter } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import { createCategory } from "@/lib/categories";

export default function NewCategoryPage() {
  const router = useRouter();

  async function handleSubmit(data) {
    await createCategory(data);
    router.push("/admin/categories");
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Nouvelle catégorie</h1>
          <p>Elle apparaîtra dans le sous-menu "Produits" si "Afficher dans le menu" est coché.</p>
        </div>
      </div>
      <CategoryForm onSubmit={handleSubmit} />
    </>
  );
}
