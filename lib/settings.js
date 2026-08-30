import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";
import {
  defaultTheme,
  defaultContent,
  defaultSeo,
  defaultGeneral,
  defaultShopify,
  defaultFilters,
  defaultNavigation,
  defaultLegal,
} from "./defaults";

const DEFAULTS_BY_KEY = {
  theme: defaultTheme,
  content: defaultContent,
  seo: defaultSeo,
  general: defaultGeneral,
  shopify: defaultShopify,
  filters: defaultFilters,
  navigation: defaultNavigation,
  legal: defaultLegal,
};

export async function getSettings(key) {
  const fallback = DEFAULTS_BY_KEY[key] || {};
  if (!firebaseEnabled) return fallback;
  try {
    const snap = await getDoc(doc(db, "settings", key));
    if (!snap.exists()) return fallback;
    return { ...fallback, ...snap.data() };
  } catch {
    return fallback;
  }
}

export async function saveSettings(key, values) {
  if (!firebaseEnabled) {
    throw new Error("Firebase n'est pas configuré (voir .env.local.example).");
  }
  await setDoc(doc(db, "settings", key), values, { merge: true });
}
