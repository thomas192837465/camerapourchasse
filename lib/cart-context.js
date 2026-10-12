"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firebaseEnabled } from "./firebase";
import { getVisitorId, logCartAdd } from "./cartActivity";

const CartContext = createContext(null);

// Packs de quantité : le prix unitaire d'une ligne suit sa quantité (remise du meilleur palier
// atteint), y compris quand la quantité est changée depuis le panier — le total affiché reste
// ainsi aligné sur la remise automatique appliquée par Shopify au paiement.
function withQtyTiers(item) {
  if (!item.tiers?.length || typeof item.fullPrice !== "number") return item;
  const tier = [...item.tiers]
    .filter((t) => Number(t.qty) <= item.qty)
    .sort((a, b) => Number(b.qty) - Number(a.qty))[0];
  const pct = Number(tier?.discountPct) || 0;
  const price = Math.round(item.fullPrice * (1 - pct / 100) * 100) / 100;
  const packLabel = pct > 0 ? `Pack de ${item.qty} (-${pct} %)` : "";
  const variant = [item.baseVariant, packLabel].filter(Boolean).join(" · ");
  return { ...item, price, variant };
}
const STORAGE_KEY = "ccp_cart_items";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Écoute directe (sans passer par useAuth, qui vérifie aussi le statut admin) : le panier n'a
  // besoin que de l'identité pour le flux d'activité admin, pas d'une lecture Firestore en plus
  // sur chaque page du site.
  useEffect(() => {
    if (!firebaseEnabled) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const api = useMemo(() => {
    function addItem({ productId, name, price, image, variant, source, shopifyVariantId, fullPrice, tiers }, qty = 1) {
      setItems((prev) => {
        const key = `${productId}__${variant || ""}`;
        const existing = prev.find((it) => it.key === key);
        if (existing) {
          return prev.map((it) =>
            it.key === key
              ? withQtyTiers({
                  ...it,
                  qty: it.qty + qty,
                  tiers: tiers?.length ? tiers : it.tiers,
                  fullPrice: typeof fullPrice === "number" ? fullPrice : it.fullPrice,
                })
              : it
          );
        }
        return [
          ...prev,
          withQtyTiers({
            key,
            productId,
            name,
            price,
            image,
            variant,
            baseVariant: variant,
            source,
            shopifyVariantId,
            qty,
            fullPrice,
            tiers,
          }),
        ];
      });
      setDrawerOpen(true);
      logCartAdd({ visitorId: getVisitorId(), user, name, price, qty, variant });
    }

    function updateQty(key, qty) {
      setItems((prev) =>
        qty <= 0
          ? prev.filter((it) => it.key !== key)
          : prev.map((it) => (it.key === key ? withQtyTiers({ ...it, qty }) : it))
      );
    }

    function removeItem(key) {
      setItems((prev) => prev.filter((it) => it.key !== key));
    }

    function clear() {
      setItems([]);
    }

    function openDrawer() {
      setDrawerOpen(true);
    }

    function closeDrawer() {
      setDrawerOpen(false);
    }

    function toggleDrawer() {
      setDrawerOpen((v) => !v);
    }

    return { addItem, updateQty, removeItem, clear, openDrawer, closeDrawer, toggleDrawer };
  }, [user]);

  const count = items.reduce((sum, it) => sum + it.qty, 0);
  const total = items.reduce((sum, it) => sum + it.qty * it.price, 0);
  const isShopifyCart = items.length > 0 && items.every((it) => it.source === "shopify" && it.shopifyVariantId);
  const hasMixedSources = items.some((it) => it.source === "shopify") && !isShopifyCart;

  return (
    <CartContext.Provider value={{ items, count, total, isShopifyCart, hasMixedSources, drawerOpen, user, ...api }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un <CartProvider>");
  return ctx;
}
