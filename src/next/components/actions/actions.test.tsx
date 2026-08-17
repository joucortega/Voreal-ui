import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Heart } from "../../icons";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextButton, NextIconButton } from "./actions";

it("disables a loading primary button without replacing its accessible name", () => {
  renderNext(<NextButton loading>Buscar</NextButton>);
  expect(screen.getByRole("button", { name: "Buscar" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Buscar" })).toHaveAttribute("aria-busy", "true");
});

it("requires a text label for an icon-only button", () => {
  renderNext(
    <NextIconButton label="Guardar en favoritos">
      <Heart />
    </NextIconButton>,
  );
  expect(screen.getByRole("button", { name: "Guardar en favoritos" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Guardar en favoritos" }).querySelector("svg")).toHaveClass("vrn-icon");
});
