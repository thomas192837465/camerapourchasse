"use client";

import { useState } from "react";
import { CameraIcon, CheckIcon, StarRating } from "./Icons";
import { useCart } from "@/lib/cart-context";
import QtyStepper from "./QtyStepper";
import Tabs from "./Tabs";

export default function ProductInteractive({ product }) {
  const images = (product.images || []).filter((img) => img.url);
  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState(product.variants?.[0]?.name || "");
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images[0]?.url || "",
        variant,
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
            <img src={images[activeImage]?.url} alt={images[activeImage]?.alt || product.name} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.85)" }}>
              <CameraIcon style={{ width: "34%", height: "34%", strokeWidth: 1.1 }} />
            </div>
          )}
        </div>

        {images.length > 1 ? (
          <div className="gallery-thumbs">
            {images.map((img, i) => (
              <button key={i} className={i === activeImage ? "active" : ""} onClick={() => setActiveImage(i)}>
                <img src={img.url} alt={img.alt || product.name} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <h1 className="pd-title">{product.name}</h1>

        <div className="pd-rating">
          <StarRating average={product.rating?.average} />
          <strong>{(product.rating?.average || 0).toFixed(1)}/5</strong> · {product.rating?.count || 0} avis
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
            {product.features.map((f) => (
              <li key={f}>
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
              {product.variants.map((v) => (
                <button
                  key={v.name}
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
                    {product.specs.map((s) => (
                      <tr key={s.label}>
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
              content: (
                <div className="review-list">
                  <div className="review">
                    <div className="avatar">ML</div>
                    <div>
                      <div className="review-head">
                        <strong>Marc L.</strong>
                        <span className="stars">★★★★★</span>
                        <span style={{ fontSize: "0.78rem", color: "var(--ink-faint)" }}>5/5</span>
                      </div>
                      <p>
                        Excellente caméra, déclenchement très rapide et images nettes même de nuit. La connexion 4G
                        fonctionne parfaitement en forêt.
                      </p>
                    </div>
                  </div>
                  <div className="review">
                    <div className="avatar">SD</div>
                    <div>
                      <div className="review-head">
                        <strong>Sophie D.</strong>
                        <span className="stars">★★★★★</span>
                        <span style={{ fontSize: "0.78rem", color: "var(--ink-faint)" }}>5/5</span>
                      </div>
                      <p>Boîtier très solide et parfaitement étanche après plusieurs semaines sous la pluie.</p>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
}
