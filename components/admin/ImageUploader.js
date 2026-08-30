"use client";

import { useRef, useState } from "react";
import { resizeImageToFit } from "@/lib/image";
import { uploadToCloudinary, cloudinaryEnabled } from "@/lib/cloudinary";

export default function ImageUploader({ images, onChange, targetSize }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError("");

    if (!cloudinaryEnabled) {
      setError(
        "Cloudinary n'est pas configuré (voir .env.local.example : NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME et NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)."
      );
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const blob = await resizeImageToFit(file, targetSize.width, targetSize.height);
        const { url, publicId } = await uploadToCloudinary(blob);
        uploaded.push({ url, cloudinaryId: publicId, alt: "" });
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err.message || "Échec de l'upload.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove(index) {
    // Retire l'image du produit. Le fichier reste sur Cloudinary (la suppression nécessite
    // une requête signée côté serveur) — quota gratuit largement suffisant pour une boutique.
    onChange(images.filter((_, i) => i !== index));
  }

  function handleAltChange(index, alt) {
    onChange(images.map((img, i) => (i === index ? { ...img, alt } : img)));
  }

  function makePrimary(index) {
    if (index === 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  }

  return (
    <div>
      <p className="form-hint" style={{ marginBottom: 10 }}>
        Les photos sont automatiquement recadrées en {targetSize.width}×{targetSize.height}px. La première photo est
        utilisée comme image principale.
      </p>

      {!cloudinaryEnabled ? (
        <div className="banner warning" style={{ marginBottom: 14 }}>
          Cloudinary n'est pas encore configuré : l'ajout de photos est désactivé pour l'instant (voir le README).
        </div>
      ) : null}

      <div className="uploader-grid">
        {images.map((img, i) => (
          <div key={img.cloudinaryId || i}>
            <div className="uploader-slot">
              <img src={img.url} alt={img.alt || ""} />
              {i === 0 ? <span className="primary-tag">Principale</span> : null}
              <button type="button" className="remove-tag" onClick={() => handleRemove(i)} aria-label="Supprimer">
                ×
              </button>
            </div>
            <input
              type="text"
              placeholder="Texte alternatif (SEO)"
              value={img.alt}
              onChange={(e) => handleAltChange(i, e.target.value)}
              style={{
                width: "100%",
                marginTop: 6,
                fontSize: "0.75rem",
                padding: "6px 8px",
                border: "1px solid var(--border)",
                borderRadius: 6,
              }}
            />
            {i !== 0 ? (
              <button
                type="button"
                onClick={() => makePrimary(i)}
                style={{ fontSize: "0.72rem", marginTop: 4, background: "none", border: "none", color: "var(--green-700)", textDecoration: "underline" }}
              >
                Définir comme principale
              </button>
            ) : null}
          </div>
        ))}

        <button type="button" className="uploader-add" onClick={() => inputRef.current?.click()} disabled={uploading || !cloudinaryEnabled}>
          <span style={{ fontSize: "1.4rem" }}>+</span>
          {uploading ? "Envoi…" : "Ajouter des photos"}
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
      {error ? <div className="banner error">{error}</div> : null}
    </div>
  );
}
