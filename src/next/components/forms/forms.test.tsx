import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextCheckbox, NextField, NextInput, NextSelect } from "./forms";
import "./forms.css";

it("connects field error and hint text to the input", () => {
  renderNext(
    <NextField error="Escribe una ciudad" hint="Ciudad o código postal" htmlFor="city" label="Ubicación">
      <NextInput id="city" />
    </NextField>,
  );
  expect(screen.getByLabelText("Ubicación")).toHaveAccessibleDescription("Ciudad o código postal Escribe una ciudad");
  expect(screen.getByLabelText("Ubicación")).toHaveAttribute("aria-invalid", "true");
});

it("uses htmlFor as the control id when a child supplies a mismatched id", () => {
  renderNext(
    <NextField htmlFor="city" label="Ubicación">
      <NextInput id="location" />
    </NextField>,
  );

  expect(screen.getByLabelText("Ubicación")).toHaveAttribute("id", "city");
});

it("uses a real select and checkbox", () => {
  renderNext(
    <>
      <NextSelect aria-label="Ordenar">
        <option>Relevancia</option>
      </NextSelect>
      <NextCheckbox label="Verificados" count={31} />
    </>,
  );
  expect(screen.getByRole("combobox", { name: "Ordenar" })).toBeVisible();
  expect(screen.getByRole("checkbox", { name: /Verificados/ })).toBeVisible();
});

it("gives the checkbox activation row a shared 44px minimum target", () => {
  renderNext(<NextCheckbox label="Verificados" />);

  expect(getComputedStyle(screen.getByRole("checkbox").closest("label")!).minBlockSize).toBe("44px");
});
