"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDownIcon } from "./Icons";

export default function Filters({ categories, options, selectedCategorySlugs }) {
  const RESOLUTION_OPTIONS = options?.resolutionOptions || [];
  const VISION_OPTIONS = options?.visionOptions || [];
  const RANGE_OPTIONS = options?.rangeOptions || [];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // La catégorie active vient soit du chemin (/produits/{slug}, URL canonique passée en prop),
  // soit de l'ancienne query string (?categorie=a,b, utilisée pour la multi-sélection).
  const selectedCategories = selectedCategorySlugs ?? (searchParams.get("categorie") || "").split(",").filter(Boolean);
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

  function toggleCategory(slug) {
    const next = selectedCategories.includes(slug)
      ? selectedCategories.filter((v) => v !== slug)
      : [...selectedCategories, slug];

    const params = new URLSearchParams(searchParams.toString());
    params.delete("categorie");

    if (next.length === 1) {
      // Une seule catégorie sélectionnée : URL canonique /produits/{slug} (meilleure pour le SEO).
      const qs = params.toString();
      router.push(`/produits/${next[0]}${qs ? `?${qs}` : ""}`);
    } else {
      // Aucune ou plusieurs catégories : reste sur /produits avec ?categorie=a,b.
      if (next.length) params.set("categorie", next.join(","));
      router.push(`/produits${params.toString() ? `?${params.toString()}` : ""}`);
    }
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
                onChange={() => toggleCategory(cat.slug)}
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

      {RESOLUTION_OPTIONS.length ? (
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
      ) : null}

      {VISION_OPTIONS.length ? (
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
      ) : null}

      {RANGE_OPTIONS.length ? (
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
      ) : null}
    </aside>
  );
}
