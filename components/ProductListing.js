import Link from "next/link";
import Filters from "./Filters";
import ResultsView from "./ResultsView";
import SearchBar from "./SearchBar";
import ContentBlocks from "./ContentBlocks";
import ProductComparisonTable from "./ProductComparisonTable";
import { buildFaqJsonLd } from "@/lib/schema";

export default function ProductListing({
  categories,
  products,
  filterOptions,
  selectedCategorySlugs,
  title,
  category,
  siteUrl = "",
  introBlocks,
  pricingBlocks,
}) {
  const breadcrumbJsonLd = category
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Produits", item: `${siteUrl}/produits` },
          { "@type": "ListItem", position: 3, name: category.name, item: `${siteUrl}/produits/${category.slug}` },
        ],
      }
    : null;

  // Sur la fiche catégorie, la FAQ vient des blocs de la catégorie ; sur le catalogue racine,
  // des deux blocs de contenu SEO ajoutés autour du tableau comparatif.
  const faqJsonLd = category ? buildFaqJsonLd(category.blocks) : buildFaqJsonLd([...(introBlocks || []), ...(pricingBlocks || [])]);

  return (
    <main className="container">
      {breadcrumbJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      ) : null}
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

      {category ? (
        <nav className="breadcrumb">
          <Link href="/">Accueil</Link>
          <span className="sep">/</span>
          <Link href="/produits">Produits</Link>
          <span className="sep">/</span>
          <span className="current">{category.name}</span>
        </nav>
      ) : null}

      <h1 className="listing-title">{title}</h1>

      <section className="search-hero">
        <SearchBar />
      </section>

      <div className="search-layout">
        <Filters categories={categories} options={filterOptions} selectedCategorySlugs={selectedCategorySlugs} />
        <ResultsView products={products} />
      </div>

      {category ? (
        <ContentBlocks blocks={category.blocks} />
      ) : (
        <>
          <ContentBlocks blocks={introBlocks} />
          {(introBlocks || pricingBlocks) ? <ProductComparisonTable /> : null}
          <ContentBlocks blocks={pricingBlocks} />
        </>
      )}
    </main>
  );
}
