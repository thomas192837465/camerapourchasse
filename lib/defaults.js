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
  // Image de logo (facultative) : si vide, un pictogramme caméra générique est utilisé à la place.
  logoImage: { url: "", alt: "" },
  logoLine1: "CAMÉRA",
  logoLine2: "CHASSE PRO",
  heroTitle: "Ne manquez plus aucun mouvement.",
  heroSubtitle:
    "Des caméras de chasse HD, discrètes et connectées pour surveiller la faune ou sécuriser votre territoire en temps réel.",
  heroButtonText: "Voir les modèles 4G",
  heroImage: { url: "", alt: "" },
  heroImageCaption: "Capturez l'instant !",
  heroPatternColor: "#2c5b3d",
  footerDescription: "Caméras de chasse HD, discrètes et performantes pour capturer l'invisible.",

  featuresTitle: "La Promesse Technique",
  features: [
    { icon: "eye", title: "Invisibilité Totale", description: "LEDs No-Glow indétectables par le gibier." },
    { icon: "bolt", title: "Déclenchement Ultra-Rapide", description: "Capteurs réagissant en 0,2 seconde." },
    { icon: "wifi", title: "Connectivité 4G Intégrée", description: "Transmission instantanée sur votre téléphone." },
    { icon: "battery", title: "Autonomie Longue Durée", description: "Gestion intelligente jusqu'à 6 mois." },
  ],

  // Section E-E-A-T (Expérience, Expertise, Autorité, Confiance) : signaux de confiance
  // attendus par Google sur une page marchande. Les points marqués [entre crochets] contiennent
  // des faits à vérifier/compléter avec de vraies informations avant publication.
  eeatTitle: "Notre Expertise, Votre Confiance",
  eeatSubtitle:
    "Ce qui nous distingue : une sélection rigoureuse, un vrai service après-vente, et des avis clients affichés sans filtre.",
  eeatPoints: [
    {
      icon: "eye",
      title: "Testé sur le terrain",
      description:
        "[Décrivez ici votre process de test réel — ex : nombre de jours en forêt, conditions testées] avant chaque mise en vente.",
    },
    {
      icon: "bolt",
      title: "Expertise technique",
      description: "[X] ans à travailler sur l'équipement de chasse et de surveillance extérieure.",
    },
    {
      icon: "star",
      title: "Avis vérifiés, sans filtre",
      description: "Chaque avis affiché sur nos fiches produit est réel, avec le nom du client — jamais inventé.",
    },
    {
      icon: "location",
      title: "SAV basé en France",
      description: "Une question, un souci ? Une équipe joignable et réactive.",
    },
  ],

  // Titre SEO de la grille de catégories (plus descriptif que "Grille de Catégories" pour le
  // référencement) — modifiable dans Admin → Réglages → Contenu.
  categoriesSectionTitle: "Trouvez la Caméra de Chasse Adaptée à Votre Besoin",
  bestSellersTitle: "Nos Meilleurs Équipements",

  trustBadges: [
    { icon: "truck", title: "Livraison Gratuite", description: "Offerte dès aujourd'hui, 24/48h en France." },
    { icon: "shield", title: "Garantie 2 ans", description: "Remplacement à neuf." },
    { icon: "location", title: "SAV Basé en France", description: "Assistance technique réactive." },
    { icon: "card", title: "Paiement Sécurisé", description: "Cartes bancaires, virement." },
  ],

  newsletterTitle: "Recevez nos conseils de placement et offres exclusives.",

  // Colonnes de liens du pied de page (hors "Légal", générée automatiquement à partir de
  // /mentions-legales et /cgv). Modifiable dans Admin → Réglages → Contenu.
  footerColumns: [
    {
      id: "produits",
      title: "Produits",
      links: [
        { id: "fl-1", label: "Caméras 4G", href: "/produits/cameras-4g" },
        { id: "fl-2", label: "Vision Nocturne", href: "/produits/vision-nocturne" },
        { id: "fl-3", label: "Accessoires", href: "/produits/accessoires" },
      ],
    },
    {
      id: "guide",
      title: "Guide & Support",
      links: [
        { id: "fl-4", label: "Comment choisir sa caméra", href: "#" },
        { id: "fl-5", label: "Livraison", href: "/livraison" },
        { id: "fl-6", label: "Garantie", href: "#" },
        { id: "fl-7", label: "Contact", href: "#" },
      ],
    },
    {
      id: "apropos",
      title: "À propos",
      links: [
        { id: "fl-8", label: "Notre histoire", href: "/notre-histoire" },
        { id: "fl-9", label: "Blog", href: "/blog" },
      ],
    },
  ],

  // Contenu des pages "Livraison" et "Notre histoire" (liées depuis le pied de page), au format
  // blocs — modifiable dans Admin → Réglages → Contenu. Les [textes entre crochets] sont des
  // exemples à remplacer par de vraies informations avant publication.
  livraisonBlocks: [
  { id: "livr-1", type: "heading", text: "Délais et zones de livraison" },
  {
    id: "livr-2",
    type: "paragraph",
    text: "Toutes nos caméras de chasse sont expédiées depuis notre entrepôt en France. En France métropolitaine, la livraison est **gratuite** et votre colis arrive généralement sous **24 à 48h ouvrées** après validation de votre commande.",
  },
  { id: "livr-3", type: "heading", text: "Suivi de votre commande" },
  {
    id: "livr-4",
    type: "paragraph",
    text: "Dès l'expédition de votre colis, vous recevez un e-mail de confirmation avec un numéro de suivi Colissimo. Vous pouvez suivre l'acheminement de votre commande en temps réel jusqu'à votre porte.",
  },
  { id: "livr-5", type: "heading", text: "Livraison hors France métropolitaine" },
  {
    id: "livr-6",
    type: "paragraph",
    text: "Nous livrons également en Belgique et en Suisse, sous 3 à 5 jours ouvrés (frais calculés automatiquement au moment du paiement). Les DOM-TOM ne sont pas encore couverts : contactez-nous pour étudier votre demande.",
  },
  {
    id: "livr-7",
    type: "faq",
    items: [
      {
        question: "Que faire si mon colis est endommagé à la réception ?",
        answer:
          "Contactez notre service client sous 48h avec des photos du colis et du produit : nous nous occupons du remplacement sous garantie.",
      },
      {
        question: "Puis-je modifier l'adresse de livraison après ma commande ?",
        answer: "Contactez-nous rapidement après votre achat : c'est possible tant que le colis n'a pas encore été expédié.",
      },
      {
        question: "Le paiement à la livraison est-il possible ?",
        answer: "Non, seul le paiement en ligne par carte bancaire ou virement est disponible actuellement.",
      },
    ],
  },
  ],

  histoireBlocks: [
    { id: "hist-1", type: "heading", text: "Une passion née sur le terrain" },
    {
      id: "hist-2",
      type: "paragraph",
      text: "Je m'appelle Julien. J'ai grandi en Sologne, entre les battues du dimanche et les longues heures passées à observer le gibier aux côtés de mon grand-père. Des années plus tard, cette passion pour l'observation de la faune et le respect du territoire ne m'a jamais quittée.",
    },
    { id: "hist-3", type: "heading", text: "Pourquoi Caméra Chasse Pro ?" },
    {
      id: "hist-4",
      type: "paragraph",
      text: "Après 8 années passées sur le terrain à tester des dizaines de caméras de chasse — certaines fiables, beaucoup décevantes — j'ai créé Caméra Chasse Pro à partir d'une frustration simple : trouver du matériel réellement pensé pour durer en forêt, sans compromis sur la discrétion ni l'autonomie.",
    },
    { id: "hist-5", type: "heading", text: "Mon engagement" },
    {
      id: "hist-6",
      type: "paragraph",
      text: "Chaque produit vendu sur ce site, je le choisis avec la même exigence que s'il devait équiper mon propre poste d'observation. **Pas de gadget, pas de promesse marketing invérifiable** : juste du matériel testé, sélectionné, et un service après-vente à l'écoute de chaque chasseur.",
    },
  ],
};

export const defaultSeo = {
  siteTitle: "Caméra Chasse Pro",
  titleTemplate: "%s — Caméra Chasse Pro",
  defaultMetaDescription:
    "Caméras de chasse HD, discrètes et performantes pour capturer l'invisible. Vision nocturne, 4G, haute résolution.",
  ogImage: "",
  // Favicon (facultatif) : format carré recommandé (ex : 512×512). Sans image, un favicon par
  // défaut aux couleurs du site est utilisé.
  favicon: "",
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

// Informations utilisées pour générer les pages /mentions-legales et /cgv. Il s'agit d'un
// modèle standard (structure et clauses classiques du droit français) : à compléter avec vos
// vraies informations, et idéalement à faire relire par un professionnel avant mise en ligne.
export const defaultLegal = {
  companyName: "",
  legalForm: "",
  siret: "",
  rcs: "",
  address: "",
  email: "",
  phone: "",
  publicationDirector: "",
  hostName: "",
  hostAddress: "",
  returnAddress: "",
  mentionsExtra: "",
  cgvExtra: "",
};

// Liste d'options proposées dans les filtres de la page /produits (admin > Réglages > Filtres).
export const defaultFilters = {
  resolutionOptions: ["4K UHD", "30 MP", "50 MP"],
  visionOptions: ["Vision Nocturne No-Glow", "Vision couleur basse lumière"],
  rangeOptions: ["Détection 25 m", "Détection 15 m", "Détection 10 m"],
};

// Liens de la barre de navigation affichés après le menu déroulant "Produits"
// (qui liste automatiquement les catégories marquées "Afficher dans le menu").
export const defaultNavigation = {
  items: [
    { id: "accessoires", label: "Accessoires", href: "/produits/accessoires", children: [] },
    { id: "blog", label: "Blog", href: "/blog", children: [] },
    { id: "support", label: "Support", href: "#", children: [] },
  ],
};

export const defaultCategories = [
  {
    id: "cameras-4g",
    name: "Caméras 4G",
    slug: "cameras-4g",
    icon: "camera",
    order: 1,
    showInNav: true,
    seo: { metaTitle: "", metaDescription: "" },
    image: { url: "", alt: "" },
  },
  {
    id: "vision-nocturne",
    name: "Vision Nocturne",
    slug: "vision-nocturne",
    icon: "moon",
    order: 2,
    showInNav: true,
    seo: { metaTitle: "", metaDescription: "" },
    image: { url: "", alt: "" },
  },
  {
    id: "haute-resolution",
    name: "Haute Résolution",
    slug: "haute-resolution",
    icon: "image",
    order: 3,
    showInNav: true,
    seo: { metaTitle: "", metaDescription: "" },
    image: { url: "", alt: "" },
  },
  {
    id: "accessoires",
    name: "Accessoires",
    slug: "accessoires",
    icon: "card",
    order: 4,
    showInNav: false,
    seo: { metaTitle: "", metaDescription: "" },
    image: { url: "", alt: "" },
  },
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
