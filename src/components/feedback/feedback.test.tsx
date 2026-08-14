import { screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { expect, it } from "vitest";
import { renderVoreal } from "../../testing/render-voreal";
import { Button } from "../button";
import { Alert } from "./alert";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";
import { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./toast";

it("uses persistent alerts for task-blocking errors", () => {
  renderVoreal(
    <ErrorState
      action={<Button>Reintentar</Button>}
      autoFocus
      description="Revisa tu conexión e inténtalo nuevamente."
      title="No pudimos cargar los negocios"
    />,
  );

  const error = screen.getByRole("alert");
  expect(error).toHaveFocus();
  expect(screen.getByRole("button", { name: "Reintentar" })).toBeVisible();
});

it("exposes feedback states with text and dimensions", () => {
  renderVoreal(
    <div>
      <Alert description="Los cambios todavía no se publican." title="Borrador guardado" variant="warning" />
      <Progress label="Perfil completado" value={72} />
      <Skeleton aria-label="Cargando fotografía" height="8rem" width="12rem" />
      <EmptyState description="Prueba otra categoría." title="No encontramos negocios" />
    </div>,
  );

  expect(screen.getByRole("progressbar", { name: "Perfil completado" })).toHaveAttribute("aria-valuenow", "72");
  const skeletonStyle = screen.getByRole("status", { name: "Cargando fotografía" }).getAttribute("style");
  expect(skeletonStyle).toContain("height: 8rem");
  expect(skeletonStyle).toContain("width: 12rem");
  expect(screen.getByText("Borrador guardado")).toBeVisible();
  expect(screen.getByText("No encontramos negocios")).toBeVisible();
});

it("has no detectable accessibility violations across feedback states", async () => {
  const { container } = renderVoreal(
    <div>
      <Alert description="Todo está listo." title="Perfil publicado" variant="success" />
      <EmptyState description="Agrega el primer elemento." title="Sin resultados" />
      <Progress label="Carga" value={40} />
    </div>,
  );
  const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});

it("gives every toast region a stable layout class", () => {
  renderVoreal(
    <ToastProvider>
      <Toast open>
        <ToastTitle>Perfil guardado</ToastTitle>
        <ToastDescription>Los cambios ya están disponibles.</ToastDescription>
        <ToastAction altText="Deshacer">Deshacer</ToastAction>
        <ToastClose aria-label="Cerrar">Cerrar</ToastClose>
      </Toast>
      <ToastViewport />
    </ToastProvider>,
  );

  expect(screen.getByText("Perfil guardado")).toHaveClass("vr-toast__title");
  expect(screen.getByText("Los cambios ya están disponibles.")).toHaveClass("vr-toast__description");
  expect(screen.getByRole("button", { name: "Deshacer" })).toHaveClass("vr-toast__action");
  expect(screen.getByRole("button", { name: "Cerrar" })).toHaveClass("vr-toast__close");
});
