import { createRef, useState } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { expect, it, vi } from "vitest";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextRadioGroup, NextSwitch } from "./form-controls.client";
import {
  NextCheckbox,
  NextField,
  NextFormSummary,
  NextInput,
  NextInputGroup,
  NextSelect,
  NextTextarea,
} from "./forms";
import "./forms.css";

const rejectedRadioGroupAsChild = (
  // @ts-expect-error NextRadioGroup owns its Radix root anatomy and cannot delegate it with asChild.
  <NextRadioGroup asChild label="Visibility" name="visibility" options={[]} />
);
void rejectedRadioGroupAsChild;

const rejectedSwitchAsChild = (
  // @ts-expect-error NextSwitch owns its Radix root anatomy and cannot delegate it with asChild.
  <NextSwitch asChild label="Messages" />
);
void rejectedSwitchAsChild;

it("connects field error and hint text to the input", () => {
  renderNext(
    <NextField error="Escribe una ciudad" hint="Ciudad o código postal" htmlFor="city" label="Ubicación">
      <NextInput id="city" />
    </NextField>,
  );
  expect(screen.getByLabelText("Ubicación")).toHaveAccessibleDescription("Ciudad o código postal Escribe una ciudad");
  expect(screen.getByLabelText("Ubicación")).toHaveAttribute("aria-invalid", "true");
});

it("de-duplicates existing field descriptions while preserving their order", () => {
  renderNext(
    <NextField error="Escribe una ciudad" hint="Ciudad o código postal" htmlFor="city" label="Ubicación">
      <NextInput aria-describedby="external city-hint external city-error" />
    </NextField>,
  );

  expect(screen.getByLabelText("Ubicación")).toHaveAttribute("aria-describedby", "external city-hint city-error");
});

it("uses htmlFor as the control id when a child supplies a mismatched id", () => {
  renderNext(
    <NextField htmlFor="city" label="Ubicación">
      <NextInput id="location" />
    </NextField>,
  );

  expect(screen.getByLabelText("Ubicación")).toHaveAttribute("id", "city");
});

it("uses a real select and checkbox", () => {
  renderNext(
    <>
      <NextSelect aria-label="Ordenar">
        <option>Relevancia</option>
      </NextSelect>
      <NextCheckbox label="Verificados" count={31} />
    </>,
  );
  expect(screen.getByRole("combobox", { name: "Ordenar" })).toBeVisible();
  expect(screen.getByRole("checkbox", { name: /Verificados/ })).toBeVisible();
});

it("preserves native textarea attributes and exposes its element ref", () => {
  const ref = createRef<HTMLTextAreaElement>();
  renderNext(
    <NextField htmlFor="notes" label="Notas" required>
      <NextTextarea name="notes" ref={ref} rows={5} />
    </NextField>,
  );

  const textarea = screen.getByRole("textbox", { name: /Notas/ });
  expect(textarea).toHaveAttribute("name", "notes");
  expect(textarea).toHaveAttribute("rows", "5");
  expect(textarea).toBeRequired();
  expect(ref.current).toBe(textarea);
  expect(getComputedStyle(textarea).resize).toBe("vertical");
});

it("accepts a native textarea as its single field control", () => {
  renderNext(
    <NextField htmlFor="bio" label="Biografía">
      <textarea defaultValue="Comerciante local" />
    </NextField>,
  );

  expect(screen.getByRole("textbox", { name: "Biografía" })).toHaveValue("Comerciante local");
});

it("decorates an input without changing its native behavior", async () => {
  const user = userEvent.setup();
  const ref = createRef<HTMLInputElement>();
  renderNext(
    <NextInputGroup prefix="$" suffix="USD">
      <NextInput aria-label="Precio" defaultValue="25" name="price" ref={ref} />
    </NextInputGroup>,
  );

  const input = screen.getByRole("textbox", { name: "Precio" });
  await user.clear(input);
  await user.type(input, "40");
  expect(input).toHaveAttribute("name", "price");
  expect(input).toHaveValue("40");
  expect(ref.current).toBe(input);
  expect(screen.getByText("$")).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByText("USD")).toHaveAttribute("aria-hidden", "true");
  expect(getComputedStyle(screen.getByText("$")).pointerEvents).toBe("none");
});

it("forwards input group and form summary refs to their native containers", () => {
  const inputGroupRef = createRef<HTMLDivElement>();
  const summaryRef = createRef<HTMLDivElement>();
  renderNext(
    <>
      <NextInputGroup ref={inputGroupRef}>
        <NextInput aria-label="Precio" />
      </NextInputGroup>
      <NextFormSummary
        errors={[{ id: "price", message: "Escribe un precio" }]}
        ref={summaryRef}
        title="Corrige estos errores"
      />
    </>,
  );

  expect(inputGroupRef.current).toBeInstanceOf(HTMLDivElement);
  expect(inputGroupRef.current).toContainElement(screen.getByRole("textbox", { name: "Precio" }));
  expect(summaryRef.current).toBeInstanceOf(HTMLDivElement);
  expect(summaryRef.current).toContainElement(screen.getByRole("heading", { name: "Corrige estos errores" }));
});

it("forwards field and Radix composite root props, refs, and form attributes", () => {
  const fieldRef = createRef<HTMLDivElement>();
  const radioRef = createRef<HTMLDivElement>();
  const switchRef = createRef<HTMLButtonElement>();
  renderNext(
    <>
      <p id="choice-hint">Choose one option</p>
      <p id="switch-hint">Required preference</p>
      <form aria-label="Preferences" id="preferences" />
      <NextField className="profile-field" data-owner="profile" htmlFor="profile-name" label="Name" ref={fieldRef}>
        <NextInput />
      </NextField>
      <NextRadioGroup
        aria-describedby="choice-hint"
        className="profile-radio"
        data-owner="profile"
        defaultValue="public"
        form="preferences"
        label="Visibility"
        name="visibility"
        options={[{ label: "Public", value: "public" }]}
        ref={radioRef}
        required
      />
      <NextSwitch
        aria-describedby="switch-hint"
        className="profile-switch"
        data-owner="profile"
        defaultChecked
        form="preferences"
        label="Messages"
        name="messages"
        ref={switchRef}
        required
        value="yes"
      />
    </>,
  );

  const field = screen.getByLabelText("Name").closest(".vrn-field");
  const radio = screen.getByRole("radiogroup", { name: "Visibility" });
  const toggle = screen.getByRole("switch", { name: "Messages" });
  expect(fieldRef.current).toBe(field);
  expect(field).toHaveClass("vrn-field", "profile-field");
  expect(field).toHaveAttribute("data-owner", "profile");
  expect(radioRef.current).toBe(radio);
  expect(radio).toHaveClass("vrn-radio-group", "profile-radio");
  expect(radio).toHaveAttribute("aria-describedby", "choice-hint");
  expect(radio).toHaveAttribute("data-owner", "profile");
  expect(switchRef.current).toBe(toggle);
  expect(toggle).toHaveClass("vrn-switch", "profile-switch");
  expect(toggle).toHaveAttribute("aria-describedby", "switch-hint");
  expect(toggle).toHaveAttribute("data-owner", "profile");
  expect(toggle).toHaveAttribute("aria-required", "true");

  const data = new FormData(screen.getByRole<HTMLFormElement>("form", { name: "Preferences" }));
  expect(data.getAll("visibility")).toEqual(["public"]);
  expect(data.getAll("messages")).toEqual(["yes"]);
});

it("updates an uncontrolled radio group and reports the selected value", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  renderNext(
    <NextRadioGroup
      defaultValue="5"
      label="Distancia"
      name="radius"
      onValueChange={onValueChange}
      options={[
        { value: "5", label: "5 millas" },
        { value: "10", label: "10 millas", description: "Más resultados" },
      ]}
    />,
  );

  const tenMiles = screen.getByRole("radio", { name: "10 millas" });
  expect(tenMiles).toHaveAccessibleDescription("Más resultados");
  await user.click(screen.getByText("10 millas"));
  expect(tenMiles).toBeChecked();
  expect(onValueChange).toHaveBeenCalledWith("10");
});

it("supports a controlled radio group", async () => {
  const user = userEvent.setup();

  function ControlledRadioGroup() {
    const [value, setValue] = useState("5");
    return (
      <NextRadioGroup
        label="Distancia"
        name="radius"
        onValueChange={setValue}
        options={[
          { value: "5", label: "5 millas" },
          { value: "10", label: "10 millas" },
        ]}
        value={value}
      />
    );
  }

  renderNext(<ControlledRadioGroup />);
  await user.click(screen.getByRole("radio", { name: "10 millas" }));
  expect(screen.getByRole("radio", { name: "10 millas" })).toBeChecked();
  expect(screen.getByRole("radio", { name: "5 millas" })).not.toBeChecked();
});

it("gives a switch its label and reports checked changes", async () => {
  const user = userEvent.setup();
  const onCheckedChange = vi.fn();
  renderNext(<NextSwitch label="Abierto ahora" onCheckedChange={onCheckedChange} />);

  const control = screen.getByRole("switch", { name: "Abierto ahora" });
  await user.click(screen.getByText("Abierto ahora"));
  expect(control).toBeChecked();
  expect(onCheckedChange).toHaveBeenCalledWith(true);
});

it("gives custom choice controls a 44px minimum target", () => {
  renderNext(
    <>
      <NextRadioGroup label="Distancia" name="radius" options={[{ value: "10", label: "10 millas" }]} />
      <NextSwitch label="Abierto ahora" />
    </>,
  );

  const radioStyle = getComputedStyle(screen.getByRole("radio", { name: "10 millas" }));
  const switchStyle = getComputedStyle(screen.getByRole("switch", { name: "Abierto ahora" }));
  expect(radioStyle.minBlockSize).toBe("44px");
  expect(radioStyle.minInlineSize).toBe("44px");
  expect(switchStyle.minBlockSize).toBe("44px");
  expect(switchStyle.minInlineSize).toBe("48px");
});

it("renders a measurable switch track with a real border", () => {
  renderNext(<NextSwitch label="Abierto ahora" />);

  const control = screen.getByRole("switch", { name: "Abierto ahora" });
  const track = control.querySelector<HTMLElement>(".vrn-switch__track");
  expect(track).toBeInTheDocument();

  const trackStyle = getComputedStyle(track!);
  expect(trackStyle.blockSize).toBe("28px");
  expect(trackStyle.inlineSize).toBe("48px");
  expect(trackStyle.borderStyle).toBe("solid");
  expect(trackStyle.borderWidth).toBe("1px");
});

it("submits each named Radix control exactly once", async () => {
  const user = userEvent.setup();
  renderNext(
    <form aria-label="Filtros">
      <NextRadioGroup
        defaultValue="10"
        label="Distancia"
        name="radius"
        options={[
          { value: "5", label: "5 millas" },
          { value: "10", label: "10 millas" },
        ]}
      />
      <NextSwitch defaultChecked label="Abierto ahora" name="openNow" value="yes" />
    </form>,
  );

  const form = screen.getByRole<HTMLFormElement>("form", { name: "Filtros" });
  const data = new FormData(form);
  expect(data.getAll("radius")).toEqual(["10"]);
  expect(data.getAll("openNow")).toEqual(["yes"]);

  await user.click(screen.getByRole("switch", { name: "Abierto ahora" }));
  expect(new FormData(form).getAll("openNow")).toEqual([]);
});

it("links each form summary error to its field and opts into alerts explicitly", () => {
  const { rerender } = renderNext(
    <NextFormSummary
      errors={[
        { id: "city", message: "Escribe una ciudad" },
        { id: "category", message: "Elige una categoría", href: "/ayuda#category" },
      ]}
      title="Corrige estos errores"
    />,
  );

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Corrige estos errores" })).toBeVisible();
  expect(screen.getByRole("link", { name: "Escribe una ciudad" })).toHaveAttribute("href", "#city");
  expect(screen.getByRole("link", { name: "Elige una categoría" })).toHaveAttribute("href", "/ayuda#category");

  rerender(
    <NextFormSummary
      errors={[{ id: "city", message: "Escribe una ciudad" }]}
      role="alert"
      title="Corrige estos errores"
    />,
  );
  expect(screen.getByRole("alert")).toBeVisible();
});

it("gives the checkbox activation row a shared 44px minimum target", () => {
  renderNext(<NextCheckbox label="Verificados" />);

  expect(getComputedStyle(screen.getByRole("checkbox").closest("label")!).minBlockSize).toBe("44px");
});

it("has no detectable accessibility violations in the complete form family", async () => {
  const { container } = renderNext(
    <form>
      <NextField htmlFor="description" label="Descripción">
        <NextTextarea />
      </NextField>
      <NextInputGroup prefix="$" suffix="USD">
        <NextInput aria-label="Precio" />
      </NextInputGroup>
      <NextRadioGroup
        label="Distancia"
        name="radius"
        options={[
          { value: "5", label: "5 millas" },
          { value: "10", label: "10 millas" },
        ]}
      />
      <NextSwitch label="Abierto ahora" />
      <NextFormSummary
        errors={[{ id: "description", message: "Escribe una descripción" }]}
        title="Corrige estos errores"
      />
    </form>,
  );

  const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});
