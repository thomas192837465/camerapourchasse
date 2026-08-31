"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-context";

/** Redirige directement vers le paiement adapté : Shopify si panier 100% Shopify, sinon le formulaire du site. */
export function useCheckout() {
  const router = useRouter();
  const { items, isShopifyCart, hasMixedSources } = useCart();
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");

  async function goToCheckout() {
    if (hasMixedSources) return;
    setError("");

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
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err.message || "Une erreur est survenue, veuillez réessayer.");
      setRedirecting(false);
    }
  }

  return { goToCheckout, redirecting, error };
}
