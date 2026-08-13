import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Container, Divider, Grid, Stack } from "./layout";
import "../primitives.css";

it("renders layout props as responsive structural behavior", () => {
  render(
    <Container data-testid="container" size="reading">
      <Stack data-testid="stack" gap="4">
        <Grid columns={2} data-testid="grid">
          <span>Uno</span>
          <span>Dos</span>
        </Grid>
        <Divider orientation="vertical" />
      </Stack>
    </Container>,
  );

  expect(screen.getByTestId("container")).toHaveAttribute("data-vr-size", "reading");
  expect(getComputedStyle(screen.getByTestId("stack")).display).toBe("flex");
  expect(getComputedStyle(screen.getByTestId("grid")).display).toBe("grid");
  expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
});
