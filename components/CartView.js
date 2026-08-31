"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useCheckout } from "@/lib/useCheckout";
import QtyStepper from "./QtyStepper";
import { CartIcon } from "./Icons";

export default function CartView() {
  const { items, total, updateQty, removeItem, isShopifyCart, hasMixedSources } = useCart();
  const { goToCheckout, redirecting, error } = useCheckout();

  if (!items.length) {
    return (
      <main className="container">
        <div className="empty-state">
          <CartIcon style={{ width: 48, height: 48, color: "var(--ink-faint)", marginBottom: 16 }} />
          <h2>Votre panier est vide</h2>
          <p style={{ marginBottom: 24 }}>Parcourez notre catalogue pour trouver votre prochaine caméra.</p>
          <Link href="/produits" className="btn btn-primary">
            Découvrir nos Produits
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 className="page-title">Votre Panier</h1>
      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <div className="cart-line" key={item.key}>
              <div className="cart-line-thumb">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="80px" style={{ objectFit: "contain" }} />
                ) : null}
              </div>
              <div>
                <h3>{item.name}</h3>
                {item.variant ? <div className="variant">Variante : {item.variant}</div> : null}
                <button className="remove-btn" onClick={() => removeItem(item.key)}>
                  Retirer
                </button>
              </div>
              <QtyStepper value={item.qty} onChange={(v) => updateQty(item.key, v)} />
              <div className="price">€{(item.qty * item.price).toFixed(2).replace(".", ",")}</div>
            </div>
          ))}
        </div>

        <div className="summary-card">
          <h2>Résumé</h2>
          <div className="summary-row">
            <span>Sous-total</span>
            <span>€{total.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="summary-row">
            <span>Livraison</span>
            <span>Gratuite</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>€{total.toFixed(2).replace(".", ",")}</span>
          </div>

          {hasMixedSources ? (
            <div className="banner warning" style={{ marginTop: 14 }}>
              Ton panier mélange des produits qui ne peuvent pas être commandés ensemble pour l'instant. Retire l'un
              des deux groupes de produits pour continuer.
            </div>
          ) : null}
          {error ? <div className="banner error" style={{ marginTop: 14 }}>{error}</div> : null}

          <button
            type="button"
            className="btn btn-primary btn-block"
            style={{ marginTop: 18, opacity: hasMixedSources ? 0.5 : 1 }}
            onClick={goToCheckout}
            disabled={redirecting || hasMixedSources}
          >
            {redirecting ? "Redirection…" : isShopifyCart ? "Payer en ligne" : "Passer la commande"}
          </button>
        </div>
      </div>
    </main>
  );
}
