"use client";

import { TrashIcon } from "@/components/Icons";

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function FooterColumnsEditor({ columns, onChange }) {
  function updateColumn(index, patch) {
    onChange(columns.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function addColumn() {
    onChange([...columns, { id: uid("col"), title: "", links: [] }]);
  }

  function removeColumn(index) {
    onChange(columns.filter((_, i) => i !== index));
  }

  function addLink(colIndex) {
    updateColumn(colIndex, {
      links: [...columns[colIndex].links, { id: uid("lien"), label: "", href: "" }],
    });
  }

  function updateLink(colIndex, linkIndex, field, value) {
    updateColumn(colIndex, {
      links: columns[colIndex].links.map((l, i) => (i === linkIndex ? { ...l, [field]: value } : l)),
    });
  }

  function removeLink(colIndex, linkIndex) {
    updateColumn(colIndex, { links: columns[colIndex].links.filter((_, i) => i !== linkIndex) });
  }

  return (
    <div>
      {columns.map((col, ci) => (
        <div className="admin-card" style={{ background: "var(--bg)", marginBottom: 14 }} key={col.id}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <input
              placeholder="Titre de la colonne (ex : Produits)"
              value={col.title}
              onChange={(e) => updateColumn(ci, { title: e.target.value })}
              style={{ flex: 1 }}
            />
            <button type="button" className="icon-btn" onClick={() => removeColumn(ci)} aria-label="Supprimer la colonne">
              <TrashIcon />
            </button>
          </div>

          {col.links.map((link, li) => (
            <div className="repeatable-row" key={link.id}>
              <div className="form-field">
                <input
                  placeholder="Libellé"
                  value={link.label}
                  onChange={(e) => updateLink(ci, li, "label", e.target.value)}
                />
              </div>
              <div className="form-field">
                <input
                  placeholder="Lien (ex : /produits/accessoires)"
                  value={link.href}
                  onChange={(e) => updateLink(ci, li, "href", e.target.value)}
                />
              </div>
              <button type="button" className="icon-btn" onClick={() => removeLink(ci, li)} aria-label="Supprimer">
                <TrashIcon />
              </button>
            </div>
          ))}
          <button type="button" className="add-row-btn" onClick={() => addLink(ci)}>
            + Ajouter un lien
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm" onClick={addColumn}>
        + Ajouter une colonne
      </button>
    </div>
  );
}
