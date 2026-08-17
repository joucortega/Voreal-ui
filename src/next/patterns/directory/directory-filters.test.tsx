import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ComponentProps } from "react";
import { axe } from "vitest-axe";
import { expect, it, vi } from "vitest";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextDirectoryFilterDrawer } from "./directory-filter-drawer";
import { NextDirectoryFilterPanel } from "./directory-filter-panel";
import type { NextDirectoryFilterValue } from "./directory.types";
import "./directory.css";

const categories = [
  { count: 86, label: "Restaurantes", value: "food" },
  { count: 42, label: "Impuestos", value: "tax" },
  { disabled: true, label: "Sin resultados", value: "empty" },
] as const;

const languages = [
  { count: 72, label: "Español", value: "es" },
  { count: 58, label: "Inglés", value: "en" },
] as const;

const initialValue: NextDirectoryFilterValue = {
  categories: [],
  languages: [],
  openNow: false,
  postalCode: "21202",
  radius: "25",
  verifiedOnly: false,
};

type PanelProps = ComponentProps<typeof NextDirectoryFilterPanel>;

function FilterPanelFixture({ onValueChange = () => undefined }: { onValueChange?: PanelProps["onValueChange"] }) {
  const [value, setValue] = useState(initialValue);

  return (
    <NextDirectoryFilterPanel
      categories={categories}
      languages={languages}
      onValueChange={(nextValue) => {
        setValue(nextValue);
        onValueChange(nextValue);
      }}
      value={value}
    />
  );
}

function FilterDrawerFixture({
  onApply,
  onClear,
  resultCount = 124,
}: Partial<Pick<ComponentProps<typeof NextDirectoryFilterDrawer>, "onApply" | "onClear" | "resultCount">>) {
  const [value, setValue] = useState(initialValue);

  return (
    <NextDirectoryFilterDrawer
      categories={categories}
      languages={languages}
      onApply={onApply}
      onClear={onClear}
      onValueChange={setValue}
      resultCount={resultCount}
      value={value}
    />
  );
}

it("updates one immutable filter value from the desktop panel", async () => {
  const user = userEvent.setup();
  const frozenValue = Object.freeze({ ...initialValue, categories: Object.freeze([] as string[]) });
  const onValueChange = vi.fn();
  renderNext(
    <NextDirectoryFilterPanel
      categories={categories}
      languages={languages}
      onValueChange={onValueChange}
      value={frozenValue}
    />,
  );

  await user.click(screen.getByRole("checkbox", { name: /Restaurantes/ }));

  expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ categories: ["food"] }));
  expect(frozenValue.categories).toEqual([]);
});

it("keeps each controlled field native, labelled, and independently editable", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  renderNext(<FilterPanelFixture onValueChange={onValueChange} />);

  expect(screen.getByRole("group", { name: "Categoría" })).toBeVisible();
  expect(screen.getByRole("group", { name: "Idioma" })).toBeVisible();
  expect(screen.getByRole("checkbox", { name: /Sin resultados/ })).toBeDisabled();

  await user.click(screen.getByRole("checkbox", { name: /Español/ }));
  expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ languages: ["es"] }));

  await user.clear(screen.getByRole("textbox", { name: "Código postal" }));
  await user.type(screen.getByRole("textbox", { name: "Código postal" }), "21224");
  expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ postalCode: "21224" }));

  await user.selectOptions(screen.getByRole("combobox", { name: "Distancia" }), "50");
  expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ radius: "50" }));

  await user.click(screen.getByRole("checkbox", { name: "Solo negocios verificados" }));
  expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ verifiedOnly: true }));

  await user.click(screen.getByRole("checkbox", { name: "Solo abiertos ahora" }));
  expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ openNow: true }));
});

it("renders the same filters visibly inside a portalled mobile drawer", async () => {
  const user = userEvent.setup();
  renderNext(<FilterDrawerFixture />);

  await user.click(screen.getByRole("button", { name: "Abrir filtros" }));

  const dialog = screen.getByRole("dialog", { name: "Filtros" });
  expect(dialog).toBeVisible();
  expect(dialog).toHaveAttribute("data-vrn-portal");
  expect(document.querySelector(".vrn-directory-filter-drawer__overlay")).toHaveAttribute("data-vrn-portal");
  expect(within(dialog).getByRole("group", { name: "Categoría" })).toBeVisible();
  expect(within(dialog).getByRole("combobox", { name: "Distancia" })).toBeVisible();
  expect(within(dialog).getByRole("option", { name: "25 millas" })).toBeVisible();
});

it("keeps the user-facing apply label concise", async () => {
  renderNext(<FilterDrawerFixture resultCount={124} />);
  await userEvent.click(screen.getByRole("button", { name: "Abrir filtros" }));

  expect(screen.getByRole("button", { name: "Ver 124 resultados" })).toBeVisible();
  expect(screen.queryByText(/payload|exception|diagnostic|stack/i)).not.toBeInTheDocument();
});

it("applies or clears from the sticky drawer footer and then closes", async () => {
  const user = userEvent.setup();
  const onApply = vi.fn();
  const onClear = vi.fn();
  renderNext(<FilterDrawerFixture onApply={onApply} onClear={onClear} />);

  const trigger = screen.getByRole("button", { name: "Abrir filtros" });
  await user.click(trigger);
  await user.click(screen.getByRole("button", { name: "Limpiar filtros" }));
  expect(onClear).toHaveBeenCalledOnce();
  expect(screen.getByRole("dialog", { name: "Filtros" })).toBeVisible();

  await user.click(screen.getByRole("button", { name: "Ver 124 resultados" }));
  expect(onApply).toHaveBeenCalledOnce();
  expect(screen.queryByRole("dialog", { name: "Filtros" })).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

it("closes on Escape, restores focus, and contains Tab focus while open", async () => {
  const user = userEvent.setup();
  renderNext(<FilterDrawerFixture />);
  const trigger = screen.getByRole("button", { name: "Abrir filtros" });

  await user.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "Filtros" });
  for (let index = 0; index < 12; index += 1) {
    await user.tab();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  }

  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog", { name: "Filtros" })).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

it("keeps drawer content scrollable with a sticky action footer", async () => {
  renderNext(<FilterDrawerFixture />);
  await userEvent.click(screen.getByRole("button", { name: "Abrir filtros" }));

  const dialog = screen.getByRole("dialog", { name: "Filtros" });
  const body = dialog.querySelector(".vrn-directory-filter-drawer__body");
  const footer = dialog.querySelector(".vrn-directory-filter-drawer__footer");
  expect(getComputedStyle(dialog).maxBlockSize).not.toBe("none");
  expect(getComputedStyle(body! as Element).overflowY).toBe("auto");
  expect(getComputedStyle(body! as Element).overscrollBehavior).toBe("contain");
  expect(getComputedStyle(footer! as Element).position).toBe("sticky");
});

it("Voreal Next filters have no detectable violations with the drawer open", async () => {
  renderNext(<FilterDrawerFixture />);
  await userEvent.click(screen.getByRole("button", { name: "Abrir filtros" }));

  const results = await axe(document.body, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});
