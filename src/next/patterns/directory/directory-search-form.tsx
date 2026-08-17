import clsx from "clsx";
import { MapPin, Search } from "../../icons";
import type { NextDirectorySearchFormProps } from "./directory.types";

export function NextDirectorySearchForm({
  "aria-label": ariaLabel = "Buscar en el directorio",
  action,
  className,
  defaultValue,
  loading = false,
  locationLabel = "¿Dónde?",
  queryLabel = "¿Qué buscas?",
  submitLabel = "Buscar",
  ...props
}: NextDirectorySearchFormProps) {
  return (
    <form
      {...props}
      action={action}
      aria-label={ariaLabel}
      className={clsx("vrn-directory-search", className)}
      method="get"
      role="search"
    >
      <label className="vrn-directory-search__field">
        <span className="vrn-directory-search__label">{queryLabel}</span>
        <span className="vrn-directory-search__control">
          <Search aria-hidden="true" className="vrn-icon vrn-directory-search__icon" />
          <input
            className="vrn-directory-search__input"
            defaultValue={defaultValue.query}
            name="q"
            placeholder="Negocio, servicio o categoría"
            type="search"
          />
        </span>
      </label>
      <label className="vrn-directory-search__field vrn-directory-search__field--location">
        <span className="vrn-directory-search__label">{locationLabel}</span>
        <span className="vrn-directory-search__control">
          <MapPin aria-hidden="true" className="vrn-icon vrn-directory-search__icon" />
          <input
            className="vrn-directory-search__input"
            defaultValue={defaultValue.location}
            name="location"
            placeholder="Ciudad o código postal"
            type="text"
          />
        </span>
      </label>
      <button
        aria-busy={loading || undefined}
        className="vrn-directory-search__submit"
        disabled={loading}
        type="submit"
      >
        {submitLabel}
      </button>
    </form>
  );
}
