"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/settings";
import { defaultContent } from "@/lib/defaults";
import SingleImageField from "@/components/admin/SingleImageField";
import IconPicker from "@/components/admin/IconPicker";
import FooterColumnsEditor from "@/components/admin/FooterColumnsEditor";
import ContentBlocksEditor from "@/components/admin/ContentBlocksEditor";
import { TrashIcon } from "@/components/Icons";

export default function ContentSettingsPage() {
  const [content, setContent] = useState(defaultContent);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings("content").then((c) => {
      setContent(c);
      setReady(true);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings("content", content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return <p>Chargement…</p>;

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

  function IconTextList({ field, itemPlaceholder }) {
    return (
      <>
        {content[field].map((item, i) => (
          <div className="repeatable-row" key={i}>
            <IconPicker value={item.icon} onChange={(icon) => updateListItem(field, i, { ...item, icon })} />
            <div className="form-field">
              <input
                placeholder="Titre"
                value={item.title}
                onChange={(e) => updateListItem(field, i, { ...item, title: e.target.value })}
              />
              <input
                placeholder={itemPlaceholder || "Description"}
                value={item.description}
                onChange={(e) => updateListItem(field, i, { ...item, description: e.target.value })}
                style={{ marginTop: 6 }}
              />
            </div>
            <button type="button" className="icon-btn" onClick={() => removeListItem(field, i)}>
              <TrashIcon />
            </button>
          </div>
        ))}
        <button type="button" className="add-row-btn" onClick={() => addListItem(field, { icon: "star", title: "", description: "" })}>
          + Ajouter
        </button>
      </>
    );
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Contenu de la page d'accueil</h1>
          <p>Logo, hero, sections et pied de page.</p>
        </div>
      </div>

      <div className="admin-card">
        <h2>Logo (en-tête & pied de page)</h2>
        <div className="form-grid">
          <div className="form-field">
            <label>Ligne 1</label>
            <input value={content.logoLine1} onChange={(e) => set("logoLine1", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Ligne 2</label>
            <input value={content.logoLine2} onChange={(e) => set("logoLine2", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Bannière d'accueil (hero)</h2>
        <div className="form-field">
          <label>Titre (H1 de la page d'accueil)</label>
          <textarea rows={2} value={content.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Sous-titre</label>
          <textarea rows={2} value={content.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Texte du bouton</label>
          <input value={content.heroButtonText} onChange={(e) => set("heroButtonText", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Photo du hero (à droite du texte — ex : une caméra de chasse)</label>
          <SingleImageField
            value={content.heroImage}
            onChange={(img) => set("heroImage", img)}
            altPlaceholder="Texte alternatif (SEO)"
          />
        </div>
        <div className="form-field">
          <label>Texte manuscrit à côté de la photo (avec flèche — laisser vide pour le masquer)</label>
          <input
            value={content.heroImageCaption}
            onChange={(e) => set("heroImageCaption", e.target.value)}
            placeholder="ex : Capturez l'instant !"
          />
        </div>
        <div className="form-field">
          <label>Couleur du motif d'empreintes en fond</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="color"
              value={content.heroPatternColor}
              onChange={(e) => set("heroPatternColor", e.target.value)}
              style={{ width: 40, height: 40, border: "none", borderRadius: 6 }}
            />
            <span className="form-hint hex">{content.heroPatternColor}</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Section "Promesse technique"</h2>
        <div className="form-field">
          <label>Titre de la section</label>
          <input value={content.featuresTitle} onChange={(e) => set("featuresTitle", e.target.value)} />
        </div>
        <IconTextList field="features" />
      </div>

      <div className="admin-card">
        <h2>Section "Expertise & Confiance" (E-E-A-T)</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Signaux de confiance attendus par Google et les IA sur une page marchande (expérience, expertise, autorité,
          confiance). Les textes entre [crochets] sont des exemples à remplacer par vos vraies informations —
          n'affichez rien que vous ne puissiez justifier.
        </p>
        <div className="form-field">
          <label>Titre de la section</label>
          <input value={content.eeatTitle} onChange={(e) => set("eeatTitle", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Sous-titre</label>
          <textarea rows={2} value={content.eeatSubtitle} onChange={(e) => set("eeatSubtitle", e.target.value)} />
        </div>
        <IconTextList field="eeatPoints" />
      </div>

      <div className="admin-card">
        <h2>Grille de catégories</h2>
        <div className="form-field">
          <label>Titre de la section (visible sur la page, utile pour le SEO)</label>
          <input value={content.categoriesSectionTitle} onChange={(e) => set("categoriesSectionTitle", e.target.value)} />
        </div>
        <p className="form-hint">
          Les photos de chaque catégorie (avec leur texte alternatif SEO) se gèrent dans Catalogue → Catégories.
        </p>
      </div>

      <div className="admin-card">
        <h2>Section "Meilleures ventes"</h2>
        <div className="form-field">
          <label>Titre de la section</label>
          <input value={content.bestSellersTitle} onChange={(e) => set("bestSellersTitle", e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Bandeau de réassurance (livraison, garantie...)</h2>
        <IconTextList field="trustBadges" />
      </div>

      <div className="admin-card">
        <h2>Pied de page</h2>
        <div className="form-field">
          <label>Description sous le logo</label>
          <textarea rows={2} value={content.footerDescription} onChange={(e) => set("footerDescription", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Titre du bloc newsletter</label>
          <input value={content.newsletterTitle} onChange={(e) => set("newsletterTitle", e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Colonnes de liens du pied de page</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          La colonne "Légal" (Mentions légales / CGV) est ajoutée automatiquement et ne se modifie pas ici.
        </p>
        <FooterColumnsEditor columns={content.footerColumns} onChange={(footerColumns) => set("footerColumns", footerColumns)} />
      </div>

      <div className="admin-card">
        <h2>Page "Livraison"</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Visible sur /livraison. Les textes entre [crochets] sont des exemples : remplacez-les par vos vraies
          informations avant publication.
        </p>
        <ContentBlocksEditor blocks={content.livraisonBlocks} onChange={(blocks) => set("livraisonBlocks", blocks)} />
      </div>

      <div className="admin-card">
        <h2>Page "Notre histoire"</h2>
        <p className="form-hint" style={{ marginBottom: 10 }}>
          Visible sur /notre-histoire. Les textes entre [crochets] sont des exemples : remplacez-les par vos vraies
          informations avant publication.
        </p>
        <ContentBlocksEditor blocks={content.histoireBlocks} onChange={(blocks) => set("histoireBlocks", blocks)} />
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </>
  );
}
