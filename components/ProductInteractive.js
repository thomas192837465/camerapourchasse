"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CameraIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon } from "./Icons";
import { useCart } from "@/lib/cart-context";
import QtyStepper from "./QtyStepper";
import TrustRating from "./TrustRating";
import ProductPackSelector from "./ProductPackSelector";
import FaIcon from "./FaIcon";
import DeliveryEstimate from "./DeliveryEstimate";
import PromoInline from "./PromoInline";
import { cloudinaryTransform } from "@/lib/cloudinaryUrl";
import { videoPosterUrl } from "@/lib/cloudinary";
import { formatPrice, fill } from "@/lib/format";


export default function ProductInteractive({ product, bundle, trustBadges = [], qtyTiers = [], promo = null, texts = {} }) {
  const T = texts;
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
                        {bundle.name} — {v.label} ({formatPrice(v.price)}
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
  // Packs de quantité (1 / 2 / 3 caméras) : remise en % sur chaque caméra au-delà de 1.
  // La même remise DOIT exister côté Shopify (remise automatique "dès 2 / dès 3 articles"),
  // sinon le prix affiché ici et celui du paiement diffèrent — voir REFONTE_A_LIRE.md.
  const tiers = product.hideQtyTiers
    ? []
    : (qtyTiers || []).filter((t) => Number(t.qty) >= 1).sort((a, b) => a.qty - b.qty);
  const useTiers = tiers.length > 1;
  const [tierQty, setTierQty] = useState(() => (useTiers ? Number(tiers[0].qty) : 1));
  const [stepperQty, setQty] = useState(1);
  const qty = useTiers ? tierQty : stepperQty;
  const activeTier = useTiers ? tiers.find((t) => Number(t.qty) === tierQty) : null;
  const tierPct = Number(activeTier?.discountPct) || 0;
  const applyTier = (unit, pct = tierPct) => Math.round(unit * (1 - pct / 100) * 100) / 100;
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


  function handleAdd() {
    addItem(
      {
        productId: product.id,
        name: selectedVariant ? `${product.name} — ${selectedVariant.title}` : product.name,
        price: applyTier(hasBundle ? product.price : displayPrice),
        // Prix plein + paliers : le panier recalcule la remise si la quantité y est modifiée.
        fullPrice: hasBundle ? product.price : displayPrice,
        tiers: useTiers ? tiers.map((t) => ({ qty: Number(t.qty), discountPct: Number(t.discountPct) || 0 })) : undefined,
        image: images.find((img) => img.type !== "video")?.url || "",
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

  // Prix unitaire de la caméra (formule/variante choisie), puis total réel de la sélection :
  // caméra(s) remisée(s) selon le pack + carte(s) SD si la formule "pack" est choisie.
  const cameraUnit = hasBundle ? product.price : displayPrice;
  const bundleUnit = hasBundle && selectedOptionId === "pack" && selectedBundleVariant ? selectedBundleVariant.price : 0;
  const totalPrice = qty * (applyTier(cameraUnit) + bundleUnit);
  // Pack avec un autre produit : case « en plus » (par défaut) ou deux formules (affichage historique).
  const addonMode = hasBundle && Boolean(bundleOptions) && product.pack?.displayMode !== "formula";
  const formulaMode = hasBundle && Boolean(bundleOptions) && !addonMode;
  const showPriceBlock = !useTiers && !formulaMode;

  const reviewCount = product.rating?.count || 0;
  const inBox = (product.inBox || []).filter(Boolean);

  return (
    <>
    <section className="product-detail" id="acheter">
      <div className="pd-gallery">
        <div className="gallery-main">
          {images.length ? (
            images[activeImage]?.type === "video" ? (
              <video
                key={images[activeImage].url}
                src={images[activeImage].url}
                poster={videoPosterUrl(images[activeImage].url)}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="gallery-main-video"
              />
            ) : (
              <Image
                src={images[activeImage]?.url}
                alt={images[activeImage]?.alt || product.name}
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
                style={{ objectFit: "contain" }}
                priority
              />
            )
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
          <div className="gallery-thumbs" role="tablist" aria-label="Photos et vidéos du produit">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                className={i === activeImage ? "active" : ""}
                onClick={() => setActiveImage(i)}
                aria-label={img.type === "video" ? "Voir la vidéo" : `Voir la photo ${i + 1}`}
              >
                <ThumbMedia img={img} alt={product.name} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="pd-buy">
        {reviewCount ? (
          <a href="#avis" className="pd-rating">
            <TrustRating average={product.rating.average} count={reviewCount} />
          </a>
        ) : null}

        <h1 className="pd-title">{product.name}</h1>
        {product.headline || product.shortDescription ? (
          <p className="pd-headline">{product.headline || product.shortDescription}</p>
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

        {useTiers ? (
          <>
            <p className="pd-choose-label">{T.tiersTitle}</p>
            <div className="qty-tiers" role="radiogroup" aria-label={T.tiersTitle}>
              {tiers.map((t) => {
                const n = Number(t.qty);
                const pct = Number(t.discountPct) || 0;
                const unit = applyTier(cameraUnit, pct);
                const full = (product.compareAtPrice > cameraUnit ? product.compareAtPrice : cameraUnit) * n;
                const selected = n === tierQty;
                return (
                  <label key={n} className={`qty-tier${selected ? " selected" : ""}`}>
                    <input
                      type="radio"
                      name="qty-tier"
                      className="pack-option-input"
                      checked={selected}
                      onChange={() => setTierQty(n)}
                    />
                    {t.badge ? <span className="pack-option-badge">{t.badge}</span> : null}
                    <span className={`pack-option-radio${selected ? " checked" : ""}`} aria-hidden="true" />
                    <span className="qty-tier-thumbs" aria-hidden="true">
                      {Array.from({ length: Math.min(n, 3) }).map((_, i) =>
                        images[0]?.url ? (
                          <img key={i} src={cloudinaryTransform(images[0].url, "w_80,h_80,c_pad,b_white,q_auto,f_auto")} alt="" />
                        ) : (
                          <CameraIcon key={i} />
                        )
                      )}
                    </span>
                    <span className="qty-tier-body">
                      <strong>
                        {n} {n > 1 ? T.unitPlural : T.unitSingular}
                        {pct > 0 ? <span className="qty-tier-pct">-{pct}%</span> : null}
                      </strong>
                      <small>{n > 1 ? fill(T.perUnitText, { prix: formatPrice(unit) }) : t.label || ""}</small>
                    </span>
                    <span className="qty-tier-price">
                      <strong>{formatPrice(unit * n)}</strong>
                      {full > unit * n + 0.009 ? <span className="compare">{formatPrice(full)}</span> : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </>
        ) : null}

        {showPriceBlock ? (
          <div className="pd-price">
            <span className="pd-price-current">{formatPrice(product.price)}</span>
            {product.compareAtPrice > product.price ? (
              <>
                <span className="compare">{formatPrice(product.compareAtPrice)}</span>
                <span className="discount-pct">
                  -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                </span>
              </>
            ) : null}
          </div>
        ) : null}

        {addonMode && selectedBundleVariant ? (
          <label className={`pd-addon${selectedOptionId === "pack" ? " checked" : ""}`}>
            <input
              type="checkbox"
              className="pd-addon-input"
              checked={selectedOptionId === "pack"}
              onChange={(e) => setSelectedOptionId(e.target.checked ? "pack" : "solo")}
            />
            <span className="pd-addon-box" aria-hidden="true">
              <CheckIcon />
            </span>
            <span className="pd-addon-media" aria-hidden="true">
              {bundledImageNode}
            </span>
            <span className="pd-addon-body">
              <strong>{product.pack?.addonTitle || `Ajouter : ${bundle.name}`}</strong>
              {product.pack?.addonSubtitle ? <small>{product.pack.addonSubtitle}</small> : null}
              {bundle.variants.length > 1 ? (
                <select
                  value={selectedBundleVariantId}
                  onChange={(e) => {
                    setSelectedBundleVariantId(e.target.value);
                    // Choisir une capacité = vouloir l'option : on coche la case automatiquement.
                    setSelectedOptionId("pack");
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  aria-label="Choisir la version"
                >
                  {bundle.variants.map((v) => (
                    <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                      {v.label} — {formatPrice(v.price)}
                      {v.availableForSale ? "" : " (rupture)"}
                    </option>
                  ))}
                </select>
              ) : null}
            </span>
            <span className="pd-addon-price">
              <strong>+{formatPrice(selectedBundleVariant.price * qty)}</strong>
              {qty > 1 ? <small>{formatPrice(selectedBundleVariant.price)} {T.addonPerUnitText}</small> : null}
            </span>
          </label>
        ) : null}

        {formulaMode ? (
          <>
            <p className="pd-choose-label">{useTiers ? T.formulaTitle : T.formulaChooseTitle}</p>
            {useTiers && qty > 1 ? <p className="pd-choose-hint">{T.formulaHint}</p> : null}
            <ProductPackSelector
              variants={bundleOptions}
              selectedId={selectedOptionId}
              onSelect={setSelectedOptionId}
            />
          </>
        ) : !hasBundle && product.source !== "shopify" && product.variants?.length ? (
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

        {product.stock > 0 && T.stockLabel ? (
          <p className="pd-stock">
            <span className="pd-stock-dot" aria-hidden="true" /> {T.stockLabel}
          </p>
        ) : null}

        <div className="pd-buy-row" ref={buyRowRef}>
          {useTiers ? null : <QtyStepper value={stepperQty} onChange={setQty} />}
          <button className="btn btn-accent btn-lg pd-atc" onClick={handleAdd}>
            {added ? (
              T.atcAddedLabel
            ) : (
              <>
                <span>{T.atcLabel}</span>
                <span className="pd-atc-sep" aria-hidden="true" />
                <span>{formatPrice(totalPrice)}</span>
              </>
            )}
          </button>
        </div>
        {T.microTrust?.filter(Boolean).length ? (
          <p className="pd-microtrust">
            {T.microTrust.filter(Boolean).map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </p>
        ) : null}

        {promo?.enabled ? <PromoInline promo={promo} /> : null}

        <DeliveryEstimate />

        {T.guaranteeTitle ? (
          <div className="pd-guarantee">
            {T.guaranteeSealValue ? (
              <span className="pd-guarantee-seal" aria-hidden="true">
                <strong>{T.guaranteeSealValue}</strong>
                <small>{T.guaranteeSealUnit}</small>
              </span>
            ) : null}
            <div>
              <strong>{T.guaranteeTitle}</strong>
              {T.guaranteeText ? <p>{T.guaranteeText}</p> : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="pd-details">
        {product.description ? (
          <details className="pd-acc" open>
            <summary>{T.accDescriptionTitle}</summary>
            <div className="pd-acc-body">
              <p>{product.description}</p>
            </div>
          </details>
        ) : null}
        {product.specs?.length ? (
          <details className="pd-acc">
            <summary>{T.accSpecsTitle}</summary>
            <div className="pd-acc-body">
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
            </div>
          </details>
        ) : null}
        {inBox.length ? (
          <details className="pd-acc">
            <summary>{T.accInBoxTitle}</summary>
            <div className="pd-acc-body">
              <ul className="pd-inbox">
                {inBox.map((item, i) => (
                  <li key={i}>
                    <CheckIcon /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ) : null}
        {T.accShippingTitle ? (
          <details className="pd-acc">
            <summary>{T.accShippingTitle}</summary>
            <div className="pd-acc-body">
              <p>{T.accShippingText}</p>
              <p className="pd-acc-links">
                <a href="/livraison">Page Livraison</a> · <a href="/cgv">CGV</a>
              </p>
            </div>
          </details>
        ) : null}
        {T.accWarrantyTitle ? (
          <details className="pd-acc">
            <summary>{T.accWarrantyTitle}</summary>
            <div className="pd-acc-body">
              <p>{T.accWarrantyText}</p>
            </div>
          </details>
        ) : null}
      </div>
    </section>

    <div className={`pd-sticky-bar${showStickyBar ? " visible" : ""}`}>
      <div className="pd-sticky-info">
        <span className="pd-sticky-name">{product.name}</span>
        <span className="pd-sticky-price">{formatPrice(totalPrice)}</span>
      </div>
      <button className="btn btn-accent" onClick={handleAdd}>
        {added ? T.atcAddedLabel : T.atcLabel}
      </button>
    </div>
    </>
  );
}

// Vignette de la galerie/fil d'attente : une vidéo n'a pas de prévisualisation Next/Image valide
// (ce n'est pas une image), donc on affiche l'image de sa première frame (même fichier Cloudinary,
// extension changée — voir lib/cloudinary.js) avec un repère "lecture" par-dessus.
function ThumbMedia({ img, alt }) {
  if (img.type === "video") {
    return (
      <>
        <Image src={videoPosterUrl(img.url)} alt={img.alt || alt} fill sizes="100px" style={{ objectFit: "contain" }} />
        <span className="gallery-thumbs-video-overlay">
          <PlayIcon />
        </span>
      </>
    );
  }
  return <Image src={img.url} alt={img.alt || alt} fill sizes="100px" style={{ objectFit: "contain" }} />;
}
