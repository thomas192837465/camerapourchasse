import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";

const COL = "media";

/** Bibliothèque des photos déjà envoyées sur Cloudinary, réutilisables entre produits sans ré-upload. */
export async function getMediaLibrary() {
  if (!firebaseEnabled) return [];
  const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "desc"), limit(60)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addMediaItem({ url, cloudinaryId, alt = "" }) {
  if (!firebaseEnabled) return;
  await addDoc(collection(db, COL), { url, cloudinaryId, alt, createdAt: serverTimestamp() });
}

export async function removeMediaItem(id) {
  if (!firebaseEnabled) return;
  await deleteDoc(doc(db, COL, id));
}
