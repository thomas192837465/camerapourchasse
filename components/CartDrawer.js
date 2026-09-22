"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCart } from "@/lib/cart-context";
import { useCheckout } from "@/lib/useCheckout";
import { getPublishedProducts } from "@/lib/products";
import { PAYMENT_ICONS } from "@/lib/icons-fa";
import { CartIcon, CheckIcon } from "./Icons";
import FaIcon from "./FaIcon";
import QtyStepper from "./QtyStepper";

export default function CartDrawer({ content }) {
  const { items, total, count, drawerOpen, closeDrawer, updateQty, removeItem, addItem, hasMixedSources } = useCart();
  const { goToCheckout, redirecting, error } = useCheckout();
  const [suggestions, setSuggestions] = useState([]);
  const [bundles, setBundles] = useState({});
  const [selectedBundleVariants, setSelectedBundleVariants] = useState({});

  const bannerText = content?.cartBannerText || "";
  const freeShippingThreshold = Number(content?.freeShippingThreshold) || 0;
  const remainingForFreeShipping = freeShippingThreshold > 0 ? Math.max(0, freeShippingThreshold - total) : 0;
  const freeShippingProgress = freeShippingThreshold > 0 ? Math.min(100, (total / freeShippingThreshold) * 100) : 0;

  useEffect(() => {
    if (!drawerOpen) return;
    getPublishedProducts({ isBestSeller: true }).then((products) => {
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
    const image = product.images?.find((img) => img.url)?.url || "";
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image,
      variant: product.variants?.[0]?.name || "",
      source: product.source,
      shopifyVariantId: product.shopifyVariantId,
    });
  }

  return (
    <>
      <div className={`cart-drawer-overlay ${drawerOpen ? "open" : ""}`} onClick={closeDrawer} aria-hidden="true" />
      <aside className={`cart-drawer ${drawerOpen ? "open" : ""}`} inert={!drawerOpen}>
        <div className="cart-drawer-header">
          <h2>Mon panier</h2>
          <button type="button" className="icon-btn" onClick={closeDrawer} aria-label="Fermer">
            ×
          </button>
        </div>

        {bannerText ? <p className="cart-drawer-banner">{bannerText}</p> : null}

        {items.length > 0 && freeShippingThreshold > 0 ? (
          <div className="cart-free-shipping">
            <p>
              {remainingForFreeShipping > 0 ? (
                <>
                  Seulement <strong>€{remainingForFreeShipping.toFixed(2).replace(".", ",")}</strong> de plus et la
                  livraison est <strong>gratuite</strong>.
                </>
              ) : (
                <>🎉 Livraison gratuite débloquée !</>
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
            {suggestions.length ? (
              <div className="cart-drawer-upsell">
                <p>Vous pourriez aussi aimer</p>
                <div className="cart-drawer-upsell-row">
                  {suggestions.map((p) => {
                    const image = p.images?.find((img) => img.url)?.url;
                    return (
                      <button type="button" key={p.id} className="cart-drawer-upsell-item" onClick={() => handleQuickAdd(p)}>
                        <span className="cart-drawer-upsell-thumb">
                          {image ? <Image src={image} alt={p.name} fill sizes="64px" style={{ objectFit: "contain" }} /> : null}
                          <span className="cart-drawer-upsell-plus">+</span>
                        </span>
                        <span className="cart-drawer-upsell-name">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

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
                    <span className="price">€{(item.qty * item.price).toFixed(2).replace(".", ",")}</span>
                    <button type="button" className="remove-btn" onClick={() => removeItem(item.key)}>
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>

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
                                {v.label} — €{v.price.toFixed(2).replace(".", ",")}
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

            <div className="cart-drawer-footer">
              <div className="summary-row">
                <span>Sous-total ({count} article{count > 1 ? "s" : ""})</span>
                <span>€{total.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="summary-row" style={{ marginBottom: 14 }}>
                <span>Livraison</span>
                <span>{freeShippingThreshold > 0 && remainingForFreeShipping > 0 ? "Calculée à l'étape suivante" : "Gratuite"}</span>
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
                className="btn btn-primary btn-block"
                onClick={goToCheckout}
                disabled={redirecting || hasMixedSources}
                style={{ opacity: hasMixedSources ? 0.5 : 1 }}
              >
                {redirecting ? "Redirection…" : "Finaliser ma commande"}
              </button>
              <div className="cart-payment-icons">
                {Object.entries(PAYMENT_ICONS).map(([key, icon]) => (
                  <FontAwesomeIcon key={key} icon={icon} />
                ))}
              </div>
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
