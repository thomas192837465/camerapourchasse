"use client";

import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, firebaseEnabled } from "./firebase";

export function useAuth() {
  const [state, setState] = useState({ loading: true, user: null, isAdmin: false });

  useEffect(() => {
    if (!firebaseEnabled) {
      setState({ loading: false, user: null, isAdmin: false });
      return;
    }
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ loading: false, user: null, isAdmin: false });
        return;
      }
      let isAdmin = false;
      try {
        const snap = await getDoc(doc(db, "admins", user.uid));
        isAdmin = snap.exists();
      } catch {
        isAdmin = false;
      }
      setState({ loading: false, user, isAdmin });
    });
    return unsub;
  }, []);

  return state;
}

export async function login(email, password) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré (voir .env.local.example).");
  return signInWithEmailAndPassword(auth, email, password);
}

/** Création d'un compte client (espace "Mon compte" — distinct des comptes admin). */
export async function signup(email, password, name) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré (voir .env.local.example).");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(cred.user, { displayName: name });
  }
  return cred;
}

export async function logout() {
  if (!firebaseEnabled) return;
  return signOut(auth);
}
