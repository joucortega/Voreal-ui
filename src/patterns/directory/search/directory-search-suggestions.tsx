"use client";

import * as Popover from "@radix-ui/react-popover";
import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent } from "react";
import { Media } from "../../../components/content/media";
import { useVorealPortalProps } from "../../../primitives";
import { cn } from "../../../utilities/cn";
import { defaultDirectorySearchParamNames } from "./directory-search-state";
import type { DirectorySearchEvent, DirectorySearchNavigation, DirectorySearchParamNames, DirectorySuggestion, DirectorySuggestionGroup, DirectorySuggestionLoader } from "./directory-search.types";
import { useDirectorySuggestions } from "./use-directory-suggestions";

export type DirectorySearchSuggestionsProps = DirectorySearchNavigation & {
  "aria-label"?: string; className?: string; debounceMs?: number; defaultValue?: string; disabled?: boolean;
  emptyText?: string; errorText?: string; loadSuggestions: DirectorySuggestionLoader; loadingText?: string;
  minQueryLength?: number; name?: string; offlineText?: string; onSearchEvent?: (event: DirectorySearchEvent) => void;
  parameterNames?: Partial<DirectorySearchParamNames>; placeholder?: string;
};

type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const ownedCategoryControlAttribute = "data-vr-directory-suggestions-category";

function isFormControl(control: unknown): control is FormControl {
  return control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement;
}

function getNamedFormControl(form: HTMLFormElement | null | undefined, name: string): FormControl | undefined {
  if (!form) return undefined;
  const namedControl = form.elements.namedItem(name);
  if (isFormControl(namedControl)) return namedControl;
  for (const control of form.elements) {
    if (isFormControl(control) && control.name === name) return control;
  }
  return undefined;
}

function setNamedFormValue(form: HTMLFormElement | null | undefined, name: string, value: string): boolean {
  const control = getNamedFormControl(form, name);
  if (!control) return false;
  if (control instanceof HTMLInputElement && control.hasAttribute(ownedCategoryControlAttribute)) {
    control.disabled = false;
  }
  control.value = value;
  control.dispatchEvent(new Event("input", { bubbles: true }));
  control.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

export function DirectorySearchSuggestions({
  "aria-label": ariaLabel = "¿Qué buscas?", className, debounceMs, defaultValue = "", disabled,
  emptyText = "No encontramos coincidencias. Prueba otra palabra o ubicación",
  errorText = "Las sugerencias no están disponibles. Aún puedes buscar", loadSuggestions,
  loadingText = "Buscando sugerencias…", minQueryLength, name,
  offlineText = "No tienes conexión. Podrás buscar cuando vuelvas a conectarte", onNavigate,
  onSearchEvent, parameterNames, placeholder = "Tacos, abogado, salón…", LinkComponent,
}: DirectorySearchSuggestionsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId().replace(/:/g, "");
  const listboxId = `vr-directory-suggestions-${id}`;
  const names = useMemo(() => ({ ...defaultDirectorySearchParamNames, ...parameterNames }), [parameterNames]);
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [, setFormRevision] = useState(0);
  const portalProps = useVorealPortalProps();
  const formData = inputRef.current?.form ? new FormData(inputRef.current.form) : undefined;
  const request = { query, location: String(formData?.get(names.location) ?? ""), ...(String(formData?.get(names.category) ?? "") ? { category: String(formData?.get(names.category)) } : {}) };
  const { groups, status } = useDirectorySuggestions({ request, loadSuggestions, open: open && !disabled, debounceMs, minQueryLength, onSearchEvent });
  const flattened = useMemo(() => groups.flatMap((group) => group.items.map((suggestion) => ({ group, suggestion }))), [groups]);
  const active = activeIndex === null ? undefined : flattened[activeIndex];

  useEffect(() => { if (activeIndex !== null && activeIndex >= flattened.length) setActiveIndex(null); }, [activeIndex, flattened.length]);
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const handleSubmit = () => onSearchEvent?.({ type: "search_submitted", queryLength: query.trim().length, online: typeof navigator === "undefined" || navigator.onLine });
    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, [onSearchEvent, query]);
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const refreshRequest = () => setFormRevision((value) => value + 1);
    form.addEventListener("input", refreshRequest);
    form.addEventListener("change", refreshRequest);
    return () => { form.removeEventListener("input", refreshRequest); form.removeEventListener("change", refreshRequest); };
  }, []);
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form || form.elements.namedItem(names.category)) return;
    const categoryControl = document.createElement("input");
    categoryControl.disabled = true;
    categoryControl.name = names.category;
    categoryControl.setAttribute(ownedCategoryControlAttribute, "");
    categoryControl.type = "hidden";
    form.append(categoryControl);
    return () => categoryControl.remove();
  }, [names.category]);

  const optionId = (index: number) => `${listboxId}-option-${index}`;
  const close = () => { setOpen(false); setActiveIndex(null); };
  const select = (suggestion: DirectorySuggestion, source: "keyboard" | "pointer") => {
    const form = inputRef.current?.form;
    if (suggestion.type === "business" && suggestion.href) {
      if (onNavigate) onNavigate(suggestion.href); else if (source === "keyboard") window.location.assign(suggestion.href);
    } else if (suggestion.type === "category") {
      if (!setNamedFormValue(form, names.category, suggestion.id)) return;
    } else if (suggestion.type === "location") {
      if (!setNamedFormValue(form, names.location, suggestion.title)) return;
    } else return;
    onSearchEvent?.({ type: "suggestion_selected", suggestionId: suggestion.id, suggestionType: suggestion.type, source });
    close();
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => { setQuery(event.target.value); setActiveIndex(null); setOpen(true); };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") { if (open) { event.preventDefault(); close(); } return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!flattened.length) return;
      event.preventDefault(); setOpen(true);
      setActiveIndex((current) => event.key === "ArrowDown" ? ((current ?? -1) + 1) % flattened.length : ((current ?? 0) - 1 + flattened.length) % flattened.length);
    } else if (event.key === "Enter" && active) { event.preventDefault(); select(active.suggestion, "keyboard"); }
  };
  const statusText = status === "loading" ? loadingText : status === "empty" ? emptyText : status === "error" ? errorText : status === "offline" ? offlineText : status === "success" ? `${flattened.length} sugerencias disponibles` : "";
  const visible = open && (status !== "idle");

  return <Popover.Root open={visible} onOpenChange={(next) => { if (!next) close(); }}>
    <Popover.Anchor asChild><input aria-activedescendant={active ? optionId(activeIndex!) : undefined} aria-autocomplete="list" aria-controls={listboxId} aria-expanded={visible} aria-label={ariaLabel} autoComplete="off" className={cn("vr-input vr-directory-search__input vr-directory-suggestions__input", className)} disabled={disabled} name={name ?? names.query} onChange={handleChange} onFocus={() => { if (query.trim().length >= (minQueryLength ?? 2)) setOpen(true); }} onKeyDown={handleKeyDown} placeholder={placeholder} ref={inputRef} role="combobox" type="search" value={query} /></Popover.Anchor>
    <Popover.Portal><Popover.Content {...portalProps} align="start" className="vr-popover vr-directory-suggestions" collisionPadding={8} onOpenAutoFocus={(event) => event.preventDefault()} role="presentation" sideOffset={6}>
      <div aria-atomic="true" aria-live="polite" className="vr-directory-suggestions__status">{statusText}</div>
      <div aria-label="Sugerencias" id={listboxId} role="listbox">{status === "success" && groups.map((group) => <SuggestionGroup group={group} key={group.id} listboxId={listboxId} onSelect={select} optionId={optionId} activeIndex={activeIndex} flattened={flattened} LinkComponent={LinkComponent} onNavigate={onNavigate} />)}</div>
    </Popover.Content></Popover.Portal>
  </Popover.Root>;
}

function SuggestionGroup({ group, listboxId, onSelect, optionId, activeIndex, flattened, LinkComponent, onNavigate }: { group: DirectorySuggestionGroup; listboxId: string; onSelect: (item: DirectorySuggestion, source: "keyboard" | "pointer") => void; optionId: (index: number) => string; activeIndex: number | null; flattened: readonly { group: DirectorySuggestionGroup; suggestion: DirectorySuggestion }[]; LinkComponent?: DirectorySearchNavigation["LinkComponent"]; onNavigate?: DirectorySearchNavigation["onNavigate"] }) {
  const labelId = `${listboxId}-group-${group.id}`;
  return <div aria-labelledby={labelId} className="vr-directory-suggestions__group" role="group"><div className="vr-directory-suggestions__group-label" id={labelId}>{group.label}</div>{group.items.map((suggestion) => {
    const index = flattened.findIndex((entry) => entry.suggestion === suggestion);
    const selected = activeIndex === index;
    const content = <>
      {suggestion.image ? (
        <Media
          alt={suggestion.image.alt}
          aspectRatio="1 / 1"
          className="vr-directory-suggestions__image"
          fallback={suggestion.title.slice(0, 2).toLocaleUpperCase()}
          loading="lazy"
          src={suggestion.image.src}
        />
      ) : null}
      <span className="vr-directory-suggestions__option-content">
        <span className="vr-directory-suggestions__title">{suggestion.title}</span>
        {suggestion.description ? <span className="vr-directory-suggestions__description">{suggestion.description}</span> : null}
        {suggestion.metadata ? <span className="vr-directory-suggestions__metadata">{suggestion.metadata}</span> : null}
      </span>
    </>;
    const props = { "aria-selected": selected, className: "vr-directory-suggestions__option", "data-has-image": suggestion.image ? "true" : "false", id: optionId(index), onMouseDown: (event: MouseEvent) => event.preventDefault(), onClick: () => onSelect(suggestion, "pointer"), role: "option" as const };
    if (suggestion.type === "business" && suggestion.href) {
      const Link = LinkComponent ?? "a";
      return <Link {...props} href={suggestion.href} key={suggestion.id} onClick={(event: MouseEvent) => { if (onNavigate) event.preventDefault(); onSelect(suggestion, "pointer"); }}>{content}</Link>;
    }
    return <button {...props} key={suggestion.id} type="button">{content}</button>;
  })}</div>;
}
