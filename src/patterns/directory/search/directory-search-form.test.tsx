import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { renderVoreal } from "../../../testing/render-voreal";
import "../../../tokens/component.css";
import "../../../themes/neutral.css";
import "../../../styles/accessibility.css";
import "./directory-search.css";
import { DirectorySearchForm } from "./directory-search-form";

function getDirectoryInputFocusRule(): CSSStyleRule | undefined {
  const visit = (rules: CSSRuleList): CSSStyleRule | undefined => {
    for (const rule of rules) {
      if (rule instanceof CSSStyleRule && rule.selectorText === ".vr-directory-search__input:focus-visible") return rule;
      if ("cssRules" in rule) {
        const match = visit((rule as CSSGroupingRule).cssRules);
        if (match) return match;
      }
    }
    return undefined;
  };
  for (const sheet of document.styleSheets) {
    const match = visit(sheet.cssRules);
    if (match) return match;
  }
  return undefined;
}

it("renders a native GET search with canonical names and initial values", () => {
  const { container } = renderVoreal(
    <DirectorySearchForm
      action="/directorio"
      defaultValue={{ query: "tacos", location: "21222", category: "food", sort: "rating", page: 3 }}
    />,
  );

  const form = screen.getByRole("search", { name: "Buscar en el directorio" });
  expect(form).toHaveAttribute("method", "get");
  expect(form).toHaveAttribute("action", "/directorio");
  expect(screen.getByRole("searchbox", { name: "¿Qué buscas?" })).toHaveAttribute("name", "q");
  expect(screen.getByRole("searchbox", { name: "¿Qué buscas?" })).toHaveValue("tacos");
  expect(screen.getByRole("textbox", { name: "¿Dónde?" })).toHaveAttribute("name", "location");
  expect(container.querySelector('input[name="page"]')).toHaveValue("1");
});

it("keeps visible keyboard focus on both native search inputs", async () => {
  const user = userEvent.setup();
  renderVoreal(<DirectorySearchForm action="/directorio" />);

  await user.tab();
  const query = screen.getByRole("searchbox", { name: "¿Qué buscas?" });
  expect(query).toHaveFocus();
  expect(query).toHaveClass("vr-directory-search__input");

  await user.tab();
  const location = screen.getByRole("textbox", { name: "¿Dónde?" });
  expect(location).toHaveFocus();
  expect(location).toHaveClass("vr-directory-search__input");

  const focusRule = getDirectoryInputFocusRule();
  expect(focusRule?.style.getPropertyValue("outline")).toContain("solid");
  expect(focusRule?.style.getPropertyValue("outline")).not.toContain("none");
});
