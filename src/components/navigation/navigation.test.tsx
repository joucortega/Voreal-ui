import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { renderVoreal } from "../../testing/render-voreal";
import { Breadcrumbs } from "./breadcrumbs";
import { DropdownMenu } from "./dropdown-menu";
import { Pagination } from "./pagination";
import { Tabs } from "./tabs";

it("moves between tabs with arrow keys", async () => {
  const user = userEvent.setup();
  renderVoreal(
    <Tabs
      aria-label="Vista de resultados"
      defaultValue="list"
      items={[
        { content: "Resultados en lista", label: "Lista", value: "list" },
        { content: "Resultados en mapa", label: "Mapa", value: "map" },
      ]}
    />,
  );

  const listTab = screen.getByRole("tab", { name: "Lista" });
  listTab.focus();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Mapa" })).toHaveFocus();
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Resultados en mapa");
});

it("uses semantic breadcrumb navigation and marks the current page", () => {
  renderVoreal(
    <Breadcrumbs
      items={[
        { href: "/", label: "Inicio" },
        { href: "/negocios", label: "Negocios" },
        { label: "Sabor de Casa" },
      ]}
    />,
  );

  expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
  expect(screen.getByText("Sabor de Casa")).toHaveAttribute("aria-current", "page");
});

it("renders pagination as real links when URLs are available", () => {
  renderVoreal(<Pagination getHref={(page) => `/negocios?page=${page}`} page={2} totalPages={4} />);

  expect(screen.getByRole("link", { name: "Página anterior" })).toHaveAttribute("href", "/negocios?page=1");
  expect(screen.getByRole("link", { name: "Página 3" })).toHaveAttribute("href", "/negocios?page=3");
  expect(screen.getByText("2")).toHaveAttribute("aria-current", "page");
});

it("preserves keyboard selection in dropdown menus", async () => {
  const onSelect = vi.fn();
  const user = userEvent.setup();
  renderVoreal(
    <DropdownMenu
      items={[
        { label: "Editar", onSelect },
        { label: "Duplicar", onSelect: vi.fn() },
      ]}
      label="Acciones del negocio"
      trigger="Abrir acciones"
    />,
  );

  const trigger = screen.getByRole("button", { name: "Acciones del negocio" });
  trigger.focus();
  await user.keyboard("{Enter}");
  const firstItem = await screen.findByRole("menuitem", { name: "Editar" });
  expect(firstItem).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(onSelect).toHaveBeenCalledOnce();
});
