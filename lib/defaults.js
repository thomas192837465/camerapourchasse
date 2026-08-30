// Valeurs par défaut utilisées tant que Firebase n'est pas configuré,
// ou tant qu'aucun réglage n'a encore été enregistré côté admin.
// Reprennent exactement les valeurs du design d'origine (css/style.css).

export const defaultTheme = {
  green900: "#16301f",
  green800: "#1d3b2c",
  green700: "#244a34",
  green600: "#2c5b3d",
  green500: "#326b45",
  green100: "#e7efe6",
  green50: "#f2f6f0",
  gold: "#f0a93a",
  ink: "#202822",
  inkSoft: "#55605a",
  inkFaint: "#8a938c",
  bg: "#f4f2ec",
  card: "#ffffff",
  border: "#e6e2d8",
};

export const defaultContent = {
  logoLine1: "CAMÉRA",
  logoLine2: "CHASSE PRO",
  heroTitle: "Explorez la Nature Sauvage. La Technologie au Service de l'Observation.",
  heroSubtitle: "Caméras de chasse HD, discrètes et performantes pour capturer l'invisible.",
  heroButtonText: "Découvrir nos Produits",
  footerDescription: "Caméras de chasse HD, discrètes et performantes pour capturer l'invisible.",
};

export const defaultSeo = {
  siteTitle: "Caméra Chasse Pro",
  titleTemplate: "%s — Caméra Chasse Pro",
  defaultMetaDescription:
    "Caméras de chasse HD, discrètes et performantes pour capturer l'invisible. Vision nocturne, 4G, haute résolution.",
  ogImage: "",
};

export const defaultGeneral = {
  productImageWidth: 1200,
  productImageHeight: 1200,
};

export const defaultShopify = {
  shopDomain: "",
  accessToken: "",
  connected: false,
};

export const defaultCategories = [
  { id: "cameras-4g", name: "Caméras 4G", slug: "cameras-4g", icon: "camera", order: 1 },
  { id: "vision-nocturne", name: "Vision Nocturne", slug: "vision-nocturne", icon: "moon", order: 2 },
  { id: "haute-resolution", name: "Haute Résolution", slug: "haute-resolution", icon: "image", order: 3 },
  { id: "accessoires", name: "Accessoires", slug: "accessoires", icon: "card", order: 4 },
];

// Produits de démonstration affichés tant qu'aucune donnée n'existe encore dans Firestore
// (Firebase non configuré, ou base vide avant le premier import). Voir scripts/seed.js
// pour peupler ces mêmes produits dans Firestore une fois le projet connecté.
const placeholderImage = { url: "", cloudinaryId: "", alt: "Caméra de chasse posée sur un tronc en forêt" };

function demoProduct(overrides) {
  return {
    shortDescription: "",
    compareAtPrice: null,
    sku: "",
    stock: 25,
    features: ["Vidéo 4K UHD", "Détection 25 m", "Vision Nocturne No-Glow", "Étanche IP66", "Carte SIM incluse"],
    specs: [
      { label: "Résolution vidéo", value: "4K UHD (3840 × 2160)" },
      { label: "Portée de détection", value: "25 m" },
      { label: "Vision nocturne", value: "Infrarouge No-Glow, 940 nm" },
      { label: "Connectivité", value: "4G LTE + Wi-Fi" },
      { label: "Étanchéité", value: "IP66" },
      { label: "Stockage", value: "Carte micro SD jusqu'à 256 Go" },
    ],
    variants: [
      { name: "Camouflage", colorHex: "#4f5b3f" },
      { name: "Gris Ardoise", colorHex: "#7b8288" },
      { name: "Noir Mat", colorHex: "#2a2c2a" },
    ],
    images: [placeholderImage, placeholderImage, placeholderImage],
    isBestSeller: false,
    rating: { average: 4.7, count: 120 },
    status: "published",
    seo: { metaTitle: "", metaDescription: "" },
    description:
      "Capture des images ultra-nettes et des vidéos 4K UHD, même en pleine nuit grâce à sa technologie infrarouge No-Glow invisible pour le gibier. Boîtier étanche pour une utilisation toute l'année en forêt.",
    ...overrides,
  };
}

export const defaultProducts = [
  demoProduct({
    id: "camera-4g-promark-30mp",
    slug: "camera-4g-promark-30mp",
    name: "Caméra 4G ProMark 30MP",
    price: 189.99,
    categoryId: "cameras-4g",
    isBestSeller: true,
    rating: { average: 4.8, count: 120 },
  }),
  demoProduct({
    id: "camera-chasse-promark-30mp",
    slug: "camera-chasse-promark-30mp",
    name: "Caméra de Chasse ProMark 30MP",
    price: 189.99,
    categoryId: "vision-nocturne",
    isBestSeller: true,
    rating: { average: 4.7, count: 140 },
  }),
  demoProduct({
    id: "camera-4g-promark-50mp-hd",
    slug: "camera-4g-promark-50mp-hd",
    name: "Caméra 4G ProMark 50MP HD",
    price: 219.99,
    categoryId: "haute-resolution",
    isBestSeller: true,
    rating: { average: 4.9, count: 120 },
  }),
  demoProduct({
    id: "camera-chasse-4g-promark-30mp-hd",
    slug: "camera-chasse-4g-promark-30mp-hd",
    name: "Caméra de Chasse 4G ProMark 30MP HD",
    price: 199.99,
    categoryId: "cameras-4g",
    isBestSeller: true,
    rating: { average: 4.8, count: 129 },
  }),
];
