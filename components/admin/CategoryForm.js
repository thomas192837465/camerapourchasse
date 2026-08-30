"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/products";
import { TrashIcon } from "@/components/Icons";
import SingleImageField from "./SingleImageField";

const emptyCategory = {
  name: "",
  slug: "",
  order: 1,
  showInNav: true,
  seo: { metaTitle: "", metaDescription: "" },
  image: { url: "", alt: "" },
};

export default function CategoryForm({ initialCategory, onSubmit, onDelete }) {
  const router = useRouter();
  const [category, setCategory] = useState(() => ({ ...emptyCategory, ...initialCategory }));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialCategory?.slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field, value) {
    setCategory((c) => ({ ...c, [field]: value }));
  }

  function handleNameChange(value) {
    setCategory((c) => ({ ...c, name: value, slug: slugTouched ? c.slug : slugify(value) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!category.name || !category.slug) {
      setError("Merci de renseigner au minimum le titre et le slug.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({ ...category, order: Number(category.order) || 1 });
    } catch (err) {
      setError(err.message || "Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-card">
        <h2>Informations générales</h2>
        <div className="form-grid">
          <div className="form-field full">
            <label>Titre (affiché dans le menu "Produits" et sur la page d'accueil)</label>
            <input required value={category.name} onChange={(e) => handleNameChange(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Slug (URL)</label>
            <input
              required
              value={category.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
            <span className="form-hint">/produits/{category.slug || "..."}</span>
          </div>
          <div className="form-field">
            <label>Ordre d'affichage</label>
            <input type="number" value={category.order} onChange={(e) => set("order", e.target.value)} />
          </div>
          <div className="form-field" style={{ justifyContent: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={category.showInNav}
                onChange={(e) => set("showInNav", e.target.checked)}
              />
              Afficher comme sous-menu dans "Produits" (barre de navigation)
            </label>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Photo (grille de catégories, page d'accueil)</h2>
        <SingleImageField
          value={category.image}
          onChange={(img) => set("image", img)}
          altPlaceholder="Texte alternatif (SEO) — ex : Caméra de chasse solaire posée sur un tronc"
        />
      </div>

      <div className="admin-card">
        <h2>SEO</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Utilisé sur la page /produits quand un visiteur filtre uniquement sur cette catégorie.
        </p>
        <div className="form-field">
          <label>Titre meta (balise &lt;title&gt;)</label>
          <input
            value={category.seo.metaTitle}
            placeholder={category.name}
            onChange={(e) => set("seo", { ...category.seo, metaTitle: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label>Meta description</label>
          <textarea
            rows={2}
            value={category.seo.metaDescription}
            onChange={(e) => set("seo", { ...category.seo, metaDescription: e.target.value })}
          />
        </div>
      </div>

      {error ? <div className="banner error">{error}</div> : null}

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer la catégorie"}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => router.push("/admin/categories")}>
          Annuler
        </button>
        {onDelete ? (
          <button
            type="button"
            className="btn btn-danger"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              if (confirm("Supprimer définitivement cette catégorie ?")) onDelete();
            }}
          >
            <TrashIcon /> Supprimer
          </button>
        ) : null}
      </div>
    </form>
  );
}
