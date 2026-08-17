import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { expect, it } from "vitest";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextDirectoryHeader, type VorealNextLinkProps } from "./directory-header";

const navigation = [
  { href: "/para-negocios", label: "Para negocios" },
  { href: "/recursos", label: "Recursos" },
  { href: "/favoritos", label: "Favoritos" },
] as const;

function TestLink({ href, ...props }: VorealNextLinkProps) {
  return <a {...props} data-test-link="true" href={href} />;
}

function HeaderFixture() {
  return (
    <NextDirectoryHeader
      accountLabel="Mi cuenta"
      brand={<span>voreal</span>}
      descriptor="Directorio de negocios latinos"
      LinkComponent={TestLink}
      navItems={navigation}
      primaryAction={{ href: "/listar", label: "Listar mi negocio" }}
    />
  );
}

it("renders injected links and the complete approved navigation", () => {
  renderNext(<HeaderFixture />);

  expect(screen.getByRole("banner")).toBeVisible();
  expect(screen.getByRole("link", { name: "Listar mi negocio" })).toHaveAttribute("data-test-link", "true");
  expect(screen.getByText("Directorio de negocios latinos")).toBeVisible();
  expect(screen.getByText("Mi cuenta")).toBeVisible();
  for (const item of navigation) {
    expect(screen.getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
  }
  expect(within(screen.getByRole("navigation", { name: "Navegación principal" })).getAllByRole("link").map((link) => link.textContent)).toEqual([
    "Para negocios",
    "Listar mi negocio",
    "Recursos",
    "Favoritos",
  ]);
});

it("uses native anchors by default", () => {
  renderNext(
    <NextDirectoryHeader
      brand={<span>voreal</span>}
      navItems={navigation}
      primaryAction={{ href: "/listar", label: "Listar mi negocio" }}
    />,
  );

  expect(screen.getByRole("link", { name: "Listar mi negocio" }).tagName).toBe("A");
});

it("opens a labelled mobile menu with the same links and restores focus when it closes", async () => {
  const user = userEvent.setup();
  renderNext(<HeaderFixture />);
  const trigger = screen.getByRole("button", { name: "Abrir navegación" });

  await user.click(trigger);

  const dialog = screen.getByRole("dialog", { name: "Navegación" });
  expect(dialog).toBeVisible();
  for (const item of navigation) {
    expect(within(dialog).getByRole("link", { name: item.label })).toHaveAttribute("href", item.href);
  }

  await user.click(screen.getByRole("button", { name: "Cerrar navegación" }));
  expect(trigger).toHaveFocus();
});

it("has no detectable accessibility violations for Voreal Next header with its menu open", async () => {
  const user = userEvent.setup();
  renderNext(<HeaderFixture />);

  await user.click(screen.getByRole("button", { name: "Abrir navegación" }));

  const results = await axe(document.body, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});

it("keeps tall mobile navigation scrollable without chaining to the locked page", async () => {
  await import("./directory.css");
  const longNavigation = Array.from({ length: 30 }, (_, index) => ({
    href: `/enlace-${index + 1}`,
    label: `Enlace ${index + 1}`,
  }));
  renderNext(
    <NextDirectoryHeader
      brand={<span>voreal</span>}
      navItems={longNavigation}
      primaryAction={{ href: "/listar", label: "Listar mi negocio" }}
    />,
  );

  fireEvent.click(screen.getByRole("button", { hidden: true, name: "Abrir navegación" }));

  const dialog = screen.getByRole("dialog", { name: "Navegación" });
  expect(within(dialog).getByRole("link", { name: "Enlace 30" })).toBeVisible();
  expect(getComputedStyle(dialog).overflowY).toBe("auto");
  expect(getComputedStyle(dialog).overscrollBehavior).toBe("contain");
});
