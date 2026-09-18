"use client";

import { TrashIcon } from "@/components/Icons";
import { shopifyGidToDocId } from "@/lib/shopifyContent";
import IconPicker from "./IconPicker";

const EMPTY_INFO = { subtitle: "", badge: "", items: [] };

// Complément éditorial par variante Shopify (ex : "Caméra seule" / "Pack Prêt à filmer") : sous-titre,
// badge et liste d'articles inclus, affichés par ProductPackSelector sur la fiche produit dès qu'un
// produit Shopify a plusieurs variantes.
export default function VariantInfoEditor({ variants, value, onChange }) {
  function infoFor(variantId) {
    return { ...EMPTY_INFO, ...(value[shopifyGidToDocId(variantId)] || {}) };
  }

  function update(variantId, patch) {
    const docId = shopifyGidToDocId(variantId);
    onChange({ ...value, [docId]: { ...infoFor(variantId), ...patch } });
  }

  function addItem(variantId) {
    const info = infoFor(variantId);
    update(variantId, { items: [...info.items, { icon: "star", label: "" }] });
  }

  function updateItem(variantId, index, patch) {
    const info = infoFor(variantId);
    update(variantId, { items: info.items.map((it, i) => (i === index ? { ...it, ...patch } : it)) });
  }

  function removeItem(variantId, index) {
    const info = infoFor(variantId);
    update(variantId, { items: info.items.filter((_, i) => i !== index) });
  }

  return (
    <div>
      {variants.map((v) => {
        const info = infoFor(v.id);
        return (
          <div className="admin-card" style={{ background: "var(--bg)", marginBottom: 14 }} key={v.id}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <strong style={{ fontSize: "0.9rem" }}>{v.title}</strong>
              <span className="form-hint">
                €{Number(v.price.amount).toFixed(2).replace(".", ",")} ·{" "}
                {v.availableForSale ? "En stock" : "Indisponible"}
              </span>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>Sous-titre (ex : "Pour commencer dès réception.")</label>
                <input value={info.subtitle} onChange={(e) => update(v.id, { subtitle: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Badge (laisser vide pour n'en afficher aucun)</label>
                <input
                  placeholder='ex : "LE PLUS CHOISI"'
                  value={info.badge}
                  onChange={(e) => update(v.id, { badge: e.target.value })}
                />
              </div>
            </div>

            <div className="form-field" style={{ marginTop: 10 }}>
              <label>Articles inclus dans cette formule</label>
              {info.items.map((item, i) => (
                <div className="repeatable-row" key={i}>
                  <IconPicker value={item.icon} onChange={(icon) => updateItem(v.id, i, { icon })} />
                  <div className="form-field">
                    <input
                      placeholder='ex : "1× Caméra de Chasse Full HD 1080p"'
                      value={item.label}
                      onChange={(e) => updateItem(v.id, i, { label: e.target.value })}
                    />
                  </div>
                  <button type="button" className="icon-btn" onClick={() => removeItem(v.id, i)}>
                    <TrashIcon />
                  </button>
                </div>
              ))}
              <button type="button" className="add-row-btn" onClick={() => addItem(v.id)}>
                + Ajouter un article
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
