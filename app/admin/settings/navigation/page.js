"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/settings";
import { defaultNavigation } from "@/lib/defaults";
import { TrashIcon } from "@/components/Icons";

export default function NavigationSettingsPage() {
  const [nav, setNav] = useState(defaultNavigation);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings("navigation").then((n) => {
      setNav(n);
      setReady(true);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings("navigation", nav);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return <p>Chargement…</p>;

  function updateItem(index, field, value) {
    setNav((n) => ({
      ...n,
      items: n.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  }

  function addItem() {
    setNav((n) => ({
      ...n,
      items: [...n.items, { id: `lien-${Date.now()}`, label: "", href: "" }],
    }));
  }

  function removeItem(index) {
    setNav((n) => ({ ...n, items: n.items.filter((_, i) => i !== index) }));
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Navigation</h1>
          <p>
            Liens affichés dans la barre de navigation, après le menu déroulant "Produits" (dont le contenu se gère
            depuis Catégories).
          </p>
        </div>
      </div>

      <div className="admin-card">
        <h2>Liens du menu</h2>
        {nav.items.map((item, i) => (
          <div className="repeatable-row" key={item.id || i}>
            <div className="form-field">
              <label>Libellé</label>
              <input
                placeholder="ex : Accessoires"
                value={item.label}
                onChange={(e) => updateItem(i, "label", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Lien</label>
              <input
                placeholder="ex : /produits/accessoires"
                value={item.href}
                onChange={(e) => updateItem(i, "href", e.target.value)}
              />
            </div>
            <button type="button" className="icon-btn" onClick={() => removeItem(i)} aria-label="Supprimer">
              <TrashIcon />
            </button>
          </div>
        ))}
        <button type="button" className="add-row-btn" onClick={addItem}>
          + Ajouter un lien
        </button>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </>
  );
}
