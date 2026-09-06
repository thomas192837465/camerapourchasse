"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useCheckout } from "@/lib/useCheckout";
import { getPublishedProducts } from "@/lib/products";
import { CartIcon, CheckIcon } from "./Icons";
import QtyStepper from "./QtyStepper";

export default function CartDrawer() {
  const { items, total, count, drawerOpen, closeDrawer, updateQty, removeItem, addItem, hasMixedSources } = useCart();
  const { goToCheckout, redirecting, error } = useCheckout();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!drawerOpen) return;
    getPublishedProducts({ isBestSeller: true }).then((products) => {
      const cartIds = new Set(items.map((it) => it.productId));
      setSuggestions(products.filter((p) => !cartIds.has(p.id)).slice(0, 6));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

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

            <div className="cart-drawer-footer">
              <div className="summary-row">
                <span>Sous-total ({count} article{count > 1 ? "s" : ""})</span>
                <span>€{total.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="summary-row" style={{ marginBottom: 14 }}>
                <span>Livraison</span>
                <span>Gratuite</span>
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
              <p className="cart-drawer-trust">
                <CheckIcon style={{ width: 14, height: 14 }} /> Satisfaction garantie
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
