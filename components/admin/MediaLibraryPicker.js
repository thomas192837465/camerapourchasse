"use client";

import { useEffect, useState } from "react";
import { getMediaLibrary, removeMediaItem } from "@/lib/media";
import { TrashIcon } from "@/components/Icons";

export default function MediaLibraryPicker({ onSelect, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMediaLibrary()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(e, id) {
    e.stopPropagation();
    if (!confirm("Retirer cette photo de la bibliothèque ? (elle reste sur les produits qui l'utilisent déjà)")) return;
    await removeMediaItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Bibliothèque média</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        {loading ? (
          <p>Chargement…</p>
        ) : items.length ? (
          <div className="uploader-grid">
            {items.map((item) => (
              <div
                key={item.id}
                className="uploader-slot media-picker-item"
                role="button"
                tabIndex={0}
                onClick={() => onSelect(item)}
              >
                <img src={item.url} alt={item.alt || ""} />
                <button type="button" className="remove-tag" onClick={(e) => handleRemove(e, item.id)} aria-label="Supprimer">
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>
            Aucune photo dans la bibliothèque pour l'instant. Les photos que vous ajoutez à un produit y sont
            enregistrées automatiquement.
          </p>
        )}
      </div>
    </div>
  );
}
