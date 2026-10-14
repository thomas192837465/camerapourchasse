import { notFound, permanentRedirect } from "next/navigation";
import { getCategoryBySlug, getCategories } from "@/lib/categories";
import { getProductBySlug, getPublishedProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { getPostBySlug } from "@/lib/posts";
import { pageMetadata } from "@/lib/metadata";
import { productPath } from "@/lib/productUrl";
import ProductListing from "@/components/ProductListing";
import ProductPage, { productMetadata } from "@/components/ProductPage";

export const revalidate = 60;

// Anciennes pages supprimées : tant qu'aucune catégorie ne reprend ces adresses (ou ne les liste
// dans ses "Anciennes adresses"), elles redirigent vers la page Nos caméras plutôt qu'une erreur 404.
// piege-photo → l'article /blog/piege-photo dès qu'il est publié.
const RETIRED = {
  "piege-photo": { post: "piege-photo" },
  "camera-de-chasse-sans-abonnement": {},
  "cameras-de-chasse-connectees": {},
  "camera-de-chasse-4g": {},
  "camera-de-chasse-wifi": {},
};

// /produits/{segment} sert, dans cet ordre :
//  1. une catégorie (son slug),
//  2. une ancienne adresse de catégorie (champ "Anciennes adresses" de la catégorie) → redirection,
//  3. une fiche produit (son slug ; un ancien slug ou le handle Shopify redirige vers le bon),
//  4. une ancienne page supprimée (RETIRED) → redirection vers /produits.
async function resolve(segment) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === segment);
  if (category) return { category, categories };
  const renamed = categories.find((c) => (c.formerSlugs || []).includes(segment));
  if (renamed) return { redirectTo: `/produits/${renamed.slug}` };
  const product = await getProductBySlug(segment);
  if (product) return { product };
  const retired = RETIRED[segment];
  if (retired) {
    const post = retired.post ? await getPostBySlug(retired.post).catch(() => null) : null;
    return { redirectTo: post ? `/blog/${retired.post}` : "/produits" };
  }
  return {};
}

export async function generateMetadata({ params }) {
  const { categorie } = await params;
  const { category, product } = await resolve(categorie);
  if (product) return productMetadata(product);
  if (!category) return {};
  return pageMetadata(`/produits/${category.slug}`, {
    title: category.seo?.metaTitle || category.name,
    description:
      category.seo?.metaDescription ||
      `Découvrez notre sélection ${category.name} : caméras de chasse HD, discrètes et performantes.`,
    images: category.image?.url ? [category.image.url] : undefined,
  });
}

export default async function CategoryOrProductPage({ params, searchParams }) {
  const { categorie } = await params;
  const { category, categories, product, redirectTo } = await resolve(categorie);

  if (redirectTo) permanentRedirect(redirectTo);

  if (category) {
    const [products, navigation] = await Promise.all([
      getPublishedProducts({ categoryIds: [category.slug], excludePromo: true }),
      getSettings("navigation"),
    ]);

    return (
      <ProductListing
        categories={categories}
        products={products}
        selectedCategorySlugs={[category.slug]}
        title={category.h1 || category.name}
        intro={category.intro}
        category={category}
        listingLabel={navigation.productsLabel || "Nos caméras"}
        siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ""}
      />
    );
  }

  if (!product) notFound();
  if (productPath(product) !== `/produits/${categorie}`) permanentRedirect(productPath(product));
  return <ProductPage product={product} />;
}
