import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { expect, it, vi } from "vitest";
import { renderVoreal } from "../../testing/render-voreal";
import { AdSlot } from "./ad-slot";
import { BusinessCard } from "./business-card";
import { BusinessHours } from "./business-hours";
import { CategoryScroller } from "./category-scroller";
import { DirectorySearch } from "./directory-search";
import { FilterPanel } from "./filter-panel";
import type { BusinessSummary, DirectoryFilter, DirectorySearchValue } from "./types";

const business: BusinessSummary = {
  category: "Restaurante mexicano",
  href: "/negocios/sabor-de-casa",
  id: "sabor-de-casa",
  image: { alt: "Platos de Sabor de Casa", fallback: "SC", src: "/missing.jpg" },
  location: "Highlandtown · Baltimore",
  name: "Sabor de Casa",
  status: { label: "Abierto ahora", tone: "success" },
};

it("keeps status, name, category, location, and actions in every card variant", () => {
  for (const variant of ["vertical", "horizontal", "compact", "featured"] as const) {
    const { unmount } = renderVoreal(<BusinessCard business={business} variant={variant} />);
    expect(screen.getByRole("heading", { name: business.name })).toBeVisible();
    expect(screen.getByText(business.category)).toBeVisible();
    expect(screen.getByText(business.location)).toBeVisible();
    expect(screen.getByText("Abierto ahora")).toBeVisible();
    expect(screen.getByRole("link", { name: `Ver ${business.name}` })).toHaveAttribute("href", business.href);
    unmount();
  }
});

it("uses one serializable value for search entry", async () => {
  const onChange = vi.fn();
  const onSubmit = vi.fn();
  const user = userEvent.setup();
  const value: DirectorySearchValue = { location: "Baltimore, MD", query: "tacos" };
  renderVoreal(<DirectorySearch onChange={onChange} onSubmit={onSubmit} value={value} />);

  const query = screen.getByRole("searchbox", { name: "¿Qué buscas?" });
  fireEvent.change(query, { target: { value: "panadería" } });
  expect(onChange).toHaveBeenLastCalledWith({ location: "Baltimore, MD", query: "panadería" });
  await user.click(screen.getByRole("button", { name: "Buscar" }));
  expect(onSubmit).toHaveBeenCalledWith(value);
});

it("shares controlled category and filter values across presentations", async () => {
  const onCategoryChange = vi.fn();
  const onFilterChange = vi.fn();
  const user = userEvent.setup();
  const filters: DirectoryFilter[] = [
    { count: 12, label: "Abierto ahora", value: "open" },
    { count: 8, label: "Verificados", value: "verified" },
  ];

  renderVoreal(
    <div>
      <CategoryScroller
        categories={[{ label: "Todos", value: "all" }, { label: "Restaurantes", value: "food" }]}
        onValueChange={onCategoryChange}
        value="all"
      />
      <FilterPanel filters={filters} onValueChange={onFilterChange} value={["open"]} />
    </div>,
  );

  await user.click(screen.getByRole("radio", { name: "Restaurantes" }));
  expect(onCategoryChange).toHaveBeenCalledWith("food");
  await user.click(screen.getByRole("checkbox", { name: /Verificados/ }));
  expect(onFilterChange).toHaveBeenCalledWith(["open", "verified"]);
});

it("communicates closed days and labels sponsored content", () => {
  renderVoreal(
    <div>
      <BusinessHours
        days={[
          { day: "Lunes", hours: "9:00 a. m. – 8:00 p. m." },
          { closed: true, day: "Domingo" },
        ]}
      />
      <AdSlot advertiser="Mercado Sol" href="/anuncios/mercado-sol" title="Productos latinos cerca de ti" />
    </div>,
  );

  expect(screen.getByText("Cerrado")).toBeVisible();
  expect(screen.getByRole("complementary", { name: "Anuncio de Mercado Sol" })).toBeVisible();
  expect(screen.getByText("Patrocinado")).toBeVisible();
});

it("has no detectable accessibility violations in a directory result", async () => {
  const { container } = renderVoreal(<BusinessCard business={business} variant="featured" />);
  const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});
