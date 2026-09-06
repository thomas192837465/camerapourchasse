import Link from "next/link";
import { getSettings } from "@/lib/settings";
import ContentBlocks from "@/components/ContentBlocks";

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: "Livraison",
    description: "Délais, zones de livraison et suivi de commande pour vos caméras de chasse.",
    alternates: { canonical: "/livraison" },
  };
}

export default async function LivraisonPage() {
  const content = await getSettings("content");

  return (
    <main className="container">
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
