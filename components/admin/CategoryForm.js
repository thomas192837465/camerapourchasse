"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify, slugifyTyping } from "@/lib/products";
import { TrashIcon } from "@/components/Icons";
import SingleImageField from "./SingleImageField";
import ContentBlocksEditor from "./ContentBlocksEditor";

const emptyCategory = {
  name: "",
  slug: "",
  order: 1,
  visible: true,
  showInNav: true,
  h1: "",
  intro: "",
  formerSlugs: [],
  seo: { metaTitle: "", metaDescription: "" },
  image: { url: "", alt: "" },
  blocks: [],
};

export default function CategoryForm({ initialCategory, onSubmit, onDelete }) {
  const router = useRouter();
  const [category, setCategory] = useState(() => ({ ...emptyCategory, ...initialCategory }));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialCategory?.slug));
  const [formerText, setFormerText] = useState(() => (initialCategory?.formerSlugs || []).join(", "));
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
            <label>Nom (affiché dans le menu « Nos caméras » et sur la page d'accueil)</label>
            <input required value={category.name} onChange={(e) => handleNameChange(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Slug (URL)</label>
            <input
              required
              value={category.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugifyTyping(e.target.value));
              }}
              onBlur={(e) => set("slug", slugify(e.target.value))}
            />
            <span className="form-hint">/produits/{category.slug || "..."}</span>
          </div>
          <div className="form-field">
            <label>Anciennes adresses (redirigées ici)</label>
            <input
              placeholder="ex : cameras-de-chasse-connectees"
              value={formerText}
              onChange={(e) => {
                // Le texte saisi reste tel quel à l'écran (sinon les tirets disparaissent pendant
                // la frappe) ; la liste enregistrée, elle, est nettoyée.
                setFormerText(e.target.value);
                set(
                  "formerSlugs",
                  e.target.value.split(",").map((s) => slugify(s.trim())).filter(Boolean)
                );
              }}
            />
            <span className="form-hint">
              Slugs séparés par des virgules : /produits/ancien-slug redirige définitivement vers cette catégorie.
            </span>
          </div>
          <div className="form-field">
            <label>Ordre d'affichage</label>
            <input type="number" value={category.order} onChange={(e) => set("order", e.target.value)} />
          </div>
          <div className="form-field" style={{ justifyContent: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={category.visible !== false}
                onChange={(e) => set("visible", e.target.checked)}
              />
              En ligne sur le site
            </label>
            <span className="form-hint">
              Décoché : la catégorie reste dans l'admin mais disparaît du site (menu, filtres, accueil, sitemap) et son
              adresse redirige vers « Nos caméras » ou vers la catégorie qui la liste dans ses anciennes adresses.
            </span>
          </div>
          <div className="form-field" style={{ justifyContent: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={category.showInNav}
                onChange={(e) => set("showInNav", e.target.checked)}
              />
              Afficher dans le menu déroulant « Nos caméras »
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
        <h2>Haut de page</h2>
        <div className="form-field">
          <label>Titre H1 (vide = le nom de la catégorie)</label>
          <input value={category.h1 || ""} placeholder={category.name} onChange={(e) => set("h1", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Intro au-dessus des produits (2 à 4 phrases)</label>
          <textarea rows={3} value={category.intro || ""} onChange={(e) => set("intro", e.target.value)} />
          <span className="form-hint">Gras avec **texte**, liens avec [texte](/adresse).</span>
        </div>
      </div>

      <div className="admin-card">
        <h2>Guide sous les produits (SEO)</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Affiché sur la page /produits/{category.slug || "..."}, sous la grille de produits. Ajoutez des blocs dans
          l'ordre voulu (déplaçables avec les flèches) : titres, paragraphes (gras et liens possibles), photos,
          tableaux et FAQ (avec balisage FAQPage pour Google et les IA).
        </p>
        <ContentBlocksEditor blocks={category.blocks} onChange={(blocks) => set("blocks", blocks)} />
      </div>

      <div className="admin-card">
        <h2>SEO</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Titre et description affichés dans Google pour /produits/{category.slug || "..."}.
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
