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
  const plain = {
    id,
    category: "",
    blocks: [],
    relatedProductSlugs: [],
    relatedPostIds: [],
    seo: { metaTitle: "", metaDescription: "", featuredImage: { url: "", alt: "" } },
  };
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

/** Temps de lecture estimé à partir du texte des blocs (≈200 mots/minute), 1 minute minimum. */
export function estimateReadingTime(blocks) {
  const text = (blocks || [])
    .map((b) => {
      if (b.type === "heading" || b.type === "subheading" || b.type === "paragraph") return b.text || "";
      if (b.type === "faq") return (b.items || []).map((i) => `${i.question} ${i.answer}`).join(" ");
      if (b.type === "table") {
        return [b.title, b.intro, ...(b.rows || []).map((r) => `${r.label} ${r.value}`)].join(" ");
      }
      return "";
    })
    .join(" ")
    .replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Articles liés : même catégorie que l'article courant en priorité, puis les plus récents. */
export function getRelatedPosts(allPosts, currentPost, max = 3) {
  const others = allPosts.filter((p) => p.id !== currentPost.id);
  const sameCategory = currentPost.category ? others.filter((p) => p.category === currentPost.category) : [];
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, max);
}

/**
 * Articles liés choisis à la main dans l'admin (voir RelatedPostsField), dans l'ordre choisi.
 * Retourne null si rien n'a été sélectionné, pour que l'appelant retombe sur getRelatedPosts().
 */
export function getManualRelatedPosts(allPosts, ids) {
  if (!ids || !ids.length) return null;
  const byId = new Map(allPosts.map((p) => [p.id, p]));
  const found = ids.map((id) => byId.get(id)).filter(Boolean);
  return found.length ? found : null;
}

/** Catégories réellement utilisées parmi les articles publiés, avec leur nombre d'articles. */
export function getCategoryCounts(posts) {
  const counts = {};
  for (const p of posts) {
    const cat = (p.category || "").trim();
    if (!cat) continue;
    counts[cat] = (counts[cat] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
