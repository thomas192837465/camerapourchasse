import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";

const COL = "shopifyProductContent";

export const emptyShopifyContent = {
  categoryId: "",
  images: [],
  features: [],
  specs: [],
  faq: [],
  isBestSeller: false,
  rating: { average: 0, count: 0 },
  seo: { metaTitle: "", metaDescription: "", featuredImage: { url: "", alt: "" } },
};

/** Un ID Shopify (gid://shopify/Product/1234567890) devient "1234567890" pour servir d'ID Firestore. */
export function shopifyGidToDocId(gid) {
  return gid.split("/").pop();
}

export async function getShopifyProductContent(docId) {
  if (!firebaseEnabled) return emptyShopifyContent;
  const snap = await getDoc(doc(db, COL, docId));
  return snap.exists() ? { ...emptyShopifyContent, ...snap.data() } : emptyShopifyContent;
}

export async function saveShopifyProductContent(docId, data) {
  if (!firebaseEnabled) throw new Error("Firebase n'est pas configuré.");
  return setDoc(doc(db, COL, docId), data, { merge: true });
}

/** { [docId]: content } pour tous les produits déjà enrichis — utilisé par la liste admin. */
export async function getAllShopifyProductContent() {
  if (!firebaseEnabled) return {};
  const snap = await getDocs(collection(db, COL));
  const out = {};
  snap.docs.forEach((d) => {
    out[d.id] = d.data();
  });
  return out;
}

/**
 * Fusionne un produit Shopify (nom, prix, stock — source de vérité) avec son contenu du site
 * (photos, FAQ, SEO — géré dans l'admin) en un objet "produit" de la même forme que ceux issus
 * de Firestore, pour que le reste du site (fiches produit, grilles, sitemap...) n'ait rien à
 * changer. Une catégorie doit être assignée dans l'admin pour que le produit soit considéré
 * "publié" côté site (évite de montrer des produits pas encore enrichis).
 */
export function mergeShopifyProduct(shopifyProduct, content) {
  const c = { ...emptyShopifyContent, ...content };
  if (!c.categoryId) return null;

  const images = c.images.length
    ? c.images
    : (shopifyProduct.images?.nodes || []).map((img) => ({
        url: img.url,
        alt: img.altText || shopifyProduct.title,
      }));

  const compareAt = Number(shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount) || 0;

  return {
    id: shopifyGidToDocId(shopifyProduct.id),
    source: "shopify",
    slug: shopifyProduct.handle,
    name: shopifyProduct.title,
    shortDescription: "",
    description: shopifyProduct.description || "",
    price: Number(shopifyProduct.priceRange.minVariantPrice.amount),
    compareAtPrice: compareAt > 0 ? compareAt : null,
    sku: "",
    stock: shopifyProduct.availableForSale ? 999 : 0,
    categoryId: c.categoryId,
    status: "published",
    isBestSeller: c.isBestSeller,
    images,
    features: c.features,
    specs: c.specs,
    variants: [],
    faq: c.faq,
    rating: c.rating,
    seo: c.seo,
    supplierLink: "",
    updatedAt: null,
  };
}
