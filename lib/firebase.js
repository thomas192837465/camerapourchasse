import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Pas de Firebase Storage : depuis février 2026, Storage nécessite le plan payant Blaze.
// Les photos produits sont hébergées sur Cloudinary (gratuit, voir lib/cloudinary.js).

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export { firebaseConfig };
export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = firebaseEnabled ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
