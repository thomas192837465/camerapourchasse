import { getSettings } from "@/lib/settings";
import { getCategories } from "@/lib/categories";
import { getPublishedProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/metadata";
import Hero from "@/components/Hero";
import TechPromise from "@/components/TechPromise";
import EeatSection from "@/components/EeatSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import TrustBadges from "@/components/TrustBadges";

// Sans ça, Next.js peut figer cette page au moment du build sur Vercel : un produit ou un
// article publié ensuite depuis l'admin n'apparaîtrait qu'après un nouveau déploiement.
export const revalidate = 60;

export async function generateMetadata() {
  const seo = await getSettings("seo");
  // Pas de `title` ici : le layout racine fournit déjà `default` (seo.siteTitle) pour la page
  // d'accueil — en fixer un ici le ferait passer par le gabarit de titre ("%s | WildTrail"),
  // ce qu'on ne veut que pour les pages profondes.
  const meta = pageMetadata("/", {
    description: seo.defaultMetaDescription,
    images: seo.ogImage ? [seo.ogImage] : undefined,
  });
  meta.openGraph.title = seo.siteTitle;
  return meta;
}

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

  // Version machine-readable des signaux de confiance affichés dans la section "Expertise &
  // Confiance" — uniquement des faits réels (coordonnées saisies dans l'admin, note calculée à
  // partir des vrais avis) : jamais de champ inventé pour remplir le schema.
  // Pas d'aggregateRating ici : Google ne retient pas les notes auto-déclarées par l'entreprise
  // elle-même à ce niveau — seules celles portées par chaque Product (déjà en place) sont valides.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seo.siteTitle,
    url: siteUrl || undefined,
    logo: seo.ogImage || undefined,
    email: legal.email || undefined,
    telephone: legal.phone || undefined,
    address: legal.address || undefined,
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
