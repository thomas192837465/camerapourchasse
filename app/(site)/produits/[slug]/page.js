import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { getCategoryById } from "@/lib/categories";
import ProductInteractive from "@/components/ProductInteractive";
import ProductGrid from "@/components/ProductGrid";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seo?.metaTitle || product.name,
    description: product.seo?.metaDescription || product.shortDescription || product.description?.slice(0, 155),
    alternates: { canonical: `/produits/${product.slug}` },
    openGraph: {
      title: product.seo?.metaTitle || product.name,
      description: product.seo?.metaDescription || product.shortDescription,
      images: product.images?.filter((i) => i.url).map((i) => i.url) || [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    product.categoryId ? getCategoryById(product.categoryId) : null,
    getRelatedProducts(product.categoryId, product.id, 4),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: (product.images || []).filter((i) => i.url).map((i) => i.url),
    sku: product.sku || product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: product.price,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: product.rating?.count
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating.average,
          reviewCount: product.rating.count,
        }
      : undefined,
  };

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="breadcrumb">
        <Link href="/">Accueil</Link>
        <span className="sep">/</span>
        <Link href="/produits">Produits</Link>
        {category ? (
          <>
            <span className="sep">/</span>
            <Link href={`/produits?categorie=${category.slug}`}>{category.name}</Link>
          </>
        ) : null}
        <span className="sep">/</span>
        <span className="current">{product.name}</span>
      </nav>

      <ProductInteractive product={product} />

      {related.length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <h2 className="reco-title">Produits Recommandés</h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </main>
  );
}
