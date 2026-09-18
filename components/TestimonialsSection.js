"use client";

import { useRef, useState } from "react";
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { cloudinaryTransform } from "@/lib/cloudinaryUrl";

const TRUNCATE_LENGTH = 110;

function TestimonialCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const rating = Math.round(item.rating || 5);
  const text = item.text || "";
  const isLong = text.length > TRUNCATE_LENGTH;

  return (
    <div className="testimonial-card">
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
          <button type="button" className="testimonial-more" onClick={() => setExpanded(true)}>
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
      <strong className="testimonial-name">{item.name}</strong>
    </div>
  );
}

// Section "Ils nous ont fait confiance" affichée sur l'accueil : témoignages saisis dans l'admin,
// présentés en carrousel horizontal (même mécanique que ProductCarousel).
export default function TestimonialsSection({ title, rating, testimonials }) {
  const trackRef = useRef(null);
  const valid = (testimonials || []).filter((t) => t.name && t.text);

  if (!valid.length) return null;

  function scrollByAmount(direction) {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstChild?.offsetWidth || 280;
    track.scrollBy({ left: direction * (cardWidth + 20) * 2, behavior: "smooth" });
  }

  const roundedRating = Math.round(rating || 0);

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

        <div className="carousel">
          <button
            type="button"
            className="carousel-nav prev"
            onClick={() => scrollByAmount(-1)}
            aria-label="Témoignages précédents"
          >
            <ChevronLeftIcon />
          </button>
          <div className="carousel-track" ref={trackRef}>
            {valid.map((t, i) => (
              <div className="carousel-item testimonial-item" key={t.id || i}>
                <TestimonialCard item={t} />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="carousel-nav next"
            onClick={() => scrollByAmount(1)}
            aria-label="Témoignages suivants"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
