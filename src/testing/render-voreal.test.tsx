import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderVoreal } from "./render-voreal";

it("applies the selected Voreal theme and density", () => {
  renderVoreal(<button>Buscar</button>, {
    theme: "red-latina",
    density: "compact",
  });

  const root = screen.getByTestId("voreal-root");
  expect(root).toHaveAttribute("data-vr-theme", "red-latina");
  expect(root).toHaveAttribute("data-vr-density", "compact");
});
