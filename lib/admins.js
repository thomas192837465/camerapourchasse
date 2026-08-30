import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db, firebaseConfig, firebaseEnabled } from "./firebase";

export async function getAdmins() {
  if (!firebaseEnabled) return [];
  const snap = await getDocs(collection(db, "admins"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

/**
 * Crée un nouveau compte Firebase Auth (e-mail + mot de passe) et lui donne les droits admin.
 * Utilise une instance Firebase secondaire et isolée pour que la création du compte ne déconnecte
 * pas l'admin actuellement connecté (limite connue du SDK client : créer un compte y connecte
 * automatiquement l'app qui a fait l'appel).
 */
export async function inviteAdmin(email, password) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  const secondaryApp = initializeApp(firebaseConfig, `invite-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    await setDoc(doc(db, "admins", cred.user.uid), { email });
    return cred.user.uid;
  } finally {
    await signOut(secondaryAuth).catch(() => {});
    await deleteApp(secondaryApp).catch(() => {});
  }
}

export async function removeAdmin(uid) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  return deleteDoc(doc(db, "admins", uid));
}
