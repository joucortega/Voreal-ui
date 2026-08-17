import { screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { expect, it } from "vitest";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextDirectoryFilterPanel } from "./directory-filter-panel";
import { NextDirectoryLayout, NextDirectoryCardGrid } from "./directory-layout";
import { NextDirectoryPagination } from "./directory-pagination";
import { NextDirectoryEmpty, NextDirectoryError, NextDirectoryLoading } from "./directory-states";
import type { VorealNextLinkProps } from "./directory.types";
import "./directory.css";

const emptyFilters = {
  categories: [] as const,
  languages: [] as const,
  openNow: false,
  postalCode: "",
  radius: "25" as const,
  verifiedOnly: false,
};

function TestLink({ href, ...props }: VorealNextLinkProps) {
  return <a {...props} data-test-link="true" href={href} />;
}

function cssForMediaCondition(document: Document, condition: string) {
  return Array.from(document.styleSheets)
    .flatMap((sheet) => Array.from(sheet.cssRules))
    .filter((rule) => rule.cssText.startsWith(`@media ${condition}`))
    .map((rule) => rule.cssText)
    .join(" ");
}

it("renders every slot in one predictable landmark structure", () => {
  renderNext(
    <NextDirectoryLayout
      filters={<span>Filtros desktop</span>}
      header={<header>Header</header>}
      resultsHeader={<section>Resumen</section>}
      search={<form aria-label="Buscar negocios" role="search" />}
    >
      <NextDirectoryCardGrid><article>Negocio</article></NextDirectoryCardGrid>
    </NextDirectoryLayout>,
  );

  const main = screen.getByRole("main");
  expect(main).toBeVisible();
  expect(main.querySelectorAll(".vrn-container")).toHaveLength(1);
  expect(screen.getByRole("search", { name: "Buscar negocios" })).toBeVisible();
  expect(screen.getByRole("complementary", { name: "Filtros" })).toContainElement(screen.getByText("Filtros desktop"));
  expect(screen.getByRole("region", { name: "Resultados" })).toContainElement(screen.getByText("Negocio"));
  expect(main).not.toContainElement(screen.getByText("Header"));
});

it("owns the only complementary landmark when it composes the filter panel", () => {
  renderNext(
    <NextDirectoryLayout
      filters={(
        <NextDirectoryFilterPanel
          categories={[]}
          languages={[]}
          onValueChange={() => undefined}
          value={emptyFilters}
        />
      )}
      header={<header>Header</header>}
      resultsHeader={<section>Resumen</section>}
      search={<form role="search" />}
    >
      <NextDirectoryCardGrid />
    </NextDirectoryLayout>,
  );

  expect(screen.getAllByRole("complementary")).toHaveLength(1);
  expect(screen.getByRole("complementary", { name: "Filtros" })).toContainElement(screen.getByRole("heading", { name: "Filtros" }));
});

it("uses a minmax grid and the approved responsive column breakpoints", () => {
  const { container } = renderNext(<NextDirectoryCardGrid data-testid="grid" />);
  const grid = screen.getByTestId("grid");

  expect(grid).toHaveClass("vrn-directory-card-grid");
  expect(getComputedStyle(grid).display).toBe("grid");
  expect(getComputedStyle(grid).gridTemplateColumns).toContain("minmax(0, 1fr)");
  expect(container.ownerDocument.styleSheets[0]).toBeDefined();

  const css = Array.from(container.ownerDocument.styleSheets)
    .flatMap((sheet) => Array.from(sheet.cssRules))
    .map((rule) => rule.cssText)
    .join(" ");
  expect(css).toMatch(/48rem/);
  expect(css).toMatch(/64rem/);
  expect(css).toMatch(/75rem/);
  expect(css).toMatch(/grid-template-columns: 16\.5rem minmax\(0, 1fr\)/);
  expect(css).toMatch(/repeat\(2, minmax\(0, 1fr\)\)/);
  expect(css).toMatch(/repeat\(3, minmax\(0, 1fr\)\)/);
});

it("lets compact control groups reflow when mobile text is enlarged", () => {
  const { container } = renderNext(<NextDirectoryCardGrid data-testid="grid" />);
  const mobileCss = cssForMediaCondition(container.ownerDocument, "(width < 48rem)");

  expect(mobileCss).toMatch(/\.vrn-directory-header__inner\s*\{[^}]*flex-wrap:\s*wrap/);
  expect(mobileCss).toMatch(/\.vrn-directory-results__toolbar\s*\{[^}]*flex-wrap:\s*wrap/);
  expect(mobileCss).toMatch(/\.vrn-directory-pagination__edges\s*\{[^}]*flex-wrap:\s*wrap/);
});

it("keeps the mobile results rhythm and pagination visually compact", () => {
  const { container } = renderNext(
    <NextDirectoryPagination currentPage={2} getPageHref={(page) => `/pagina/${page}`} pageCount={5} />,
  );
  const navigation = screen.getByRole("navigation", { name: "Paginación" });
  const mobileCss = cssForMediaCondition(container.ownerDocument, "(width < 48rem)");

  expect(getComputedStyle(navigation).display).toBe("flex");
  expect(getComputedStyle(navigation).justifyContent).toBe("center");
  expect(mobileCss).toMatch(/\.vrn-directory-results\s*\{[^}]*gap:\s*var\(--vrn-space-2\)/);
  expect(mobileCss).toMatch(/\.vrn-directory-results\s*\{[^}]*padding-block:\s*var\(--vrn-space-3\)/);
  expect(mobileCss).toMatch(/\.vrn-directory-results__filters-label,\s*\.vrn-directory-results__sort-label\s*\{[^}]*display:\s*none/);
});

it("uses crawlable page links, marks the current page and honors the link adapter", () => {
  renderNext(
    <NextDirectoryPagination
      currentPage={2}
      getPageHref={(page) => `/directorio?page=${page}`}
      LinkComponent={TestLink}
      pageCount={4}
    />,
  );

  const pageThree = screen.getByRole("link", { name: "Página 3" });
  expect(pageThree).toHaveAttribute("href", "/directorio?page=3");
  expect(pageThree).toHaveAttribute("data-test-link", "true");
  expect(screen.getByRole("link", { name: "Página 2" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("navigation", { name: "Paginación" })).toBeVisible();
  expect(screen.getByText("Anterior")).toBeVisible();
  expect(screen.getByText("Siguiente")).toBeVisible();
  expect(screen.getByRole("link", { name: "Primera página" }).querySelectorAll("svg")).toHaveLength(2);
  expect(screen.getByRole("link", { name: "Última página" }).querySelectorAll("svg")).toHaveLength(2);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

it.each([
  [0, 1],
  [-12, 1],
  [Number.NaN, 1],
  [Number.NEGATIVE_INFINITY, 1],
  [99, 5],
  [Number.POSITIVE_INFINITY, 1],
  [Number.MAX_VALUE, 5],
] as const)("clamps current page %s to %s", (currentPage, expectedPage) => {
  renderNext(
    <NextDirectoryPagination
      currentPage={currentPage}
      getPageHref={(page) => `/pagina/${page}`}
      pageCount={5}
    />,
  );

  expect(screen.getByRole("link", { name: `Página ${expectedPage}` })).toHaveAttribute("aria-current", "page");
});

it.each([
  Number.NaN,
  Number.NEGATIVE_INFINITY,
  Number.POSITIVE_INFINITY,
  -1,
  0,
  1,
] as const)("hides pagination for invalid or non-paginated page count %s", (pageCount) => {
  renderNext(
    <NextDirectoryPagination currentPage={1} getPageHref={(page) => `/pagina/${page}`} pageCount={pageCount} />,
  );

  expect(screen.queryByRole("navigation", { name: "Paginación" })).not.toBeInTheDocument();
});

it("caps unsafe finite page counts before neighbor arithmetic", () => {
  const destinations: number[] = [];
  renderNext(
    <NextDirectoryPagination
      currentPage={Number.MAX_VALUE}
      getPageHref={(page) => {
        destinations.push(page);
        return `/pagina/${page}`;
      }}
      pageCount={Number.MAX_VALUE}
    />,
  );

  const current = screen.getByRole("link", { name: "Página 10000" });
  const previous = screen.getByRole("link", { name: "Página anterior" });
  expect(current).toHaveAttribute("aria-current", "page");
  expect(previous).toHaveAttribute("href", "/pagina/9999");
  expect(previous.getAttribute("href")).not.toBe(current.getAttribute("href"));
  expect(destinations).toContain(9999);
  expect(destinations).toContain(10000);
  expect(destinations.every((page) => Number.isSafeInteger(page) && page >= 1 && page <= 10000)).toBe(true);
});

it("renders edge navigation without ellipsis controls and hides a single page", () => {
  const { rerender } = renderNext(
    <NextDirectoryPagination currentPage={5} getPageHref={(page) => `/pagina/${page}`} pageCount={10} />,
  );

  const navigation = screen.getByRole("navigation", { name: "Paginación" });
  expect(within(navigation).getByRole("link", { name: "Primera página" })).toHaveAttribute("href", "/pagina/1");
  expect(within(navigation).getByRole("link", { name: "Página anterior" })).toHaveAttribute("href", "/pagina/4");
  expect(within(navigation).getByRole("link", { name: "Página siguiente" })).toHaveAttribute("href", "/pagina/6");
  expect(within(navigation).getByRole("link", { name: "Última página" })).toHaveAttribute("href", "/pagina/10");
  expect(within(navigation).queryByRole("button")).not.toBeInTheDocument();

  rerender(
    <div data-voreal-ui="next">
      <NextDirectoryPagination currentPage={1} getPageHref={(page) => `/pagina/${page}`} pageCount={1} />
    </div>,
  );
  expect(screen.queryByRole("navigation", { name: "Paginación" })).not.toBeInTheDocument();
});

it("renders six stable 3:2 skeleton cards with the business card anatomy", () => {
  const { container } = renderNext(<NextDirectoryLoading />);

  expect(screen.getByRole("status", { name: "Cargando negocios" })).toBeVisible();
  const skeletons = container.querySelectorAll(".vrn-directory-card--skeleton");
  expect(skeletons).toHaveLength(6);
  for (const skeleton of skeletons) {
    expect(skeleton.querySelector(".vrn-directory-card__media")).toBeInTheDocument();
    expect(getComputedStyle(skeleton.querySelector(".vrn-directory-card__media")!)).toHaveProperty("aspect-ratio", "3 / 2");
    expect(skeleton.querySelector(".vrn-directory-card__category")).toBeInTheDocument();
    expect(skeleton.querySelector(".vrn-directory-card__name")).toBeInTheDocument();
    expect(skeleton.querySelector(".vrn-directory-card__description")).toBeInTheDocument();
    expect(skeleton.querySelector(".vrn-directory-card__location")).toBeInTheDocument();
    expect(skeleton.querySelector(".vrn-directory-card__facts")).toBeInTheDocument();
    expect(skeleton.querySelector(".vrn-directory-card__cta")).toBeInTheDocument();
  }
});

it("supports an explicit loading count without producing an invalid negative count", () => {
  const { container, rerender } = renderNext(<NextDirectoryLoading count={2} />);
  expect(container.querySelectorAll(".vrn-directory-card--skeleton")).toHaveLength(2);

  rerender(<div data-voreal-ui="next"><NextDirectoryLoading count={-4} /></div>);
  expect(container.querySelectorAll(".vrn-directory-card--skeleton")).toHaveLength(0);
});

it.each([
  Number.NaN,
  Number.NEGATIVE_INFINITY,
  Number.POSITIVE_INFINITY,
  -1,
] as const)("normalizes invalid skeleton count %s without throwing", (count) => {
  const { container } = renderNext(<NextDirectoryLoading count={count} />);
  expect(container.querySelectorAll(".vrn-directory-card--skeleton")).toHaveLength(0);
});

it("caps a huge finite skeleton count before allocating card nodes", () => {
  const { container } = renderNext(<NextDirectoryLoading count={Number.MAX_VALUE} />);
  expect(container.querySelectorAll(".vrn-directory-card--skeleton")).toHaveLength(24);
});

it("shows concise recoverable states and only the supplied public action", () => {
  const { rerender } = renderNext(
    <NextDirectoryEmpty
      action={<button>Limpiar filtros</button>}
      description="Prueba otra categoría o distancia."
      title="No encontramos negocios"
    />,
  );
  expect(screen.getByRole("heading", { name: "No encontramos negocios" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Limpiar filtros" })).toBeVisible();

  rerender(
    <div data-voreal-ui="next">
      <NextDirectoryError action={<button>Intentar de nuevo</button>} />
    </div>,
  );
  expect(screen.getByText("No pudimos cargar los negocios.")).toBeVisible();
  expect(screen.getByRole("button", { name: "Intentar de nuevo" })).toBeVisible();
  expect(screen.queryByText(/stack|exception|500|payload|diagnostic/i)).not.toBeInTheDocument();
});

it("Voreal Next directory states wrap long text and have no detectable accessibility violations", async () => {
  const longText = "ContenidoMuyLargoSinSeparadores".repeat(4);
  const { container } = renderNext(
    <>
      <NextDirectoryEmpty description={longText} title={longText} />
      <NextDirectoryError description="Vuelve a intentarlo." title="Algo salió mal" />
    </>,
  );

  for (const element of container.querySelectorAll(".vrn-directory-state__title, .vrn-directory-state__description")) {
    expect(getComputedStyle(element).overflowWrap).toBe("anywhere");
  }
  const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});
