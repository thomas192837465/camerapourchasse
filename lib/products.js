import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";
import { defaultProducts } from "./defaults";

const COL = "products";

function normalize(id, data) {
  return { id, ...data };
}

/** Récupère tous les produits publiés (pour la vitrine), avec filtres appliqués côté client. */
export async function getPublishedProducts(filters = {}) {
  let products;
  if (!firebaseEnabled) {
    products = defaultProducts;
  } else {
    try {
      const snap = await getDocs(
        query(collection(db, COL), where("status", "==", "published"))
      );
      products = snap.empty ? defaultProducts : snap.docs.map((d) => normalize(d.id, d.data()));
    } catch {
      products = defaultProducts;
    }
  }

  const { categoryId, categoryIds, search, minPrice, maxPrice, isBestSeller, tags } = filters;
  const wantedCategories = categoryIds && categoryIds.length ? categoryIds : categoryId ? [categoryId] : null;

  return products.filter((p) => {
    if (wantedCategories && !wantedCategories.includes(p.categoryId)) return false;
    if (typeof isBestSeller === "boolean" && Boolean(p.isBestSeller) !== isBestSeller) return false;
    if (typeof minPrice === "number" && p.price < minPrice) return false;
    if (typeof maxPrice === "number" && p.price > maxPrice) return false;
    if (search) {
      const needle = search.toLowerCase();
      if (!p.name.toLowerCase().includes(needle)) return false;
    }
    if (tags && tags.length) {
      const haystack = [p.name, p.description, ...(p.features || [])].join(" ").toLowerCase();
      if (!tags.every((tag) => haystack.includes(tag.toLowerCase()))) return false;
    }
    return true;
  });
}

export async function getProductBySlug(slug) {
  if (!firebaseEnabled) {
    return defaultProducts.find((p) => p.slug === slug) || null;
  }
  try {
    const snap = await getDocs(query(collection(db, COL), where("slug", "==", slug)));
    if (snap.empty) return defaultProducts.find((p) => p.slug === slug) || null;
    const d = snap.docs[0];
    return normalize(d.id, d.data());
  } catch {
    return defaultProducts.find((p) => p.slug === slug) || null;
  }
}

export async function getProductById(id) {
  if (!firebaseEnabled) return defaultProducts.find((p) => p.id === id) || null;
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? normalize(snap.id, snap.data()) : null;
}

/** Tous les produits (y compris brouillons) pour l'admin. */
export async function getAllProductsAdmin() {
  if (!firebaseEnabled) return defaultProducts;
  const snap = await getDocs(query(collection(db, COL), orderBy("updatedAt", "desc")));
  return snap.docs.map((d) => normalize(d.id, d.data()));
}

export async function getRelatedProducts(categoryId, excludeId, max = 4) {
  const all = await getPublishedProducts({ categoryId });
  return all.filter((p) => p.id !== excludeId).slice(0, max);
}

export async function createProduct(data) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  const now = serverTimestamp();
  return addDoc(collection(db, COL), { ...data, createdAt: now, updatedAt: now });
}

export async function updateProduct(id, data) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  return setDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteProduct(product) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  // Les photos restent sur Cloudinary (suppression à faire manuellement si besoin, voir README).
  return deleteDoc(doc(db, COL, product.id));
}

export function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
