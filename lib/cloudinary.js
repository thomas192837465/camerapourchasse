"use client";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryEnabled = Boolean(CLOUD_NAME && UPLOAD_PRESET);

/** Upload d'un Blob/File vers Cloudinary (upload non signé, sans clé secrète côté client). */
export async function uploadToCloudinary(blob) {
  if (!cloudinaryEnabled) {
    throw new Error(
      "Cloudinary n'est pas configuré (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET manquants)."
    );
  }

  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.error?.message || "Échec de l'upload vers Cloudinary.");
  }

  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}

/** Upload d'une vidéo (fichier brut, pas de redimensionnement client comme pour les images :
 * Cloudinary l'encode à la volée). Même préréglage non signé que les photos. */
export async function uploadVideoToCloudinary(file) {
  if (!cloudinaryEnabled) {
    throw new Error(
      "Cloudinary n'est pas configuré (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET manquants)."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.error?.message || "Échec de l'upload de la vidéo vers Cloudinary.");
  }

  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}

/** Image de la première image de la vidéo (même fichier Cloudinary, extension changée) — sert de
 * vignette dans les carrousels, sans avoir à générer/uploader une image séparée. */
export function videoPosterUrl(url) {
  return (url || "").replace(/\.(mp4|mov|webm|m4v)(\?.*)?$/i, ".jpg$2");
}
