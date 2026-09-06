"use client";

import { useEffect, useState } from "react";
import { cloudinaryTransform } from "@/lib/cloudinaryUrl";

/**
 * Fond décoratif flou derrière la photo du hero : fait défiler les photos des produits
 * (best-sellers) déjà mis en avant dans l'admin, une image toutes les 7 secondes.
 */
export default function HeroCameraBackdrop({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 7000);
    return () => clearInterval(id);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div className="hero-camera-backdrop" aria-hidden="true">
      {images.map((img, i) => (
        <img
          key={img.url}
          src={cloudinaryTransform(img.url, "w_500,q_auto,f_auto")}
          alt=""
          className={`hero-camera-backdrop-img${i === index ? " is-active" : ""}`}
        />
      ))}
    </div>
  );
}
