import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { expect, it, vi } from "vitest";
import { renderVoreal } from "../../testing/render-voreal";
import {
  ActionRail,
  LinkedCta,
  PathButton,
  RelayButton,
  SplitBridge,
} from "./signature-actions";

const railItems = [
  { value: "list", label: "Lista" },
  { value: "map", label: "Mapa" },
  { value: "grid", label: "Cuadrícula" },
];

it("changes ActionRail selection with arrow keys", async () => {
  const onValueChange = vi.fn();
  const user = userEvent.setup();

  renderVoreal(
    <ActionRail
      defaultValue="list"
      items={railItems}
      label="Vista de resultados"
      onValueChange={onValueChange}
    />,
  );

  await user.tab();
  expect(screen.getByRole("radio", { name: "Lista" })).toHaveFocus();
  await user.keyboard("{ArrowRight}");

  expect(screen.getByRole("radio", { name: "Mapa" })).toBeChecked();
  expect(onValueChange).toHaveBeenLastCalledWith("map");
});

it("keeps SplitBridge actions independently operable", async () => {
  const onPrimary = vi.fn();
  const onSecondary = vi.fn();
  const user = userEvent.setup();

  renderVoreal(
    <SplitBridge
      primary={{ label: "Ver perfil", onClick: onPrimary }}
      secondary={{ label: "Cómo llegar", onClick: onSecondary }}
    />,
  );

  await user.click(screen.getByRole("button", { name: "Ver perfil" }));
  await user.click(screen.getByRole("button", { name: "Cómo llegar" }));
  expect(onPrimary).toHaveBeenCalledOnce();
  expect(onSecondary).toHaveBeenCalledOnce();
});

it("exposes RelayButton status without creating a second action", () => {
  renderVoreal(<RelayButton status="12 negocios abiertos">Explorar ahora</RelayButton>);

  expect(screen.getAllByRole("button")).toHaveLength(1);
  expect(screen.getByRole("button", { name: "Explorar ahora" })).toBeVisible();
  expect(screen.getByText("12 negocios abiertos")).toHaveAttribute("role", "status");
});

it("preserves LinkedCta reading order and signature actions remain accessible", async () => {
  const { container } = renderVoreal(
    <LinkedCta
      action={<PathButton destination="Directorio">Descubrir negocios</PathButton>}
      description="Encuentra servicios latinos cerca de ti."
      eyebrow="Tu comunidad"
      title="Todo comienza cerca"
    />,
  );

  const text = container.textContent ?? "";
  expect(text.indexOf("Tu comunidad")).toBeLessThan(text.indexOf("Todo comienza cerca"));
  expect(text.indexOf("Todo comienza cerca")).toBeLessThan(
    text.indexOf("Encuentra servicios latinos cerca de ti."),
  );
  expect(text.indexOf("Encuentra servicios latinos cerca de ti.")).toBeLessThan(
    text.indexOf("Descubrir negocios"),
  );
  const results = await axe(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  expect(results.violations).toEqual([]);
});
