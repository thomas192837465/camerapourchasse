"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories, updateCategory } from "@/lib/categories";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState("");

  // Masquer plutôt que supprimer : la catégorie reste en base (produits, textes, SEO conservés),
  // elle disparaît simplement du site et son adresse redirige.
<<<<<<< ours
<<<<<<< ours
  async function toggleVisible(c) {
    const visible = c.visible === false;
    setSaving(c.id);
    setError("");
    try {
      await updateCategory(c.id, { visible });
      setCategories((list) => list.map((x) => (x.id === c.id ? { ...x, visible } : x)));
=======
=======
>>>>>>> theirs
  async function toggle(c, field) {
    const value = c[field] === false;
    setSaving(`${c.id}:${field}`);
    setError("");
    try {
      await updateCategory(c.id, { [field]: value });
      setCategories((list) => list.map((x) => (x.id === c.id ? { ...x, [field]: value } : x)));
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
    } catch (e) {
      setError(e.message || "Enregistrement impossible.");
    } finally {
      setSaving(null);
    }
  }

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
<<<<<<< ours
<<<<<<< ours
          <p>{loading ? "Chargement…" : `${categories.length} catégorie(s)`} — cliquez sur « En ligne » / « Masquée » pour afficher ou retirer une catégorie du site sans la supprimer.</p>
=======
          <p>{loading ? "Chargement…" : `${categories.length} catégorie(s)`} — cliquez sur une pastille pour la changer : « Sur le site » retire la catégorie du site sans la supprimer, « Filtres » choisit celles proposées à gauche dans « Nos caméras ».</p>
>>>>>>> theirs
=======
          <p>{loading ? "Chargement…" : `${categories.length} catégorie(s)`} — cliquez sur une pastille pour la changer : « Sur le site » retire la catégorie du site sans la supprimer, « Filtres » choisit celles proposées à gauche dans « Nos caméras ».</p>
>>>>>>> theirs
        </div>
        <Link href="/admin/categories/new" className="btn btn-primary">
          + Ajouter une catégorie
        </Link>
      </div>

      <div className="admin-card">
        {error && <p className="form-error">{error}</p>}
        {categories.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Slug</th>
                <th>Ordre</th>
                <th>Sur le site</th>
<<<<<<< ours
<<<<<<< ours
=======
                <th>Filtres « Nos caméras »</th>
>>>>>>> theirs
=======
                <th>Filtres « Nos caméras »</th>
>>>>>>> theirs
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
                    <button
                      type="button"
                      className={`status-pill status-toggle ${c.visible === false ? "draft" : ""}`}
<<<<<<< ours
<<<<<<< ours
                      onClick={() => toggleVisible(c)}
                      disabled={saving === c.id}
                      title={c.visible === false ? "Cliquer pour remettre en ligne" : "Cliquer pour masquer du site"}
                    >
                      {saving === c.id ? "…" : c.visible === false ? "Masquée" : "En ligne"}
=======
=======
>>>>>>> theirs
                      onClick={() => toggle(c, "visible")}
                      disabled={saving === `${c.id}:visible`}
                      title={c.visible === false ? "Cliquer pour remettre en ligne" : "Cliquer pour masquer du site"}
                    >
                      {saving === `${c.id}:visible` ? "…" : c.visible === false ? "Masquée" : "En ligne"}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`status-pill status-toggle ${c.inFilters === false ? "draft" : ""}`}
                      onClick={() => toggle(c, "inFilters")}
                      disabled={saving === `${c.id}:inFilters`}
                      title={c.inFilters === false ? "Cliquer pour l'ajouter aux filtres" : "Cliquer pour la retirer des filtres"}
                    >
                      {saving === `${c.id}:inFilters` ? "…" : c.inFilters === false ? "Non" : "Oui"}
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
                    </button>
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
