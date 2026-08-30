"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/settings";
import { defaultSeo } from "@/lib/defaults";

export default function SeoSettingsPage() {
  const [seo, setSeo] = useState(defaultSeo);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings("seo").then((s) => {
      setSeo(s);
      setReady(true);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings("seo", seo);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return <p>Chargement…</p>;

  function set(field, value) {
    setSeo((s) => ({ ...s, [field]: value }));
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>SEO</h1>
          <p>Réglages par défaut utilisés sur toutes les pages (chaque produit peut ensuite les personnaliser).</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="form-field">
          <label>Nom du site</label>
          <input value={seo.siteTitle} onChange={(e) => set("siteTitle", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Modèle de titre des pages</label>
          <input value={seo.titleTemplate} onChange={(e) => set("titleTemplate", e.target.value)} />
          <span className="form-hint">%s est remplacé par le titre de chaque page (ex : "%s — {seo.siteTitle}")</span>
        </div>
        <div className="form-field">
          <label>Meta description par défaut</label>
          <textarea rows={3} value={seo.defaultMetaDescription} onChange={(e) => set("defaultMetaDescription", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Image de partage par défaut (URL Open Graph)</label>
          <input value={seo.ogImage} onChange={(e) => set("ogImage", e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Bonnes pratiques appliquées automatiquement</h2>
        <ul style={{ paddingLeft: 18, color: "var(--ink-soft)", fontSize: "0.88rem", lineHeight: 1.8, listStyle: "disc" }}>
          <li>Un seul <code>&lt;h1&gt;</code> par page (titre du hero, "Résultats de recherche" ou nom du produit).</li>
          <li>Balises meta title/description générées pour chaque page et chaque produit.</li>
          <li>Données structurées (JSON-LD) sur les fiches produit.</li>
          <li><code>sitemap.xml</code> et <code>robots.txt</code> générés automatiquement.</li>
          <li>Texte alternatif obligatoire sur chaque photo produit.</li>
        </ul>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </>
  );
}
