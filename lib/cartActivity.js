import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";

const COL = "cartActivity";
const VISITOR_KEY = "ccp_visitor_id";

/**
 * Identifiant anonyme persistant par navigateur (aucune donnée personnelle), pour relier entre eux
 * les ajouts au panier d'un même visiteur non connecté dans le flux d'activité admin.
 */
export function getVisitorId() {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

/**
 * Enregistre un ajout au panier pour le flux temps réel de l'admin. Écriture "fire-and-forget" :
 * jamais attendue ni bloquante pour l'utilisateur, une erreur ici ne doit jamais gêner l'achat.
 */
export function logCartAdd({ visitorId, user, name, price, qty, variant }) {
  if (!firebaseEnabled) return;
  try {
    addDoc(collection(db, COL), {
      visitorId,
      userId: user?.uid || null,
      userEmail: user?.email || null,
      name,
      price,
      qty,
      variant: variant || "",
      createdAt: serverTimestamp(),
    }).catch(() => {});
  } catch {
    // ignore — le suivi ne doit jamais faire échouer l'ajout au panier
  }
}

/** Flux temps réel des derniers ajouts au panier, tous visiteurs confondus (réservé à l'admin). */
export function subscribeToCartActivity(callback, max = 50) {
  if (!firebaseEnabled) return () => {};
  const q = query(collection(db, COL), orderBy("createdAt", "desc"), limit(max));
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
        };
      })
    );
  });
}
