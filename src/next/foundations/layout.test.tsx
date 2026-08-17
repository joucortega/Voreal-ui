import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NextCluster, NextContainer, NextDivider, NextGrid, NextStack } from "./layout";

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
});
