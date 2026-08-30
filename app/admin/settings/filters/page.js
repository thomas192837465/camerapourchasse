"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/settings";
import { defaultFilters } from "@/lib/defaults";
import { TrashIcon } from "@/components/Icons";

const GROUPS = [
  { key: "resolutionOptions", label: "Résolution", placeholder: "ex : 4K UHD" },
  { key: "visionOptions", label: "Vision de Nuit", placeholder: "ex : Vision Nocturne No-Glow" },
  { key: "rangeOptions", label: "Portée", placeholder: "ex : Détection 25 m" },
];

export default function FiltersSettingsPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings("filters").then((f) => {
      setFilters(f);
      setReady(true);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings("filters", filters);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return <p>Chargement…</p>;

  function updateOption(key, index, value) {
    setFilters((f) => ({ ...f, [key]: f[key].map((opt, i) => (i === index ? value : opt)) }));
  }

  function addOption(key) {
    setFilters((f) => ({ ...f, [key]: [...f[key], ""] }));
  }

  function removeOption(key, index) {
    setFilters((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }));
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Filtres de recherche</h1>
          <p>Options proposées dans les filtres de la page /produits (en plus des catégories et du prix).</p>
        </div>
      </div>

      {GROUPS.map((group) => (
        <div className="admin-card" key={group.key}>
          <h2>{group.label}</h2>
          {filters[group.key].map((opt, i) => (
            <div className="repeatable-row" key={i}>
              <div className="form-field">
                <input
                  placeholder={group.placeholder}
                  value={opt}
                  onChange={(e) => updateOption(group.key, i, e.target.value)}
                />
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => removeOption(group.key, i)}
                aria-label="Supprimer"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
          <button type="button" className="add-row-btn" onClick={() => addOption(group.key)}>
            + Ajouter une option
          </button>
        </div>
      ))}

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </>
  );
}
