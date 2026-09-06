import { getSettings } from "@/lib/settings";
import { getCategories } from "@/lib/categories";
import { getPublishedProducts } from "@/lib/products";
import { computeRating } from "@/lib/reviews";
import Hero from "@/components/Hero";
import TechPromise from "@/components/TechPromise";
import EeatSection from "@/components/EeatSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import TrustBadges from "@/components/TrustBadges";

export default async function HomePage() {
  const [content, categories, allProducts, seo, legal] = await Promise.all([
    getSettings("content"),
    getCategories(),
    getPublishedProducts(),
    getSettings("seo"),
    getSettings("legal"),
  ]);

  const bestSellers = allProducts.filter((p) => p.isBestSeller);

  const heroBackdropImages = bestSellers
    .map((p) => p.images?.find((img) => img.url))
    .filter(Boolean);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const siteRating = computeRating(allProducts.flatMap((p) => p.reviews || []));

  // Version machine-readable des signaux de confiance affichés dans la section "Expertise &
  // Confiance" — uniquement des faits réels (coordonnées saisies dans l'admin, note calculée à
  // partir des vrais avis) : jamais de champ inventé pour remplir le schema.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seo.siteTitle,
    url: siteUrl || undefined,
    logo: seo.ogImage || undefined,
    email: legal.email || undefined,
    telephone: legal.phone || undefined,
    address: legal.address || undefined,
    aggregateRating: siteRating.count
      ? {
          "@type": "AggregateRating",
          ratingValue: siteRating.average,
          reviewCount: siteRating.count,
        }
      : undefined,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />

      <Hero content={content} images={heroBackdropImages} />

      <TechPromise items={content.features} />

      <EeatSection title={content.eeatTitle} subtitle={content.eeatSubtitle} points={content.eeatPoints} />

      <div className="container">
        <CategoryGrid title={content.categoriesSectionTitle} categories={categories} />

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-head-row">
            <h2 className="section-title">{content.bestSellersTitle}</h2>
          </div>
          {bestSellers.length ? (
            <ProductGrid products={bestSellers} />
          ) : (
            <p style={{ color: "var(--ink-soft)" }}>Aucun produit en vedette pour le moment.</p>
          )}
        </section>
      </div>

      <TrustBadges items={content.trustBadges} />
    </main>
  );
}
