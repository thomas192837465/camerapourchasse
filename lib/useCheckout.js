"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-context";
import { trackBeginCheckout, decorateCheckoutUrl } from "./gtag";
import { trackClarityEvent } from "./clarity";

/** Redirige directement vers le paiement adapté : Shopify si panier 100% Shopify, sinon le formulaire du site. */
export function useCheckout() {
  const router = useRouter();
  const { items, total, isShopifyCart, hasMixedSources } = useCart();
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");

  async function goToCheckout() {
    if (hasMixedSources) return;
    setError("");

    trackBeginCheckout({ items, value: total });
    trackClarityEvent("finaliser_ma_commande");

    if (!isShopifyCart) {
      router.push("/commande");
      return;
    }

    setRedirecting(true);
    try {
      const res = await fetch("/api/shopify/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: items.map((it) => ({ variantId: it.shopifyVariantId, quantity: it.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de la création du paiement.");
      // Transporte l'identifiant de clic publicitaire vers le domaine Shopify,
      // sans quoi la vente n'est jamais rattachée à la campagne.
      window.location.href = await decorateCheckoutUrl(data.checkoutUrl);
    } catch (err) {
      setError(err.message || "Une erreur est survenue, veuillez réessayer.");
      setRedirecting(false);
    }
  }

  return { goToCheckout, redirecting, error };
}
