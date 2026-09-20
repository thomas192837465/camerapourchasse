import { collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";

const COL = "subscribers";

/**
 * Enregistre une inscription newsletter (liste d'opt-in marketing à part de la fiche client d'une
 * commande, alimentée uniquement par une action explicite du visiteur). Document indexé par
 * l'e-mail lui-même : une réinscription met juste à jour la date au lieu de créer un doublon, et
 * ça évite d'avoir besoin d'un droit de LECTURE public juste pour vérifier un doublon (la règle
 * Firestore de cette collection n'autorise que l'écriture, pas la lecture, aux visiteurs).
 * `source` identifie l'emplacement du formulaire (ex : "footer", "blog") pour savoir ce qui convertit.
 */
export async function addSubscriber(email, source = "footer") {
  if (!firebaseEnabled) {
    throw new Error("Firebase n'est pas configuré.");
  }
  const clean = (email || "").trim().toLowerCase();
  if (!clean || !clean.includes("@") || clean.includes("/")) {
    throw new Error("Adresse e-mail invalide.");
  }

  await setDoc(doc(db, COL, clean), { email: clean, source, createdAt: serverTimestamp() }, { merge: true });
}

/** Retire un inscrit de la liste — réservé à l'admin (voir firestore.rules). */
export async function deleteSubscriber(email) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  await deleteDoc(doc(db, COL, email.trim().toLowerCase()));
}

/** Liste complète des inscrits, plus récents d'abord — réservé à l'admin. */
export async function getAllSubscribers() {
  if (!firebaseEnabled) return [];
  const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => {
    const data = d.data();
    return { id: d.id, ...data, createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null };
  });
}
