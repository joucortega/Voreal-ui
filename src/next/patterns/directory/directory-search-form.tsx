import clsx from "clsx";
import { MapPin, Search } from "../../icons";
import type { NextDirectorySearchFormProps } from "./directory.types";

export function NextDirectorySearchForm({
  "aria-label": ariaLabel = "Buscar en el directorio",
  action,
  className,
  defaultValue,
  fieldIdPrefix,
  loading = false,
  locationTrailingAction,
  locationLabel = "¿Dónde?",
  queryTrailingAction,
  queryLabel = "¿Qué buscas?",
  submitLabel = "Buscar",
  ...props
}: NextDirectorySearchFormProps) {
  const queryId = `${fieldIdPrefix}-query`;
  const locationId = `${fieldIdPrefix}-location`;

  return (
    <form
      {...props}
      action={action}
      aria-label={ariaLabel}
      className={clsx("vrn-directory-search", className)}
      method="get"
      role="search"
    >
      <div className="vrn-directory-search__field">
        <label className="vrn-directory-search__label" htmlFor={queryId}>{queryLabel}</label>
        <span className="vrn-directory-search__control">
          <Search aria-hidden="true" className="vrn-icon vrn-directory-search__icon" />
          <input
            className="vrn-directory-search__input"
            defaultValue={defaultValue.query}
            id={queryId}
            name="q"
            placeholder="Negocio, servicio o categoría"
            type="search"
          />
          {queryTrailingAction ? <span className="vrn-directory-search__trailing">{queryTrailingAction}</span> : null}
        </span>
      </div>
      <div className="vrn-directory-search__field vrn-directory-search__field--location">
        <label className="vrn-directory-search__label" htmlFor={locationId}>{locationLabel}</label>
        <span className="vrn-directory-search__control">
          <MapPin aria-hidden="true" className="vrn-icon vrn-directory-search__icon" />
          <input
            className="vrn-directory-search__input"
            defaultValue={defaultValue.location}
            id={locationId}
            name="location"
            placeholder="Ciudad o código postal"
            type="text"
          />
          {locationTrailingAction ? <span className="vrn-directory-search__trailing">{locationTrailingAction}</span> : null}
        </span>
      </div>
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
