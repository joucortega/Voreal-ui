"use client";

import { Checkbox } from "../../components/form";
import { cn } from "../../utilities/cn";
import type { DirectoryFilter } from "./types";

export type FilterPanelProps = {
  className?: string;
  filters: readonly DirectoryFilter[];
  label?: string;
  onValueChange: (value: string[]) => void;
  value: readonly string[];
};

export function FilterPanel({
  className,
  filters,
  label = "Filtros",
  onValueChange,
  value,
}: FilterPanelProps) {
  return (
    <fieldset className={cn("vr-filter-panel", className)}>
      <legend className="vr-filter-panel__legend">{label}</legend>
      <div className="vr-filter-panel__options">
        {filters.map((filter) => (
          <Checkbox
            checked={value.includes(filter.value)}
            disabled={filter.disabled}
            key={filter.value}
            label={filter.count === undefined ? filter.label : `${filter.label} (${filter.count})`}
            onCheckedChange={(checked) => {
              const next = checked === true
                ? [...value, filter.value]
                : value.filter((entry) => entry !== filter.value);
              onValueChange(Array.from(new Set(next)));
            }}
          />
        ))}
      </div>
    </fieldset>
  );
}
