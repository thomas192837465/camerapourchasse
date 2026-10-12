"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useCheckout } from "@/lib/useCheckout";
import { getPublishedProducts } from "@/lib/products";
import { CartIcon, CheckIcon } from "./Icons";
import FaIcon from "./FaIcon";
import QtyStepper from "./QtyStepper";
import PaymentIcons from "./PaymentIcons";
import { formatPrice } from "@/lib/format";
import { getStoredDiscountCode } from "@/lib/discountCode";

export default function CartDrawer({ content }) {
  const { items, total, count, drawerOpen, closeDrawer, updateQty, removeItem, addItem, hasMixedSources } = useCart();
  const { goToCheckout, redirecting, error } = useCheckout();
  const [suggestions, setSuggestions] = useState([]);
  const [bundles, setBundles] = useState({});
  const [selectedBundleVariants, setSelectedBundleVariants] = useState({});

  const bannerText = content?.cartBannerText || "";
  const globalTiers = (content?.qtyTiers || []).map((t) => ({ qty: Number(t.qty), discountPct: Number(t.discountPct) || 0 }));
  const [discountCode, setDiscountCode] = useState("");
  useEffect(() => {
    if (drawerOpen) setDiscountCode(getStoredDiscountCode());
  }, [drawerOpen]);
  const freeShippingThreshold = Number(content?.freeShippingThreshold) || 0;
  const remainingForFreeShipping = freeShippingThreshold > 0 ? Math.max(0, freeShippingThreshold - total) : 0;
  const freeShippingProgress = freeShippingThreshold > 0 ? Math.min(100, (total / freeShippingThreshold) * 100) : 0;

  useEffect(() => {
    if (!drawerOpen) return;
    getPublishedProducts({ isBestSeller: true, excludePromo: true }).then((products) => {
      const cartIds = new Set(items.map((it) => it.productId));
      setSuggestions(products.filter((p) => !cartIds.has(p.id)).slice(0, 6));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  // Suggère la carte SD (ou autre produit "pack") d'une caméra ajoutée au panier sans passer par le
  // sélecteur de la fiche produit (ex : "Ajouter au panier" depuis une page catégorie) — voir
  // ProductPackSelector pour l'équivalent sur la fiche produit elle-même.
  useEffect(() => {
    const idsToFetch = [...new Set(items.map((it) => it.productId))].filter((id) => !(id in bundles));
    if (!idsToFetch.length) return;
    idsToFetch.forEach((id) => {
      fetch(`/api/cart/sd-suggestion?productId=${encodeURIComponent(id)}`)
        .then((res) => res.json())
        .then((data) => setBundles((prev) => ({ ...prev, [id]: data.bundle || null })))
        .catch(() => setBundles((prev) => ({ ...prev, [id]: null })));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const sdSuggestions = [];
  {
    const seen = new Set();
    for (const item of items) {
      const bundle = bundles[item.productId];
      if (!bundle?.variants?.length) continue;
      if (items.some((it) => it.productId === bundle.productId)) continue;
      if (seen.has(bundle.productId)) continue;
      seen.add(bundle.productId);
      sdSuggestions.push({ forItem: item, bundle });
    }
  }

  function handleAddBundle(bundle) {
    const variantId = selectedBundleVariants[bundle.productId] || bundle.defaultVariantId;
    const variant = bundle.variants.find((v) => v.id === variantId) || bundle.variants[0];
    if (!variant) return;
    addItem({
      productId: bundle.productId,
      name: `${bundle.name} — ${variant.label}`,
      price: variant.price,
      image: bundle.image || "",
      variant: "",
      source: "shopify",
      shopifyVariantId: variant.id,
    });
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") closeDrawer();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeDrawer]);

  function handleQuickAdd(product) {
    const image = product.images?.find((img) => img.url && img.type !== "video")?.url || "";
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image,
      variant: product.variants?.[0]?.name || "",
      source: product.source,
      shopifyVariantId: product.shopifyVariantId,
      fullPrice: product.price,
      tiers: !product.hideQtyTiers && globalTiers.length > 1 ? globalTiers : undefined,
    });
  }

  // Remises affichées : packs de quantité (déjà dans les prix des lignes) + code promo mémorisé
  // (déduit par Shopify au paiement, affiché ici à titre indicatif).
  const fullSubtotal = items.reduce(
    (sum, it) => sum + it.qty * (typeof it.fullPrice === "number" && it.fullPrice > it.price ? it.fullPrice : it.price),
    0
  );
  const packSavings = Math.max(0, Math.round((fullSubtotal - total) * 100) / 100);
  const promoValue = discountCode ? Number(content?.promoCodeValue) || 0 : 0;
  const estimatedTotal = Math.max(0, total - promoValue);

  // Upsell "palier suivant" : 1 caméra dans le panier → proposer d'en prendre 2 avec la remise.
  const tierUpsell = (() => {
    for (const it of items) {
      if (!it.tiers?.length || typeof it.fullPrice !== "number") continue;
      const sorted = [...it.tiers].sort((a, b) => a.qty - b.qty);
      const current = sorted.filter((t) => t.qty <= it.qty).pop();
      const next = sorted.find((t) => t.qty > it.qty && (Number(t.discountPct) || 0) > (Number(current?.discountPct) || 0));
      if (!next) continue;
      const unit = Math.round(it.fullPrice * (1 - next.discountPct / 100) * 100) / 100;
      return { item: it, next, unit, add: next.qty - it.qty };
    }
    return null;
  })();

  return (
    <>
      <div className={`cart-drawer-overlay ${drawerOpen ? "open" : ""}`} onClick={closeDrawer} aria-hidden="true" />
      <aside className={`cart-drawer ${drawerOpen ? "open" : ""}`} inert={!drawerOpen}>
        <div className="cart-drawer-header">
          <h2>
            Mon panier{count > 0 ? <span className="cart-drawer-count">{count}</span> : null}
          </h2>
          <button type="button" className="icon-btn" onClick={closeDrawer} aria-label="Fermer">
            ×
          </button>
        </div>

        {bannerText ? <p className="cart-drawer-banner">{bannerText}</p> : null}

        {items.length > 0 && freeShippingThreshold > 0 ? (
          <div className="cart-free-shipping">
            <p>
              <FaIcon name="truck" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Plus que <strong>{formatPrice(remainingForFreeShipping)}</strong> pour profiter de la{" "}
                  <strong>livraison gratuite</strong>
                </span>
              ) : (
                <span>
                  <strong>Livraison gratuite</strong> débloquée
                </span>
              )}
            </p>
            <div className="cart-free-shipping-bar">
              <div className="cart-free-shipping-bar-fill" style={{ width: `${freeShippingProgress}%` }} />
            </div>
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="cart-drawer-empty">
            <CartIcon style={{ width: 40, height: 40, color: "var(--ink-faint)" }} />
            <p>Votre panier est vide.</p>
            <button type="button" className="btn btn-primary" onClick={closeDrawer}>
              Continuer mes achats
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer-body">
            <div className="cart-drawer-items">
              {items.map((item) => (
                <div className="cart-drawer-item" key={item.key}>
                  <div className="cart-drawer-item-thumb">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="64px" style={{ objectFit: "contain" }} />
                    ) : null}
                  </div>
                  <div className="cart-drawer-item-info">
                    <h3>{item.name}</h3>
                    {item.variant ? <p className="form-hint">{item.variant}</p> : null}
                    <QtyStepper value={item.qty} onChange={(v) => updateQty(item.key, v)} />
                  </div>
                  <div className="cart-drawer-item-side">
                    <span className="price">{formatPrice((item.qty * item.price))}</span>
                    <button type="button" className="remove-btn" onClick={() => removeItem(item.key)}>
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {tierUpsell ? (
              <div className="cart-tier-upsell">
                <div>
                  <strong>
                    Ajoutez {tierUpsell.add} caméra{tierUpsell.add > 1 ? "s" : ""}, -{tierUpsell.next.discountPct} % sur
                    chacune
                  </strong>
                  <small>
                    {tierUpsell.next.qty} × {formatPrice(tierUpsell.unit)} au lieu de {formatPrice(tierUpsell.item.fullPrice)}
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-dark btn-sm"
                  onClick={() => updateQty(tierUpsell.item.key, tierUpsell.next.qty)}
                >
                  Passer à {tierUpsell.next.qty}
                </button>
              </div>
            ) : null}

            {sdSuggestions.length ? (
              <div className="cart-drawer-sd-suggestions">
                {sdSuggestions.map(({ forItem, bundle }) => {
                  const selectedId = selectedBundleVariants[bundle.productId] || bundle.defaultVariantId;
                  return (
                    <div className="cart-drawer-sd-suggestion" key={bundle.productId}>
                      <div className="cart-drawer-sd-suggestion-thumb">
                        {bundle.image ? (
                          <Image src={bundle.image} alt={bundle.name} fill sizes="44px" style={{ objectFit: "contain" }} />
                        ) : null}
                      </div>
                      <div className="cart-drawer-sd-suggestion-info">
                        <p>Ajouter une carte SD pour votre {forItem.name} ?</p>
                        {bundle.variants.length > 1 ? (
                          <select
                            value={selectedId || ""}
                            onChange={(e) =>
                              setSelectedBundleVariants((prev) => ({ ...prev, [bundle.productId]: e.target.value }))
                            }
                          >
                            {bundle.variants.map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.label} — {formatPrice(v.price)}
                              </option>
                            ))}
                          </select>
                        ) : null}
                      </div>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => handleAddBundle(bundle)}>
                        Ajouter
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {suggestions.length ? (
              <div className="cart-drawer-upsell">
                <p>Complétez votre équipement</p>
                <div className="cart-upsell-row">
                  {suggestions.map((p) => {
                    const image = p.images?.find((img) => img.url && img.type !== "video")?.url;
                    return (
                      <div key={p.id} className="cart-upsell-card">
                        <span className="cart-upsell-thumb">
                          {image ? <Image src={image} alt={p.name} fill sizes="72px" style={{ objectFit: "contain" }} /> : null}
                        </span>
                        <span className="cart-upsell-name">{p.name}</span>
                        <span className="cart-upsell-price">{formatPrice(p.price)}</span>
                        <button type="button" className="cart-upsell-add" onClick={() => handleQuickAdd(p)}>
                          + Ajouter
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            </div>

            <div className="cart-drawer-footer">
              <div className="summary-row">
                <span>Sous-total ({count} article{count > 1 ? "s" : ""})</span>
                <span>{formatPrice(fullSubtotal)}</span>
              </div>
              {packSavings > 0 ? (
                <div className="summary-row summary-discount">
                  <span>Remise pack</span>
                  <span>-{formatPrice(packSavings)}</span>
                </div>
              ) : null}
              {discountCode ? (
                <div className="summary-row summary-discount">
                  <span>
                    Code <strong>{discountCode}</strong>
                  </span>
                  <span>{promoValue ? `-${formatPrice(promoValue)}` : "au paiement"}</span>
                </div>
              ) : null}
              <div className="summary-row">
                <span>Livraison</span>
                <span>
                  {freeShippingThreshold > 0
                    ? remainingForFreeShipping > 0
                      ? "Calculée au paiement"
                      : "Gratuite"
                    : "Calculée au paiement"}
                </span>
              </div>
              <div className="summary-row summary-total">
                <span>Total{discountCode && promoValue ? " estimé" : ""}</span>
                <span>{formatPrice(estimatedTotal)}</span>
              </div>
              {hasMixedSources ? (
                <div className="banner warning" style={{ marginBottom: 12 }}>
                  Ton panier mélange des produits qui ne peuvent pas être commandés ensemble pour l'instant. Retire
                  l'un des deux groupes de produits pour continuer.
                </div>
              ) : null}
              {error ? <div className="banner error" style={{ marginBottom: 12 }}>{error}</div> : null}

              <button
                type="button"
                className="btn btn-accent btn-lg btn-block"
                onClick={goToCheckout}
                disabled={redirecting || hasMixedSources}
                style={{ opacity: hasMixedSources ? 0.5 : 1 }}
              >
                {redirecting ? "Redirection…" : "Finaliser ma commande"}
              </button>
              <PaymentIcons methods={content?.paymentMethods} />
              <div className="cart-drawer-trust-row">
                <span>
                  <FaIcon name="lock" /> Paiement sécurisé
                </span>
                <span>
                  <FaIcon name="truck" /> Livraison rapide
                </span>
                <span>
                  <CheckIcon style={{ width: 13, height: 13 }} /> Satisfaction client
                </span>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
