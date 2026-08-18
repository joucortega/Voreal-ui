import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { VorealNextRoot } from "../root";
import meta, { Atlas } from "./core-components.stories";

function renderStory(story: { render?: unknown }) {
  const storyRender = story.render as (() => ReactNode) | undefined;
  if (!storyRender) throw new Error("The component atlas must define an explicit render function.");
  return render(<VorealNextRoot>{storyRender()}</VorealNextRoot>);
}

describe("Voreal Next component atlas", () => {
  it("renders every public core component in compact family sections", () => {
    const { container } = renderStory(Atlas);

    expect(meta.title).toBe("Next/Components/Core Atlas");
    for (const family of ["Acciones", "Formularios", "Navegación", "Estado", "Feedback", "Contenido", "Overlays"]) {
      expect(screen.getByRole("heading", { name: family })).toBeInTheDocument();
    }

    for (const selector of [
      ".vrn-button", ".vrn-icon-button", ".vrn-button-group", ".vrn-action-link",
      ".vrn-field", ".vrn-input", ".vrn-select", ".vrn-textarea", ".vrn-input-group",
      ".vrn-checkbox", ".vrn-radio-group", ".vrn-switch", ".vrn-form-summary",
      ".vrn-breadcrumbs", ".vrn-tabs", ".vrn-stepper", ".vrn-navigation-rail",
      ".vrn-tag", ".vrn-badge", ".vrn-alert", ".vrn-progress", ".vrn-skeleton",
      ".vrn-empty-state", ".vrn-avatar", ".vrn-rating", ".vrn-review-summary",
    ]) {
      expect(container.querySelector(selector), selector).toBeInTheDocument();
    }

    expect(container.querySelectorAll(".vrn-section")).toHaveLength(7);
    expect(container.querySelectorAll(".vrn-surface")).toHaveLength(7);
    expect(container.querySelectorAll(".vrn-stack").length).toBeGreaterThanOrEqual(7);

    for (const [name, selector] of [
      ["container", ".vrn-container"],
      ["cluster", ".vrn-cluster"],
      ["divider", ".vrn-divider"],
      ["caption", ".vrn-caption"],
    ] as const) {
      expect(container.querySelector(`${selector}[data-atlas-foundation="${name}"]`), name).toBeInTheDocument();
    }
  });

  it("demonstrates the public dialog, dialog close, and drawer contracts", () => {
    renderStory(Atlas);

    fireEvent.click(screen.getByRole("button", { name: "Abrir diálogo" }));
    expect(screen.getByRole("dialog", { name: "Confirmar publicación" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cerrar y continuar" }));
    expect(screen.queryByRole("dialog", { name: "Confirmar publicación" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Abrir panel" }));
    expect(screen.getByRole("dialog", { name: "Filtros rápidos" })).toBeInTheDocument();
  });
});
