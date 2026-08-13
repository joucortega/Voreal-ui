"use client";

import type { FormEvent } from "react";
import { Button } from "../../components/button";
import { Input } from "../../components/form";
import { cn } from "../../utilities/cn";
import type { DirectorySearchValue } from "./types";

export type DirectorySearchProps = {
  className?: string;
  locationLabel?: string;
  onChange: (value: DirectorySearchValue) => void;
  onSubmit?: (value: DirectorySearchValue) => void;
  queryLabel?: string;
  submitLabel?: string;
  value: DirectorySearchValue;
};

export function DirectorySearch({
  className,
  locationLabel = "¿Dónde?",
  onChange,
  onSubmit,
  queryLabel = "¿Qué buscas?",
  submitLabel = "Buscar",
  value,
}: DirectorySearchProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(value);
  }

  return (
    <form aria-label="Buscar en el directorio" className={cn("vr-directory-search", className)} onSubmit={submit} role="search">
      <label className="vr-directory-search__field">
        <span className="vr-directory-search__label">{queryLabel}</span>
        <Input
          aria-label={queryLabel}
          className="vr-directory-search__input"
          onChange={(event) => onChange({ ...value, query: event.target.value })}
          placeholder="Tacos, abogado, salón…"
          type="search"
          value={value.query}
        />
      </label>
      <span aria-hidden="true" className="vr-directory-search__divider" />
      <label className="vr-directory-search__field">
        <span className="vr-directory-search__label">{locationLabel}</span>
        <Input
          aria-label={locationLabel}
          className="vr-directory-search__input"
          onChange={(event) => onChange({ ...value, location: event.target.value })}
          placeholder="Ciudad o código postal"
          value={value.location}
        />
      </label>
      <Button className="vr-directory-search__submit" type="submit">{submitLabel}</Button>
    </form>
  );
}
