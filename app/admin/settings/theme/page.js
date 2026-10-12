"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/settings";
import { defaultTheme } from "@/lib/defaults";

const FIELDS = [
  { key: "green900", label: "Anthracite très foncé (titres, bandes sombres)" },
  { key: "green800", label: "Anthracite (prix, footer)" },
  { key: "green700", label: "Anthracite clair (survols)" },
  { key: "green600", label: "Boutons secondaires" },
  { key: "green500", label: "Bordures actives" },
  { key: "green100", label: "Gris clair" },
  { key: "green50", label: "Gris quasi blanc (fonds)" },
  { key: "accent", label: "Lime signal (boutons d'achat, accents)" },
  { key: "accentHover", label: "Lime (survol)" },
  { key: "accentInk", label: "Lime foncé (texte sur fond clair)" },
  { key: "forest", label: "Vert forêt (couleur du logo)" },
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
    getSettings("themeV2").then((t) => {
      setTheme(t);
      setReady(true);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings("themeV2", theme);
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
