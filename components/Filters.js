"use client";

import { ChevronDownIcon } from "./Icons";

/** Panneau de filtres (contrôlé) : l'état et le filtrage vivent dans FilterableResults, côté
 * navigateur, pour que cocher une case ou bouger le prix soit instantané (aucun aller-retour
 * serveur). */
export default function Filters({ categories, selectedCategories, onToggleCategory, maxPrice, onMaxPrice }) {
  return (
    <aside className="filters">
      <h2>Résultats</h2>

      <details className="filter-group" open>
        <summary>
          Catégorie <ChevronDownIcon />
        </summary>
        <div className="filter-body">
          {categories.map((cat) => (
            <label className="filter-checkbox" key={cat.id}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => onToggleCategory(cat.slug)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </details>

      <details className="filter-group" open>
        <summary>
          Prix <ChevronDownIcon />
        </summary>
        <div className="filter-body">
          <div className="range-row">
            <input type="range" min="0" max="500" value={maxPrice} onChange={(e) => onMaxPrice(Number(e.target.value))} />
          </div>
          <div className="range-values">
            <span>0 €</span>
            <span>{maxPrice} €</span>
          </div>
        </div>
      </details>
    </aside>
  );
}
