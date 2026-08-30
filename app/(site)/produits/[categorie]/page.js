import { notFound, permanentRedirect } from "next/navigation";
import { getCategoryBySlug, getCategories } from "@/lib/categories";
import { getProductBySlug, getPublishedProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import ProductListing from "@/components/ProductListing";

// URL canonique d'une catégorie : /produits/{slug}. Si le segment ne correspond à aucune
// catégorie, on retombe sur l'ancien comportement : /produits/{slug} était autrefois l'URL
// d'une fiche produit, conservée pour rediriger de façon permanente vers /produits/{categorie}/{slug}.
export async function generateMetadata({ params }) {
  const { categorie } = await params;
  const category = await getCategoryBySlug(categorie);
  if (!category) return {};
  return {
    title: category.seo?.metaTitle || category.name,
    description:
      category.seo?.metaDescription ||
      `Découvrez notre sélection ${category.name} : caméras de chasse HD, discrètes et performantes.`,
    alternates: { canonical: `/produits/${category.slug}` },
  };
}

export default async function CategoryOrLegacyProductPage({ params, searchParams }) {
  const { categorie } = await params;
  const category = await getCategoryBySlug(categorie);

  if (category) {
    const sp = await searchParams;
    const tags = (sp?.tags || "").split(",").filter(Boolean);
    const maxPrice = sp?.max ? Number(sp.max) : undefined;
    const search = sp?.q || "";

    const [categories, products, filterOptions] = await Promise.all([
      getCategories(),
      getPublishedProducts({ categoryIds: [category.slug], tags, maxPrice, search }),
      getSettings("filters"),
    ]);

    return (
      <ProductListing
        categories={categories}
        products={products}
        filterOptions={filterOptions}
        selectedCategorySlugs={[category.slug]}
        title={category.name}
      />
    );
  }

  const product = await getProductBySlug(categorie);
  if (!product) notFound();
  permanentRedirect(`/produits/${product.categoryId}/${categorie}`);
}
