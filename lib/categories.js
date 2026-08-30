import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";
import { defaultCategories } from "./defaults";

const COL = "categories";

function normalize(id, data) {
  return {
    showInNav: true,
    seo: { metaTitle: "", metaDescription: "" },
    image: { url: "", alt: "" },
    ...data,
    id,
  };
}

export async function getCategories() {
  if (!firebaseEnabled) return defaultCategories;
  try {
    const snap = await getDocs(query(collection(db, COL), orderBy("order", "asc")));
    if (snap.empty) return defaultCategories;
    return snap.docs.map((d) => normalize(d.id, d.data()));
  } catch {
    return defaultCategories;
  }
}

export async function getCategoryBySlug(slug) {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export async function createCategory(data) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  return addDoc(collection(db, COL), data);
}

export async function updateCategory(id, data) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  return setDoc(doc(db, COL, id), data, { merge: true });
}

export async function deleteCategory(id) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  return deleteDoc(doc(db, COL, id));
}

export async function getCategoryById(id) {
  if (!firebaseEnabled) return defaultCategories.find((c) => c.id === id) || null;
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? normalize(snap.id, snap.data()) : null;
}
