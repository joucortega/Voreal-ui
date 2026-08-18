import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { X } from "../../icons";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextDirectorySearchForm } from "./directory-search-form";
import "./directory.css";

it("renders a canonical GET search that works without JavaScript", () => {
  renderNext(
    <NextDirectorySearchForm
      action="/directorio"
      defaultValue={{ query: "restaurantes", location: "Baltimore, MD" }}
      fieldIdPrefix="canonical-search"
    />,
  );

  const form = screen.getByRole("search", { name: "Buscar en el directorio" });
  expect(form).toHaveAttribute("method", "get");
  expect(form).toHaveAttribute("action", "/directorio");
  expect(screen.getByRole("searchbox", { name: "¿Qué buscas?" })).toHaveAttribute("name", "q");
  expect(screen.getByRole("textbox", { name: "¿Dónde?" })).toHaveAttribute("name", "location");
  expect(screen.getByRole("button", { name: "Buscar" })).toHaveAttribute("type", "submit");
});

it("keeps explicit labels when the initial values are empty", () => {
  renderNext(
    <NextDirectorySearchForm
      action="/directorio"
      defaultValue={{ query: "", location: "" }}
      fieldIdPrefix="empty-search"
    />,
  );

  expect(screen.getByLabelText("¿Qué buscas?")).toBeVisible();
  expect(screen.getByLabelText("¿Dónde?")).toBeVisible();
});

it("preserves native form attributes while forcing a GET submission", () => {
  renderNext(
    <NextDirectorySearchForm
      action="/buscar"
      data-source="directory-hero"
      defaultValue={{ query: "cafés", location: "21224" }}
      encType="multipart/form-data"
      fieldIdPrefix="attribute-search"
      target="_blank"
    />,
  );

  const form = screen.getByRole("search", { name: "Buscar en el directorio" });
  expect(form).toHaveAttribute("method", "get");
  expect(form).toHaveAttribute("target", "_blank");
  expect(form).toHaveAttribute("enctype", "multipart/form-data");
  expect(form).toHaveAttribute("data-source", "directory-hero");
});

it("disables only submission while a search is loading", () => {
  renderNext(
    <NextDirectorySearchForm
      action="/directorio"
      defaultValue={{ query: "panadería", location: "Baltimore, MD" }}
      fieldIdPrefix="loading-search"
      loading
    />,
  );

  expect(screen.getByRole("button", { name: "Buscar" })).toBeDisabled();
  expect(screen.getByRole("searchbox", { name: "¿Qué buscas?" })).toBeEnabled();
  expect(screen.getByRole("textbox", { name: "¿Dónde?" })).toBeEnabled();
});

it("keeps the compound surface compact without narrowing either native input", () => {
  renderNext(
    <NextDirectorySearchForm
      action="/directorio"
      defaultValue={{ query: "contabilidad", location: "Baltimore, MD" }}
      fieldIdPrefix="compact-search"
    />,
  );

  const form = screen.getByRole("search", { name: "Buscar en el directorio" });
  expect(getComputedStyle(form).display).toBe("grid");
  expect(screen.getByRole("searchbox", { name: "¿Qué buscas?" })).toHaveClass("vrn-directory-search__input");
  expect(screen.getByRole("textbox", { name: "¿Dónde?" })).toHaveClass("vrn-directory-search__input");
});

it("accepts server-safe trailing actions without changing native search fields", async () => {
  const user = userEvent.setup();
  const { container } = renderNext(
    <NextDirectorySearchForm
      action="/directorio"
      defaultValue={{ query: "restaurantes", location: "Baltimore, MD" }}
      fieldIdPrefix="action-search"
      locationTrailingAction={<button aria-label="Limpiar ubicación" type="button"><X /></button>}
      queryTrailingAction={<button aria-label="Limpiar búsqueda" type="button"><X /></button>}
    />,
  );

  const query = screen.getByRole("searchbox", { name: "¿Qué buscas?" });
  const location = screen.getByRole("textbox", { name: "¿Dónde?" });
  const queryLabel = screen.getByText("¿Qué buscas?", { selector: "label" });
  const locationLabel = screen.getByText("¿Dónde?", { selector: "label" });
  expect(query.id).not.toBe("");
  expect(location.id).not.toBe("");
  expect(query.id).not.toBe(location.id);
  expect(queryLabel).toHaveAttribute("for", query.id);
  expect(locationLabel).toHaveAttribute("for", location.id);
  expect(container.querySelector("label button")).toBeNull();

  await user.click(queryLabel);
  expect(query).toHaveFocus();
  await user.tab();
  expect(screen.getByRole("button", { name: "Limpiar búsqueda" })).toHaveFocus();
  await user.tab();
  expect(location).toHaveFocus();
  await user.tab();
  expect(screen.getByRole("button", { name: "Limpiar ubicación" })).toHaveFocus();
  await user.tab();
  expect(screen.getByRole("button", { name: "Buscar" })).toHaveFocus();
  await user.click(locationLabel);
  expect(location).toHaveFocus();
  await user.click(screen.getByRole("button", { name: "Limpiar búsqueda" }));
  expect(query).toHaveAttribute("name", "q");
  expect(screen.getByRole("button", { name: "Limpiar ubicación" }).querySelector("svg"))
    .toHaveAttribute("aria-hidden", "true");
});

it("derives unique explicit field ids for multiple server-renderable forms", () => {
  renderNext(
    <>
      <NextDirectorySearchForm
        aria-label="Buscar comercios"
        action="/comercios"
        defaultValue={{ query: "", location: "" }}
        fieldIdPrefix="commerce-search"
      />
      <NextDirectorySearchForm
        aria-label="Buscar profesionales"
        action="/profesionales"
        defaultValue={{ query: "", location: "" }}
        fieldIdPrefix="professional-search"
      />
    </>,
  );

  const commerce = screen.getByRole("search", { name: "Buscar comercios" });
  const professional = screen.getByRole("search", { name: "Buscar profesionales" });
  const commerceQuery = commerce.querySelector<HTMLInputElement>('[name="q"]');
  const professionalQuery = professional.querySelector<HTMLInputElement>('[name="q"]');
  expect(commerceQuery).toHaveAttribute("id", "commerce-search-query");
  expect(professionalQuery).toHaveAttribute("id", "professional-search-query");
  expect(new Set(Array.from(document.querySelectorAll("input"), (input) => input.id)).size).toBe(4);
});
