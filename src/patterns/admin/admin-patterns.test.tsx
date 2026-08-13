import { fireEvent, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { expect, it } from "vitest";
import { renderVoreal } from "../../testing/render-voreal";
import { ActivityHistory } from "./activity-history";
import { AdminReference } from "./admin-reference";
import { AdminShell } from "./admin-shell";
import { PublicationStatus } from "./publication-status";

it("exposes admin navigation and status without relying on color", () => {
  renderVoreal(<AdminReference />, { density: "compact", theme: "red-latina" });

  expect(screen.getByRole("navigation", { name: "Administración" })).toBeVisible();
  expect(screen.getAllByText("Publicado")[0]).toHaveAccessibleName(/estado publicado/i);
});

it("marks the current admin destination and keeps content discoverable", () => {
  renderVoreal(
    <AdminShell
      current="businesses"
      items={[
        { href: "/admin", label: "Resumen", value: "overview" },
        { href: "/admin/negocios", label: "Negocios", value: "businesses" },
      ]}
    >
      <h1>Directorio</h1>
    </AdminShell>,
  );

  expect(screen.getByRole("link", { name: "Negocios" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("heading", { name: "Directorio" })).toBeVisible();
});

it("labels status and activity chronology with text", () => {
  renderVoreal(
    <>
      <PublicationStatus status="draft" />
      <ActivityHistory
        items={[{ actor: "Ana Martínez", at: "Hoy, 10:24 a. m.", description: "Actualizó el teléfono", id: "1" }]}
      />
    </>,
  );

  expect(screen.getByText("Borrador")).toHaveAccessibleName("Estado borrador");
  expect(screen.getByRole("list", { name: "Historial de actividad" })).toBeVisible();
});

it("opens quick edit from the reference and has no detectable accessibility violations", async () => {
  const { container } = renderVoreal(<AdminReference />, { density: "compact", theme: "red-latina" });

  fireEvent.click(screen.getAllByRole("button", { name: /editar/i })[0]);
  expect(await screen.findByRole("dialog", { name: "Editar Sabor de Casa" })).toBeVisible();
  const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});
