import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";

const COL = "orders";

export const ORDER_STATUSES = [
  { value: "nouvelle", label: "Nouvelle" },
  { value: "en_preparation", label: "En préparation" },
  { value: "expediee", label: "Expédiée" },
  { value: "livree", label: "Livrée" },
  { value: "annulee", label: "Annulée" },
];

export async function createOrder({ customer, items, total }) {
  if (!firebaseEnabled) {
    throw new Error(
      "La prise de commande nécessite Firebase (voir .env.local.example). Configurez votre projet Firebase pour activer le passage de commande."
    );
  }
  const docRef = await addDoc(collection(db, COL), {
    customer,
    items,
    total,
    status: "nouvelle",
    shipping: { carrier: "", trackingNumber: "", trackingUrl: "" },
    shopifyOrderId: null,
    source: "site",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getOrderById(id) {
  if (!firebaseEnabled) return null;
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getAllOrders() {
  if (!firebaseEnabled) return [];
  const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateOrder(id, data) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  return setDoc(doc(db, COL, id), data, { merge: true });
}
