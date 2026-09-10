import Link from "next/link";
import { getSettings } from "@/lib/settings";
import ContentBlocks from "@/components/ContentBlocks";
import { buildFaqJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 60;

export async function generateMetadata() {
  return pageMetadata("/livraison", {
    title: "Livraison",
    description: "Délais, zones de livraison et suivi de commande pour vos caméras de chasse.",
  });
}

export default async function LivraisonPage() {
  const content = await getSettings("content");
  const faqJsonLd = buildFaqJsonLd(content.livraisonBlocks);

  return (
    <main className="container">
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

      <nav className="breadcrumb">
        <Link href="/">Accueil</Link>
        <span className="sep">/</span>
        <span className="current">Livraison</span>
      </nav>

      <h1 className="listing-title">Livraison</h1>

      <ContentBlocks blocks={content.livraisonBlocks} />
    </main>
  );
}
