import { getCategories, getCategoryBySlug } from "@/lib/categories";
import { getPublishedProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import ProductListing from "@/components/ProductListing";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q;
  const categorySlugs = (sp?.categorie || "").split(",").filter(Boolean);

  if (!q && categorySlugs.length === 1) {
    const category = await getCategoryBySlug(categorySlugs[0]);
    if (category) {
      return {
        title: category.seo?.metaTitle || category.name,
        description:
          category.seo?.metaDescription ||
          `Découvrez notre sélection ${category.name} : caméras de chasse HD, discrètes et performantes.`,
      };
    }
  }

  return {
    title: q ? `Résultats pour "${q}"` : "Toutes nos caméras de chasse",
    description:
      "Parcourez notre catalogue de caméras de chasse : 4G, vision nocturne, haute résolution et accessoires.",
  };
}

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const categoryIds = (sp?.categorie || "").split(",").filter(Boolean);
  const tags = (sp?.tags || "").split(",").filter(Boolean);
  const maxPrice = sp?.max ? Number(sp.max) : undefined;
  const search = sp?.q || "";

  const [categories, products, filterOptions] = await Promise.all([
    getCategories(),
    getPublishedProducts({ categoryIds, tags, maxPrice, search }),
    getSettings("filters"),
  ]);

  return (
    <ProductListing
      categories={categories}
      products={products}
      filterOptions={filterOptions}
      selectedCategorySlugs={categoryIds}
      title={search ? `Résultats pour "${search}"` : "Toutes nos caméras de chasse"}
    />
  );
}
