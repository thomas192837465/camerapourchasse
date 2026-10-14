"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Filters from "./Filters";
import ResultsView from "./ResultsView";
import { productCategoryIds } from "@/lib/productUrl";

/**
 * Filtres + grille. Tous les produits de la page sont déjà chargés : les filtres trient dans le
 * navigateur, instantanément. L'adresse est mise à jour sans recharger (lien partageable).
 * Sur une page catégorie (/produits/{slug}), changer de catégorie reste une vraie navigation
 * vers la page de l'autre catégorie.
 */
export default function FilterableResults({ categories, allLabel, products, lockedCategory, initialCategories = [], initialMaxPrice = 500 }) {
  const router = useRouter();
  const [selected, setSelected] = useState(lockedCategory ? [lockedCategory] : initialCategories);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  function syncUrl(nextCategories, nextMax) {
    if (lockedCategory) return;
    const params = new URLSearchParams(window.location.search);
    if (nextCategories.length) params.set("categorie", nextCategories.join(","));
    else params.delete("categorie");
    if (nextMax < 500) params.set("max", String(nextMax));
    else params.delete("max");
    const qs = params.toString();
    window.history.replaceState(null, "", `/produits${qs ? `?${qs}` : ""}`);
  }

  function toggleCategory(slug) {
    const next = selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug];
    if (lockedCategory) {
      // Page catégorie : on rejoint la page de la catégorie choisie (ou le catalogue).
      const others = next.filter((s) => s !== lockedCategory);
      router.push(others.length === 1 ? `/produits/${others[0]}` : others.length ? `/produits?categorie=${others.join(",")}` : "/produits");
      return;
    }
    setSelected(next);
    syncUrl(next, maxPrice);
  }

  // « Toutes nos caméras » : retire le filtre de catégorie (sur une page catégorie, retour au catalogue).
  function showAll() {
    if (lockedCategory) {
      router.push("/produits");
      return;
    }
    setSelected([]);
    syncUrl([], maxPrice);
  }

  function changeMaxPrice(value) {
    setMaxPrice(value);
    syncUrl(selected, value);
  }

  const visible = useMemo(
    () =>
      products.filter((p) => {
        if (typeof p.price === "number" && p.price > maxPrice) return false;
        if (lockedCategory || !selected.length) return true;
        return productCategoryIds(p).some((c) => selected.includes(c));
      }),
    [products, selected, maxPrice, lockedCategory]
  );

  return (
    <div className="search-layout">
      <Filters
        categories={categories}
        allLabel={allLabel}
        allSelected={!lockedCategory && !selected.length}
        onShowAll={showAll}
        selectedCategories={selected}
        onToggleCategory={toggleCategory}
        maxPrice={maxPrice}
        onMaxPrice={changeMaxPrice}
      />
      <ResultsView products={visible} />
    </div>
  );
}
