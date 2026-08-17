import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextDirectorySearchForm } from "./directory-search-form";
import "./directory.css";

it("renders a canonical GET search that works without JavaScript", () => {
  renderNext(
    <NextDirectorySearchForm
      action="/directorio"
      defaultValue={{ query: "restaurantes", location: "Baltimore, MD" }}
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
  renderNext(<NextDirectorySearchForm action="/directorio" defaultValue={{ query: "", location: "" }} />);

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
    />,
  );

  const form = screen.getByRole("search", { name: "Buscar en el directorio" });
  expect(getComputedStyle(form).display).toBe("grid");
  expect(screen.getByRole("searchbox", { name: "¿Qué buscas?" })).toHaveClass("vrn-directory-search__input");
  expect(screen.getByRole("textbox", { name: "¿Dónde?" })).toHaveClass("vrn-directory-search__input");
});
