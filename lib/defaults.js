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
  heroTitle: "Caméra de chasse connectée : ne manquez plus aucun mouvement",
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
  eeatTitle: "Pourquoi acheter sa caméra de chasse chez WildTrail",
  eeatSubtitle:
    "Ce qui nous distingue : une sélection rigoureuse par Julien, 8 ans d'expérience sur le terrain, un vrai service après-vente, et des avis clients affichés sans filtre.",
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

  // Contenu SEO ajouté sous le bloc produits de l'accueil (définition, guide de choix par
  // terrain, législation, FAQ) — modifiable dans Admin → Réglages → Contenu.
  homeBlocks: [
    { id: "home-1", type: "heading", text: "Qu'est-ce qu'une caméra de chasse ?" },
    {
      id: "home-2",
      type: "paragraph",
      text: "Une caméra de chasse est un boîtier autonome équipé d'un détecteur de mouvement infrarouge passif (PIR) : dès qu'un animal traverse son champ de détection, elle déclenche automatiquement une photo ou une vidéo, de jour comme de nuit. Contrairement à un appareil photo classique, elle reste en veille en permanence sur le terrain, sans surveillance, pendant plusieurs semaines à plusieurs mois selon son autonomie.\n\nLes modèles WildTrail se déclenchent en 0,2 seconde et détectent un mouvement jusqu'à 25 mètres. Les images sont soit enregistrées sur une carte mémoire à récupérer sur place, soit envoyées directement sur votre téléphone via Wifi, Bluetooth ou 4G selon le modèle. Utilisée par les chasseurs pour repérer le passage du gibier, elle sert aussi à surveiller un territoire isolé ou simplement à observer la faune sans la déranger.",
    },
    { id: "home-3", type: "heading", text: "Quelle caméra de chasse choisir selon votre terrain ?" },
    {
      id: "home-4",
      type: "paragraph",
      text: "Le bon choix dépend avant tout de votre terrain : capte-t-il le réseau mobile ? Le poste est-il visité souvent, ou laissé plusieurs mois sans passage ? Voici comment orienter votre choix selon votre situation.",
    },
    { id: "home-5", type: "subheading", text: "Terrain couvert par le réseau mobile : la 4G" },
    {
      id: "home-6",
      type: "paragraph",
      text: "Si votre terrain capte le réseau mobile, une caméra 4G comme la [WildTrail C40](/produits/cameras-de-chasse-connectees/wildtrail-c40-camera-chasse-4g) ou la [WildTrail H40](/produits/camera-de-chasse-solaire/wildtrail-h40-camera-chasse-4g) envoie vos photos directement sur votre téléphone, où que vous soyez. Vous suivez le passage du gibier en temps réel, sans jamais vous déplacer pour relever une carte SD — idéal pour un terrain isolé ou visité rarement.",
    },
    { id: "home-7", type: "subheading", text: "Terrain sans réseau : le Wifi et le Bluetooth" },
    {
      id: "home-8",
      type: "paragraph",
      text: "Sans couverture mobile, misez sur une caméra Wifi/Bluetooth comme la [WildTrail C20](/produits/cameras-de-chasse-connectees/wildtrail-c20-camera-chasse-wifi-bluetooth) : vous récupérez vos photos sur votre smartphone à quelques mètres de la caméra, sans y toucher et sans abonnement — une solution économique, parfaite pour un terrain proche que vous visitez régulièrement.",
    },
    { id: "home-9", type: "subheading", text: "Poste laissé plusieurs mois : le solaire" },
    {
      id: "home-10",
      type: "paragraph",
      text: "Pour un poste que vous ne visitez qu'occasionnellement, une caméra solaire comme la [WildTrail H20](/produits/camera-de-chasse-solaire/wildtrail-h20-camera-chasse-4g) ou la [WildTrail H80](/produits/camera-de-chasse-solaire/wildtrail-h80-camera-chasse-solaire-4g) offre une autonomie quasi illimitée dès qu'il y a un minimum de luminosité — jusqu'à 6 mois en veille, sans changer les piles.",
    },
    { id: "home-11", type: "heading", text: "La législation sur les caméras de chasse" },
    {
      id: "home-12",
      type: "paragraph",
      text: "L'installation d'une caméra de chasse n'est pas totalement libre, même sur un terrain privé. Sur votre propre propriété, vous pouvez en installer une sans autorisation particulière, à condition qu'elle ne filme que votre parcelle. Si son champ de vision couvre un chemin ou un passage emprunté par des tiers, le RGPD s'applique dès qu'une personne peut être identifiée sur les images : il faut alors informer les passants et ne conserver les enregistrements que le temps nécessaire.\n\nFilmer la voie publique ou la propriété d'un voisin sans son accord est interdit. Selon les départements et le type de terrain (ACCA, réserve, domaine public), une déclaration en préfecture peut aussi être exigée — renseignez-vous auprès de la vôtre avant de poser votre caméra. Pour aller plus loin, consultez les ressources de la [CNIL](https://www.cnil.fr) sur la vidéosurveillance.",
    },
    {
      id: "home-13",
      type: "faq",
      items: [
        {
          question: "Quelles sont les meilleures caméras de chasse ?",
          answer:
            "Il n'existe pas de modèle universellement meilleur : le bon choix dépend de votre terrain, de votre budget et de la connectivité recherchée. Pour un terrain isolé, une caméra 4G solaire comme la WildTrail H80 est la plus confortable. Pour débuter sans se ruiner, une Wifi/Bluetooth comme la C20 suffit largement.",
        },
        {
          question: "Quelle est la législation concernant les caméras de chasse ?",
          answer:
            "Sur votre propre terrain, l'installation est libre tant que la caméra ne filme que votre parcelle. Dès qu'un passage ou une personne peut être filmé, le RGPD impose d'informer les tiers. Filmer la voie publique est interdit, et une déclaration en préfecture peut être requise selon votre situation.",
        },
        {
          question: "Quelle est la meilleure caméra pour filmer la chasse ?",
          answer:
            "Privilégiez un modèle à déclenchement rapide (moins de 0,5 seconde) et à bonne résolution vidéo, comme la WildTrail H80 ou la C40 (vidéo 2K). Une bonne vision nocturne infrarouge reste indispensable, la majorité du gibier se déplaçant à l'aube ou au crépuscule.",
        },
        {
          question: "Quelle carte SIM pour caméra de chasse ?",
          answer:
            "Les caméras 4G WildTrail fonctionnent avec une carte SIM standard ou M2M, prépayée ou avec un petit forfait data, insérée directement dans l'appareil. Aucun abonnement n'est imposé : vous choisissez librement votre opérateur et votre forfait.",
        },
        {
          question: "Comment fonctionne une caméra de chasse ?",
          answer:
            "Un détecteur infrarouge passif repère la chaleur et le mouvement d'un animal, puis déclenche automatiquement une photo ou une vidéo. Le fichier est enregistré sur une carte SD, envoyé par Wifi/Bluetooth à votre téléphone à proximité, ou transmis directement par 4G où que vous soyez.",
        },
      ],
    },
  ],

  // Contenu SEO de /produits, affiché sous la grille de produits, de part et d'autre du tableau
  // comparatif (voir components/ProductComparisonTable.js). Modifiable dans Admin → Contenu.
  produitsIntroBlocks: [
    { id: "prod-1", type: "heading", text: "Nos caméras de chasse par usage" },
    {
      id: "prod-2",
      type: "paragraph",
      text: "**Affût et suivi du gibier.** Pour repérer les passages avant l'ouverture ou suivre un animal sur son territoire, une caméra à déclenchement rapide et bonne autonomie s'impose — les [caméras connectées](/produits/cameras-de-chasse-connectees) vous alertent dès qu'un animal passe, sans avoir à vous déplacer.\n\n**Surveillance de territoire hors saison.** Pour surveiller une parcelle, un chalet ou un accès isolé toute l'année, misez sur l'autonomie : les [caméras solaires](/produits/camera-de-chasse-solaire) tiennent plusieurs mois sans intervention.\n\n**Observation de la faune.** Pour observer le gibier sans le déranger, une caméra discrète à vision nocturne no-glow (LED invisible) capture des images nettes sans effrayer l'animal — c'est le cas de l'ensemble de la gamme WildTrail.",
    },
    { id: "prod-3", type: "heading", text: "Comment choisir dans notre catalogue" },
    {
      id: "prod-4",
      type: "paragraph",
      text: "Cinq critères décident vraiment du bon choix, dans l'ordre où ils comptent.\n\n**1. La connectivité.** 4G pour un terrain isolé, Wifi/Bluetooth pour un terrain proche visité régulièrement, ou carte SD seule pour le budget le plus serré.\n\n**2. La source d'énergie.** Le solaire offre une autonomie quasi illimitée dès qu'il y a de la lumière ; la batterie classique reste suffisante pour un poste visité tous les mois.\n\n**3. Le type de vision nocturne.** Le no-glow (infrarouge invisible) est indispensable pour du gibier farouche ; une vision couleur basse lumière peut convenir pour de la simple surveillance.\n\n**4. La résolution du capteur.** Au-delà de 20 Mpx, le gain réel est minime — méfiez-vous des mégapixels obtenus par interpolation logicielle plutôt que par le capteur lui-même.\n\n**5. L'indice d'étanchéité.** Visez au minimum IP65 pour une utilisation toute l'année en forêt, quelles que soient les conditions.",
    },
  ],
  produitsPricingBlocks: [
    { id: "prod-5", type: "heading", text: "Nos prix : ce que vous payez vraiment" },
    {
      id: "prod-6",
      type: "paragraph",
      text: "Nos caméras se situent entre 79,69 € et 89,99 €, sans abonnement obligatoire sur aucun modèle. C'est plus cher que les premiers prix qu'on trouve en ligne (souvent entre 12 € et 37 €), et c'est un choix assumé : chaque WildTrail est testée sur le terrain avant sa mise en vente, couverte par une **garantie 2 ans avec remplacement à neuf**, et accompagnée d'un **SAV basé en France**, joignable et réactif. Sur du matériel laissé des semaines en forêt, sous la pluie et le gel, c'est cette fiabilité qui fait la différence — pas seulement le prix affiché au premier coup d'œil.",
    },
    {
      id: "prod-7",
      type: "faq",
      items: [
        {
          question: "Quel budget prévoir pour une caméra de chasse ?",
          answer:
            "Comptez entre 79 € et 90 € pour un modèle WildTrail, sans frais d'abonnement obligatoire. C'est un investissement unique : la carte SIM (si vous choisissez un modèle 4G) reste le seul coût récurrent, et vous restez libre de votre opérateur.",
        },
        {
          question: "Quelle différence entre les modèles H et C ?",
          answer:
            "Les modèles H (H20, H40, H80) sont conçus autour de l'autonomie solaire, pour un poste laissé longtemps sans visite. Les modèles C (C20, C40) misent sur la connectivité — Wifi/Bluetooth ou 4G avec vue en direct — pour un terrain visité plus régulièrement.",
        },
        {
          question: "Y a-t-il des frais cachés ?",
          answer:
            "Non. Le prix affiché est le prix final : livraison gratuite en France métropolitaine, garantie 2 ans incluse, aucun abonnement imposé. Seule une carte SIM (pour les modèles 4G) reste à votre charge, à un tarif que vous choisissez librement.",
        },
      ],
    },
  ],

  // Page /blog : bandeau d'en-tête. Modifiable dans Admin → Réglages → Contenu.
  blogPageTitle: "Tout savoir sur les caméras de chasse",
  blogPageSubtitle: "Guides, conseils et tests pour choisir la caméra de chasse idéale et optimiser vos sorties.",

  // Encart "à propos" affiché dans la barre latérale de chaque article, à la place d'une fausse
  // fiche auteur — renvoie vers /notre-histoire. Modifiable dans Admin → Réglages → Contenu.
  blogAboutTitle: "Envie d'en savoir plus ?",
  blogAboutText:
    "Découvrez qui se cache derrière la sélection de nos caméras de chasse et notre engagement envers les chasseurs.",

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
