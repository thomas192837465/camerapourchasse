"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import SingleImageField from "./SingleImageField";
import ReviewsEditor from "./ReviewsEditor";
import ContentBlocksEditor from "./ContentBlocksEditor";
import { slugify } from "@/lib/products";
import { TrashIcon } from "@/components/Icons";

const emptyProduct = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  compareAtPrice: "",
  sku: "",
  stock: 0,
  categoryId: "",
  status: "published",
  isBestSeller: false,
  supplierLink: "",
  images: [],
  features: [],
  specs: [],
  variants: [],
  faq: [],
  reviews: [],
  blocks: [],
  seo: { metaTitle: "", metaDescription: "", featuredImage: { url: "", alt: "" } },
};

export default function ProductForm({ initialProduct, categories, generalSettings, onSubmit, onDelete }) {
  const router = useRouter();
  const [product, setProduct] = useState(() => ({ ...emptyProduct, ...initialProduct }));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialProduct?.slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field, value) {
    setProduct((p) => ({ ...p, [field]: value }));
  }

  function handleNameChange(value) {
    setProduct((p) => ({ ...p, name: value, slug: slugTouched ? p.slug : slugify(value) }));
  }

  function updateListItem(field, index, value) {
    setProduct((p) => ({ ...p, [field]: p[field].map((item, i) => (i === index ? value : item)) }));
  }

  function addListItem(field, item) {
    setProduct((p) => ({ ...p, [field]: [...p[field], item] }));
  }

  function removeListItem(field, index) {
    setProduct((p) => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!product.name || !product.slug || !product.price || !product.categoryId) {
      setError("Merci de renseigner au minimum le nom, le slug, le prix et la catégorie.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        ...product,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        stock: Number(product.stock) || 0,
      });
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
            <label>Nom du produit (H1 de la fiche produit)</label>
            <input required value={product.name} onChange={(e) => handleNameChange(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Slug (URL)</label>
            <input
              required
              value={product.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
            <span className="form-hint">/produits/{product.slug || "..."}</span>
          </div>
          <div className="form-field">
            <label>Catégorie</label>
            <select required value={product.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
              <option value="">— Choisir —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field full">
            <label>Description courte (résumé, utilisé pour le SEO par défaut)</label>
            <input value={product.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
          </div>
          <div className="form-field full">
            <label>Description complète</label>
            <textarea rows={5} value={product.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Prix (€)</label>
            <input type="number" step="0.01" required value={product.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Prix barré (€, optionnel)</label>
            <input type="number" step="0.01" value={product.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} />
          </div>
          <div className="form-field">
            <label>SKU</label>
            <input value={product.sku} onChange={(e) => set("sku", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Stock</label>
            <input type="number" value={product.stock} onChange={(e) => set("stock", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Statut</label>
            <select value={product.status} onChange={(e) => set("status", e.target.value)}>
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
          <div className="form-field" style={{ justifyContent: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={product.isBestSeller}
                onChange={(e) => set("isBestSeller", e.target.checked)}
              />
              Mettre en avant ("Meilleures Ventes")
            </label>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Fournisseur</h2>
        <div className="form-field">
          <label>Lien du produit chez le fournisseur (ex : AliExpress)</label>
          <input
            type="url"
            placeholder="https://www.aliexpress.com/item/..."
            value={product.supplierLink}
            onChange={(e) => set("supplierLink", e.target.value)}
          />
          <span className="form-hint">
            Affiché sur chaque commande contenant ce produit, pour passer la commande fournisseur en un clic.
          </span>
        </div>
      </div>

      <div className="admin-card">
        <h2>Photos du produit</h2>
        <ImageUploader
          images={product.images}
          onChange={(images) => set("images", images)}
          targetSize={{ width: generalSettings.productImageWidth, height: generalSettings.productImageHeight }}
        />
      </div>

      <div className="admin-card">
        <h2>Caractéristiques (liste à puces avec ✓)</h2>
        {product.features.map((feature, i) => (
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
        {product.specs.map((spec, i) => (
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
        <h2>Variantes (coloris)</h2>
        {product.variants.map((variant, i) => (
          <div className="repeatable-row" key={i}>
            <div className="form-field">
              <input
                placeholder="Nom (ex : Camouflage)"
                value={variant.name}
                onChange={(e) => updateListItem("variants", i, { ...variant, name: e.target.value })}
              />
            </div>
            <input
              type="color"
              value={variant.colorHex || "#4f5b3f"}
              onChange={(e) => updateListItem("variants", i, { ...variant, colorHex: e.target.value })}
              style={{ width: 40, height: 40, border: "none", borderRadius: 6 }}
            />
            <button type="button" className="icon-btn" onClick={() => removeListItem("variants", i)}>
              <TrashIcon />
            </button>
          </div>
        ))}
        <button type="button" className="add-row-btn" onClick={() => addListItem("variants", { name: "", colorHex: "#4f5b3f" })}>
          + Ajouter une variante
        </button>
      </div>

      <div className="admin-card">
        <h2>FAQ (questions fréquentes)</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Affichée sur la fiche produit au-dessus de "Vous pourriez aimer", avec les balises SEO nécessaires pour
          apparaître en résultat enrichi ("rich snippet") dans Google.
        </p>
        {product.faq.map((item, i) => (
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
        <h2>Avis clients</h2>
        <ReviewsEditor reviews={product.reviews} onChange={(reviews) => set("reviews", reviews)} />
      </div>

      <div className="admin-card">
        <h2>Contenu additionnel (SEO)</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Affiché sur la fiche produit sous la fiche technique. Ajoutez des blocs dans l'ordre voulu : titres,
          paragraphes (gras et liens possibles), photos, tableaux et FAQ.
        </p>
        <ContentBlocksEditor blocks={product.blocks} onChange={(blocks) => set("blocks", blocks)} />
      </div>

      <div className="admin-card">
        <h2>SEO</h2>
        <div className="form-field">
          <label>Titre meta (balise &lt;title&gt;)</label>
          <input
            value={product.seo.metaTitle}
            placeholder={product.name}
            onChange={(e) => set("seo", { ...product.seo, metaTitle: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label>Meta description</label>
          <textarea
            rows={2}
            value={product.seo.metaDescription}
            placeholder={product.shortDescription}
            onChange={(e) => set("seo", { ...product.seo, metaDescription: e.target.value })}
          />
        </div>
        <div className="form-field">
          <label>Image de mise en avant (Google / partage sur les réseaux sociaux)</label>
          <p className="form-hint" style={{ marginBottom: 8 }}>
            Sans image choisie ici, la première photo du produit est utilisée par défaut.
          </p>
          <SingleImageField
            value={product.seo.featuredImage}
            onChange={(img) => set("seo", { ...product.seo, featuredImage: img })}
            altPlaceholder="Texte alternatif (SEO)"
          />
        </div>
      </div>

      {error ? <div className="banner error">{error}</div> : null}

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer le produit"}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => router.push("/admin/products")}>
          Annuler
        </button>
        {onDelete ? (
          <button
            type="button"
            className="btn btn-danger"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              if (confirm("Supprimer définitivement ce produit ?")) onDelete();
            }}
          >
            Supprimer
          </button>
        ) : null}
      </div>
    </form>
  );
}
