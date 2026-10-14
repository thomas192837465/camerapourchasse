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
      items: [...n.items, { id: `lien-${Date.now()}`, label: "", href: "", children: [] }],
    }));
  }

  function removeItem(index) {
    setNav((n) => ({ ...n, items: n.items.filter((_, i) => i !== index) }));
  }

  function addChild(index) {
    setNav((n) => ({
      ...n,
      items: n.items.map((item, i) =>
        i === index
          ? { ...item, children: [...(item.children || []), { id: `sous-lien-${Date.now()}`, label: "", href: "" }] }
          : item
      ),
    }));
  }

  function updateChild(index, childIndex, field, value) {
    setNav((n) => ({
      ...n,
      items: n.items.map((item, i) =>
        i === index
          ? {
              ...item,
              children: item.children.map((child, ci) => (ci === childIndex ? { ...child, [field]: value } : child)),
            }
          : item
      ),
    }));
  }

  function removeChild(index, childIndex) {
    setNav((n) => ({
      ...n,
      items: n.items.map((item, i) =>
        i === index ? { ...item, children: item.children.filter((_, ci) => ci !== childIndex) } : item
      ),
    }));
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Navigation</h1>
          <p>
            Le menu commence par un menu déroulant qui liste les catégories cochées « Afficher dans le menu »
            (Catalogue → Catégories), puis affiche les liens ci-dessous.
          </p>
        </div>
      </div>

      <div className="admin-card">
        <h2>Menu déroulant des catégories</h2>
        <div className="repeatable-row">
          <div className="form-field">
            <label>Libellé du menu</label>
            <input
              placeholder="Nos caméras"
              value={nav.productsLabel ?? ""}
              onChange={(e) => setNav((n) => ({ ...n, productsLabel: e.target.value }))}
            />
          </div>
          <div className="form-field">
            <label>Dernier lien (vers /produits)</label>
            <input
              placeholder="Toutes les caméras"
              value={nav.productsAllLabel ?? ""}
              onChange={(e) => setNav((n) => ({ ...n, productsAllLabel: e.target.value }))}
            />
          </div>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0 10px" }}>
          <input
            type="checkbox"
            checked={nav.productsDropdown === true}
            onChange={(e) => setNav((n) => ({ ...n, productsDropdown: e.target.checked }))}
          />
          Afficher les catégories dans un menu déroulant (sinon, simple lien vers /produits)
        </label>
        <p className="form-hint">
          Une catégorie ajoutée comme lien ci-dessous (ex : Accessoires) n&apos;est pas répétée dans ce menu
          déroulant. Pour en masquer une autre, décochez « Afficher dans le menu » dans sa fiche catégorie.
        </p>
      </div>

      <div className="admin-card">
        <h2>Liens du menu</h2>
        {nav.items.map((item, i) => (
          <div className="admin-card" style={{ background: "var(--bg)", marginBottom: 14 }} key={item.id || i}>
            <div className="repeatable-row">
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

            <div style={{ marginTop: 10, paddingLeft: 20 }}>
              <label className="form-hint" style={{ display: "block", marginBottom: 8 }}>
                Sous-libellés (menu déroulant sous "{item.label || "…"}")
              </label>
              {(item.children || []).map((child, ci) => (
                <div className="repeatable-row" key={child.id || ci} style={{ marginBottom: 8 }}>
                  <div className="form-field">
                    <input
                      placeholder="ex : Boîtiers de protection"
                      value={child.label}
                      onChange={(e) => updateChild(i, ci, "label", e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <input
                      placeholder="ex : /produits/accessoires/boitiers"
                      value={child.href}
                      onChange={(e) => updateChild(i, ci, "href", e.target.value)}
                    />
                  </div>
                  <button type="button" className="icon-btn" onClick={() => removeChild(i, ci)} aria-label="Supprimer">
                    <TrashIcon />
                  </button>
                </div>
              ))}
              <button type="button" className="add-row-btn" onClick={() => addChild(i)}>
                + Ajouter un sous-lien
              </button>
            </div>
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
