"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useId, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useVorealPortalProps } from "../../primitives";
import { cn } from "../../utilities/cn";
import { useFieldControl } from "./field";

export type ComboboxItem = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type ComboboxProps = {
  "aria-label"?: string;
  className?: string;
  disabled?: boolean;
  emptyText?: string;
  id?: string;
  items: readonly ComboboxItem[];
  loading?: boolean;
  loadingText?: string;
  onQueryChange: (query: string) => void;
  onValueChange: (value: string) => void;
  placeholder?: string;
  query: string;
  statusText?: string;
  value?: string;
};

export function Combobox({
  "aria-label": ariaLabel,
  className,
  disabled = false,
  emptyText = "No hay resultados",
  id,
  items,
  loading = false,
  loadingText = "Buscando…",
  onQueryChange,
  onValueChange,
  placeholder = "Escribe para buscar",
  query,
  statusText,
  value,
}: ComboboxProps) {
  const reactId = useId().replaceAll(":", "");
  const listboxId = `vr-combobox-${reactId}-listbox`;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const portalProps = useVorealPortalProps();
  const fieldProps = useFieldControl({ id });
  const availableItems = items.filter((item) => !item.disabled);
  const activeItem = activeIndex >= 0 ? availableItems[activeIndex] : undefined;

  function selectItem(item: ComboboxItem) {
    if (item.disabled) return;
    onValueChange(item.value);
    onQueryChange(item.label);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onQueryChange(event.target.value);
    setOpen(true);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => Math.min(current + 1, availableItems.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => current <= 0 ? availableItems.length - 1 : current - 1);
    } else if (event.key === "Enter" && activeItem) {
      event.preventDefault();
      selectItem(activeItem);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const announcedStatus = loading
    ? loadingText
    : statusText ?? (items.length === 0 && query ? emptyText : "");

  return (
    <div className={cn("vr-combobox", className)}>
      <PopoverPrimitive.Root onOpenChange={setOpen} open={open}>
        <PopoverPrimitive.Anchor asChild>
          <span className="vr-combobox__anchor">
            <input
              {...fieldProps}
              aria-activedescendant={activeItem ? `${listboxId}-${activeItem.value}` : undefined}
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-expanded={open}
              aria-label={ariaLabel}
              autoComplete="off"
              className="vr-input vr-combobox__input"
              disabled={disabled}
              onChange={handleChange}
              onClick={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              role="combobox"
              value={query}
            />
            <span aria-hidden="true" className="vr-combobox__icon">⌄</span>
          </span>
        </PopoverPrimitive.Anchor>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            {...portalProps}
            align="start"
            className="vr-combobox-content"
            onCloseAutoFocus={(event) => event.preventDefault()}
            onOpenAutoFocus={(event) => event.preventDefault()}
            sideOffset={6}
          >
            <div aria-label="Resultados" className="vr-combobox__listbox" id={listboxId} role="listbox">
              {loading ? (
                <div className="vr-combobox__empty">{loadingText}</div>
              ) : items.length > 0 ? (
                items.map((item) => {
                  const optionIndex = availableItems.indexOf(item);
                  const active = optionIndex >= 0 && optionIndex === activeIndex;
                  return (
                    <div
                      aria-disabled={item.disabled || undefined}
                      aria-selected={item.value === value}
                      className="vr-combobox__option"
                      data-active={active ? "true" : undefined}
                      id={`${listboxId}-${item.value}`}
                      key={item.value}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => item.disabled ? undefined : setActiveIndex(optionIndex)}
                      onClick={() => selectItem(item)}
                      role="option"
                    >
                      <span>{item.label}</span>
                      {item.value === value ? <span aria-hidden="true">✓</span> : null}
                    </div>
                  );
                })
              ) : (
                <div className="vr-combobox__empty">{emptyText}</div>
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      <span aria-live="polite" className="vr-combobox__status" role="status">{announcedStatus}</span>
    </div>
  );
}
