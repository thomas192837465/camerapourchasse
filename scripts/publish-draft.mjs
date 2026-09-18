// Publie un article de blog (brouillon) dans Firestore à partir d'un fichier JSON.
//
// Ce script ne fait AUCUNE génération de contenu : il prend un JSON déjà rédigé (voir
// drafts/_exemple.json pour le format attendu, qui correspond exactement au schéma utilisé par
// l'admin /admin/blog) et l'enregistre comme article de blog, toujours en statut "draft"
// (brouillon) — jamais publié automatiquement, même si le JSON dit le contraire.
//
// Pourquoi un script séparé plutôt que taper directement dans l'admin ? Pour permettre à Claude
// (ici ou dans Claude Code, en local) de préparer le brouillon à partir du calendrier éditorial
// (content/blog-briefs.json) et de l'envoyer dans Firestore d'un coup, prêt à être relu dans
// /admin/blog avant publication.
//
// Prérequis : .env.local rempli (voir .env.local.example) ET le compte admin déjà créé.
//
// Utilisation :
//   ADMIN_EMAIL=vous@exemple.com ADMIN_PASSWORD=votre-mot-de-passe npm run publish-draft -- drafts/A1.json

import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, addDoc, collection, serverTimestamp, getDocs } from "firebase/firestore";

const BLOCK_TYPES = new Set(["heading", "subheading", "paragraph", "image", "table", "faq"]);

function fail(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

const filePath = process.argv[2];
if (!filePath) {
  fail(
    "Indiquez le fichier JSON de l'article à publier.\n" +
      "   Exemple : npm run publish-draft -- drafts/A1.json"
  );
}

let raw;
try {
  raw = readFileSync(filePath, "utf-8");
} catch {
  fail(`Fichier introuvable : ${filePath}`);
}

let post;
try {
  post = JSON.parse(raw);
} catch (e) {
  fail(`JSON invalide dans ${filePath} : ${e.message}`);
}

// --- Validation minimale du schéma (voir components/admin/BlogPostForm.js) ---
const errors = [];
if (!post.title) errors.push("champ « title » manquant");
if (!post.slug) errors.push("champ « slug » manquant");
if (!Array.isArray(post.blocks) || post.blocks.length === 0) errors.push("champ « blocks » manquant ou vide");
(post.blocks || []).forEach((b, i) => {
  if (!BLOCK_TYPES.has(b.type)) errors.push(`bloc #${i + 1} : type inconnu « ${b.type} »`);
});
if (errors.length) fail(`Schéma invalide dans ${filePath} :\n   - ${errors.join("\n   - ")}`);

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  fail("Variables NEXT_PUBLIC_FIREBASE_* manquantes (voir .env.local.example).");
}
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  fail(
    "Définissez ADMIN_EMAIL et ADMIN_PASSWORD (le compte admin créé via /admin/login) :\n" +
      "   ADMIN_EMAIL=vous@exemple.com ADMIN_PASSWORD=... npm run publish-draft -- drafts/A1.json"
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Si la catégorie indiquée dans le JSON n'existe pas encore dans /admin/blog/categories, on la
// crée automatiquement (au lieu de la laisser vide) : l'article a directement sa catégorie sans
// aller cliquer dans l'admin, et la catégorie apparaît ensuite dans le menu déroulant comme les
// autres.
async function ensureCategory(db, name) {
  if (!name) return;
  const snap = await getDocs(collection(db, "blogCategories"));
  const exists = snap.docs.some((d) => (d.data().name || "").trim().toLowerCase() === name.trim().toLowerCase());
  if (exists) return;
  await addDoc(collection(db, "blogCategories"), { name: name.trim() });
  console.log(`   (catégorie « ${name.trim()} » créée dans /admin/blog/categories)`);
}

async function main() {
  await signInWithEmailAndPassword(auth, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
  console.log("Connecté en tant qu'admin.");

  if (post.category) {
    await ensureCategory(db, post.category);
  }

  // Sécurité : quoi qu'il y ait dans le JSON, on force toujours le statut "draft".
  // La publication reste un geste volontaire, fait à la main dans /admin/blog.
  const data = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    category: post.category || "",
    author: post.author || "",
    publishedAt: post.publishedAt || new Date().toISOString().slice(0, 10),
    status: "draft",
    coverImage: post.coverImage || { url: "", alt: "" },
    blocks: post.blocks,
    relatedProductSlugs: Array.isArray(post.relatedProductSlugs) ? post.relatedProductSlugs : [],
    relatedPostIds: Array.isArray(post.relatedPostIds) ? post.relatedPostIds : [],
    seo: {
      metaTitle: post.seo?.metaTitle || post.title,
      metaDescription: post.seo?.metaDescription || post.excerpt || "",
      featuredImage: post.seo?.featuredImage || { url: "", alt: "" },
    },
  };

  const ref = await addDoc(collection(db, "posts"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  console.log(`\n✅ Brouillon créé : "${data.title}"`);
  console.log(`   Catégorie : ${data.category || "(aucune)"}`);
  console.log(`   Article ID Firestore : ${ref.id}`);
  console.log(`   À relire et publier ici : /admin/blog/${ref.id}\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Échec de la publication :", err.message, "\n");
  process.exit(1);
});
