import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { expect, it, vi } from "vitest";
import { renderVoreal } from "../../testing/render-voreal";
import { Button, ButtonGroup, IconButton } from "./button";

it("blocks activation and announces a loading button", async () => {
  const onClick = vi.fn();
  const user = userEvent.setup();

  renderVoreal(
    <Button loading onClick={onClick}>
      Guardar
    </Button>,
  );

  const button = screen.getByRole("button", { name: "Guardar" });
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute("aria-busy", "true");
  await user.click(button);
  expect(onClick).not.toHaveBeenCalled();
});

it("defaults to a non-submitting native button", async () => {
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  const user = userEvent.setup();

  renderVoreal(
    <form onSubmit={onSubmit}>
      <Button>Vista previa</Button>
    </form>,
  );

  const button = screen.getByRole("button", { name: "Vista previa" });
  expect(button).toHaveAttribute("type", "button");
  await user.click(button);
  expect(onSubmit).not.toHaveBeenCalled();
});

it("gives icon actions and grouped actions explicit accessible names", async () => {
  const { container } = renderVoreal(
    <ButtonGroup label="Acciones del negocio">
      <IconButton label="Editar negocio">✎</IconButton>
      <IconButton label="Eliminar negocio">×</IconButton>
    </ButtonGroup>,
  );

  expect(screen.getByRole("group", { name: "Acciones del negocio" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Editar negocio" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Eliminar negocio" })).toBeVisible();
  const results = await axe(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  expect(results.violations).toEqual([]);
});
