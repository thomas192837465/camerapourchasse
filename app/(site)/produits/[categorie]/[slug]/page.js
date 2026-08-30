import { notFound, redirect } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import { getSettings } from "@/lib/settings";
import ProductDetail from "@/components/ProductDetail";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  // Image de mise en avant choisie dans l'admin (SEO) en priorité, sinon la première photo du produit.
  const featuredImage = product.seo?.featuredImage?.url;
  const galleryImages = product.images?.filter((i) => i.url).map((i) => i.url) || [];
  const ogImages = featuredImage ? [featuredImage, ...galleryImages.filter((u) => u !== featuredImage)] : galleryImages;

  return {
    title: product.seo?.metaTitle || product.name,
    description: product.seo?.metaDescription || product.shortDescription || product.description?.slice(0, 155),
    alternates: { canonical: `/produits/${product.categoryId}/${product.slug}` },
    openGraph: {
      title: product.seo?.metaTitle || product.name,
      description: product.seo?.metaDescription || product.shortDescription,
      images: ogImages,
    },
  };
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

  const [category, related, seo] = await Promise.all([
    getCategoryBySlug(product.categoryId),
    getRelatedProducts(product.categoryId, product.id, 24),
    getSettings("seo"),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return (
    <ProductDetail
      product={product}
      category={category}
      related={related}
      siteName={seo.siteTitle}
      siteUrl={siteUrl}
    />
  );
}
