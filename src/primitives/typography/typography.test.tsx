import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Caption, Heading, Text } from "./typography";

it("uses semantic elements for headings, body text, and captions", () => {
  render(
    <>
      <Heading level={2}>Negocios</Heading>
      <Text tone="muted">Resultados cerca de ti</Text>
      <Caption>Actualizado hoy</Caption>
    </>,
  );

  expect(screen.getByRole("heading", { level: 2, name: "Negocios" })).toBeVisible();
  expect(screen.getByText("Resultados cerca de ti").tagName).toBe("P");
  expect(screen.getByText("Actualizado hoy").tagName).toBe("SPAN");
});
