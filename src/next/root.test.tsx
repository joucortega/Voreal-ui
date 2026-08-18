import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VorealNextRoot, vorealNextPortalProps } from "./root";

describe("VorealNextRoot", () => {
  it("marks only its own subtree as Voreal Next", () => {
    render(<VorealNextRoot className="host-class">Contenido</VorealNextRoot>);
    const root = screen.getByText("Contenido");

    expect(root).toHaveAttribute("data-voreal-ui", "next");
    expect(root).toHaveClass("vrn-root", "host-class");
    expect(document.documentElement).not.toHaveAttribute("data-voreal-ui");
    expect(document.body).not.toHaveAttribute("data-voreal-ui");
  });

  it("provides a stable attribute for Radix portals", () => {
    expect(vorealNextPortalProps).toEqual({ "data-vrn-portal": "" });
  });

  it("exposes a theme name without mutating the document", () => {
    render(<VorealNextRoot theme="red-latina">Contenido</VorealNextRoot>);

    expect(screen.getByText("Contenido")).toHaveAttribute("data-vrn-theme", "red-latina");
    expect(document.documentElement).not.toHaveAttribute("data-vrn-theme");
    expect(document.body).not.toHaveAttribute("data-vrn-theme");
  });

  it("omits the theme attribute when no theme is provided", () => {
    render(<VorealNextRoot>Contenido</VorealNextRoot>);

    expect(screen.getByText("Contenido")).not.toHaveAttribute("data-vrn-theme");
  });
});
