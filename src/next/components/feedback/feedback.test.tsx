import { createRef } from "react";
import { screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { expect, it } from "vitest";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextAlert, NextEmptyState, NextProgress, NextSkeleton } from "./feedback";
import "./feedback.css";

it("keeps persistent alerts quiet unless the consumer explicitly requests a live alert", () => {
  renderNext(
    <>
      <NextAlert title="Perfil actualizado">Los cambios ya están disponibles.</NextAlert>
      <NextAlert role="alert" title="No se pudo guardar" tone="danger">
        Revisa los campos marcados.
      </NextAlert>
    </>,
  );

  expect(screen.getByText("Perfil actualizado").closest(".vrn-alert")).not.toHaveAttribute("role");
  expect(screen.getByRole("alert")).toHaveTextContent("No se pudo guardar");
});

it("keeps numeric zero content instead of treating it as absent", () => {
  renderNext(
    <>
      <NextAlert title="Intentos restantes">{0}</NextAlert>
      <NextEmptyState description={0} title="Resultados" />
    </>,
  );

  expect(screen.getByText("Intentos restantes").parentElement).toHaveTextContent("0");
  expect(screen.getByText("Resultados").parentElement).toHaveTextContent("0");
});

it("preserves alert refs, classes, data attributes, and an action with a 44px target", () => {
  const ref = createRef<HTMLDivElement>();
  renderNext(
    <NextAlert
      ref={ref}
      action={<button type="button">Reintentar</button>}
      className="account-alert"
      data-context="profile"
      title="Algo salió mal"
    />,
  );

  const alert = screen.getByText("Algo salió mal").closest(".vrn-alert");
  const action = screen.getByRole("button", { name: "Reintentar" });
  expect(ref.current).toBe(alert);
  expect(alert).toHaveClass("vrn-alert", "account-alert");
  expect(alert).toHaveAttribute("data-context", "profile");
  expect(getComputedStyle(action).minBlockSize).toBe("44px");
  expect(getComputedStyle(action).minInlineSize).toBe("44px");
});

it("renders an indeterminate progressbar without inventing a current value", () => {
  renderNext(<NextProgress data-process="upload" label="Subiendo documentos" />);

  const progress = screen.getByRole("progressbar", { name: "Subiendo documentos" });
  expect(progress.tagName).toBe("DIV");
  expect(progress).not.toHaveAttribute("aria-valuenow");
  expect(progress).toHaveAttribute("aria-valuetext", "En progreso");
  expect(screen.getByText("Subiendo documentos").closest(".vrn-progress")).toHaveAttribute("data-process", "upload");
});

it.each([
  ["negative", -20, 80, "0", "80"],
  ["above maximum", 120, 80, "80", "80"],
  ["zero", 0, 0, "0", "100"],
] as const)("clamps %s determinate progress to a safe range", (_case, value, max, expectedValue, expectedMax) => {
  renderNext(<NextProgress label={`Progreso ${_case}`} max={max} value={value} />);

  const progress = screen.getByRole("progressbar", { name: `Progreso ${_case}` });
  expect(progress.tagName).toBe("PROGRESS");
  expect(progress).toHaveAttribute("value", expectedValue);
  expect(progress).toHaveAttribute("max", expectedMax);
});

it("treats a non-finite progress value as indeterminate", () => {
  renderNext(<NextProgress label="Importando" value={Number.NaN} />);
  expect(screen.getByRole("progressbar", { name: "Importando" }).tagName).toBe("DIV");
});

it("applies stable skeleton dimensions while preserving consumer styles", () => {
  renderNext(<NextSkeleton data-testid="skeleton" height="2rem" style={{ borderRadius: "1rem" }} width="75%" />);

  const skeleton = screen.getByTestId("skeleton");
  expect(skeleton).toHaveAttribute("aria-hidden", "true");
  expect(skeleton.style.getPropertyValue("--vrn-skeleton-height")).toBe("2rem");
  expect(skeleton.style.getPropertyValue("--vrn-skeleton-width")).toBe("75%");
  expect(skeleton.style.borderRadius).toBe("1rem");
});

it("disables skeleton animation when the user prefers reduced motion", () => {
  const { container } = renderNext(<NextSkeleton data-testid="reduced-motion-skeleton" />);
  const mediaRule = Array.from(container.ownerDocument.styleSheets)
    .flatMap((sheet) => Array.from(sheet.cssRules))
    .find((rule) => rule.type === CSSRule.MEDIA_RULE && (rule as CSSMediaRule).conditionText === "(prefers-reduced-motion: reduce)") as CSSMediaRule | undefined;
  const skeletonRule = Array.from(mediaRule?.cssRules ?? [])
    .find((rule) => (rule as CSSStyleRule).selectorText?.includes(".vrn-skeleton")) as CSSStyleRule | undefined;

  expect(skeletonRule?.style.animation).toBe("none");
});

it("keeps empty-state actions usable and long copy contained", () => {
  const longCopy = "InformaciónComunitariaMultilingüeSinSeparadores".repeat(3);
  const { container } = renderNext(
    <NextEmptyState
      action={<a href="/directorio">Explorar directorio</a>}
      description={longCopy}
      icon={<svg data-testid="empty-icon" />}
      title={longCopy}
    />,
  );

  expect(screen.getByTestId("empty-icon").parentElement).toHaveAttribute("aria-hidden", "true");
  const action = screen.getByRole("link", { name: "Explorar directorio" });
  expect(getComputedStyle(action).minBlockSize).toBe("44px");
  expect(getComputedStyle(action).minInlineSize).toBe("44px");
  for (const selector of [".vrn-empty-state__title", ".vrn-empty-state__description"]) {
    const styles = getComputedStyle(container.querySelector(selector)!);
    expect(styles.minInlineSize).toMatch(/^0(?:px)?$/u);
    expect(styles.overflowWrap).toBe("anywhere");
  }
});

it("has no detectable accessibility violations across feedback states", async () => {
  const { container } = renderNext(
    <>
      <NextAlert action={<button type="button">Entendido</button>} title="Aviso">Contenido persistente.</NextAlert>
      <NextProgress label="Preparando resultados" />
      <NextProgress label="Perfil completado" max={10} value={7} />
      <NextSkeleton height="2rem" width="10rem" />
      <NextEmptyState description="Prueba otra búsqueda." title="No encontramos resultados" />
    </>,
  );

  const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});
