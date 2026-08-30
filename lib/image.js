"use client";

/**
 * Redimensionne un fichier image côté navigateur vers une taille fixe (mode "contain",
 * centré sur fond blanc, sans recadrage), afin que toutes les photos produit soient
 * uniformes tout en gardant le produit entier visible. Retourne un Blob JPEG prêt à être uploadé.
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

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      const sourceRatio = img.width / img.height;
      const targetRatio = targetWidth / targetHeight;

      let dw, dh;
      if (sourceRatio > targetRatio) {
        dw = targetWidth;
        dh = dw / sourceRatio;
      } else {
        dh = targetHeight;
        dw = dh * sourceRatio;
      }
      const dx = (targetWidth - dw) / 2;
      const dy = (targetHeight - dh) / 2;

      ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dw, dh);

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
