import Link from "next/link";
import ProductInteractive from "./ProductInteractive";
import ProductCarousel from "./ProductCarousel";

export default function ProductDetail({ product, category, related, siteName, siteUrl = "" }) {
  const productUrl = `${siteUrl}/produits/${product.categoryId}/${product.slug}`;
  const faq = (product.faq || []).filter((f) => f.question && f.answer);
  const featuredImage = product.seo?.featuredImage?.url;
  const galleryImages = (product.images || []).filter((i) => i.url).map((i) => i.url);
  const jsonLdImages = featuredImage ? [featuredImage, ...galleryImages.filter((u) => u !== featuredImage)] : galleryImages;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: jsonLdImages,
    sku: product.sku || product.id,
    brand: { "@type": "Brand", name: siteName },
    url: productUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: product.price,
      url: productUrl,
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

  const breadcrumbItems = [
    { name: "Accueil", url: `${siteUrl}/` },
    { name: "Produits", url: `${siteUrl}/produits` },
    ...(category ? [{ name: category.name, url: `${siteUrl}/produits/${category.slug}` }] : []),
    { name: product.name, url: productUrl },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  const faqJsonLd = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

      <nav className="breadcrumb">
        <Link href="/">Accueil</Link>
        <span className="sep">/</span>
        <Link href="/produits">Produits</Link>
        {category ? (
          <>
            <span className="sep">/</span>
            <Link href={`/produits/${category.slug}`}>{category.name}</Link>
          </>
        ) : null}
        <span className="sep">/</span>
        <span className="current">{product.name}</span>
      </nav>

      <ProductInteractive product={product} />

      {faq.length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <h2 className="reco-title">Questions fréquentes</h2>
          <div className="faq-list">
            {faq.map((f, i) => (
              <details className="faq-item" key={i}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <h2 className="reco-title">Vous pourriez aimer</h2>
          <ProductCarousel products={related} />
        </section>
      ) : null}
    </main>
  );
}
