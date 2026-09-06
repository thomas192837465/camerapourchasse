"use client";

import { useRef, useState } from "react";
import { uploadToCloudinary, cloudinaryEnabled } from "@/lib/cloudinary";
import { addMediaItem } from "@/lib/media";

/**
 * Photos jointes à un avis client (déballage, installation...) : upload multiple, sans
 * recadrage — contrairement aux photos produit, elles sont affichées telles quelles.
 */
export default function ReviewPhotosField({ photos, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError("");

    if (!cloudinaryEnabled) {
      setError("Cloudinary n'est pas configuré (voir README).");
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const { url, publicId } = await uploadToCloudinary(file);
        const item = { url, cloudinaryId: publicId, alt: "" };
        uploaded.push(item);
        addMediaItem(item).catch(() => {});
      }
      onChange([...photos, ...uploaded]);
    } catch (err) {
      setError(err.message || "Échec de l'upload.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove(index) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        {photos.map((p, i) => (
          <div key={i} style={{ position: "relative", width: 56, height: 56 }}>
            <img
              src={p.url}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }}
            />
            <button
              type="button"
              className="remove-tag"
              onClick={() => handleRemove(i)}
              aria-label="Supprimer"
              style={{ position: "absolute", top: -6, right: -6 }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || !cloudinaryEnabled}
      >
        {uploading ? "Envoi…" : "+ Ajouter des photos"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
      {error ? <div className="banner error" style={{ marginTop: 8 }}>{error}</div> : null}
    </div>
  );
}
