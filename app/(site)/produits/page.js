<<<<<<< ours
import { getSiteCategories, getCategoryBySlug } from "@/lib/categories";
=======
import { getSiteCategories, getCategoryBySlug, isInFilters } from "@/lib/categories";
import { productCategoryIds } from "@/lib/productUrl";
>>>>>>> theirs
import { getPublishedProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/metadata";
import ProductListing from "@/components/ProductListing";

// Page « Nos caméras » : page pilier sur « caméra de chasse » (H1, intro, guide et comparatif
// réglables dans Admin → Contenu → « Page Nos caméras »).
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

  const content = await getSettings("content");
  return pageMetadata("/produits", {
    title: q ? `Résultats pour "${q}"` : content.produitsMetaTitle || content.produitsH1 || "Caméra de chasse",
    description: content.produitsMetaDescription || "",
  });
}

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const categoryIds = (sp?.categorie || "").split(",").filter(Boolean);
  const tags = (sp?.tags || "").split(",").filter(Boolean);
  const maxPrice = sp?.max ? Number(sp.max) : undefined;
  const search = sp?.q || "";

  // Tous les produits sont envoyés une fois : catégories et prix se filtrent ensuite dans le
  // navigateur (FilterableResults), sans recharger la page à chaque clic.
  const [categories, allProducts, content, navigation] = await Promise.all([
    getSiteCategories(),
    getPublishedProducts({}),
    getSettings("content"),
    getSettings("navigation"),
  ]);
  // Sans recherche, « Nos caméras » ne liste pas les produits rangés uniquement dans une catégorie
  // retirée des filtres (ex : Accessoires, qui a sa propre page). Un produit sans catégorie reste listé.
  const hiddenFromListing = new Set(categories.filter((c) => !isInFilters(c)).map((c) => c.slug));
  const inListing = (p) => {
    const ids = productCategoryIds(p).filter((id) => id !== "aucune");
    return !ids.length || ids.some((id) => !hiddenFromListing.has(id));
  };
  const products = search || tags.length ? await getPublishedProducts({ tags, search }) : allProducts.filter(inListing);

  return (
    <ProductListing
      categories={categories}
      products={products}
      selectedCategorySlugs={categoryIds.filter((id) => categories.some((c) => c.slug === id))}
      title={search ? `Résultats pour "${search}"` : content.produitsH1 || "Caméra de chasse"}
      intro={search ? "" : content.produitsIntro}
      introBlocks={content.produitsIntroBlocks}
      pricingBlocks={content.produitsPricingBlocks}
      comparison={{ title: content.comparisonTitle, rows: content.comparisonRows, products: allProducts }}
      listingLabel={navigation.productsLabel || "Nos caméras"}
      initialMaxPrice={Number.isFinite(maxPrice) ? maxPrice : 500}
      allLabel={content.produitsFiltersAllLabel || "Toutes nos caméras"}
    />
  );
}
