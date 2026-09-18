import { notFound, redirect } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getBundledVariant } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import { getSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/metadata";
import ProductDetail from "@/components/ProductDetail";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  // Image de mise en avant choisie dans l'admin (SEO) en priorité, sinon la première photo du produit.
  const featuredImage = product.seo?.featuredImage?.url;
  const galleryImages = product.images?.filter((i) => i.url).map((i) => i.url) || [];
  const ogImages = featuredImage ? [featuredImage, ...galleryImages.filter((u) => u !== featuredImage)] : galleryImages;

  return pageMetadata(`/produits/${product.categoryId}/${product.slug}`, {
    title: product.seo?.metaTitle || product.name,
    description: product.seo?.metaDescription || product.shortDescription || product.description?.slice(0, 155),
    images: ogImages,
  });
}

export default async function ProductPage({ params }) {
  const { categorie, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // URL canonique : /produits/{slug-catégorie}/{slug-produit}. Si l'URL ne correspond pas
  // à la vraie catégorie du produit (lien obsolète, catégorie renommée...), on redirige
  // vers la bonne URL plutôt que de servir un contenu dupliqué (SEO).
  if (product.categoryId !== categorie) {
    redirect(`/produits/${product.categoryId}/${slug}`);
  }

  const [category, related, seo, content, bundle] = await Promise.all([
    getCategoryBySlug(product.categoryId),
    getRelatedProducts(product.categoryId, product.id, 24),
    getSettings("seo"),
    getSettings("content"),
    getBundledVariant(product.pack),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return (
    <ProductDetail
      product={product}
      category={category}
      related={related}
      siteName={seo.siteTitle}
      siteUrl={siteUrl}
      bundle={bundle}
      testimonials={{
        title: content.testimonialsTitle,
        rating: content.testimonialsRating,
        items: content.testimonials,
      }}
    />
  );
}
