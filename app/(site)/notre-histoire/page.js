import Link from "next/link";
import { getSettings } from "@/lib/settings";
import ContentBlocks from "@/components/ContentBlocks";

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: "Notre histoire",
    description: "L'histoire et la passion derrière la marque.",
    alternates: { canonical: "/notre-histoire" },
  };
}

export default async function HistoirePage() {
  const content = await getSettings("content");

  return (
    <main className="container">
      <nav className="breadcrumb">
        <Link href="/">Accueil</Link>
        <span className="sep">/</span>
        <span className="current">Notre histoire</span>
      </nav>

      <h1 className="listing-title">Notre histoire</h1>

      <ContentBlocks blocks={content.histoireBlocks} />
    </main>
  );
}
