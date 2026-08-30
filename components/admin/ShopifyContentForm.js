"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import SingleImageField from "./SingleImageField";
import { TrashIcon } from "@/components/Icons";
import { emptyShopifyContent } from "@/lib/shopifyContent";

export default function ShopifyContentForm({ shopifyProduct, initialContent, categories, generalSettings, onSubmit }) {
  const router = useRouter();
  const [content, setContent] = useState(() => ({ ...emptyShopifyContent, ...initialContent }));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(field, value) {
    setContent((c) => ({ ...c, [field]: value }));
  }

  function updateListItem(field, index, value) {
    setContent((c) => ({ ...c, [field]: c[field].map((item, i) => (i === index ? value : item)) }));
  }

  function addListItem(field, item) {
    setContent((c) => ({ ...c, [field]: [...c[field], item] }));
  }

  function removeListItem(field, index) {
    setContent((c) => ({ ...c, [field]: c[field].filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!content.categoryId) {
      setError("Merci de choisir une catégorie.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || "Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  const price = Number(shopifyProduct.priceRange.minVariantPrice.amount);

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-card">
        <h2>Produit Shopify</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Nom, prix et stock viennent de Shopify — modifiables uniquement là-bas.
        </p>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {shopifyProduct.featuredImage?.url ? (
            <img
              src={shopifyProduct.featuredImage.url}
              alt=""
              style={{ width: 64, height: 64, objectFit: "contain", border: "1px solid var(--border)", borderRadius: 8, background: "#fff" }}
            />
          ) : null}
          <div>
            <strong>{shopifyProduct.title}</strong>
            <p className="form-hint">
              €{price.toFixed(2).replace(".", ",")} ·{" "}
              {shopifyProduct.availableForSale ? "En stock" : "Indisponible"}
            </p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Informations du site</h2>
        <div className="form-grid">
          <div className="form-field">
            <label>Catégorie</label>
            <select required value={content.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
              <option value="">— Choisir —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field" style={{ justifyContent: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={content.isBestSeller}
                onChange={(e) => set("isBestSeller", e.target.checked)}
              />
              Mettre en avant ("Meilleures Ventes")
            </label>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Photos du produit</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Tes propres photos pour la fiche produit du site (indépendantes de celles sur Shopify).
        </p>
        <ImageUploader
          images={content.images}
          onChange={(images) => set("images", images)}
          targetSize={{ width: generalSettings.productImageWidth, height: generalSettings.productImageHeight }}
        />
      </div>

      <div className="admin-card">
        <h2>Caractéristiques (liste à puces avec ✓)</h2>
        {content.features.map((feature, i) => (
          <div className="repeatable-row" key={i}>
            <div className="form-field">
              <input value={feature} onChange={(e) => updateListItem("features", i, e.target.value)} />
            </div>
            <button type="button" className="icon-btn" onClick={() => removeListItem("features", i)}>
              <TrashIcon />
            </button>
          </div>
        ))}
        <button type="button" className="add-row-btn" onClick={() => addListItem("features", "")}>
          + Ajouter une caractéristique
        </button>
      </div>

      <div className="admin-card">
        <h2>Spécifications techniques</h2>
        {content.specs.map((spec, i) => (
          <div className="repeatable-row" key={i}>
            <div className="form-field">
              <input
                placeholder="Libellé (ex : Résolution)"
                value={spec.label}
                onChange={(e) => updateListItem("specs", i, { ...spec, label: e.target.value })}
              />
            </div>
            <div className="form-field">
              <input
                placeholder="Valeur (ex : 4K UHD)"
                value={spec.value}
                onChange={(e) => updateListItem("specs", i, { ...spec, value: e.target.value })}
              />
            </div>
            <button type="button" className="icon-btn" onClick={() => removeListItem("specs", i)}>
              <TrashIcon />
            </button>
          </div>
        ))}
        <button type="button" className="add-row-btn" onClick={() => addListItem("specs", { label: "", value: "" })}>
          + Ajouter une spécification
        </button>
      </div>

      <div className="admin-card">
        <h2>FAQ (questions fréquentes)</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Affichée sur la fiche produit au-dessus de "Vous pourriez aimer", avec les balises SEO nécessaires pour
          apparaître en résultat enrichi ("rich snippet") dans Google.
        </p>
        {content.faq.map((item, i) => (
          <div className="repeatable-row" key={i}>
            <div className="form-field">
              <input
                placeholder="Question (ex : Quelle est l'autonomie de la batterie ?)"
                value={item.question}
                onChange={(e) => updateListItem("faq", i, { ...item, question: e.target.value })}
              />
              <textarea
                rows={2}
                placeholder="Réponse"
                value={item.answer}
                onChange={(e) => updateListItem("faq", i, { ...item, answer: e.target.value })}
                style={{ marginTop: 6 }}
              />
            </div>
            <button type="button" className="icon-btn" onClick={() => removeListItem("faq", i)}>
              <TrashIcon />
            </button>
          </div>
        ))}
        <button type="button" className="add-row-btn" onClick={() => addListItem("faq", { question: "", answer: "" })}>
          + Ajouter une question
        </button>
      </div>

      <div className="admin-card">
        <h2>SEO</h2>
        <div className="form-field">
          <label>Titre meta (balise &lt;title&gt;)</label>
          <input
            value={content.seo.metaTitle}
            placeholder={shopifyProduct.title}
            onChange={(e) => set("seo", { ...content.seo, metaTitle: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label>Meta description</label>
          <textarea
            rows={2}
            value={content.seo.metaDescription}
            onChange={(e) => set("seo", { ...content.seo, metaDescription: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label>Image de mise en avant (Google / partage sur les réseaux sociaux)</label>
          <p className="form-hint" style={{ marginBottom: 8 }}>
            Sans image choisie ici, la première photo ajoutée ci-dessus est utilisée par défaut.
          </p>
          <SingleImageField
            value={content.seo.featuredImage}
            onChange={(img) => set("seo", { ...content.seo, featuredImage: img })}
            altPlaceholder="Texte alternatif (SEO)"
          />
        </div>
      </div>

      {error ? <div className="banner error">{error}</div> : null}

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => router.push("/admin/shopify-products")}>
          Annuler
        </button>
      </div>
    </form>
  );
}
