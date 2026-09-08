"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firebaseEnabled } from "./firebase";
import { getVisitorId, logCartAdd } from "./cartActivity";

const CartContext = createContext(null);
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
    function addItem({ productId, name, price, image, variant, source, shopifyVariantId }, qty = 1) {
      setItems((prev) => {
        const key = `${productId}__${variant || ""}`;
        const existing = prev.find((it) => it.key === key);
        if (existing) {
          return prev.map((it) => (it.key === key ? { ...it, qty: it.qty + qty } : it));
        }
        return [...prev, { key, productId, name, price, image, variant, source, shopifyVariantId, qty }];
      });
      setDrawerOpen(true);
      logCartAdd({ visitorId: getVisitorId(), user, name, price, qty, variant });
    }

    function updateQty(key, qty) {
      setItems((prev) =>
        qty <= 0 ? prev.filter((it) => it.key !== key) : prev.map((it) => (it.key === key ? { ...it, qty } : it))
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
    <CartContext.Provider value={{ items, count, total, isShopifyCart, hasMixedSources, drawerOpen, ...api }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un <CartProvider>");
  return ctx;
}
