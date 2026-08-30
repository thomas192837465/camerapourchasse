import { getSettings } from "@/lib/settings";
import { getCategories } from "@/lib/categories";
import { getPublishedProducts } from "@/lib/products";
import Hero from "@/components/Hero";
import TechPromise from "@/components/TechPromise";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import TrustBadges from "@/components/TrustBadges";

export default async function HomePage() {
  const [content, categories, bestSellers] = await Promise.all([
    getSettings("content"),
    getCategories(),
    getPublishedProducts({ isBestSeller: true }),
  ]);

  return (
    <main>
      <Hero content={content} />

      <TechPromise title={content.featuresTitle} items={content.features} />

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
