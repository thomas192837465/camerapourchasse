"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/categories";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Catégories</h1>
          <p>{loading ? "Chargement…" : `${categories.length} catégorie(s)`} — gèrent le menu "Produits" de la navigation.</p>
        </div>
        <Link href="/admin/categories/new" className="btn btn-primary">
          + Ajouter une catégorie
        </Link>
      </div>

      <div className="admin-card">
        {categories.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Slug</th>
                <th>Ordre</th>
                <th>Dans le menu</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td>{c.order}</td>
                  <td>
                    <span className={`status-pill ${c.showInNav ? "" : "draft"}`}>
                      {c.showInNav ? "Visible" : "Masquée"}
                    </span>
                  </td>
                  <td className="row-actions">
                    <Link href={`/admin/categories/${c.id}`}>Modifier</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>
            {loading ? "Chargement…" : "Aucune catégorie. Commencez par en ajouter une."}
          </p>
        )}
      </div>
    </>
  );
}
