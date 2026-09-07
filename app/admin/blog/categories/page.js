"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory } from "@/lib/blogCategories";
import { TrashIcon } from "@/components/Icons";

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    getBlogCategories().then((list) => {
      setCategories(list);
      setLoading(false);
    });
  }

  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    setError("");
    try {
      await createBlogCategory(newName.trim());
      setNewName("");
      load();
    } catch (err) {
      setError(err.message || "Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRename(id, name) {
    await updateBlogCategory(id, name);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette catégorie ? Les articles qui l'utilisent garderont son nom en texte libre.")) return;
    await deleteBlogCategory(id);
    load();
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Catégories du blog</h1>
          <p>
            {loading ? "Chargement…" : `${categories.length} catégorie(s)`} — disponibles au choix sur chaque
            article, affichées en badge et listées dans la barre latérale de /blog.
          </p>
        </div>
        <Link href="/admin/blog" className="btn btn-outline">
          ← Retour au blog
        </Link>
      </div>

      <div className="admin-card">
        <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nom de la catégorie (ex : Guide d'achat)"
            style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px" }}
          />
          <button className="btn btn-primary" type="submit" disabled={saving}>
            + Ajouter
          </button>
        </form>

        {error ? <div className="banner error">{error}</div> : null}

        {categories.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <BlogCategoryRow key={cat.id} category={cat} onRename={handleRename} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>
            {loading ? "Chargement…" : "Aucune catégorie. Ajoutez-en une ci-dessus."}
          </p>
        )}
      </div>
    </>
  );
}

function BlogCategoryRow({ category, onRename, onDelete }) {
  const [name, setName] = useState(category.name || "");
  const changed = name.trim() && name.trim() !== category.name;

  return (
    <tr>
      <td>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", width: "100%" }}
        />
      </td>
      <td className="row-actions">
        {changed ? (
          <button type="button" className="btn btn-outline btn-sm" onClick={() => onRename(category.id, name.trim())}>
            Enregistrer
          </button>
        ) : null}
        <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(category.id)}>
          <TrashIcon />
        </button>
      </td>
    </tr>
  );
}
