"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/settings";
import { defaultContent } from "@/lib/defaults";

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

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Contenu de la page d'accueil</h1>
          <p>Logo, texte du hero et pied de page.</p>
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
      </div>

      <div className="admin-card">
        <h2>Pied de page</h2>
        <div className="form-field">
          <label>Description sous le logo</label>
          <textarea rows={2} value={content.footerDescription} onChange={(e) => set("footerDescription", e.target.value)} />
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </>
  );
}
