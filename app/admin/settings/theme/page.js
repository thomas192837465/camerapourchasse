"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/settings";
import { defaultTheme } from "@/lib/defaults";

const FIELDS = [
  { key: "green900", label: "Vert très foncé (titres)" },
  { key: "green800", label: "Vert foncé (prix, footer)" },
  { key: "green700", label: "Vert (hover, accents)" },
  { key: "green600", label: "Vert principal (boutons)" },
  { key: "green500", label: "Vert clair (bordures actives)" },
  { key: "green100", label: "Vert très clair" },
  { key: "green50", label: "Vert quasi blanc (fonds)" },
  { key: "gold", label: "Doré (étoiles/notes)" },
  { key: "ink", label: "Texte principal" },
  { key: "inkSoft", label: "Texte secondaire" },
  { key: "inkFaint", label: "Texte discret" },
  { key: "bg", label: "Fond de page" },
  { key: "card", label: "Fond des cartes" },
  { key: "border", label: "Bordures" },
];

export default function ThemeSettingsPage() {
  const [theme, setTheme] = useState(defaultTheme);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings("theme").then((t) => {
      setTheme(t);
      setReady(true);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings("theme", theme);
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
          <h1>Thème & couleurs</h1>
          <p>Modifie l'apparence de toute la boutique instantanément, sans toucher au code.</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="color-field-grid">
          {FIELDS.map((f) => (
            <div className="color-field" key={f.key}>
              <input
                type="color"
                value={theme[f.key]}
                onChange={(e) => setTheme((t) => ({ ...t, [f.key]: e.target.value }))}
              />
              <div>
                <div className="label">{f.label}</div>
                <div className="hex">{theme[f.key]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </>
  );
}
