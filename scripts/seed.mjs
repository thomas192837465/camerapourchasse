// Peuple Firestore avec les catégories, produits et réglages de démonstration.
// Prérequis : .env.local rempli (voir .env.local.example) ET un compte admin déjà créé
// (via /admin/login puis un document admins/{uid} créé manuellement dans la console Firebase).
//
// Utilisation :
//   ADMIN_EMAIL=vous@exemple.com ADMIN_PASSWORD=votre-mot-de-passe npm run seed

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { defaultCategories, defaultProducts, defaultTheme, defaultContent, defaultSeo, defaultGeneral } from "../lib/defaults.js";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Variables NEXT_PUBLIC_FIREBASE_* manquantes (voir .env.local.example).");
  process.exit(1);
}

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.error(
    "Définissez ADMIN_EMAIL et ADMIN_PASSWORD (le compte admin créé via /admin/login) : \n" +
      "  ADMIN_EMAIL=vous@exemple.com ADMIN_PASSWORD=... npm run seed"
  );
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function main() {
  await signInWithEmailAndPassword(auth, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
  console.log("Connecté en tant qu'admin.");

  for (const category of defaultCategories) {
    const { id, ...data } = category;
    await setDoc(doc(db, "categories", id), data);
  }
  console.log(`${defaultCategories.length} catégories importées.`);

  for (const product of defaultProducts) {
    const { id, ...data } = product;
    await setDoc(doc(db, "products", id), { ...data, createdAt: new Date(), updatedAt: new Date() });
  }
  console.log(`${defaultProducts.length} produits importés.`);

  await setDoc(doc(collection(db, "settings"), "theme"), defaultTheme, { merge: true });
  await setDoc(doc(collection(db, "settings"), "content"), defaultContent, { merge: true });
  await setDoc(doc(collection(db, "settings"), "seo"), defaultSeo, { merge: true });
  await setDoc(doc(collection(db, "settings"), "general"), defaultGeneral, { merge: true });
  console.log("Réglages par défaut enregistrés.");

  console.log("Terminé !");
  process.exit(0);
}

main().catch((err) => {
  console.error("Échec du seed :", err.message);
  process.exit(1);
});
