import { getCategories } from "@/lib/categories";
import { getPublishedProducts } from "@/lib/products";
import Filters from "@/components/Filters";
import ResultsView from "@/components/ResultsView";
import SearchBar from "@/components/SearchBar";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q;
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

  const [categories, products] = await Promise.all([
    getCategories(),
    getPublishedProducts({ categoryIds, tags, maxPrice, search }),
  ]);

  return (
    <main className="container">
      <section className="search-hero">
        <SearchBar />
      </section>

      <div className="search-layout">
        <Filters categories={categories} />
        <ResultsView products={products} />
      </div>
    </main>
  );
}
