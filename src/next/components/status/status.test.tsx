import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { expect, it, vi } from "vitest";
import { NextButton } from "../actions";
import { NextCheckbox, NextField, NextInput, NextSelect } from "../forms";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextBadge, NextTag } from "./status";
import "./status.css";

it("gives a removable filter an explicit action name", async () => {
  const user = userEvent.setup();
  const onRemove = vi.fn();
  renderNext(<NextTag onRemove={onRemove} removeLabel="Quitar filtro Restaurantes">Restaurantes</NextTag>);
  await user.click(screen.getByRole("button", { name: "Quitar filtro Restaurantes" }));
  expect(onRemove).toHaveBeenCalledOnce();
});

it("gives a tag remove action a shared 44px minimum target", () => {
  renderNext(<NextTag onRemove={() => undefined} removeLabel="Quitar filtro Restaurantes">Restaurantes</NextTag>);

  const action = screen.getByRole("button", { name: "Quitar filtro Restaurantes" });
  expect(getComputedStyle(action).minBlockSize).toBe("44px");
  expect(getComputedStyle(action).minInlineSize).toBe("44px");
});

it("centers the Lucide close icon inside the remove target", () => {
  renderNext(<NextTag onRemove={() => undefined} removeLabel="Quitar filtro Restaurantes">Restaurantes</NextTag>);

  const action = screen.getByRole("button", { name: "Quitar filtro Restaurantes" });
  expect(getComputedStyle(action).justifyContent).toBe("center");
  expect(action.querySelector("svg.vrn-icon")).toHaveAttribute("aria-hidden", "true");
});

it("has no detectable accessibility violations for Voreal Next controls", async () => {
  const { container } = renderNext(
    <form>
      <NextButton>Buscar</NextButton>
      <NextField hint="Ciudad o código postal" htmlFor="location" label="Ubicación">
        <NextInput id="location" />
      </NextField>
      <NextSelect aria-label="Ordenar">
        <option>Relevancia</option>
      </NextSelect>
      <NextCheckbox label="Verificados" />
      <NextTag onRemove={() => undefined} removeLabel="Quitar filtro Restaurantes">Restaurantes</NextTag>
      <NextBadge tone="success">Verificado</NextBadge>
    </form>,
  );
  const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});
