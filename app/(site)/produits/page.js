import { getCategories, getCategoryBySlug } from "@/lib/categories";
import { getPublishedProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/metadata";
import ProductListing from "@/components/ProductListing";

// La canonical pointe toujours vers /produits, jamais vers une variante filtrée/triée/recherchée
// (?categorie=...&q=...) : sans ça, chaque combinaison de filtres devient une URL indexable
// potentiellement dupliquée aux yeux de Google.
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q;
  const categorySlugs = (sp?.categorie || "").split(",").filter(Boolean);

  if (!q && categorySlugs.length === 1) {
    const category = await getCategoryBySlug(categorySlugs[0]);
    if (category) {
      return pageMetadata("/produits", {
        title: category.seo?.metaTitle || category.name,
        description:
          category.seo?.metaDescription ||
          `Découvrez notre sélection ${category.name} : caméras de chasse HD, discrètes et performantes.`,
      });
    }
  }

  return pageMetadata("/produits", {
    title: q ? `Résultats pour "${q}"` : "Toutes nos caméras de chasse — prix et modèles",
    description:
      "Comparez les 5 caméras de chasse WildTrail : 4G, solaire, Wi-Fi. De 79 à 90 €, sans abonnement obligatoire, garantie 2 ans et SAV en France.",
  });
}

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const categoryIds = (sp?.categorie || "").split(",").filter(Boolean);
  const tags = (sp?.tags || "").split(",").filter(Boolean);
  const maxPrice = sp?.max ? Number(sp.max) : undefined;
  const search = sp?.q || "";

  const [categories, products, filterOptions, content] = await Promise.all([
    getCategories(),
    getPublishedProducts({ categoryIds, tags, maxPrice, search }),
    getSettings("filters"),
    getSettings("content"),
  ]);

  return (
    <ProductListing
      categories={categories}
      products={products}
      filterOptions={filterOptions}
      selectedCategorySlugs={categoryIds}
      title={search ? `Résultats pour "${search}"` : "Toutes nos caméras de chasse"}
      introBlocks={content.produitsIntroBlocks}
      pricingBlocks={content.produitsPricingBlocks}
    />
  );
}
