"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SingleImageField from "./SingleImageField";
import ContentBlocksEditor from "./ContentBlocksEditor";
import { slugify } from "@/lib/products";
import { TrashIcon } from "@/components/Icons";

const emptyPost = {
  title: "",
  slug: "",
  excerpt: "",
  author: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  status: "draft",
  coverImage: { url: "", alt: "" },
  blocks: [],
  seo: { metaTitle: "", metaDescription: "", featuredImage: { url: "", alt: "" } },
};

export default function BlogPostForm({ initialPost, onSubmit, onDelete }) {
  const router = useRouter();
  const [post, setPost] = useState(() => ({ ...emptyPost, ...initialPost }));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPost?.slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field, value) {
    setPost((p) => ({ ...p, [field]: value }));
  }

  function handleTitleChange(value) {
    setPost((p) => ({ ...p, title: value, slug: slugTouched ? p.slug : slugify(value) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!post.title || !post.slug) {
      setError("Merci de renseigner au minimum le titre et le slug.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(post);
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
            <label>Titre (H1 de l'article)</label>
            <input required value={post.title} onChange={(e) => handleTitleChange(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Slug (URL)</label>
            <input
              required
              value={post.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
            <span className="form-hint">/blog/{post.slug || "..."}</span>
          </div>
          <div className="form-field">
            <label>Statut</label>
            <select value={post.status} onChange={(e) => set("status", e.target.value)}>
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
          <div className="form-field">
            <label>Auteur</label>
            <input value={post.author} onChange={(e) => set("author", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Date de publication</label>
            <input type="date" value={post.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
          </div>
          <div className="form-field full">
            <label>Extrait (résumé affiché sur la liste du blog et dans les résultats Google)</label>
            <textarea rows={2} value={post.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Photo de couverture</h2>
        <SingleImageField
          value={post.coverImage}
          onChange={(img) => set("coverImage", img)}
          altPlaceholder="Texte alternatif (SEO)"
        />
      </div>

      <div className="admin-card">
        <h2>Contenu de l'article</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Chaque bloc "Titre (H2)" ou "Sous-titre (H3)" apparaît automatiquement dans le sommaire affiché en haut de
          l'article.
        </p>
        <ContentBlocksEditor blocks={post.blocks} onChange={(blocks) => set("blocks", blocks)} />
      </div>

      <div className="admin-card">
        <h2>SEO</h2>
        <div className="form-field">
          <label>Titre meta (balise &lt;title&gt;)</label>
          <input
            value={post.seo.metaTitle}
            placeholder={post.title}
            onChange={(e) => set("seo", { ...post.seo, metaTitle: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label>Meta description</label>
          <textarea
            rows={2}
            placeholder={post.excerpt}
            value={post.seo.metaDescription}
            onChange={(e) => set("seo", { ...post.seo, metaDescription: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label>Image de mise en avant (Google / partage sur les réseaux sociaux)</label>
          <p className="form-hint" style={{ marginBottom: 8 }}>
            Sans image choisie ici, la photo de couverture est utilisée par défaut.
          </p>
          <SingleImageField
            value={post.seo.featuredImage}
            onChange={(img) => set("seo", { ...post.seo, featuredImage: img })}
            altPlaceholder="Texte alternatif (SEO)"
          />
        </div>
      </div>

      {error ? <div className="banner error">{error}</div> : null}

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer l'article"}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => router.push("/admin/blog")}>
          Annuler
        </button>
        {onDelete ? (
          <button
            type="button"
            className="btn btn-danger"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              if (confirm("Supprimer définitivement cet article ?")) onDelete();
            }}
          >
            <TrashIcon /> Supprimer
          </button>
        ) : null}
      </div>
    </form>
  );
}
