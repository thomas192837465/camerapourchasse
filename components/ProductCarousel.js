"use client";

import { useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

export default function ProductCarousel({ products }) {
  const trackRef = useRef(null);

  function scrollByAmount(direction) {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstChild?.offsetWidth || 280;
    track.scrollBy({ left: direction * (cardWidth + 20) * 2, behavior: "smooth" });
  }

  if (!products.length) return null;

  return (
    <div className="carousel">
      <button
        type="button"
        className="carousel-nav prev"
        onClick={() => scrollByAmount(-1)}
        aria-label="Produits précédents"
      >
        <ChevronLeftIcon />
      </button>
      <div className="carousel-track" ref={trackRef}>
        {products.map((product) => (
          <div className="carousel-item" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <button
        type="button"
        className="carousel-nav next"
        onClick={() => scrollByAmount(1)}
        aria-label="Produits suivants"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}
