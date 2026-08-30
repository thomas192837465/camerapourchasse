"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/settings";
import { defaultGeneral } from "@/lib/defaults";

export default function GeneralSettingsPage() {
  const [general, setGeneral] = useState(defaultGeneral);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings("general").then((g) => {
      setGeneral(g);
      setReady(true);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings("general", {
        productImageWidth: Number(general.productImageWidth),
        productImageHeight: Number(general.productImageHeight),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return <p>Chargement…</p>;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Photos produits</h1>
          <p>Taille unique appliquée automatiquement (recadrage) à toutes les photos ajoutées à un produit.</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="form-grid">
          <div className="form-field">
            <label>Largeur (px)</label>
            <input
              type="number"
              value={general.productImageWidth}
              onChange={(e) => setGeneral((g) => ({ ...g, productImageWidth: e.target.value }))}
            />
          </div>
          <div className="form-field">
            <label>Hauteur (px)</label>
            <input
              type="number"
              value={general.productImageHeight}
              onChange={(e) => setGeneral((g) => ({ ...g, productImageHeight: e.target.value }))}
            />
          </div>
        </div>
        <p className="form-hint">
          Recommandé : format carré (1200×1200) pour un rendu homogène dans les grilles produits. Ce réglage ne
          s'applique qu'aux nouvelles photos ajoutées après modification.
        </p>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </>
  );
}
