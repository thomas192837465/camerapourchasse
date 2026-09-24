"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CameraIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { useCart } from "@/lib/cart-context";
import QtyStepper from "./QtyStepper";
import Tabs from "./Tabs";
import TrustRating from "./TrustRating";
import ReviewsList from "./ReviewsList";
import ProductPackSelector from "./ProductPackSelector";
import FaIcon from "./FaIcon";
import DeliveryEstimate from "./DeliveryEstimate";
import { cloudinaryTransform } from "@/lib/cloudinaryUrl";

const VISIBLE_THUMBS = 3;

export default function ProductInteractive({ product, bundle }) {
  const images = (product.images || []).filter((img) => img.url);
  const [activeImage, setActiveImage] = useState(0);

  // Pack croisé avec un autre produit Shopify (ex : caméra + carte SD vendue séparément) : prend
  // le pas sur le sélecteur de variantes "classique" ci-dessous, qui reste utile pour un produit
  // ayant plusieurs vraies variantes Shopify (couleur, capacité...) sans pack.
  const hasBundle = product.source === "shopify" && Boolean(bundle) && bundle.variants?.length > 0;
  const [selectedBundleVariantId, setSelectedBundleVariantId] = useState(bundle?.defaultVariantId || null);
  const selectedBundleVariant = hasBundle ? bundle.variants.find((v) => v.id === selectedBundleVariantId) : null;

  const bundledImageNode = product.pack?.bundledImage?.url ? (
    <img
      className="pack-option-item-img"
      src={cloudinaryTransform(product.pack.bundledImage.url, "w_60,h_60,c_fill,q_auto,f_auto")}
      alt={product.pack.bundledImage.alt || ""}
    />
  ) : (
    <FaIcon name="sdcard" />
  );

  const bundleOptions =
    hasBundle && selectedBundleVariant
      ? [
          {
            id: "solo",
            title: product.pack?.soloTitle || product.name,
            price: product.price,
            compareAtPrice: product.compareAtPrice || 0,
            availableForSale: product.stock > 0,
            subtitle: product.pack?.soloSubtitle || "",
            items: [{ image: product.pack?.cameraImage, icon: "camera", label: `1× ${product.name}` }],
          },
          {
            id: "pack",
            title: product.pack?.packTitle || `Pack avec ${bundle.name}`,
            price: product.price + selectedBundleVariant.price,
            compareAtPrice:
              (product.compareAtPrice || product.price) + (selectedBundleVariant.compareAtPrice || selectedBundleVariant.price),
            availableForSale: product.stock > 0 && selectedBundleVariant.availableForSale,
            subtitle: product.pack?.packSubtitle || "",
            badge: product.pack?.packBadge || "",
            items: [{ image: product.pack?.cameraImage, icon: "camera", label: `1× ${product.name}` }],
            extra:
              bundle.variants.length > 1 ? (
                <span className="pack-option-item">
                  {bundledImageNode}
                  <select
                    value={selectedBundleVariantId}
                    onChange={(e) => setSelectedBundleVariantId(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {bundle.variants.map((v) => (
                      <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                        {bundle.name} — {v.label} ({v.price.toFixed(2).replace(".", ",")}€
                        {v.availableForSale ? "" : ", rupture de stock"})
                      </option>
                    ))}
                  </select>
                </span>
              ) : (
                <span className="pack-option-item">
                  {bundledImageNode}
                  1× {bundle.name} — {selectedBundleVariant.label}
                </span>
              ),
          },
        ]
      : null;

  const isMultiVariant = product.source === "shopify" && !hasBundle && (product.variants?.length || 0) > 1;
  const [variant, setVariant] = useState(!hasBundle && !isMultiVariant ? product.variants?.[0]?.name || "" : "");
  const [selectedOptionId, setSelectedOptionId] = useState(() => {
    if (hasBundle) return "solo";
    if (!isMultiVariant) return null;
    return (product.variants.find((v) => v.availableForSale) || product.variants[0]).id;
  });
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const buyRowRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Barre "Ajouter au panier" fixée en bas de l'écran une fois que le bouton d'origine (dans
  // pd-buy-row) est scrollé hors de vue, pour ne pas obliger à remonter toute la fiche produit.
  useEffect(() => {
    function checkPosition() {
      const el = buyRowRef.current;
      if (!el) return;
      setShowStickyBar(el.getBoundingClientRect().bottom < 0);
    }
    checkPosition();
    window.addEventListener("scroll", checkPosition, { passive: true });
    window.addEventListener("resize", checkPosition);
    return () => {
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    };
  }, []);

  const selectedBundleOption = hasBundle ? bundleOptions?.find((o) => o.id === selectedOptionId) : null;
  const selectedVariant = isMultiVariant ? product.variants.find((v) => v.id === selectedOptionId) : null;
  const displayPrice = selectedBundleOption ? selectedBundleOption.price : selectedVariant ? selectedVariant.price : product.price;

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
        name: selectedVariant ? `${product.name} — ${selectedVariant.title}` : product.name,
        price: hasBundle ? product.price : displayPrice,
        image: images[0]?.url || "",
        variant,
        source: product.source,
        shopifyVariantId: selectedVariant ? selectedVariant.id : product.shopifyVariantId,
      },
      qty
    );

    // Pack sélectionné : la carte SD (ou tout autre produit bundlé) est un vrai produit Shopify à
    // part entière, ajoutée comme une SECONDE ligne de panier avec la capacité choisie — pour que
    // la commande Shopify finale ait deux lignes distinctes, chacune fournie et suivie
    // séparément (voir DSers).
    if (hasBundle && selectedOptionId === "pack" && selectedBundleVariant) {
      addItem(
        {
          productId: bundle.productId,
          name: `${bundle.name} — ${selectedBundleVariant.label}`,
          price: selectedBundleVariant.price,
          image: bundle.image || "",
          variant: "",
          source: "shopify",
          shopifyVariantId: selectedBundleVariant.id,
        },
        qty
      );
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const stickyPrice = hasBundle ? selectedBundleOption?.price ?? product.price : displayPrice;

  return (
    <>
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

        {!hasBundle || !bundleOptions ? (
          <div className="pd-price">
            €{product.price.toFixed(2).replace(".", ",")}
            {product.compareAtPrice ? (
              <>
                <span className="compare" style={{ fontSize: "1.1rem", marginLeft: 10 }}>
                  €{product.compareAtPrice.toFixed(2).replace(".", ",")}
                </span>
                <span className="discount-pct" style={{ marginLeft: 10 }}>
                  -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                </span>
              </>
            ) : null}
          </div>
        ) : null}

        {product.features?.length ? (
          <ul className="pd-features">
            {product.features.map((f, i) => (
              <li key={i}>
                <CheckIcon /> {f}
              </li>
            ))}
          </ul>
        ) : null}

        {hasBundle && bundleOptions ? (
          <ProductPackSelector
            variants={bundleOptions}
            selectedId={selectedOptionId}
            onSelect={setSelectedOptionId}
          />
        ) : product.source !== "shopify" && product.variants?.length ? (
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

        <div className="pd-buy-row" ref={buyRowRef}>
          <QtyStepper value={qty} onChange={setQty} />
          <button className="btn btn-primary" onClick={handleAdd}>
            {added ? "Ajouté ✓" : "Ajouter au Panier"}
          </button>
        </div>

        <DeliveryEstimate />

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

    <div className={`pd-sticky-bar${showStickyBar ? " visible" : ""}`}>
      <div className="pd-sticky-info">
        <span className="pd-sticky-name">{product.name}</span>
        <span className="pd-sticky-price">€{stickyPrice.toFixed(2).replace(".", ",")}</span>
      </div>
      <button className="btn btn-primary" onClick={handleAdd}>
        {added ? "Ajouté ✓" : "Ajouter au Panier"}
      </button>
    </div>
    </>
  );
}
