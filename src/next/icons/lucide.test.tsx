import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Heart } from "./lucide";

it("renders official Lucide geometry with a decorative default", () => {
  render(<Heart data-testid="heart" />);

  const icon = screen.getByTestId("heart");
  expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
  expect(icon).toHaveAttribute("fill", "none");
  expect(icon).toHaveAttribute("stroke", "currentColor");
  expect(icon).toHaveAttribute("aria-hidden", "true");
  expect(icon.querySelector("path")).toHaveAttribute(
    "d",
    "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
  );
});

it("exposes a named icon to assistive technology when labelled", () => {
  render(<Heart label="Guardar en favoritos" />);

  expect(screen.getByRole("img", { name: "Guardar en favoritos" })).toBeVisible();
});

it("allows standard SVG props to override adapter defaults", () => {
  render(<Heart data-testid="custom-heart" strokeWidth={1} />);

  expect(screen.getByTestId("custom-heart")).toHaveAttribute("stroke-width", "1");
});
