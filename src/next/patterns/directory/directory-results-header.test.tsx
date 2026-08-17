import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextDirectoryResultsHeader } from "./directory-results-header";
import "./directory.css";

it("announces result count and exposes concise filter actions", async () => {
  const user = userEvent.setup();
  const remove = vi.fn();
  const clear = vi.fn();
  renderNext(
    <NextDirectoryResultsHeader
      activeFilters={[{ id: "food", label: "Restaurantes" }]}
      locationLabel="Baltimore, MD"
      onClearAll={clear}
      onRemoveFilter={remove}
      resultCount={124}
      sort="relevance"
    />,
  );

  expect(screen.getByRole("heading", { name: "Negocios en Baltimore, MD" })).toBeVisible();
  expect(screen.getByText("124 resultados")).toHaveAttribute("aria-live", "polite");
  await user.click(screen.getByRole("button", { name: "Quitar filtro Restaurantes" }));
  expect(remove).toHaveBeenCalledWith("food");
  await user.click(screen.getByRole("button", { name: "Limpiar todos los filtros" }));
  expect(clear).toHaveBeenCalledOnce();
});

it("uses the active query as the concise results heading", () => {
  renderNext(
    <NextDirectoryResultsHeader
      activeFilters={[]}
      locationLabel="Baltimore, MD"
      queryLabel="Contabilidad"
      resultCount={1}
      sort="relevance"
    />,
  );

  expect(screen.getByRole("heading", { name: "Contabilidad en Baltimore, MD" })).toBeVisible();
  expect(screen.getByText("1 resultado")).toHaveAttribute("aria-live", "polite");
  expect(screen.queryByText("Filtros activos:")).not.toBeInTheDocument();
});

it("emits only a supported directory sort value", async () => {
  const user = userEvent.setup();
  const onSortChange = vi.fn();
  renderNext(
    <NextDirectoryResultsHeader
      activeFilters={[]}
      locationLabel="Baltimore, MD"
      onSortChange={onSortChange}
      resultCount={86}
      sort="relevance"
    />,
  );

  await user.selectOptions(screen.getByRole("combobox", { name: "Ordenar resultados" }), "rating");
  expect(onSortChange).toHaveBeenCalledWith("rating");
});

it("keeps optional mobile filtering beside sorting in one compact toolbar", () => {
  renderNext(
    <NextDirectoryResultsHeader
      activeFilters={[]}
      locationLabel="Baltimore, MD"
      mobileFilterTrigger={<button type="button">Mostrar filtros</button>}
      resultCount={86}
      sort="distance"
    />,
  );

  const sort = screen.getByRole("combobox", { name: "Ordenar resultados" });
  const filter = screen.getByRole("button", { hidden: true, name: "Mostrar filtros" });
  const toolbar = screen.getByRole("toolbar", { name: "Controles de resultados" });
  expect(toolbar).toContainElement(sort);
  expect(toolbar).toContainElement(filter);
  expect(toolbar).toHaveClass("vrn-directory-results__toolbar");
});

it("allows long result headings to wrap instead of widening the page", () => {
  renderNext(
    <NextDirectoryResultsHeader
      activeFilters={[]}
      locationLabel="Un vecindario de Baltimore con un nombre excepcionalmente largo"
      queryLabel="Servicios profesionales y comunitarios"
      resultCount={12}
      sort="relevance"
    />,
  );

  const heading = screen.getByRole("heading");
  expect(getComputedStyle(heading.parentElement!).minInlineSize).toBe("0px");
  expect(getComputedStyle(heading).overflowWrap).toBe("anywhere");
});

it("labels each results region independently when more than one is rendered", () => {
  renderNext(
    <>
      <NextDirectoryResultsHeader activeFilters={[]} locationLabel="Baltimore, MD" resultCount={86} sort="relevance" />
      <NextDirectoryResultsHeader activeFilters={[]} locationLabel="Silver Spring, MD" resultCount={42} sort="rating" />
    </>,
  );

  expect(screen.getByRole("region", { name: "Negocios en Baltimore, MD" })).toBeVisible();
  expect(screen.getByRole("region", { name: "Negocios en Silver Spring, MD" })).toBeVisible();
});
