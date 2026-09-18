"use client";

import { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";
import { GridIcon, ListIcon } from "./Icons";

const PAGE_SIZE = 9;

export default function ResultsView({ products }) {
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);

  // Sur mobile, la vue grille (2 colonnes serrées) est moins lisible que la liste — bascule le
  // réglage par défaut uniquement au premier rendu client, pour ne jamais désynchroniser du HTML
  // déjà envoyé par le serveur (qui ignore la largeur d'écran du visiteur).
  useEffect(() => {
    if (window.innerWidth <= 640) setView("list");
  }, []);

  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageProducts = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <section>
      <div className="results-header">
        <p className="results-count">Affichage de {products.length} résultat{products.length > 1 ? "s" : ""}</p>
        <div className="view-toggle">
          <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Vue grille">
            <GridIcon />
          </button>
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="Vue liste">
            <ListIcon />
          </button>
        </div>
      </div>

      {pageProducts.length ? (
        <ProductGrid products={pageProducts} className={view === "list" ? "list-view" : "cols-3"} />
      ) : (
        <p style={{ color: "var(--ink-soft)" }}>Aucun produit ne correspond à ces filtres.</p>
      )}

      {pageCount > 1 ? (
        <div className="pagination">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button key={n} className={n === currentPage ? "active" : ""} onClick={() => setPage(n)}>
              {n}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
