import { NextButton } from "../../components/actions";
import { NextDialogClose, NextDrawer } from "../../components/overlays";
import { SlidersHorizontal } from "../../icons";
import { NextDirectoryFilterPanel } from "./directory-filter-panel";
import type { NextDirectoryFilterDrawerProps } from "./directory.types";

export function NextDirectoryFilterDrawer({
  categories,
  languages,
  onApply,
  onClear,
  onValueChange,
  resultCount,
  theme,
  value,
}: NextDirectoryFilterDrawerProps) {
  return (
    <NextDrawer
      footer={
        <>
          {onClear ? (
            <NextButton onClick={onClear} variant="ghost">Limpiar filtros</NextButton>
          ) : null}
          <NextDialogClose>
            <NextButton className="vrn-directory-filter-drawer__apply" onClick={onApply}>
              Ver {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
            </NextButton>
          </NextDialogClose>
        </>
      }
      side="bottom"
      theme={theme}
      title="Filtros"
      trigger={
        <NextButton
          className="vrn-directory-filter-drawer__trigger"
          startIcon={<SlidersHorizontal />}
          variant="secondary"
        >
          Abrir filtros
        </NextButton>
      }
    >
      <NextDirectoryFilterPanel
        categories={categories}
        languages={languages}
        onValueChange={onValueChange}
        value={value}
      />
    </NextDrawer>
  );
}
