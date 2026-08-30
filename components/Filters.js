"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDownIcon } from "./Icons";

const RESOLUTION_OPTIONS = ["4K UHD", "30 MP", "50 MP"];
const VISION_OPTIONS = ["Vision Nocturne No-Glow", "Vision couleur basse lumière"];
const RANGE_OPTIONS = ["Détection 25 m", "Détection 15 m", "Détection 10 m"];

export default function Filters({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategories = (searchParams.get("categorie") || "").split(",").filter(Boolean);
  const selectedTags = (searchParams.get("tags") || "").split(",").filter(Boolean);
  const maxPrice = Number(searchParams.get("max") || 500);

  function updateParams(mutator) {
    const params = new URLSearchParams(searchParams.toString());
    mutator(params);
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleListParam(key, value, currentList) {
    updateParams((params) => {
      const next = currentList.includes(value)
        ? currentList.filter((v) => v !== value)
        : [...currentList, value];
      if (next.length) params.set(key, next.join(","));
      else params.delete(key);
    });
  }

  function setMaxPrice(value) {
    updateParams((params) => params.set("max", String(value)));
  }

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
                onChange={() => toggleListParam("categorie", cat.slug, selectedCategories)}
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
            <input
              type="range"
              min="0"
              max="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="range-values">
            <span>€0</span>
            <span>€{maxPrice}</span>
          </div>
        </div>
      </details>

      <details className="filter-group" open>
        <summary>
          Résolution <ChevronDownIcon />
        </summary>
        <div className="filter-body">
          {RESOLUTION_OPTIONS.map((opt) => (
            <label className="filter-checkbox" key={opt}>
              <input
                type="checkbox"
                checked={selectedTags.includes(opt)}
                onChange={() => toggleListParam("tags", opt, selectedTags)}
              />
              {opt}
            </label>
          ))}
        </div>
      </details>

      <details className="filter-group" open>
        <summary>
          Vision de Nuit <ChevronDownIcon />
        </summary>
        <div className="filter-body">
          {VISION_OPTIONS.map((opt) => (
            <label className="filter-checkbox" key={opt}>
              <input
                type="checkbox"
                checked={selectedTags.includes(opt)}
                onChange={() => toggleListParam("tags", opt, selectedTags)}
              />
              {opt}
            </label>
          ))}
        </div>
      </details>

      <details className="filter-group" open>
        <summary>
          Portée <ChevronDownIcon />
        </summary>
        <div className="filter-body">
          {RANGE_OPTIONS.map((opt) => (
            <label className="filter-checkbox" key={opt}>
              <input
                type="checkbox"
                checked={selectedTags.includes(opt)}
                onChange={() => toggleListParam("tags", opt, selectedTags)}
              />
              {opt}
            </label>
          ))}
        </div>
      </details>
    </aside>
  );
}
