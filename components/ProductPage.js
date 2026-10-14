import { getRelatedProducts, getBundledVariant, getPublishedProducts } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import { getSettings } from "@/lib/settings";
import { defaultContent } from "@/lib/defaults";
import { pageMetadata } from "@/lib/metadata";
import { productPath } from "@/lib/productUrl";
import ProductDetail from "@/components/ProductDetail";

/** Métadonnées d'une fiche produit (servie sur /produits/{slug}, voir lib/productUrl.js). */
export function productMetadata(product) {
  // Image de mise en avant choisie dans l'admin (SEO) en priorité, sinon la première photo du produit.
  const featuredImage = product.seo?.featuredImage?.url;
  const galleryImages = product.images?.filter((i) => i.url && i.type !== "video").map((i) => i.url) || [];
  const ogImages = featuredImage ? [featuredImage, ...galleryImages.filter((u) => u !== featuredImage)] : galleryImages;

  return pageMetadata(productPath(product), {
    title: product.seo?.metaTitle || product.name,
    description: product.seo?.metaDescription || product.shortDescription || product.description?.slice(0, 155),
    images: ogImages,
  });
}

/** Fiche produit complète. */
export default async function ProductPage({ product }) {
  const [category, related, seo, content, bundle, legal, navigation] = await Promise.all([
    getCategoryBySlug(product.categoryId),
    // Produit sans catégorie (« aucune ») : on propose le reste de la gamme.
    product.categoryId && product.categoryId !== "aucune"
      ? getRelatedProducts(product.categoryId, product.id, 24)
      : getPublishedProducts({ excludePromo: true }).then((all) => all.filter((p) => p.id !== product.id).slice(0, 24)),
    getSettings("seo"),
    getSettings("content"),
    getBundledVariant(product.pack),
    getSettings("legal"),
    getSettings("navigation"),
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
      trustBadges={content.trustBadges}
      brandPoints={content.homeStoryPoints}
      contactEmail={legal.email}
      listingLabel={navigation.productsLabel || "Nos caméras"}
      texts={{ ...defaultContent.pdpTexts, ...(content.pdpTexts || {}) }}
      qtyTiers={content.qtyTiersEnabled !== false ? content.qtyTiers : []}
      promo={{
        enabled: content.promoInlineEnabled !== false,
        amountLabel: content.promoInlineAmountLabel,
        title: content.promoInlineTitle,
        text: content.promoInlineText,
      }}
      testimonials={{
        title: content.testimonialsTitle,
        rating: content.testimonialsRating,
        items: content.testimonials,
      }}
    />
  );
}
