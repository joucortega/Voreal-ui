import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { axe } from "vitest-axe";
import { expect, it, vi } from "vitest";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextDialog, NextDrawer } from "./index";
import "./overlays.css";

const Trigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { marker?: string }>(
  function Trigger({ className, marker = "preserved", ...props }, ref) {
    return (
      <button
        {...props}
        ref={ref}
        className={["consumer-trigger", className].filter(Boolean).join(" ")}
        data-marker={marker}
      >
        Abrir perfil
      </button>
    );
  },
);

it("opens from the cloned trigger and exposes its title and description", async () => {
  renderNext(
    <NextDialog
      description="Esta información será pública."
      title="Perfil"
      trigger={<Trigger />}
    >
      <label>
        Nombre
        <input />
      </label>
    </NextDialog>,
  );

  const trigger = screen.getByRole("button", { name: "Abrir perfil" });
  expect(trigger).toHaveClass("consumer-trigger");
  expect(trigger).toHaveAttribute("data-marker", "preserved");

  await userEvent.click(trigger);

  const dialog = screen.getByRole("dialog", { name: "Perfil" });
  expect(dialog).toHaveAccessibleDescription("Esta información será pública.");
  expect(within(dialog).getByRole("textbox", { name: "Nombre" })).toBeVisible();
});

it("keeps numeric zero as an accessible description", () => {
  renderNext(
    <NextDialog defaultOpen description={0} title="Conteo" trigger={<button>Abrir conteo</button>}>
      Contenido
    </NextDialog>,
  );

  expect(screen.getByRole("dialog", { name: "Conteo" })).toHaveAccessibleDescription("0");
});

it("keeps numeric zero visible in the footer", () => {
  renderNext(
    <NextDialog defaultOpen footer={0} title="Conteo" trigger={<button>Abrir conteo</button>}>
      Contenido
    </NextDialog>,
  );

  const dialog = screen.getByRole("dialog", { name: "Conteo" });
  const footer = dialog.querySelector(".vrn-dialog__footer");
  expect(footer).toBeVisible();
  expect(footer).toHaveTextContent("0");
});

it("closes on Escape and returns focus to the trigger", async () => {
  const user = userEvent.setup();
  renderNext(<NextDialog title="Perfil" trigger={<Trigger />}>Contenido</NextDialog>);
  const trigger = screen.getByRole("button", { name: "Abrir perfil" });

  await user.click(trigger);
  await user.keyboard("{Escape}");

  expect(screen.queryByRole("dialog", { name: "Perfil" })).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

it("supports default-open state and an accessible close control", async () => {
  renderNext(
    <NextDialog defaultOpen title="Perfil" trigger={<Trigger />}>
      Contenido
    </NextDialog>,
  );

  expect(screen.getByRole("dialog", { name: "Perfil" })).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "Cerrar perfil" }));
  expect(screen.queryByRole("dialog", { name: "Perfil" })).not.toBeInTheDocument();
});

it("honors controlled state and reports requested changes", async () => {
  const onOpenChange = vi.fn();
  const view = renderNext(
    <NextDialog onOpenChange={onOpenChange} open={false} title="Perfil" trigger={<Trigger />}>
      Contenido
    </NextDialog>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Abrir perfil" }));
  expect(onOpenChange).toHaveBeenLastCalledWith(true);
  expect(screen.queryByRole("dialog", { name: "Perfil" })).not.toBeInTheDocument();

  view.rerender(
    <div className="vrn-root" data-voreal-ui="next">
      <NextDialog onOpenChange={onOpenChange} open title="Perfil" trigger={<Trigger />}>
        Contenido
      </NextDialog>
    </div>,
  );
  expect(screen.getByRole("dialog", { name: "Perfil" })).toBeVisible();
});

it("themes one scoped portal and keeps its footer visible and body scrollable", async () => {
  renderNext(
    <NextDialog
      footer={<button>Guardar</button>}
      theme="noche"
      title="Perfil"
      trigger={<Trigger />}
    >
      Contenido largo
    </NextDialog>,
  );

  await userEvent.click(screen.getByRole("button", { name: "Abrir perfil" }));

  const portal = document.querySelector('[data-vrn-portal][data-vrn-theme="noche"]');
  const dialog = screen.getByRole("dialog", { name: "Perfil" });
  const body = dialog.querySelector(".vrn-dialog__body");
  expect(portal).toContainElement(dialog);
  expect(portal?.querySelectorAll(".vrn-dialog__overlay")).toHaveLength(1);
  expect(within(dialog).getByRole("button", { name: "Guardar" })).toBeVisible();
  expect(getComputedStyle(dialog).maxBlockSize).not.toBe("none");
  expect(getComputedStyle(body as Element).overflowY).toBe("auto");
  expect(getComputedStyle(body as Element).overscrollBehavior).toBe("contain");
});

it.each(["left", "right", "bottom"] as const)("places a drawer on the %s side", async (side) => {
  renderNext(
    <NextDrawer side={side} title={`Panel ${side}`} trigger={<button>{`Abrir ${side}`}</button>}>
      Contenido
    </NextDrawer>,
  );

  await userEvent.click(screen.getByRole("button", { name: `Abrir ${side}` }));

  expect(screen.getByRole("dialog", { name: `Panel ${side}` })).toHaveAttribute("data-side", side);
});

it("has no detectable accessibility violations with dialog content open", async () => {
  renderNext(
    <NextDrawer
      description="Selecciona una preferencia."
      footer={<button>Guardar</button>}
      title="Preferencias"
      trigger={<button>Abrir preferencias</button>}
    >
      <label>
        Idioma
        <select defaultValue="es">
          <option value="es">Español</option>
        </select>
      </label>
    </NextDrawer>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Abrir preferencias" }));

  const results = await axe(document.body, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});
