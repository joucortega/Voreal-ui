import { render } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { VorealNextRoot } from "../root";
import "./tokens.css";

const semanticTokens = [
  "--vrn-color-canvas",
  "--vrn-color-surface",
  "--vrn-color-surface-muted",
  "--vrn-color-surface-raised",
  "--vrn-color-ink",
  "--vrn-color-text-muted",
  "--vrn-color-text-subtle",
  "--vrn-color-border",
  "--vrn-color-border-strong",
  "--vrn-color-action",
  "--vrn-color-action-hover",
  "--vrn-color-action-active",
  "--vrn-color-action-soft",
  "--vrn-color-on-action",
  "--vrn-color-focus",
  "--vrn-color-success",
  "--vrn-color-success-soft",
  "--vrn-color-warning",
  "--vrn-color-warning-soft",
  "--vrn-color-danger",
  "--vrn-color-danger-soft",
  "--vrn-color-info",
  "--vrn-color-info-soft",
] as const;

afterEach(() => {
  document.head.querySelector("[data-theme-contract-test]")?.remove();
});

it("provides the exact approved public semantic token inventory inside a Voreal Next root", () => {
  const { getByTestId } = render(<VorealNextRoot data-testid="next-root" />);
  const styles = getComputedStyle(getByTestId("next-root"));

  for (const token of semanticTokens) {
    expect(styles.getPropertyValue(token).trim()).not.toBe("");
  }

  expect(semanticTokens).toHaveLength(23);
});

it("scopes consumer theme overrides to the themed root", () => {
  const themeStyle = document.createElement("style");
  themeStyle.dataset.themeContractTest = "";
  themeStyle.textContent = '[data-voreal-ui="next"][data-vrn-theme="consumer"] { --vrn-color-action: #7b2cbf; }';
  document.head.append(themeStyle);

  const { getByTestId } = render(
    <>
      <VorealNextRoot data-testid="consumer-root" theme="consumer" />
      <VorealNextRoot data-testid="sibling-root" />
    </>,
  );

  expect(getComputedStyle(getByTestId("consumer-root")).getPropertyValue("--vrn-color-action").trim()).toBe("#7b2cbf");
  expect(getComputedStyle(getByTestId("sibling-root")).getPropertyValue("--vrn-color-action").trim()).toBe("#0f5bde");
  expect(getComputedStyle(document.documentElement).getPropertyValue("--vrn-color-action").trim()).toBe("");
  expect(getComputedStyle(document.body).getPropertyValue("--vrn-color-action").trim()).toBe("");
});
