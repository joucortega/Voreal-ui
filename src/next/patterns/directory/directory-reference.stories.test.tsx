import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import preview from "../../../../.storybook/preview";
import meta, {
  Cards,
  Error as ErrorStory,
  Loading,
  LongContent,
  MissingImage,
  Mobile375,
  NoResults,
  Tablet768,
} from "./directory-reference.stories";

function renderStory(story: { render?: unknown }) {
  const storyRender = story.render as (() => ReactNode) | undefined;
  if (!storyRender) throw new Error("The reference story must define an explicit render function.");
  return render(storyRender());
}

describe("Voreal Next directory reference stories", () => {
  it("selects one isolated Storybook root without nesting the legacy root", () => {
    const decorators = preview.decorators as unknown as readonly unknown[];
    const decorator = decorators[0] as (
      Story: () => ReactElement,
      context: { globals: { theme: string }; title: string },
    ) => ReactNode;

    const { container, unmount } = render(decorator(
      () => <span>Next story</span>,
      { globals: { theme: "red-latina" }, title: "Next/Patterns/Directory Reference" },
    ));
    expect(container.querySelector('[data-voreal-ui="next"]')).toBeInTheDocument();
    expect(container.querySelector(".vr-root")).not.toBeInTheDocument();
    unmount();

    const legacy = render(decorator(
      () => <span>Legacy story</span>,
      { globals: { theme: "red-latina" }, title: "Patterns/Directory Reference" },
    ));
    expect(legacy.container.querySelector("[data-vr-root]")).toBeInTheDocument();
    expect(legacy.container.querySelector('[data-voreal-ui="next"]')).not.toBeInTheDocument();
  });

  it("publishes the exact visual review contract", () => {
    expect(meta.title).toBe("Next/Patterns/Directory Reference");
    expect([Cards, Mobile375, Tablet768, Loading, NoResults, ErrorStory, LongContent, MissingImage])
      .toHaveLength(8);
    expect(Mobile375.parameters?.viewport?.defaultViewport).toBe("directory-reference-mobile-375");
    expect(Mobile375.parameters?.viewport?.viewports?.["directory-reference-mobile-375"]?.styles)
      .toEqual({ height: "812px", width: "375px" });
    expect(Tablet768.parameters?.viewport?.defaultViewport).toBe("directory-reference-tablet-768");
    expect(Tablet768.parameters?.viewport?.viewports?.["directory-reference-tablet-768"]?.styles)
      .toEqual({ height: "1024px", width: "768px" });
  });

  it("renders the six approved businesses and 960 by 640 image metadata", () => {
    const { container } = renderStory(Cards);

    expect(screen.getByRole("heading", { name: "Restaurantes en Baltimore, MD" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(screen.getByRole("article", { name: "Martínez Tax Services" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Panadería La Esperanza" })).toBeInTheDocument();

    const images = [...container.querySelectorAll<HTMLImageElement>(".vrn-directory-card__image")];
    expect(images).toHaveLength(6);
    for (const image of images) {
      expect(image).toHaveAttribute("width", "960");
      expect(image).toHaveAttribute("height", "640");
      expect(image.src).toContain("/voreal-next/directory/");
    }
  });

  it("keeps the primary demo controls visibly controlled without navigation", () => {
    renderStory(Cards);

    fireEvent.change(screen.getByLabelText("Ordenar resultados"), { target: { value: "rating" } });
    expect(screen.getByRole("status")).toHaveTextContent("Orden actualizado");

    const favorite = screen.getByRole("button", { name: "Guardar Martínez Tax Services" });
    expect(favorite).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(favorite);
    expect(favorite).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Guardado en favoritos");

    fireEvent.click(screen.getByRole("button", { name: "Limpiar todos los filtros" }));
    expect(screen.queryByText("Restaurantes", { selector: ".vrn-tag > span" })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Filtros eliminados");

    fireEvent.click(screen.getByRole("link", { name: "Página 2" }));
    expect(screen.getByRole("link", { name: "Página 2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("status")).toHaveTextContent("Página 2");
  });

  it("updates search and filters while keeping feedback concise", () => {
    renderStory(Cards);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "panaderías" } });
    fireEvent.change(screen.getByRole("textbox", { name: "¿Dónde?" }), { target: { value: "Essex, MD" } });
    fireEvent.submit(screen.getByRole("search"));
    expect(screen.getByRole("heading", { name: "Panaderías en Essex, MD" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Búsqueda actualizada");

    fireEvent.click(screen.getByRole("checkbox", { name: /Impuestos y contabilidad/ }));
    expect(screen.getByText("Impuestos y contabilidad", { selector: ".vrn-tag > span" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Resultados actualizados");
  });

  it("keeps distance cleared through unrelated changes and reactivates it when distance changes", () => {
    renderStory(Cards);

    fireEvent.click(screen.getByRole("button", { name: "Limpiar todos los filtros" }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Impuestos y contabilidad/ }));
    expect(screen.queryByText(/millas/, { selector: ".vrn-tag > span" })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Distancia"), { target: { value: "50" } });
    expect(screen.getByText("A 50 millas", { selector: ".vrn-tag > span" })).toBeInTheDocument();
  });

  it("keeps a removed distance out until the distance select changes", () => {
    renderStory(Cards);

    fireEvent.click(screen.getByRole("button", { name: "Quitar filtro A 25 millas" }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Impuestos y contabilidad/ }));
    expect(screen.queryByText(/millas/, { selector: ".vrn-tag > span" })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Distancia"), { target: { value: "10" } });
    expect(screen.getByText("A 10 millas", { selector: ".vrn-tag > span" })).toBeInTheDocument();
  });

  it("recovers the concise empty and error states locally", () => {
    const empty = renderStory(NoResults);
    expect(screen.getByRole("heading", { name: "No encontramos negocios" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));
    expect(screen.getAllByRole("article")).toHaveLength(6);
    empty.unmount();

    renderStory(ErrorStory);
    expect(screen.getByRole("heading", { name: "No pudimos cargar los negocios." })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Intentar de nuevo" }));
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(screen.getByRole("status")).toHaveTextContent("Resultados recuperados");
  });

  it("has no detectable accessibility violations in the complete reference", async () => {
    const { container } = renderStory(Cards);
    const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
    expect(results.violations).toEqual([]);
  });
});
