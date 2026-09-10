import Link from "next/link";
import { getPublishedProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/metadata";
import { buildFaqJsonLd } from "@/lib/schema";
import ProductGrid from "@/components/ProductGrid";
import ContentBlocks from "@/components/ContentBlocks";

export const revalidate = 60;

export async function generateMetadata() {
  return pageMetadata("/produits/camera-de-chasse-sans-abonnement", {
    title: "Caméra de chasse 4G sans abonnement",
    description:
      "Caméras de chasse 4G sans abonnement ni forfait imposé : votre carte SIM, votre opérateur. Photos sur votre téléphone, garantie 2 ans.",
  });
}

const BLOCKS = [
  { id: "sa-1", type: "heading", text: "Pourquoi la plupart des caméras 4G imposent un abonnement" },
  {
    id: "sa-2",
    type: "paragraph",
    text: "La majorité des grandes marques de caméras de chasse 4G vendent leur boîtier à un tarif attractif, puis imposent un abonnement mensuel obligatoire sur leur propre plateforme pour recevoir vos photos — un modèle économique classique dans l'électronique connectée, où l'appareil est parfois vendu quasiment à prix coûtant et la marge se fait sur l'abonnement récurrent.\n\nConcrètement, cela signifie que la caméra ne fonctionne qu'avec la carte SIM et le forfait data du fabricant, à un tarif fixé par lui, sans possibilité de changer d'opérateur ni de résilier sans perdre l'usage de l'appareil.\n\nCe n'est pas le choix de WildTrail. Nos modèles 4G fonctionnent avec n'importe quelle carte SIM standard ou M2M du commerce : vous choisissez votre opérateur, votre forfait, et vous gardez la main sur ce coût récurrent plutôt que de le subir.",
  },
  { id: "sa-3", type: "heading", text: "Comment fonctionne une caméra sans abonnement" },
  {
    id: "sa-4",
    type: "paragraph",
    text: "Concrètement, vous insérez une carte SIM standard (comme celle de votre téléphone) ou une carte SIM M2M dédiée aux objets connectés dans le boîtier de votre [WildTrail H40](/produits/camera-de-chasse-solaire/wildtrail-h40-camera-chasse-4g), [H80](/produits/camera-de-chasse-solaire/wildtrail-h80-camera-chasse-solaire-4g) ou [C40](/produits/cameras-de-chasse-connectees/wildtrail-c40-camera-chasse-4g). Deux options s'offrent à vous : une carte prépayée sans engagement, rechargée selon votre usage, ou un petit forfait data mensuel chez un opérateur low-cost.\n\nUne fois la carte activée et insérée, la caméra fonctionne exactement comme n'importe quel modèle 4G du marché : vos photos et vidéos arrivent directement sur votre smartphone via l'application dédiée, dès qu'un mouvement est détecté. La seule différence est que vous restez libre de changer d'opérateur, de suspendre la carte hors saison, ou de mutualiser une carte SIM déjà utilisée pour un autre usage.\n\nPour plus de détails sur le choix de la carte SIM adaptée à votre terrain, consultez notre article sur les [caméras 4G, GSM ou Wifi](/blog/camera-de-chasse-4g-gsm-ou-wifi-quelle-connectivite-choisir-selon-votre-terrain).",
  },
  { id: "sa-5", type: "heading", text: "Combien ça coûte réellement" },
  {
    id: "sa-6",
    type: "paragraph",
    text: "Sur plusieurs années, l'écart se creuse vite. Un abonnement mensuel imposé, même modeste, s'accumule saison après saison — et contrairement à l'achat de la caméra, c'est une dépense qui ne s'arrête jamais tant que vous voulez continuer à recevoir vos photos à distance.\n\nAvec une WildTrail 4G (87 € à 90 €), vous choisissez une carte SIM prépayée ou un forfait data low-cost, généralement à quelques euros par mois selon votre usage — et vous gardez la liberté de suspendre ce forfait hors saison, ce qu'un abonnement imposé à l'année ne permet pas toujours. Sur plusieurs saisons, cette liberté de choix représente une économie réelle, d'autant plus que vous n'êtes jamais dépendant d'un seul fournisseur pour continuer à utiliser votre matériel.",
  },
  { id: "sa-7", type: "heading", text: "Et sans réseau du tout : la carte SD" },
  {
    id: "sa-8",
    type: "paragraph",
    text: "Sur un terrain sans couverture mobile du tout, même la 4G ne sert à rien. Dans ce cas, la [WildTrail H20](/produits/camera-de-chasse-solaire/wildtrail-h20-camera-chasse-4g) reste la solution la plus fiable : elle fonctionne entièrement sur carte mémoire, sans connexion d'aucune sorte, avec un panneau solaire intégré pour une autonomie de plusieurs mois. Vous récupérez vos photos en relevant la carte SD lors de vos passages sur le terrain.\n\nLa [WildTrail C20](/produits/cameras-de-chasse-connectees/wildtrail-c20-camera-chasse-wifi-bluetooth) offre un compromis intermédiaire : pas de réseau mobile nécessaire, mais vous consultez vos photos sur votre smartphone via Wi-Fi/Bluetooth dès que vous êtes à proximité du boîtier, sans avoir à retirer la carte mémoire.",
  },
];

const BLOCKS_AFTER_GRID = [
  { id: "sa-9", type: "heading", text: "Surveiller une parcelle, un chalet ou un local isolé" },
  {
    id: "sa-10",
    type: "paragraph",
    text: "Une caméra de chasse 4G sans abonnement n'est pas réservée à la saison de chasse. C'est, au fond, une caméra de surveillance solaire autonome, sans forfait imposé — exactement ce que recherchent les propriétaires d'un chalet, d'une résidence secondaire ou d'un terrain isolé qui veulent être alertés en cas de passage suspect, sans installer de box internet ni payer un service de télésurveillance mensuel.\n\nLe même boîtier, la même carte SIM prépayée, fonctionnent aussi bien pour surveiller un accès forestier que pour sécuriser un local technique ou une parcelle agricole — un usage complémentaire qui étale l'utilisation de votre matériel sur toute l'année plutôt que sur la seule saison de chasse.",
  },
  {
    id: "sa-11",
    type: "faq",
    items: [
      {
        question: "Quelle carte SIM choisir pour une caméra de chasse ?",
        answer:
          "Une carte SIM standard prépayée (comme celle d'un téléphone) suffit pour un usage occasionnel. Pour un usage plus intensif, une carte SIM M2M dédiée aux objets connectés, ou un forfait data low-cost chez un opérateur MVNO, reste la solution la plus économique.",
      },
      {
        question: "Combien de photos peut-on envoyer par mois avec un petit forfait ?",
        answer:
          "Cela dépend du forfait choisi et du poids des fichiers. Pour un usage classique de quelques dizaines à quelques centaines de déclenchements par mois, un forfait data léger suffit largement — privilégiez la photo à la vidéo si vous voulez limiter votre consommation.",
      },
      {
        question: "Peut-on changer d'opérateur en cours d'utilisation ?",
        answer:
          "Oui, sans restriction : la caméra fonctionne avec n'importe quelle carte SIM standard ou M2M. Il suffit de remplacer la carte dans le boîtier et de reparamétrer l'envoi dans l'application.",
      },
      {
        question: "Que se passe-t-il si le crédit de la carte SIM est épuisé ?",
        answer:
          "La caméra continue d'enregistrer sur sa carte mémoire interne, mais cesse d'envoyer les photos par 4G jusqu'au rechargement du crédit ou du forfait. Aucune donnée n'est perdue, l'envoi reprend dès que la carte SIM est de nouveau active.",
      },
    ],
  },
];

export default async function SansAbonnementPage() {
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
        <span className="current">Sans abonnement</span>
      </nav>

      <h1 className="listing-title">Caméra de chasse sans abonnement : votre carte SIM, votre choix</h1>

      <ContentBlocks blocks={BLOCKS} />

      <section className="section" style={{ paddingTop: 0 }}>
        <h2 className="reco-title">Nos modèles sans abonnement</h2>
        <ProductGrid products={products} />
      </section>

      <ContentBlocks blocks={BLOCKS_AFTER_GRID} />
    </main>
  );
}
