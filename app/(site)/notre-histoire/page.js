import Link from "next/link";
import { getSettings } from "@/lib/settings";
import ContentBlocks from "@/components/ContentBlocks";
import { buildFaqJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const revalidate = 60;

export async function generateMetadata() {
  return pageMetadata("/notre-histoire", {
    title: "Notre histoire",
    description: "L'histoire et la passion derrière la marque.",
  });
}

export default async function HistoirePage() {
  const content = await getSettings("content");
  const faqJsonLd = buildFaqJsonLd(content.histoireBlocks);

  return (
    <main className="container">
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

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
