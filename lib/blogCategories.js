import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";

const COL = "blogCategories";

/** Catégories de blog gérées depuis l'admin, triées alphabétiquement. */
export async function getBlogCategories() {
  if (!firebaseEnabled) return [];
  try {
    const snap = await getDocs(collection(db, COL));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.name || "").localeCompare(b.name || "", "fr"));
  } catch {
    return [];
  }
}

export async function createBlogCategory(name) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  return addDoc(collection(db, COL), { name });
}

export async function updateBlogCategory(id, name) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  return setDoc(doc(db, COL, id), { name }, { merge: true });
}

export async function deleteBlogCategory(id) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  return deleteDoc(doc(db, COL, id));
}
