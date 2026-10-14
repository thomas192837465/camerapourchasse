import Link from "next/link";
import FilterableResults from "./FilterableResults";
import ContentBlocks from "./ContentBlocks";
import ProductComparisonTable from "./ProductComparisonTable";
import { buildFaqJsonLd } from "@/lib/schema";
import { renderRichText } from "@/lib/richText";
import { isInFilters } from "@/lib/categories";

export default function ProductListing({
  categories,
  products,
  selectedCategorySlugs,
  title,
  category,
  siteUrl = "",
  intro,
  introBlocks,
  pricingBlocks,
  comparison,
  listingLabel = "Nos caméras",
  initialMaxPrice = 500,
  allLabel = "Toutes nos caméras",
}) {
  const breadcrumbJsonLd = category
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: listingLabel, item: `${siteUrl}/produits` },
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
          <Link href="/produits">{listingLabel}</Link>
          <span className="sep">/</span>
          <span className="current">{category.name}</span>
        </nav>
      ) : null}

      <h1 className="listing-title">{title}</h1>
      {intro ? <p className="listing-intro" dangerouslySetInnerHTML={{ __html: renderRichText(intro) }} /> : null}

      <FilterableResults
        categories={categories.filter(isInFilters)}
        allLabel={allLabel}
        products={products}
        lockedCategory={category ? category.slug : null}
        initialCategories={selectedCategorySlugs || []}
        initialMaxPrice={initialMaxPrice}
      />

      {category ? (
        <ContentBlocks blocks={category.blocks} />
      ) : (
        <>
          <ContentBlocks blocks={introBlocks} />
          {comparison ? <ProductComparisonTable {...comparison} /> : null}
          <ContentBlocks blocks={pricingBlocks} />
        </>
      )}
    </main>
  );
}
