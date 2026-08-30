import { getSettings } from "@/lib/settings";
import { getCategories } from "@/lib/categories";
import { getPublishedProducts } from "@/lib/products";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";

export default async function HomePage() {
  const [content, categories, bestSellers] = await Promise.all([
    getSettings("content"),
    getCategories(),
    getPublishedProducts({ isBestSeller: true }),
  ]);

  return (
    <main className="container">
      <Hero content={content} />

      <section className="section">
        <h2 className="section-title">Catégories Populaires</h2>
        <CategoryGrid categories={categories} />
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head-row">
          <h2 className="section-title">Nos Meilleures Ventes</h2>
        </div>
        {bestSellers.length ? (
          <ProductGrid products={bestSellers} />
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>Aucun produit en vedette pour le moment.</p>
        )}
      </section>
    </main>
  );
}
