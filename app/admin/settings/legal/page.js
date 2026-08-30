"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/settings";
import { defaultLegal } from "@/lib/defaults";

export default function LegalSettingsPage() {
  const [legal, setLegal] = useState(defaultLegal);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings("legal").then((l) => {
      setLegal(l);
      setReady(true);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings("legal", legal);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return <p>Chargement…</p>;

  function set(field, value) {
    setLegal((l) => ({ ...l, [field]: value }));
  }

  const missingRequired = !legal.companyName || !legal.address || !legal.email;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Mentions légales & CGV</h1>
          <p>
            Ces informations génèrent automatiquement les pages{" "}
            <a href="/mentions-legales" target="_blank" rel="noreferrer">
              /mentions-legales
            </a>{" "}
            et{" "}
            <a href="/cgv" target="_blank" rel="noreferrer">
              /cgv
            </a>
            .
          </p>
        </div>
      </div>

      <div className="banner warning" style={{ marginBottom: 20 }}>
        Le texte généré est un <strong>modèle standard</strong> (structure et clauses classiques du droit français
        de la vente en ligne), pas un conseil juridique personnalisé. Complétez-le avec vos vraies informations et
        faites-le idéalement relire par un professionnel (avocat, CCI...) avant la mise en ligne publique du site.
      </div>

      {missingRequired ? (
        <div className="banner error" style={{ marginBottom: 20 }}>
          Nom de l'entreprise, adresse et e-mail sont indispensables : tant qu'ils sont vides, les pages légales
          affichent des espaces à compléter en évidence.
        </div>
      ) : null}

      <div className="admin-card">
        <h2>Identité de l'entreprise</h2>
        <div className="form-grid">
          <div className="form-field">
            <label>Nom / raison sociale</label>
            <input value={legal.companyName} onChange={(e) => set("companyName", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Forme juridique</label>
            <input
              placeholder="ex : Auto-entrepreneur, SARL, SASU..."
              value={legal.legalForm}
              onChange={(e) => set("legalForm", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>SIRET</label>
            <input value={legal.siret} onChange={(e) => set("siret", e.target.value)} />
          </div>
          <div className="form-field">
            <label>RCS / Ville d'immatriculation (si applicable)</label>
            <input value={legal.rcs} onChange={(e) => set("rcs", e.target.value)} />
          </div>
          <div className="form-field full">
            <label>Adresse du siège</label>
            <input value={legal.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="form-field">
            <label>E-mail de contact</label>
            <input type="email" value={legal.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="form-field">
            <label>Téléphone (optionnel)</label>
            <input value={legal.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="form-field full">
            <label>Directeur de la publication</label>
            <input
              placeholder="Par défaut : le nom / raison sociale ci-dessus"
              value={legal.publicationDirector}
              onChange={(e) => set("publicationDirector", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Hébergement</h2>
        <div className="form-grid">
          <div className="form-field">
            <label>Nom de l'hébergeur</label>
            <input
              placeholder="ex : Vercel Inc."
              value={legal.hostName}
              onChange={(e) => set("hostName", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Adresse de l'hébergeur</label>
            <input value={legal.hostAddress} onChange={(e) => set("hostAddress", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Retours (droit de rétractation)</h2>
        <div className="form-field">
          <label>Adresse de retour des colis (si différente de l'adresse du siège)</label>
          <input value={legal.returnAddress} onChange={(e) => set("returnAddress", e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Mentions légales — texte additionnel (optionnel)</h2>
        <div className="form-field">
          <textarea rows={4} value={legal.mentionsExtra} onChange={(e) => set("mentionsExtra", e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <h2>CGV — texte additionnel (optionnel)</h2>
        <div className="form-field">
          <textarea rows={4} value={legal.cgvExtra} onChange={(e) => set("cgvExtra", e.target.value)} />
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </>
  );
}
