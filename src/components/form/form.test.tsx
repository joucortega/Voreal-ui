import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { expect, it, vi } from "vitest";
import { renderVoreal } from "../../testing/render-voreal";
import { Checkbox } from "./checkbox";
import { Combobox } from "./combobox";
import { Field } from "./field";
import { FileUpload } from "./file-upload";
import { Input } from "./input";
import { RadioGroup } from "./radio-group";
import { Select } from "./select";
import { Switch } from "./switch";

it("associates label, help, and error with a native control", () => {
  renderVoreal(
    <Field error="Campo obligatorio" hint="Nombre público" label="Nombre" required>
      <Input name="name" />
    </Field>,
  );

  const input = screen.getByRole("textbox", { name: /Nombre/ });
  expect(input).toBeRequired();
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input.getAttribute("aria-describedby")).toContain("hint");
  expect(input.getAttribute("aria-describedby")).toContain("error");
});

it("supports keyboard selection in Select", async () => {
  const onValueChange = vi.fn();
  const user = userEvent.setup();
  renderVoreal(
    <Field label="Categoría">
      <Select
        onValueChange={onValueChange}
        options={[
          { label: "Restaurantes", value: "food" },
          { label: "Servicios legales", value: "legal" },
        ]}
        placeholder="Selecciona una categoría"
      />
    </Field>,
  );

  const trigger = screen.getByRole("combobox", { name: "Categoría" });
  await user.click(trigger);
  await user.keyboard("{ArrowDown}{Enter}");
  expect(onValueChange).toHaveBeenCalledWith("legal");
});

it("moves through Combobox results and exposes async status", async () => {
  const onValueChange = vi.fn();
  const onQueryChange = vi.fn();
  const user = userEvent.setup();
  renderVoreal(
    <Field label="Ciudad">
      <Combobox
        items={[
          { label: "Baltimore, Maryland", value: "baltimore" },
          { label: "Towson, Maryland", value: "towson" },
        ]}
        onQueryChange={onQueryChange}
        onValueChange={onValueChange}
        query="Bal"
        statusText="2 ciudades encontradas"
      />
    </Field>,
  );

  const input = screen.getByRole("combobox", { name: "Ciudad" });
  expect(screen.getByRole("status")).toHaveTextContent("2 ciudades encontradas");
  await user.click(input);
  await user.keyboard("{ArrowDown}{Enter}");
  expect(onValueChange).toHaveBeenCalledWith("baltimore");
  expect(onQueryChange).toHaveBeenCalledWith("Baltimore, Maryland");
});

it("labels Checkbox, RadioGroup, and Switch without relying on color", async () => {
  const user = userEvent.setup();
  renderVoreal(
    <div>
      <Checkbox label="Abierto ahora" />
      <RadioGroup
        aria-label="Tipo de negocio"
        options={[
          { label: "Restaurante", value: "restaurant" },
          { label: "Profesional", value: "professional" },
        ]}
      />
      <Switch label="Recibir mensajes" />
    </div>,
  );

  await user.click(screen.getByRole("checkbox", { name: "Abierto ahora" }));
  expect(screen.getByRole("checkbox", { name: "Abierto ahora" })).toBeChecked();
  await user.click(screen.getByRole("radio", { name: "Profesional" }));
  expect(screen.getByRole("radio", { name: "Profesional" })).toBeChecked();
  await user.click(screen.getByRole("switch", { name: "Recibir mensajes" }));
  expect(screen.getByRole("switch", { name: "Recibir mensajes" })).toBeChecked();
});

it("validates FileUpload locally without starting a transfer", async () => {
  const onAcceptedFiles = vi.fn();
  const onRejectedFiles = vi.fn();
  const user = userEvent.setup();
  renderVoreal(
    <FileUpload
      accept="image/png"
      label="Logo del negocio"
      maxSize={8}
      onAcceptedFiles={onAcceptedFiles}
      onRejectedFiles={onRejectedFiles}
    />,
  );

  const input = screen.getByLabelText("Logo del negocio");
  const accepted = new File(["small"], "logo.png", { type: "image/png" });
  const rejected = new File(["too-large"], "photo.jpg", { type: "image/jpeg" });
  fireEvent.change(input, { target: { files: [accepted, rejected] } });

  expect(onAcceptedFiles).toHaveBeenCalledWith([accepted]);
  expect(onRejectedFiles).toHaveBeenCalledWith([
    expect.objectContaining({ file: rejected, reasons: ["type", "size"] }),
  ]);
});

it("has no detectable accessibility violations in a representative form", async () => {
  const { container } = renderVoreal(
    <form>
      <Field hint="Así aparecerá en el directorio" label="Nombre del negocio">
        <Input />
      </Field>
      <Checkbox label="Acepto los términos" />
      <Switch label="Perfil visible" />
    </form>,
  );

  const results = await axe(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  expect(results.violations).toEqual([]);
});
