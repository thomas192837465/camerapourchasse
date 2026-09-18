"use client";

import { useState } from "react";
import Link from "next/link";
import { StarIcon, CheckIcon } from "./Icons";
import { cloudinaryTransform } from "@/lib/cloudinaryUrl";

const TRUNCATE_LENGTH = 110;

function TestimonialCard({ item, hidden }) {
  const [expanded, setExpanded] = useState(false);
  const rating = Math.round(item.rating || 5);
  const text = item.text || "";
  const isLong = text.length > TRUNCATE_LENGTH;

  return (
    <div className="testimonial-card" aria-hidden={hidden || undefined}>
      <span className="trust-rating-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`trust-star${n <= rating ? " filled" : ""}`}>
            <StarIcon />
          </span>
        ))}
      </span>
      {item.title ? <h3 className="testimonial-title">{item.title}</h3> : null}
      <p className="testimonial-text">
        {expanded || !isLong ? text : `${text.slice(0, TRUNCATE_LENGTH).trimEnd()}…`}
        {isLong && !expanded ? (
          <button type="button" className="testimonial-more" onClick={() => setExpanded(true)} tabIndex={hidden ? -1 : 0}>
            Lire la suite
          </button>
        ) : null}
      </p>
      {item.image?.url ? (
        <img
          className="testimonial-image"
          src={cloudinaryTransform(item.image.url, "w_400,q_auto,f_auto")}
          alt={item.image.alt || `Photo envoyée par ${item.name}`}
        />
      ) : null}
      <div className="testimonial-author">
        {item.avatar?.url ? (
          <img
            className="review-avatar-img"
            src={cloudinaryTransform(item.avatar.url, "w_100,q_auto,f_auto")}
            alt={item.avatar.alt || `Photo de profil de ${item.name}`}
          />
        ) : (
          <span className="avatar">{item.name.slice(0, 2).toUpperCase()}</span>
        )}
        <strong className="testimonial-name">{item.name}</strong>
      </div>
      {item.verified ? (
        <Link href="/produits" className="testimonial-verified" tabIndex={hidden ? -1 : 0}>
          <CheckIcon /> Achat vérifié
        </Link>
      ) : null}
    </div>
  );
}

// Section "Ils nous ont fait confiance" affichée sur l'accueil : témoignages saisis dans l'admin,
// défilant en continu (bandeau façon "wall of love"). La liste est dupliquée une fois : l'animation
// CSS glisse de 0 à -50% de la largeur totale, donc le deuxième exemplaire prend le relais pile là
// où le premier s'arrête, ce qui donne une boucle infinie sans à-coup.
export default function TestimonialsSection({ title, rating, testimonials }) {
  const valid = (testimonials || []).filter((t) => t.name && t.text);

  if (!valid.length) return null;

  const roundedRating = Math.round(rating || 0);
  const loop = [...valid, ...valid];
  const duration = Math.max(20, valid.length * 6);

  return (
    <section className="section testimonials-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        {rating ? (
          <div className="testimonials-rating">
            <span className="trust-rating-stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={`trust-star${n <= roundedRating ? " filled" : ""}`}>
                  <StarIcon />
                </span>
              ))}
            </span>
            <strong>{Number(rating).toFixed(1)}/5</strong>
          </div>
        ) : null}

        <div className="testimonials-marquee">
          <div className="testimonials-marquee-track" style={{ "--marquee-duration": `${duration}s` }}>
            {loop.map((t, i) => (
              <div className="testimonial-item" key={`${t.id || t.name}-${i}`}>
                <TestimonialCard item={t} hidden={i >= valid.length} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
