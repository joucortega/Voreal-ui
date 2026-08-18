"use client";

import type { ChangeEvent } from "react";
import { NextSelect } from "../../components/forms";
import { NextTag } from "../../components/status";
import type { NextDirectoryResultsHeaderProps, NextDirectorySort } from "./directory.types";

const SORT_LABELS: Record<NextDirectorySort, string> = {
  relevance: "Más relevantes",
  rating: "Mejor calificados",
  distance: "Más cercanos",
  newest: "Más recientes",
};

function isDirectorySort(value: string): value is NextDirectorySort {
  return value === "relevance" || value === "rating" || value === "distance" || value === "newest";
}

export function NextDirectoryResultsHeader({
  activeFilters,
  locationLabel,
  mobileFilterTrigger,
  onClearAll,
  onRemoveFilter,
  onSortChange,
  queryLabel,
  resultCount,
  sort,
}: NextDirectoryResultsHeaderProps) {
  const heading = `${queryLabel || "Negocios"} en ${locationLabel}`;

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.currentTarget.value;
    if (isDirectorySort(value)) onSortChange?.(value);
  }

  return (
    <section aria-label={heading} className="vrn-directory-results">
      <div className="vrn-directory-results__summary">
        <h2 className="vrn-directory-results__heading">{heading}</h2>
        <span aria-live="polite" className="vrn-directory-results__count">
          {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
        </span>
      </div>

      {activeFilters.length > 0 ? (
        <div className="vrn-directory-results__filters">
          <span className="vrn-directory-results__filters-label">Filtros activos:</span>
          <div className="vrn-directory-results__tags">
            {activeFilters.map((filter) => (
              <NextTag
                key={filter.id}
                onRemove={onRemoveFilter ? () => onRemoveFilter(filter.id) : undefined}
                removeLabel={`Quitar filtro ${filter.label}`}
              >
                {filter.label}
              </NextTag>
            ))}
          </div>
          {onClearAll ? (
            <button
              aria-label="Limpiar todos los filtros"
              className="vrn-directory-results__clear"
              onClick={onClearAll}
              type="button"
            >
              Limpiar todo
            </button>
          ) : null}
        </div>
      ) : null}

      <div aria-label="Controles de resultados" className="vrn-directory-results__toolbar" role="toolbar">
        {mobileFilterTrigger ? <div className="vrn-directory-results__mobile-filter">{mobileFilterTrigger}</div> : null}
        <label className="vrn-directory-results__sort">
          <span className="vrn-directory-results__sort-label">Ordenar por</span>
          <NextSelect aria-label="Ordenar resultados" onChange={handleSortChange} value={sort}>
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </NextSelect>
        </label>
      </div>
    </section>
  );
}
