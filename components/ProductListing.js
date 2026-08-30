import Filters from "./Filters";
import ResultsView from "./ResultsView";
import SearchBar from "./SearchBar";

export default function ProductListing({ categories, products, filterOptions, selectedCategorySlugs, title }) {
  return (
    <main className="container">
      <section className="search-hero">
        <SearchBar />
      </section>

      <div className="search-layout">
        <Filters categories={categories} options={filterOptions} selectedCategorySlugs={selectedCategorySlugs} />
        <ResultsView products={products} title={title} />
      </div>
    </main>
  );
}
