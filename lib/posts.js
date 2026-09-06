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

const COL = "posts";

function toPlain(value) {
  if (value && typeof value.toDate === "function") return value.toDate().toISOString();
  return value;
}

function normalize(id, data) {
  const plain = { id, blocks: [], seo: { metaTitle: "", metaDescription: "", featuredImage: { url: "", alt: "" } } };
  for (const [key, value] of Object.entries(data)) {
    plain[key] = toPlain(value);
  }
  return plain;
}

/**
 * Articles publiés, triés du plus récent au plus ancien. Le tri se fait côté client (pas de
 * orderBy() Firestore combiné au where()) pour éviter d'exiger un index composite — le blog
 * ne contiendra jamais assez d'articles pour que ça pèse sur les performances.
 */
export async function getPublishedPosts() {
  if (!firebaseEnabled) return [];
  try {
    const snap = await getDocs(query(collection(db, COL), where("status", "==", "published")));
    const posts = snap.docs.map((d) => normalize(d.id, d.data()));
    return posts.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
  } catch {
    return [];
  }
}

export async function getRecentPosts(max = 3) {
  const posts = await getPublishedPosts();
  return posts.slice(0, max);
}

export async function getPostBySlug(slug) {
  if (!firebaseEnabled) return null;
  try {
    const snap = await getDocs(
      query(collection(db, COL), where("slug", "==", slug), where("status", "==", "published"))
    );
    if (!snap.empty) {
      const d = snap.docs[0];
      return normalize(d.id, d.data());
    }
  } catch {
    // ignore
  }
  return null;
}

export async function getPostById(id) {
  if (!firebaseEnabled) return null;
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? normalize(snap.id, snap.data()) : null;
}

/** Tous les articles (y compris brouillons) pour l'admin. */
export async function getAllPostsAdmin() {
  if (!firebaseEnabled) return [];
  const snap = await getDocs(query(collection(db, COL), orderBy("updatedAt", "desc")));
  return snap.docs.map((d) => normalize(d.id, d.data()));
}

export async function createPost(data) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  const now = serverTimestamp();
  return addDoc(collection(db, COL), { ...data, createdAt: now, updatedAt: now });
}

export async function updatePost(id, data) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  return setDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deletePost(id) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  return deleteDoc(doc(db, COL, id));
}

export function formatPostDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}
