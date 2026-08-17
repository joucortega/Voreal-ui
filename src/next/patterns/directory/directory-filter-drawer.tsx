"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { NextButton, NextIconButton } from "../../components/actions";
import { SlidersHorizontal, X } from "../../icons";
import { vorealNextPortalProps } from "../../root";
import { NextDirectoryFilterPanel } from "./directory-filter-panel";
import type { NextDirectoryFilterDrawerProps } from "./directory.types";

export function NextDirectoryFilterDrawer({
  categories,
  languages,
  onApply,
  onClear,
  onValueChange,
  resultCount,
  value,
}: NextDirectoryFilterDrawerProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <NextButton
          className="vrn-directory-filter-drawer__trigger"
          startIcon={<SlidersHorizontal />}
          variant="secondary"
        >
          Abrir filtros
        </NextButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay {...vorealNextPortalProps} className="vrn-directory-filter-drawer__overlay" />
        <Dialog.Content
          {...vorealNextPortalProps}
          aria-describedby={undefined}
          className="vrn-directory-filter-drawer__content"
        >
          <header className="vrn-directory-filter-drawer__header">
            <Dialog.Title className="vrn-directory-filter-drawer__title">Filtros</Dialog.Title>
            <Dialog.Close asChild>
              <NextIconButton label="Cerrar filtros" variant="ghost">
                <X />
              </NextIconButton>
            </Dialog.Close>
          </header>

          <div className="vrn-directory-filter-drawer__body">
            <NextDirectoryFilterPanel
              categories={categories}
              languages={languages}
              onValueChange={onValueChange}
              value={value}
            />
          </div>

          <footer className="vrn-directory-filter-drawer__footer">
            {onClear ? (
              <NextButton onClick={onClear} variant="ghost">Limpiar filtros</NextButton>
            ) : null}
            <Dialog.Close asChild>
              <NextButton className="vrn-directory-filter-drawer__apply" onClick={onApply}>
                Ver {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
              </NextButton>
            </Dialog.Close>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
