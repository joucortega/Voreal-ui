import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { expect, it, vi } from "vitest";
import { createRef } from "react";
import type { VorealNextLinkProps } from "../../adapters";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextBreadcrumbs, NextNavigationRail, NextStepper, NextTabs } from "./index";
import "./navigation.css";

const rejectedTabsAsChild = (
  // @ts-expect-error NextTabs owns its Radix root anatomy and cannot delegate it with asChild.
  <NextTabs asChild items={[]} label="Sections" />
);
void rejectedTabsAsChild;

function LinkFixture({ href, ...props }: VorealNextLinkProps) {
  return <a {...props} href={href} />;
}

it("renders breadcrumbs as a labelled ordered navigation trail with one current page", () => {
  renderNext(
    <NextBreadcrumbs
      LinkComponent={LinkFixture}
      items={[
        { href: "/", label: "Inicio" },
        { href: "/directorio", label: "Directorio" },
        { label: "Cafeterías" },
      ]}
    />,
  );

  const navigation = screen.getByRole("navigation", { name: "Breadcrumb" });
  expect(navigation.querySelector("ol")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Directorio" })).toHaveAttribute("href", "/directorio");
  expect(screen.getByText("Cafeterías")).toHaveAttribute("aria-current", "page");
  expect(navigation.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
});

it("moves and activates tabs with ArrowLeft, ArrowRight, Home, and End", async () => {
  const user = userEvent.setup();
  renderNext(
    <NextTabs
      defaultValue="summary"
      items={[
        { value: "summary", label: "Resumen", content: "Contenido del resumen" },
        { value: "reviews", label: "Reseñas", content: "Contenido de reseñas" },
        { value: "hours", label: "Horario", content: "Contenido del horario" },
      ]}
      label="Secciones del negocio"
    />,
  );

  const summary = screen.getByRole("tab", { name: "Resumen" });
  const reviews = screen.getByRole("tab", { name: "Reseñas" });
  const hours = screen.getByRole("tab", { name: "Horario" });

  await user.click(summary);
  await user.keyboard("{ArrowRight}");
  expect(reviews).toHaveFocus();
  expect(reviews).toHaveAttribute("aria-selected", "true");

  await user.keyboard("{ArrowLeft}");
  expect(summary).toHaveFocus();

  await user.keyboard("{End}");
  expect(hours).toHaveFocus();
  expect(hours).toHaveAttribute("aria-selected", "true");

  await user.keyboard("{Home}");
  expect(summary).toHaveFocus();
  expect(screen.getByRole("tabpanel", { name: "Resumen" })).toHaveTextContent("Contenido del resumen");
});

it("keeps disabled tabs out of pointer and keyboard selection", async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  renderNext(
    <NextTabs
      defaultValue="summary"
      items={[
        { value: "summary", label: "Resumen", content: "Resumen" },
        { value: "private", label: "Privado", content: "Privado", disabled: true },
        { value: "hours", label: "Horario", content: "Horario" },
      ]}
      label="Secciones del negocio"
      onValueChange={onValueChange}
    />,
  );

  const summary = screen.getByRole("tab", { name: "Resumen" });
  const privateTab = screen.getByRole("tab", { name: "Privado" });
  await user.click(privateTab);
  expect(privateTab).toBeDisabled();
  expect(summary).toHaveAttribute("aria-selected", "true");

  await user.click(summary);
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Horario" })).toHaveFocus();
  expect(onValueChange).toHaveBeenLastCalledWith("hours");
});

it("renders a noninteractive stepper as textual progress", () => {
  renderNext(
    <NextStepper
      label="Publicar negocio"
      steps={[
        { value: "details", label: "Detalles", status: "complete" },
        { value: "photos", label: "Fotos", description: "Añade una foto", status: "current" },
        { value: "publish", label: "Publicar", status: "upcoming" },
        { value: "review", label: "Revisión", status: "error" },
      ]}
      value="photos"
    />,
  );

  const progress = screen.getByRole("navigation", { name: "Publicar negocio" });
  expect(progress.querySelector("ol")).toBeInTheDocument();
  expect(screen.queryAllByRole("button")).toHaveLength(0);
  expect(screen.getByText("Completado")).toBeVisible();
  expect(screen.getByText("Actual")).toBeVisible();
  expect(screen.getByText("Próximo")).toBeVisible();
  expect(screen.getByText("Error")).toBeVisible();
  expect(screen.getByText("Fotos").closest("li")).toHaveAttribute("aria-current", "step");
});

it("allows callback-driven step navigation without enabling upcoming steps", async () => {
  const user = userEvent.setup();
  const onStepChange = vi.fn();
  renderNext(
    <NextStepper
      label="Publicar negocio"
      onStepChange={onStepChange}
      steps={[
        { value: "details", label: "Detalles", status: "complete" },
        { value: "photos", label: "Fotos", status: "current" },
        { value: "publish", label: "Publicar", status: "upcoming" },
      ]}
      value="photos"
    />,
  );

  await user.click(screen.getByRole("button", { name: /Detalles/ }));
  expect(onStepChange).toHaveBeenCalledWith("details");

  const upcoming = screen.getByRole("button", { name: /Publicar/ });
  expect(upcoming).toBeDisabled();
  await user.click(upcoming);
  expect(onStepChange).toHaveBeenCalledTimes(1);
});

it("renders a labelled navigation rail through the shared link adapter with one current item", () => {
  renderNext(
    <NextNavigationRail
      LinkComponent={LinkFixture}
      items={[
        { href: "/overview", label: "Resumen", current: true },
        { href: "/reviews", label: "Reseñas", current: true },
        { href: "/settings", label: "Configuración" },
      ]}
      label="Cuenta del negocio"
    />,
  );

  const navigation = screen.getByRole("navigation", { name: "Cuenta del negocio" });
  expect(navigation.querySelector("ul")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Resumen" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "Reseñas" })).not.toHaveAttribute("aria-current");
  expect(navigation.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
});

it("keeps a one-character tab at 44px in both axes and its overflow local", () => {
  renderNext(
    <>
      <NextTabs
        defaultValue="summary"
        items={[{ value: "summary", label: "A", content: "Resumen" }]}
        label="Secciones"
      />
      <NextStepper
        label="Pasos"
        onStepChange={() => undefined}
        steps={[{ value: "summary", label: "Resumen", status: "current" }]}
        value="summary"
      />
      <NextNavigationRail items={[{ href: "/", label: "Inicio", current: true }]} label="Principal" />
    </>,
  );

  const tabListStyle = getComputedStyle(screen.getByRole("tablist", { name: "Secciones" }));
  const tabStyle = getComputedStyle(screen.getByRole("tab", { name: "A" }));
  const stepStyle = getComputedStyle(screen.getByRole("button", { name: /Resumen/ }));
  const railStyle = getComputedStyle(screen.getByRole("link", { name: "Inicio" }));
  expect(tabListStyle.overflowX).toBe("auto");
  expect(tabStyle.minBlockSize).toBe("44px");
  expect(tabStyle.minInlineSize).toBe("44px");
  expect(stepStyle.minBlockSize).toBe("44px");
  expect(railStyle.minBlockSize).toBe("44px");
});

it("keeps a one-character breadcrumb link at 44px in both axes", () => {
  renderNext(<NextBreadcrumbs items={[{ href: "/", label: "A" }, { label: "Actual" }]} />);

  const breadcrumbStyle = getComputedStyle(screen.getByRole("link", { name: "A" }));
  expect(breadcrumbStyle.minBlockSize).toBe("44px");
  expect(breadcrumbStyle.minInlineSize).toBe("44px");
});

it("forwards native root props, merged classes, and refs across navigation composites", () => {
  const breadcrumbsRef = createRef<HTMLElement>();
  const tabsRef = createRef<HTMLDivElement>();
  const stepperRef = createRef<HTMLElement>();
  const railRef = createRef<HTMLElement>();
  const { container } = renderNext(
    <>
      <span id="navigation-hint">Navigation hint</span>
      <NextBreadcrumbs
        aria-describedby="navigation-hint"
        className="profile-breadcrumbs"
        data-owner="profile"
        items={[{ label: "Current" }]}
        label="Profile breadcrumb"
        ref={breadcrumbsRef}
      />
      <NextTabs
        aria-describedby="navigation-hint"
        className="profile-tabs"
        data-owner="profile"
        defaultValue="summary"
        items={[{ content: "Summary", label: "Summary", value: "summary" }]}
        label="Profile tabs"
        ref={tabsRef}
      />
      <NextStepper
        aria-describedby="navigation-hint"
        className="profile-stepper"
        data-owner="profile"
        label="Profile steps"
        ref={stepperRef}
        steps={[{ label: "Summary", value: "summary" }]}
        value="summary"
      />
      <NextNavigationRail
        aria-describedby="navigation-hint"
        className="profile-rail"
        data-owner="profile"
        items={[{ current: true, href: "/", label: "Home" }]}
        label="Profile rail"
        ref={railRef}
      />
    </>,
  );

  const breadcrumbs = screen.getByRole("navigation", { name: "Profile breadcrumb" });
  const tabs = container.querySelector(".vrn-tabs");
  const stepper = screen.getByRole("navigation", { name: "Profile steps" });
  const rail = screen.getByRole("navigation", { name: "Profile rail" });
  for (const [element, ref, className] of [
    [breadcrumbs, breadcrumbsRef, "profile-breadcrumbs"],
    [tabs, tabsRef, "profile-tabs"],
    [stepper, stepperRef, "profile-stepper"],
    [rail, railRef, "profile-rail"],
  ] as const) {
    expect(ref.current).toBe(element);
    expect(element).toHaveClass(className);
    expect(element).toHaveAttribute("aria-describedby", "navigation-hint");
    expect(element).toHaveAttribute("data-owner", "profile");
  }
});

it("has no detectable accessibility violations for essential navigation", async () => {
  const { container } = renderNext(
    <>
      <NextBreadcrumbs items={[{ href: "/", label: "Inicio" }, { label: "Directorio" }]} />
      <NextTabs
        defaultValue="summary"
        items={[
          { value: "summary", label: "Resumen", content: "Contenido del resumen" },
          { value: "hours", label: "Horario", content: "Contenido del horario" },
        ]}
        label="Secciones del negocio"
      />
      <NextStepper
        label="Publicar negocio"
        steps={[
          { value: "details", label: "Detalles", status: "complete" },
          { value: "photos", label: "Fotos", status: "current" },
        ]}
        value="photos"
      />
      <NextNavigationRail items={[{ href: "/overview", label: "Resumen", current: true }]} label="Cuenta" />
    </>,
  );

  const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});
