"use client";

import { useState } from "react";
import Image from "next/image";
import { CameraIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { useCart } from "@/lib/cart-context";
import QtyStepper from "./QtyStepper";
import Tabs from "./Tabs";
import TrustRating from "./TrustRating";
import ReviewsList from "./ReviewsList";

const VISIBLE_THUMBS = 3;

export default function ProductInteractive({ product }) {
  const images = (product.images || []).filter((img) => img.url);
  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState(product.variants?.[0]?.name || "");
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function showPrev() {
    setActiveImage((i) => (i - 1 + images.length) % images.length);
  }

  function showNext() {
    setActiveImage((i) => (i + 1) % images.length);
  }

  const TOTAL_SLOTS = 4;
  const hasOverflow = images.length > TOTAL_SLOTS;
  const visibleThumbs = hasOverflow ? images.slice(0, VISIBLE_THUMBS) : images;
  const overflowImage = hasOverflow ? images[VISIBLE_THUMBS] : null;
  const overflowCount = hasOverflow ? images.length - TOTAL_SLOTS : 0;

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images[0]?.url || "",
        variant,
        source: product.source,
        shopifyVariantId: product.shopifyVariantId,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <section className="product-detail">
      <div>
        <div className="gallery-main">
          {images.length ? (
            <Image
              src={images[activeImage]?.url}
              alt={images[activeImage]?.alt || product.name}
              fill
              sizes="(max-width: 960px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
              priority
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--ink-faint)" }}>
              <CameraIcon style={{ width: "34%", height: "34%", strokeWidth: 1.1 }} />
            </div>
          )}
          {images.length > 1 ? (
            <>
              <button type="button" className="gallery-nav prev" onClick={showPrev} aria-label="Photo précédente">
                <ChevronLeftIcon />
              </button>
              <button type="button" className="gallery-nav next" onClick={showNext} aria-label="Photo suivante">
                <ChevronRightIcon />
              </button>
            </>
          ) : null}
        </div>

        {images.length > 1 ? (
          <div className="gallery-thumbs">
            {visibleThumbs.map((img, i) => (
              <button key={i} className={i === activeImage ? "active" : ""} onClick={() => setActiveImage(i)}>
                <Image src={img.url} alt={img.alt || product.name} fill sizes="100px" style={{ objectFit: "contain" }} />
              </button>
            ))}
            {overflowImage ? (
              <button
                className={activeImage >= VISIBLE_THUMBS ? "active" : ""}
                onClick={() => setActiveImage(VISIBLE_THUMBS)}
              >
                <Image
                  src={overflowImage.url}
                  alt={overflowImage.alt || product.name}
                  fill
                  sizes="100px"
                  style={{ objectFit: "contain" }}
                />
                <span className="gallery-thumbs-more-overlay">+{overflowCount}</span>
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div>
        <h1 className="pd-title">{product.name}</h1>

        <div className="pd-rating">
          <TrustRating average={product.rating?.average || 0} count={product.rating?.count || 0} />
        </div>

        <div className="pd-price">
          €{product.price.toFixed(2).replace(".", ",")}
          {product.compareAtPrice ? (
            <span className="compare" style={{ fontSize: "1.1rem", marginLeft: 10 }}>
              €{product.compareAtPrice.toFixed(2).replace(".", ",")}
            </span>
          ) : null}
        </div>

        {product.features?.length ? (
          <ul className="pd-features">
            {product.features.map((f, i) => (
              <li key={i}>
                <CheckIcon /> {f}
              </li>
            ))}
          </ul>
        ) : null}

        {product.variants?.length ? (
          <>
            <p className="pd-variant-label">
              Variante : <em>{variant}</em>
            </p>
            <div className="swatches">
              {product.variants.map((v, i) => (
                <button
                  key={i}
                  className={`swatch ${variant === v.name ? "active" : ""}`}
                  style={{ background: v.colorHex }}
                  aria-label={v.name}
                  onClick={() => setVariant(v.name)}
                />
              ))}
            </div>
          </>
        ) : null}

        <div className="pd-buy-row">
          <QtyStepper value={qty} onChange={setQty} />
          <button className="btn btn-primary" onClick={handleAdd}>
            {added ? "Ajouté ✓" : "Ajouter au Panier"}
          </button>
        </div>

        <Tabs
          tabs={[
            {
              key: "description",
              label: "Description",
              content: <p>{product.description}</p>,
            },
            {
              key: "specs",
              label: "Spécifications",
              content: product.specs?.length ? (
                <table className="spec-table">
                  <tbody>
                    {product.specs.map((s, i) => (
                      <tr key={i}>
                        <td>{s.label}</td>
                        <td>{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Aucune spécification renseignée.</p>
              ),
            },
            {
              key: "avis",
              label: "Avis Clients",
              content: <ReviewsList reviews={product.reviews} rating={product.rating} />,
            },
          ]}
        />
      </div>
    </section>
  );
}
