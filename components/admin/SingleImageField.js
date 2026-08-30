"use client";

import { useRef, useState } from "react";
import { uploadToCloudinary, cloudinaryEnabled } from "@/lib/cloudinary";
import { addMediaItem } from "@/lib/media";
import MediaLibraryPicker from "./MediaLibraryPicker";

/**
 * Champ image unique (avec texte alternatif SEO) : upload, bibliothèque partagée, ou suppression.
 * Contrairement aux photos produit (recadrées sur fond blanc, taille fixe), ces images sont
 * envoyées telles quelles : elles sont affichées en "cover" (plein cadre, sans marge) par CSS.
 */
export default function SingleImageField({ value, onChange, altPlaceholder }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);
  const image = value || { url: "", alt: "" };

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    if (!cloudinaryEnabled) {
      setError("Cloudinary n'est pas configuré (voir README).");
      return;
    }

    setUploading(true);
    try {
      const { url, publicId } = await uploadToCloudinary(file);
      const item = { url, cloudinaryId: publicId, alt: image.alt };
      addMediaItem(item).catch(() => {});
      onChange({ url, alt: image.alt });
    } catch (err) {
      setError(err.message || "Échec de l'upload.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleSelectFromLibrary(item) {
    onChange({ url: item.url, alt: image.alt || item.alt || "" });
    setShowLibrary(false);
  }

  return (
    <div>
      {image.url ? (
        <div className="uploader-slot" style={{ maxWidth: 220, marginBottom: 10 }}>
          <img src={image.url} alt={image.alt || ""} />
          <button type="button" className="remove-tag" onClick={() => onChange({ url: "", alt: "" })} aria-label="Supprimer">
            ×
          </button>
        </div>
      ) : null}

      <input
        type="text"
        placeholder={altPlaceholder || "Texte alternatif (SEO)"}
        value={image.alt}
        onChange={(e) => onChange({ ...image, alt: e.target.value })}
        style={{ marginBottom: 10 }}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" className="btn btn-outline" onClick={() => inputRef.current?.click()} disabled={uploading || !cloudinaryEnabled}>
          {uploading ? "Envoi…" : image.url ? "Changer la photo" : "Ajouter une photo"}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => setShowLibrary(true)} disabled={!cloudinaryEnabled}>
          Choisir dans la bibliothèque
        </button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      {error ? <div className="banner error" style={{ marginTop: 10 }}>{error}</div> : null}

      {showLibrary ? (
        <MediaLibraryPicker onSelect={handleSelectFromLibrary} onClose={() => setShowLibrary(false)} />
      ) : null}
    </div>
  );
}
