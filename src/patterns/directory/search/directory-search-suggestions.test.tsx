import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { useState } from "react";
import { expect, it, vi } from "vitest";
import { renderVoreal } from "../../../testing/render-voreal";
import { DirectorySearchForm } from "./directory-search-form";
import { DirectorySearchSuggestions } from "./directory-search-suggestions";
import type { DirectorySearchParamNames, DirectorySearchState, DirectorySuggestionLoader } from "./directory-search.types";

const suggestions = [
  { id: "businesses", label: "Negocios", items: [{ id: "sabor", type: "business" as const, title: "Sabor de Casa", href: "/negocios/sabor" }] },
  { id: "categories", label: "Categorías", items: [{ id: "food", type: "category" as const, title: "Restaurantes" }] },
  { id: "locations", label: "Ubicaciones", items: [{ id: "centro", type: "location" as const, title: "Centro" }] },
];

const serviceSuggestions = [
  { id: "categories", label: "Categorías", items: [{ id: "services", type: "category" as const, title: "Servicios" }] },
];

function renderSearchFixture(props: Partial<React.ComponentProps<typeof DirectorySearchSuggestions>> = {}) {
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  return {
    onSubmit,
    ...renderVoreal(<form onSubmit={onSubmit}><DirectorySearchSuggestions loadSuggestions={vi.fn().mockResolvedValue(suggestions)} {...props} /><input name="location" type="hidden" /><input name="category" type="hidden" /><input name="page" type="hidden" value="1" readOnly /><button type="submit">Buscar</button></form>),
  };
}

function renderActualSearchForm({
  defaultValue,
  parameterNames,
}: {
  defaultValue?: Partial<DirectorySearchState>;
  parameterNames?: Partial<DirectorySearchParamNames>;
} = {}) {
  return renderVoreal(
    <DirectorySearchForm
      action="/directorio"
      defaultValue={defaultValue}
      parameterNames={parameterNames}
      queryControl={(
        <DirectorySearchSuggestions
          debounceMs={0}
          loadSuggestions={async () => suggestions}
          parameterNames={parameterNames}
        />
      )}
    />,
  );
}

function RerenderingActualSearchForm() {
  const [revision, setRevision] = useState(0);
  return <>
    <button onClick={() => setRevision((value) => value + 1)} type="button">Actualizar contenido relacionado</button>
    <output aria-label="Revisión relacionada">{revision}</output>
    <DirectorySearchForm
      action="/directorio"
      defaultValue={{ query: "", location: "Baltimore", category: "food", page: 1 }}
      queryControl={(
        <DirectorySearchSuggestions
          debounceMs={0}
          loadSuggestions={async () => serviceSuggestions}
        />
      )}
    />
  </>;
}

it("selects grouped suggestions with the keyboard and keeps plain Enter for form submit", async () => {
  const user = userEvent.setup(); const onNavigate = vi.fn(); const onSearchEvent = vi.fn();
  renderSearchFixture({ debounceMs: 0, onNavigate, onSearchEvent });
  const input = screen.getByRole("combobox", { name: "¿Qué buscas?" });
  await user.type(input, "ta");
  await screen.findByRole("option", { name: /Sabor de Casa/ });
  expect(screen.getByRole("group", { name: "Negocios" })).toBeVisible();
  await user.keyboard("{ArrowDown}{Enter}");
  expect(onNavigate).toHaveBeenCalledWith("/negocios/sabor");
  expect(onSearchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: "suggestion_selected", suggestionType: "business", source: "keyboard" }));
});

it("updates the nearest category or location form control on selection", async () => {
  const user = userEvent.setup(); renderSearchFixture({ debounceMs: 0 });
  await user.type(screen.getByRole("combobox"), "ta");
  await screen.findByRole("option", { name: "Restaurantes" });
  await user.click(screen.getByRole("option", { name: "Restaurantes" }));
  expect((document.querySelector('[name="category"]') as HTMLInputElement).value).toBe("food");
  await user.clear(screen.getByRole("combobox")); await user.type(screen.getByRole("combobox"), "ta");
  await screen.findByRole("option", { name: "Centro" }); await user.click(screen.getByRole("option", { name: "Centro" }));
  expect((document.querySelector('[name="location"]') as HTMLInputElement).value).toBe("Centro");
});

it("creates one successful category control in the actual form composition", async () => {
  const user = userEvent.setup();
  renderActualSearchForm();
  const form = screen.getByRole("search") as HTMLFormElement;

  const ownedCategory = form.querySelector('input[type="hidden"][name="category"]');
  expect(ownedCategory).toBeDisabled();
  expect(new FormData(form).getAll("category")).toEqual([]);
  await user.type(screen.getByRole("combobox"), "ta");
  await user.click(await screen.findByRole("option", { name: "Restaurantes" }));

  expect(new FormData(form).getAll("category")).toEqual(["food"]);
});

it("uses a custom category parameter name when it owns the missing control", async () => {
  const user = userEvent.setup();
  const parameterNames = { query: "search", category: "topic" };
  renderActualSearchForm({ parameterNames });
  const form = screen.getByRole("search") as HTMLFormElement;

  await user.type(screen.getByRole("combobox"), "ta");
  await user.click(await screen.findByRole("option", { name: "Restaurantes" }));

  expect(screen.getByRole("combobox")).toHaveAttribute("name", "search");
  expect(new FormData(form).getAll("topic")).toEqual(["food"]);
  expect(new FormData(form).has("category")).toBe(false);
});

it("synchronizes an existing uncontrolled category control without adding a duplicate", async () => {
  const user = userEvent.setup();
  renderActualSearchForm({
    defaultValue: { query: "", location: "Baltimore", category: "services", page: 1 },
  });
  const form = screen.getByRole("search") as HTMLFormElement;

  expect(new FormData(form).getAll("category")).toEqual(["services"]);
  await user.type(screen.getByRole("combobox"), "ta");
  await user.click(await screen.findByRole("option", { name: "Restaurantes" }));

  expect(new FormData(form).getAll("category")).toEqual(["food"]);
});

it("preserves a selected category across an unrelated parent rerender", async () => {
  const user = userEvent.setup();
  renderVoreal(<RerenderingActualSearchForm />);
  const form = screen.getByRole("search") as HTMLFormElement;

  expect(new FormData(form).getAll("category")).toEqual(["food"]);
  await user.type(screen.getByRole("combobox"), "ta");
  await user.click(await screen.findByRole("option", { name: "Servicios" }));
  expect(new FormData(form).getAll("category")).toEqual(["services"]);

  await user.click(screen.getByRole("button", { name: "Actualizar contenido relacionado" }));

  expect(screen.getByRole("status", { name: "Revisión relacionada" })).toHaveTextContent("1");
  expect(new FormData(form).getAll("category")).toEqual(["services"]);
});

it("renders optional image and metadata with the contract's meaningful alt", async () => {
  const user = userEvent.setup();
  renderSearchFixture({
    debounceMs: 0,
    loadSuggestions: async () => [{
      id: "businesses",
      label: "Negocios",
      items: [{
        id: "sabor",
        type: "business",
        title: "Sabor de Casa",
        description: "Restaurante mexicano",
        href: "/negocios/sabor",
        image: { src: "/sabor.jpg", alt: "Fachada de Sabor de Casa" },
        metadata: "Abierto ahora · 0.4 mi",
      }],
    }],
  });

  await user.type(screen.getByRole("combobox"), "ta");
  const option = await screen.findByRole("option", { name: /Sabor de Casa/ });
  const image = within(option).getByRole("img", { name: "Fachada de Sabor de Casa" });
  expect(image).toHaveAttribute("src", "/sabor.jpg");
  expect(image.closest(".vr-directory-suggestions__image")).toHaveStyle({ aspectRatio: "1 / 1" });
  expect(within(option).getByText("Abierto ahora · 0.4 mi")).toHaveClass("vr-directory-suggestions__metadata");
  expect(option).toHaveAttribute("data-has-image", "true");
});

it("keeps an empty image alt decorative and omits absent optional fields", async () => {
  const user = userEvent.setup();
  renderSearchFixture({
    debounceMs: 0,
    loadSuggestions: async () => [{
      id: "locations",
      label: "Ubicaciones",
      items: [
        { id: "centro", type: "location", title: "Centro", image: { src: "/centro.jpg", alt: "" } },
        { id: "fells", type: "location", title: "Fells Point" },
      ],
    }],
  });

  await user.type(screen.getByRole("combobox"), "ta");
  const decorativeOption = await screen.findByRole("option", { name: "Centro" });
  expect(within(decorativeOption).getByAltText("")).toHaveAttribute("alt", "");
  expect(within(decorativeOption).queryByRole("img")).not.toBeInTheDocument();
  expect(within(decorativeOption).queryByText(/Abierto ahora/)).not.toBeInTheDocument();

  const plainOption = screen.getByRole("option", { name: "Fells Point" });
  expect(plainOption).toHaveAttribute("data-has-image", "false");
  expect(plainOption.querySelector(".vr-directory-suggestions__image")).toBeNull();
  expect(plainOption.querySelector(".vr-directory-suggestions__metadata")).toBeNull();
});

it("keeps long optional content inside one stable option content region", async () => {
  const user = userEvent.setup();
  const title = "Centro Comunitario de Servicios Integrales para Familias Latinas, Pequeñas Empresas y Emprendedores del Área Metropolitana de Baltimore";
  renderSearchFixture({
    debounceMs: 0,
    loadSuggestions: async () => [{
      id: "businesses",
      label: "Negocios",
      items: [{
        id: "long-business",
        type: "business",
        title,
        description: "Atención en toda la región metropolitana y comunidades vecinas",
        href: "/negocios/centro-comunitario",
        image: { src: "/centro-comunitario.jpg", alt: "" },
        metadata: "Servicios comunitarios · Español e inglés · Citas y atención sin cita",
      }],
    }],
  });

  await user.type(screen.getByRole("combobox"), "ta");
  const option = await screen.findByRole("option", { name: new RegExp(title) });
  const content = option.querySelector(".vr-directory-suggestions__option-content");
  expect(content).toContainElement(within(option).getByText(title));
  expect(content).toContainElement(within(option).getByText(/Servicios comunitarios/));
  expect(option.querySelectorAll(".vr-directory-suggestions__image")).toHaveLength(1);
});

it("closes on Escape without clearing and submits once on Enter without an active option", async () => {
  const user = userEvent.setup(); const { onSubmit } = renderSearchFixture({ debounceMs: 0 }); const input = screen.getByRole("combobox");
  await user.type(input, "ta"); await screen.findByRole("option", { name: "Sabor de Casa" }); await user.keyboard("{Escape}");
  expect(input).toHaveValue("ta"); expect(input).toHaveAttribute("aria-expanded", "false");
  await user.keyboard("{Enter}"); expect(onSubmit).toHaveBeenCalledTimes(1);
});

it("emits pointer and submit events without raw query text", async () => {
  const user = userEvent.setup(); const onSearchEvent = vi.fn(); renderSearchFixture({ debounceMs: 0, onSearchEvent });
  await user.type(screen.getByRole("combobox"), "ta"); await user.click(await screen.findByRole("option", { name: "Restaurantes" }));
  expect(onSearchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: "suggestion_selected", source: "pointer" }));
  await user.click(screen.getByRole("button", { name: "Buscar" }));
  const submit = onSearchEvent.mock.calls.flat().find((event) => event.type === "search_submitted");
  expect(submit).toEqual(expect.objectContaining({ type: "search_submitted", queryLength: 2 })); expect(submit).not.toHaveProperty("query");
});

it("announces one approved non-option status at a time and never turns cancellation into an error", async () => {
  const user = userEvent.setup(); const pending = vi.fn(() => new Promise<never>(() => undefined));
  const { rerender } = renderSearchFixture({ debounceMs: 0, loadSuggestions: pending }); await user.type(screen.getByRole("combobox"), "ta");
  expect(await screen.findByText("Buscando sugerencias…")).toBeVisible();
  await user.keyboard("{Escape}"); expect(screen.queryByText("Las sugerencias no están disponibles. Aún puedes buscar")).not.toBeInTheDocument();
  rerender(<form><DirectorySearchSuggestions debounceMs={0} loadSuggestions={vi.fn().mockResolvedValue([])} /><input name="location" type="hidden" /><input name="category" type="hidden" /></form>);
  await user.type(screen.getByRole("combobox"), "ta"); expect(await screen.findByText("No encontramos coincidencias. Prueba otra palabra o ubicación")).toBeVisible();
});

it("has no accessibility violations in directory suggestions", async () => {
  const user = userEvent.setup(); const { container } = renderSearchFixture({ debounceMs: 0 }); await user.type(screen.getByRole("combobox"), "ta"); await screen.findByRole("option", { name: "Sabor de Casa" });
  const results = await axe(container, { rules: { "color-contrast": { enabled: false } } }); expect(results.violations).toEqual([]);
});

it("uses the configured canonical query name in the native GET form", () => {
  renderSearchFixture({ parameterNames: { query: "search" } });
  expect(screen.getByRole("combobox")).toHaveAttribute("name", "search");
});

it("reads changed sibling location and category values when loading suggestions", async () => {
  const user = userEvent.setup(); const loadSuggestions = vi.fn().mockResolvedValue(suggestions);
  renderSearchFixture({ debounceMs: 0, loadSuggestions });
  const location = document.querySelector('[name="location"]') as HTMLInputElement;
  const category = document.querySelector('[name="category"]') as HTMLInputElement;
  location.value = "Baltimore"; fireEvent.input(location); category.value = "food"; fireEvent.change(category);
  await user.type(screen.getByRole("combobox"), "ta"); await screen.findByRole("option", { name: "Sabor de Casa" });
  expect(loadSuggestions).toHaveBeenCalledWith({ query: "ta", location: "Baltimore", category: "food" }, expect.any(AbortSignal));
});

it("allows browser or router navigation unless onNavigate intentionally replaces it", async () => {
  const user = userEvent.setup(); const onNavigate = vi.fn(); const events: boolean[] = [];
  function RouterLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) { return <a {...props} data-router="" onClick={(event) => { props.onClick?.(event); events.push(event.defaultPrevented); event.preventDefault(); }} />; }
  const first = renderSearchFixture({ debounceMs: 0, LinkComponent: RouterLink });
  await user.type(screen.getByRole("combobox"), "ta"); await user.click(await screen.findByRole("option", { name: "Sabor de Casa" }));
  expect(events).toEqual([false]);
  first.unmount();
  renderSearchFixture({ debounceMs: 0, onNavigate, LinkComponent: RouterLink }); await user.type(screen.getByRole("combobox"), "ta"); await user.click(await screen.findByRole("option", { name: "Sabor de Casa" }));
  expect(onNavigate).toHaveBeenCalledWith("/negocios/sabor");
  expect(events).toEqual([false, true]);
});

it("renders error and offline messages and keeps option titles out of the live status", async () => {
  const user = userEvent.setup(); const { rerender } = renderSearchFixture({ debounceMs: 0, loadSuggestions: vi.fn().mockRejectedValue(new Error("nope")) });
  await user.type(screen.getByRole("combobox"), "ta"); expect(await screen.findByText("Las sugerencias no están disponibles. Aún puedes buscar")).toBeVisible();
  rerender(<form><DirectorySearchSuggestions debounceMs={0} loadSuggestions={vi.fn().mockResolvedValue(suggestions)} /><input name="location" type="hidden" /><input name="category" type="hidden" /></form>);
  await user.type(screen.getByRole("combobox"), "ta"); await screen.findByRole("option", { name: "Sabor de Casa" });
  const live = document.querySelector('[aria-live="polite"]')!; expect(live).not.toHaveTextContent("Sabor de Casa"); expect(live.closest('[role="listbox"]')).toBeNull(); expect(document.querySelector('[role="dialog"]')).toBeNull();
  expect(screen.getByRole("listbox", { name: "Sugerencias" })).toBeVisible();
  expect(document.querySelector('[role="presentation"][aria-label]')).toBeNull();
});

it("shows the approved offline state", async () => {
  const previous = navigator.onLine;
  Object.defineProperty(navigator, "onLine", { configurable: true, value: false });
  try {
    const user = userEvent.setup(); renderSearchFixture({ debounceMs: 0 });
    await user.type(screen.getByRole("combobox"), "ta");
    expect(await screen.findByText("No tienes conexión. Podrás buscar cuando vuelvas a conectarte")).toBeVisible();
  } finally { Object.defineProperty(navigator, "onLine", { configurable: true, value: previous }); }
});

it("does not expose a rejected request after it was cancelled", async () => {
  const user = userEvent.setup(); const onSearchEvent = vi.fn(); let rejectRequest!: (reason?: unknown) => void; let signal!: AbortSignal;
  const loadSuggestions: DirectorySuggestionLoader = (_request, requestSignal) => new Promise((_, reject) => { signal = requestSignal; rejectRequest = reject; });
  renderSearchFixture({ debounceMs: 0, loadSuggestions, onSearchEvent });
  await user.type(screen.getByRole("combobox"), "ta"); await screen.findByText("Buscando sugerencias…");
  await user.keyboard("{Escape}"); expect(signal.aborted).toBe(true); rejectRequest(new Error("cancelled provider request"));
  await Promise.resolve(); await Promise.resolve();
  expect(screen.queryByText("Las sugerencias no están disponibles. Aún puedes buscar")).not.toBeInTheDocument();
  expect(onSearchEvent).not.toHaveBeenCalledWith(expect.objectContaining({ type: "suggestions_failed" }));
});

it("turns a wholly malformed rendered payload into the approved error state", async () => {
  const user = userEvent.setup();
  const onSearchEvent = vi.fn();
  renderSearchFixture({
    debounceMs: 0,
    loadSuggestions: vi.fn().mockResolvedValue([{
      id: "businesses",
      label: "Negocios",
      items: [{
        id: "bad-description",
        type: "business",
        title: "Sabor de Casa",
        description: { private: "provider detail" },
        href: "/negocios/sabor",
      }],
    }] as never),
    onSearchEvent,
  });

  await user.type(screen.getByRole("combobox"), "ta");
  expect(await screen.findByText("Las sugerencias no están disponibles. Aún puedes buscar")).toBeVisible();
  expect(screen.queryByRole("option")).not.toBeInTheDocument();
  expect(onSearchEvent).toHaveBeenCalledWith(expect.objectContaining({
    type: "suggestions_failed",
    error: { kind: "invalid-response", code: "INVALID_DIRECTORY_SUGGESTIONS" },
  }));
});
