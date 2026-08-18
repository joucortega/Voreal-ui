"use client";

import { useId, type ChangeEvent } from "react";
import { NextCheckbox, NextField, NextInput, NextSelect } from "../../components/forms";
import type {
  NextDirectoryFilterOption,
  NextDirectoryFilterPanelProps,
  NextDirectoryRadius,
} from "./directory.types";

const RADIUS_OPTIONS: readonly { label: string; value: NextDirectoryRadius }[] = [
  { label: "5 millas", value: "5" },
  { label: "10 millas", value: "10" },
  { label: "25 millas", value: "25" },
  { label: "50 millas", value: "50" },
];

function toggleSelection(values: readonly string[], option: string, checked: boolean): readonly string[] {
  if (checked) return values.includes(option) ? [...values] : [...values, option];
  return values.filter((value) => value !== option);
}

function isDirectoryRadius(value: string): value is NextDirectoryRadius {
  return value === "5" || value === "10" || value === "25" || value === "50";
}

type FilterOptionsProps = {
  idPrefix: string;
  legend: string;
  onChange: (values: readonly string[]) => void;
  options: readonly NextDirectoryFilterOption[];
  selected: readonly string[];
};

function FilterOptions({ idPrefix, legend, onChange, options, selected }: FilterOptionsProps) {
  return (
    <fieldset className="vrn-directory-filter-panel__group">
      <legend className="vrn-directory-filter-panel__legend">{legend}</legend>
      <div className="vrn-directory-filter-panel__options">
        {options.map((option) => (
          <NextCheckbox
            key={option.value}
            checked={selected.includes(option.value)}
            count={option.count}
            disabled={option.disabled}
            id={`${idPrefix}-${option.value}`}
            label={option.label}
            onChange={(event) => onChange(toggleSelection(selected, option.value, event.currentTarget.checked))}
          />
        ))}
      </div>
    </fieldset>
  );
}

export function NextDirectoryFilterPanel({
  categories,
  languages,
  onValueChange,
  value,
}: NextDirectoryFilterPanelProps) {
  const generatedId = useId();
  const idPrefix = `vrn-directory-filters-${generatedId}`;

  function updateRadius(event: ChangeEvent<HTMLSelectElement>) {
    if (isDirectoryRadius(event.currentTarget.value)) {
      onValueChange({ ...value, radius: event.currentTarget.value });
    }
  }

  return (
    <div className="vrn-directory-filter-panel">
      <h2 className="vrn-directory-filter-panel__title">Filtros</h2>

      <FilterOptions
        idPrefix={`${idPrefix}-category`}
        legend="Categoría"
        onChange={(categoriesValue) => onValueChange({ ...value, categories: categoriesValue })}
        options={categories}
        selected={value.categories}
      />

      <div className="vrn-directory-filter-panel__group">
        <h3 className="vrn-directory-filter-panel__legend">Ubicación</h3>
        <NextField htmlFor={`${idPrefix}-radius`} label="Distancia">
          <NextSelect onChange={updateRadius} value={value.radius}>
            {RADIUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </NextSelect>
        </NextField>
        <NextField htmlFor={`${idPrefix}-postal-code`} label="Código postal">
          <NextInput
            autoComplete="postal-code"
            inputMode="numeric"
            onChange={(event) => onValueChange({ ...value, postalCode: event.currentTarget.value })}
            value={value.postalCode}
          />
        </NextField>
      </div>

      <FilterOptions
        idPrefix={`${idPrefix}-language`}
        legend="Idioma"
        onChange={(languagesValue) => onValueChange({ ...value, languages: languagesValue })}
        options={languages}
        selected={value.languages}
      />

      <fieldset className="vrn-directory-filter-panel__group">
        <legend className="vrn-directory-filter-panel__legend">Disponibilidad</legend>
        <div className="vrn-directory-filter-panel__options">
          <NextCheckbox
            checked={value.verifiedOnly}
            id={`${idPrefix}-verified`}
            label="Solo negocios verificados"
            onChange={(event) => onValueChange({ ...value, verifiedOnly: event.currentTarget.checked })}
          />
          <NextCheckbox
            checked={value.openNow}
            id={`${idPrefix}-open-now`}
            label="Solo abiertos ahora"
            onChange={(event) => onValueChange({ ...value, openNow: event.currentTarget.checked })}
          />
        </div>
      </fieldset>
    </div>
  );
}
