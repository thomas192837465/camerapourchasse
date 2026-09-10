import Link from "next/link";
import { getPublishedProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/metadata";
import { buildFaqJsonLd } from "@/lib/schema";
import ProductGrid from "@/components/ProductGrid";
import ContentBlocks from "@/components/ContentBlocks";

export const revalidate = 60;

export async function generateMetadata() {
  return pageMetadata("/produits/piege-photo", {
    title: "Piège photo 4G : caméras de suivi de la faune",
    description:
      "Pièges photo WildTrail pour l'observation de la faune : 4G, solaire, vision nocturne no-glow. Sans abonnement, garantie 2 ans, SAV France.",
  });
}

const BLOCKS = [
  { id: "pp-1", type: "heading", text: "Qu'est-ce qu'un piège photographique ?" },
  {
    id: "pp-2",
    type: "paragraph",
    text: "Un piège photographique est un dispositif de surveillance non invasif, équipé d'un détecteur de mouvement infrarouge passif : dès qu'un animal entre dans son champ de détection, il déclenche automatiquement une photo ou une vidéo, sans intervention humaine et sans déranger l'animal observé.\n\nLe terme « piège » prête souvent à confusion : l'appareil ne capture rien physiquement. C'est un outil d'observation et d'inventaire, utilisé en écologie et en gestion de la faune pour recenser les espèces présentes sur un territoire, suivre leurs déplacements ou évaluer une population, sans jamais entrer en contact avec l'animal.\n\nLes mêmes boîtiers que ceux utilisés pour la chasse — déclenchement rapide, vision nocturne infrarouge, autonomie prolongée — sont largement employés par les naturalistes, les gestionnaires forestiers et les photographes animaliers, avec un objectif différent : documenter la faune plutôt que la prélever.",
  },
  { id: "pp-3", type: "heading", text: "À quoi sert un piège photo ?" },
  { id: "pp-4", type: "paragraph", text: "Le piège photographique répond à quatre usages principaux, selon le profil de son utilisateur." },
  { id: "pp-5", type: "subheading", text: "Inventaire et suivi de population" },
  {
    id: "pp-6",
    type: "paragraph",
    text: "Recenser les espèces présentes sur un territoire, estimer une densité de population ou suivre l'évolution d'un groupe dans le temps — c'est l'usage historique du piège photo en écologie de terrain, sans capture ni manipulation de l'animal.",
  },
  { id: "pp-7", type: "subheading", text: "Surveillance d'une propriété ou d'un boisement" },
  {
    id: "pp-8",
    type: "paragraph",
    text: "Pour un propriétaire forestier ou rural, un piège photo permet de surveiller un accès, un chemin ou une parcelle isolée — détecter un passage, une intrusion ou simplement documenter la fréquentation du terrain hors saison de chasse.",
  },
  { id: "pp-9", type: "subheading", text: "Photographie animalière" },
  {
    id: "pp-10",
    type: "paragraph",
    text: "Capturer des clichés d'animaux sauvages dans leur comportement naturel, sans présence humaine dérangeante ni attente prolongée à l'affût — le piège photo devient un outil de prise de vue à distance, disponible 24h/24.",
  },
  { id: "pp-11", type: "subheading", text: "Suivi des dégâts agricoles" },
  {
    id: "pp-12",
    type: "paragraph",
    text: "Identifier l'espèce responsable de dégâts sur une culture ou un élevage avant d'agir — sanglier, cervidé ou autre — pour orienter la bonne mesure de protection ou de régulation auprès des autorités compétentes.",
  },
  { id: "pp-13", type: "heading", text: "Piège photo connecté : 4G ou carte SD ?" },
  {
    id: "pp-14",
    type: "paragraph",
    text: "Un piège photo se choisit d'abord selon la façon dont vous voulez récupérer vos images. Le modèle à carte SD reste la solution la plus simple et la moins chère : vous relevez la carte mémoire lors de vos passages sur le terrain, sans connexion ni abonnement.\n\nLe piège photo 4G, comme la [WildTrail H40](/produits/camera-de-chasse-solaire/wildtrail-h40-camera-chasse-4g) ou la [H80](/produits/camera-de-chasse-solaire/wildtrail-h80-camera-chasse-solaire-4g), transmet directement vos photos et vidéos sur votre smartphone via une carte SIM, où que vous soyez — particulièrement utile sur un territoire difficile d'accès ou éloigné de votre domicile.\n\nEntre les deux, le Wi-Fi/Bluetooth ([WildTrail C20](/produits/cameras-de-chasse-connectees/wildtrail-c20-camera-chasse-wifi-bluetooth)) offre un compromis : vous consultez vos images sur votre téléphone à quelques mètres du boîtier, sans carte SIM ni abonnement, mais sans portée à distance.",
  },
  { id: "pp-15", type: "heading", text: "Comment choisir son piège photographique" },
  {
    id: "pp-16",
    type: "paragraph",
    text: "Cinq critères techniques déterminent la qualité d'un piège photo, quel que soit l'usage visé.\n\n**La portée de détection.** Plus le détecteur infrarouge couvre une large zone, plus vous augmentez vos chances de déclenchement — comptez 20 à 25 mètres pour un bon modèle.\n\n**La latence de déclenchement.** Le délai entre la détection et la prise de vue doit rester inférieur à 0,5 seconde pour ne pas manquer un animal en déplacement rapide.\n\n**Le type d'infrarouge.** Le no-glow (LED invisible) reste indispensable pour ne pas effrayer une faune farouche.\n\n**La résolution.** Au-delà de 20 mégapixels, le gain réel en netteté est minime — vérifiez si la résolution annoncée provient du capteur ou d'une interpolation logicielle.\n\n**L'autonomie et l'étanchéité.** Pour un poste laissé plusieurs mois, une caméra solaire s'impose ; visez au minimum un indice IP65.",
  },
];

const BLOCKS_AFTER_GRID = [
  { id: "pp-17", type: "heading", text: "Où placer un piège photo" },
  {
    id: "pp-18",
    type: "paragraph",
    text: "Le placement compte autant que le matériel. Visez une coulée de gibier identifiable, un point d'eau ou une lisière de bois — les zones de passage naturel de la faune. Positionnez le boîtier à environ un mètre de hauteur, légèrement orienté vers le nord pour éviter les faux déclenchements dus au soleil levant ou couchant.\n\nLaissez un dégagement suffisant devant l'appareil : une végétation trop proche le déclenche au moindre mouvement de branche et sature votre carte mémoire de fausses alertes. Sur un territoire que vous ne possédez pas, assurez-vous d'avoir l'accord du propriétaire avant d'installer votre appareil.\n\nUn piège photo susceptible de filmer des personnes — un chemin de randonnée, un sentier public à proximité — est soumis au RGPD : informez les passants de sa présence et ne conservez les images que le temps nécessaire. Filmer la voie publique ou la propriété d'un voisin sans accord reste interdit.",
  },
  {
    id: "pp-19",
    type: "faq",
    items: [
      {
        question: "Quelle est la différence entre un piège photo et une caméra de chasse ?",
        answer:
          "Techniquement, ce sont souvent les mêmes appareils. La différence est d'usage : le piège photo sert à observer, inventorier ou surveiller sans intention de prélèvement, la caméra de chasse à repérer le gibier avant une action de chasse.",
      },
      {
        question: "Peut-on installer un piège photo sur un terrain qu'on ne possède pas ?",
        answer:
          "Non, pas sans l'accord du propriétaire. Sur un terrain public ou une réserve, renseignez-vous auprès du gestionnaire ou de la préfecture avant toute installation.",
      },
      {
        question: "Faut-il un abonnement pour un piège photo ?",
        answer:
          "Non. Les modèles WildTrail à carte SD ou Wi-Fi/Bluetooth (C20) fonctionnent sans aucun abonnement. Les modèles 4G nécessitent une carte SIM avec un forfait data, que vous choisissez librement.",
      },
      {
        question: "Quelle autonomie pour un piège photo laissé plusieurs mois ?",
        answer:
          "Un modèle solaire comme la H20, la H40 ou la H80 offre une autonomie quasi illimitée dès qu'il y a un minimum de luminosité — jusqu'à 6 mois en veille sans intervention.",
      },
    ],
  },
];

export default async function PiegePhotoPage() {
  const products = await getPublishedProducts();
  const faqJsonLd = buildFaqJsonLd([...BLOCKS, ...BLOCKS_AFTER_GRID]);

  return (
    <main className="container">
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

      <nav className="breadcrumb">
        <Link href="/">Accueil</Link>
        <span className="sep">/</span>
        <Link href="/produits">Produits</Link>
        <span className="sep">/</span>
        <span className="current">Piège photo</span>
      </nav>

      <h1 className="listing-title">Piège photo : observer la faune sans la déranger</h1>

      <ContentBlocks blocks={BLOCKS} />

      <section className="section" style={{ paddingTop: 0 }}>
        <h2 className="reco-title">Nos pièges photo</h2>
        <ProductGrid products={products} />
      </section>

      <ContentBlocks blocks={BLOCKS_AFTER_GRID} />
    </main>
  );
}
