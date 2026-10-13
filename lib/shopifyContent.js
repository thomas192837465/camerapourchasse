import { doc, getDoc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";
import { computeRating } from "./reviews";

const COL = "shopifyProductContent";

export const emptyShopifyContent = {
  categoryId: "",
  // Catégories secondaires (slugs) : le produit apparaît aussi dans ces catégories, sans changer
  // son adresse ni son fil d'Ariane (ex : la H80 en "4G" et en "solaire").
  extraCategoryIds: [],
  customSlug: "",
  // Anciens slugs de la fiche (remplis automatiquement quand le slug change dans l'admin) :
  // /produits/{ancien-slug} redirige définitivement vers l'adresse actuelle.
  formerSlugs: [],
  images: [],
  // Phrase d'accroche sous le nom du produit (bénéfice principal, 1 ligne).
  headline: "",
  features: [],
  specs: [],
  // Chiffres clés affichés en grand sous l'achat ({ value: "0,2 s", label: "Déclenchement" }).
  // Vide : les 4 premières caractéristiques techniques sont utilisées.
  keyStats: [],
  // Contenu du colis (une ligne par élément).
  inBox: [],
  faq: [],
  reviews: [],
  blocks: [],
  isBestSeller: false,
  // Produit "en promotion" : reste visible sur /produits même quand un filtre catégorie/prix
  // actif l'exclurait normalement, et passe toujours en tête de la grille — voir
  // lib/products.js getPublishedProducts. Ne dispense pas de choisir une catégorie : c'est elle
  // qui détermine le fil d'Ariane de la fiche produit.
  isPromo: false,
  seo: { metaTitle: "", metaDescription: "", featuredImage: { url: "", alt: "" } },
  // Pack croisé avec un AUTRE produit Shopify (ex : ce boîtier caméra + une carte SD vendue comme
  // produit séparé, potentiellement livrée par un fournisseur différent) : à la sélection du pack,
  // les DEUX produits sont ajoutés au panier comme deux lignes distinctes, pour que Shopify /
  // DSers puisse scinder et suivre chaque expédition séparément. Voir ProductInteractive.
  pack: {
    enabled: false,
    bundledProductId: "",
    bundledVariantId: "",
    soloTitle: "",
    soloSubtitle: "",
    // Photo affichée à côté de "1× {nom de la caméra}" dans les deux options — remplace l'icône
    // générique par défaut. Idem pour bundledImage, affichée à côté du produit ajouté (carte SD).
    cameraImage: { url: "", alt: "" },
    bundledImage: { url: "", alt: "" },
    packTitle: "",
    packSubtitle: "",
    packBadge: "",
    displayMode: "addon",
    addonTitle: "",
    addonSubtitle: "",
  },
  // Désactive les packs de quantité (1/2/3) sur cette fiche — ex : un accessoire.
  hideQtyTiers: false,
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

/** Retrouve le docId d'un produit Shopify à partir du slug (URL) personnalisé choisi dans l'admin. */
export async function getShopifyContentByCustomSlug(slug) {
  if (!firebaseEnabled || !slug) return null;
  const snap = await getDocs(query(collection(db, COL), where("customSlug", "==", slug)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { docId: d.id, content: { ...emptyShopifyContent, ...d.data() } };
}

/** Retrouve un produit par un de ses anciens slugs (voir formerSlugs). */
export async function getShopifyContentByFormerSlug(slug) {
  if (!firebaseEnabled || !slug) return null;
  const snap = await getDocs(query(collection(db, COL), where("formerSlugs", "array-contains", slug)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { docId: d.id, content: { ...emptyShopifyContent, ...d.data() } };
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

  // Un produit peut avoir plusieurs variantes à des prix différents (ex : "Caméra seule" / "Pack
  // avec carte SD"). Par défaut (prix affiché en dehors de la fiche, ajout rapide au panier...) on
  // retient la moins chère disponible ; la fiche produit elle-même propose les autres via
  // ProductPackSelector, chacune avec son propre prix réellement facturé au paiement.
  const variantNodes = shopifyProduct.variants?.nodes || [];
  const chosenVariant =
    variantNodes.filter((v) => v.availableForSale).sort((a, b) => Number(a.price.amount) - Number(b.price.amount))[0] ||
    variantNodes.sort((a, b) => Number(a.price.amount) - Number(b.price.amount))[0] ||
    null;

  const price = chosenVariant ? Number(chosenVariant.price.amount) : Number(shopifyProduct.priceRange.minVariantPrice.amount);
  const compareAt = Number(chosenVariant?.compareAtPrice?.amount) || 0;

  const variants = variantNodes.map((v) => ({
    id: v.id,
    title: v.title,
    price: Number(v.price.amount),
    compareAtPrice: Number(v.compareAtPrice?.amount) || 0,
    availableForSale: v.availableForSale,
  }));

  return {
    id: shopifyGidToDocId(shopifyProduct.id),
    source: "shopify",
    shopifyVariantId: chosenVariant?.id || null,
    slug: c.customSlug || shopifyProduct.handle,
    name: shopifyProduct.title,
    shortDescription: "",
    description: shopifyProduct.description || "",
    price,
    compareAtPrice: compareAt > price ? compareAt : null,
    sku: "",
    stock: chosenVariant ? (chosenVariant.availableForSale ? 999 : 0) : shopifyProduct.availableForSale ? 999 : 0,
    categoryId: c.categoryId,
    extraCategoryIds: (c.extraCategoryIds || []).filter((id) => id && id !== c.categoryId),
    status: "published",
    isBestSeller: c.isBestSeller,
    isPromo: c.isPromo,
    images,
    headline: c.headline,
    features: c.features,
    specs: c.specs,
    keyStats: c.keyStats,
    inBox: c.inBox,
    variants,
    pack: { ...emptyShopifyContent.pack, ...c.pack },
    hideQtyTiers: Boolean(c.hideQtyTiers),
    faq: c.faq,
    reviews: c.reviews,
    blocks: c.blocks,
    rating: computeRating(c.reviews),
    seo: c.seo,
    supplierLink: "",
    updatedAt: null,
  };
}
