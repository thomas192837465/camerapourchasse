import { collection, doc, deleteDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";

const COL = "cartRecoveries";

// Ne concerne QUE le checkout "site" (/commande) : un panier Shopify part directement sur le
// checkout hébergé Shopify, qui a son propre système natif de relance de panier abandonné
// (à activer côté admin Shopify) — pas besoin de dupliquer cette logique ici pour ces commandes-là.

/**
 * Enregistre/actualise le brouillon de panier d'un visiteur dès qu'il a saisi un e-mail valide sur
 * la page de commande — avant même qu'il valide. Appel "fire-and-forget" : une erreur ici ne doit
 * jamais gêner le passage de commande. Indexé par visitorId (voir lib/cartActivity.js), pour que
 * les mises à jour successives du même panier écrasent le même document au lieu d'en créer un par
 * frappe.
 */
export function saveCartRecovery(visitorId, { email, items, total }) {
  if (!firebaseEnabled || !visitorId || !email || !items?.length) return;
  try {
    setDoc(
      doc(db, COL, visitorId),
      {
        email: email.trim().toLowerCase(),
        items: items.map((it) => ({ name: it.name, qty: it.qty, price: it.price })),
        total,
        recovered: false,
        reminderSentAt: null,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ).catch(() => {});
  } catch {
    // ignore
  }
}

/** Marque le panier comme récupéré (commande passée) — n'envoie plus de relance dessus. */
export function markCartRecovered(visitorId) {
  if (!firebaseEnabled || !visitorId) return;
  try {
    setDoc(doc(db, COL, visitorId), { recovered: true }, { merge: true }).catch(() => {});
  } catch {
    // ignore
  }
}

/**
 * Paniers à relancer : pas récupérés, sans relance déjà envoyée, inactifs depuis au moins
 * `olderThanMs`. Réservé à l'appelant authentifié admin (voir firestore.rules) — utilisé par la
 * tâche planifiée d'envoi des relances (voir app/api/cron/abandoned-carts).
 */
export async function getAbandonedCarts(olderThanMs) {
  if (!firebaseEnabled) return [];
  const snap = await getDocs(query(collection(db, COL), where("recovered", "==", false)));
  const cutoff = Date.now() - olderThanMs;
  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : null,
      };
    })
    .filter((c) => !c.reminderSentAt && c.updatedAt && c.updatedAt.getTime() <= cutoff);
}

export async function markReminderSent(visitorId) {
  await setDoc(doc(db, COL, visitorId), { reminderSentAt: serverTimestamp() }, { merge: true });
}

export async function deleteCartRecovery(visitorId) {
  await deleteDoc(doc(db, COL, visitorId));
}
