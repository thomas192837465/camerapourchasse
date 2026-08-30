"use client";

/**
 * Recadre/redimensionne un fichier image côté navigateur vers une taille fixe
 * (mode "cover", centré), afin que toutes les photos produit soient uniformes.
 * Retourne un Blob JPEG prêt à être uploadé.
 */
export function resizeImageToFit(file, targetWidth, targetHeight, quality = 0.9) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      const sourceRatio = img.width / img.height;
      const targetRatio = targetWidth / targetHeight;

      let sx, sy, sw, sh;
      if (sourceRatio > targetRatio) {
        sh = img.height;
        sw = sh * targetRatio;
        sx = (img.width - sw) / 2;
        sy = 0;
      } else {
        sw = img.width;
        sh = sw / targetRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Échec du traitement de l'image"))),
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossible de lire cette image"));
    };

    img.src = url;
  });
}
