"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/settings";
import { defaultShopify } from "@/lib/defaults";

export default function ShopifySettingsPage() {
  const [shopify, setShopify] = useState(defaultShopify);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings("shopify").then((s) => {
      setShopify(s);
      setReady(true);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveSettings("shopify", shopify);
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
          <h1>Intégration Shopify</h1>
          <p>Pour le suivi de colis et les étiquettes d'expédition, gérés côté Shopify.</p>
        </div>
      </div>

      <div className="banner warning">
        Non connecté pour le moment. Ces champs enregistrent votre configuration pour préparer la synchronisation ;
        la connexion effective (récupération automatique des commandes, statuts et numéros de suivi) sera activée
        dans une prochaine étape, une fois votre boutique Shopify créée.
      </div>

      <div className="admin-card">
        <div className="form-field">
          <label>Domaine de la boutique (xxxx.myshopify.com)</label>
          <input value={shopify.shopDomain} onChange={(e) => setShopify((s) => ({ ...s, shopDomain: e.target.value }))} />
        </div>
        <div className="form-field">
          <label>Jeton d'accès Admin API</label>
          <input
            type="password"
            value={shopify.accessToken}
            onChange={(e) => setShopify((s) => ({ ...s, accessToken: e.target.value }))}
          />
          <span className="form-hint">Généré dans Shopify → Paramètres → Applications → Développer une application.</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </>
  );
}
