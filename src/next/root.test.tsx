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
});
