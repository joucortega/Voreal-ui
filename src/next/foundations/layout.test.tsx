import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import {
  NextCluster,
  NextContainer,
  NextDivider,
  NextGrid,
  NextSection,
  NextStack,
  NextSurface,
} from "./layout";

describe("Voreal Next layout foundations", () => {
  it("keeps caller classes on NextContainer", () => {
    render(<NextContainer className="caller-class">Contenido</NextContainer>);

    expect(screen.getByText("Contenido")).toHaveClass("vrn-container", "caller-class");
  });

  it("serializes a closed spacing token on NextStack", () => {
    render(<NextStack gap="3">Contenido</NextStack>);

    expect(screen.getByText("Contenido")).toHaveAttribute("data-gap", "3");
  });

  it("serializes a closed column token on NextGrid", () => {
    render(<NextGrid columns={3}>Contenido</NextGrid>);

    expect(screen.getByText("Contenido")).toHaveAttribute("data-columns", "3");
  });

  it("renders NextDivider as an hr", () => {
    render(<NextDivider data-testid="divider" />);

    expect(screen.getByTestId("divider").tagName).toBe("HR");
  });

  it("serializes alignment and justification on NextCluster", () => {
    render(
      <NextCluster align="center" justify="between">
        Contenido
      </NextCluster>,
    );

    expect(screen.getByText("Contenido")).toHaveAttribute("data-align", "center");
    expect(screen.getByText("Contenido")).toHaveAttribute("data-justify", "between");
  });

  it("exposes a surface's selected tone and padding to its consumer", () => {
    render(
      <NextSurface tone="raised" padding="md">
        Panel
      </NextSurface>,
    );

    expect(screen.getByText("Panel")).toHaveAttribute("data-tone", "raised");
    expect(screen.getByText("Panel")).toHaveAttribute("data-padding", "md");
  });

  it("renders NextSection with its requested semantic element", () => {
    render(<NextSection as="div">Contenido de la sección</NextSection>);

    expect(screen.getByText("Contenido de la sección").tagName).toBe("DIV");
  });

  it("forwards a surface ref to its rendered div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<NextSurface ref={ref}>Panel</NextSurface>);

    expect(ref.current).toBe(screen.getByText("Panel"));
  });

  it("forwards a section ref to its requested semantic element", () => {
    const ref = createRef<HTMLElement>();
    render(<NextSection as="div" ref={ref}>Contenido de la sección</NextSection>);

    expect(ref.current).toBe(screen.getByText("Contenido de la sección"));
  });
});
