import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NextCaption, NextHeading, NextText } from "./typography";

describe("Voreal Next typography foundations", () => {
  it("renders NextHeading with the requested element and size", () => {
    render(
      <NextHeading as="h3" size="card">
        Título
      </NextHeading>,
    );

    const heading = screen.getByRole("heading", { level: 3, name: "Título" });
    expect(heading).toHaveClass("vrn-heading");
    expect(heading).toHaveAttribute("data-size", "card");
  });

  it("renders NextText with the requested element and tone", () => {
    render(
      <NextText as="span" tone="muted">
        Texto
      </NextText>,
    );

    const text = screen.getByText("Texto");
    expect(text.tagName).toBe("SPAN");
    expect(text).toHaveAttribute("data-tone", "muted");
  });

  it("renders NextCaption as a span", () => {
    render(<NextCaption>Nota</NextCaption>);

    expect(screen.getByText("Nota")).toHaveClass("vrn-caption");
    expect(screen.getByText("Nota").tagName).toBe("SPAN");
  });
});
