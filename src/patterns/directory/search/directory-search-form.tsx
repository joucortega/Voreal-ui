import type { FormHTMLAttributes, ReactNode } from "react";
import { Button } from "../../../components/button/button";
import { cn } from "../../../utilities/cn";
import { defaultDirectorySearchParamNames, normalizeDirectorySearchValue } from "./directory-search-state";
import type { DirectorySearchParamNames, DirectorySearchState } from "./directory-search.types";

export type DirectorySearchFormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "children" | "defaultValue" | "method"> & {
  categoryControl?: ReactNode;
  children?: ReactNode;
  defaultValue?: Partial<DirectorySearchState>;
  locationLabel?: string;
  locationPlaceholder?: string;
  parameterNames?: Partial<DirectorySearchParamNames>;
  queryControl?: ReactNode;
  queryLabel?: string;
  queryPlaceholder?: string;
  searchLabel?: string;
  sortControl?: ReactNode;
  submitLabel?: string;
};

export function DirectorySearchForm({
  action,
  categoryControl,
  children,
  className,
  defaultValue,
  locationLabel = "¿Dónde?",
  locationPlaceholder = "Ciudad o código postal",
  parameterNames,
  queryControl,
  queryLabel = "¿Qué buscas?",
  queryPlaceholder = "Tacos, abogado, salón…",
  searchLabel = "Buscar en el directorio",
  sortControl,
  submitLabel = "Buscar",
  ...props
}: DirectorySearchFormProps) {
  const names = { ...defaultDirectorySearchParamNames, ...parameterNames };
  const value = normalizeDirectorySearchValue({ query: "", location: "", page: 1, ...defaultValue });

  return (
    <form {...props} action={action} aria-label={searchLabel} className={cn("vr-directory-search", className)} method="get" role="search">
      <label className="vr-directory-search__field">
        <span className="vr-directory-search__label">{queryLabel}</span>
        {queryControl ?? <input aria-label={queryLabel} className="vr-input vr-directory-search__input" defaultValue={value.query} name={names.query} placeholder={queryPlaceholder} type="search" />}
      </label>
      <span aria-hidden="true" className="vr-directory-search__divider" />
      <label className="vr-directory-search__field">
        <span className="vr-directory-search__label">{locationLabel}</span>
        <input aria-label={locationLabel} className="vr-input vr-directory-search__input" defaultValue={value.location} name={names.location} placeholder={locationPlaceholder} />
      </label>
      {categoryControl ?? (value.category ? <input defaultValue={value.category} hidden name={names.category} /> : null)}
      {sortControl ?? (value.sort && value.sort !== "relevance" ? <input name={names.sort} type="hidden" value={value.sort} /> : null)}
      <input name={names.page} type="hidden" value="1" />
      {children}
      <Button className="vr-directory-search__submit" type="submit">{submitLabel}</Button>
    </form>
  );
}
