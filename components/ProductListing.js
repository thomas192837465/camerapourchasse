import Link from "next/link";
import Filters from "./Filters";
import ResultsView from "./ResultsView";
import SearchBar from "./SearchBar";
import ContentBlocks from "./ContentBlocks";

export default function ProductListing({ categories, products, filterOptions, selectedCategorySlugs, title, category, siteUrl = "" }) {
  const faqItems = (category?.blocks || [])
    .filter((b) => b.type === "faq")
    .flatMap((b) => b.items || [])
    .filter((f) => f.question && f.answer);

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

  const faqJsonLd = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

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

      <ContentBlocks blocks={category?.blocks} />
    </main>
  );
}
