import { render, screen } from "@testing-library/react";
import type { VorealNextLinkProps } from "../../adapters";
import { expect, it } from "vitest";
import { createRef, forwardRef } from "react";
import { Heart } from "../../icons";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextActionLink, NextButton, NextButtonGroup, NextIconButton } from "./actions";
import "./actions.css";

function OrdinaryLinkFixture({ href, ...props }: VorealNextLinkProps) {
  return <a {...props} href={href} />;
}

const rejectedActionLinkAdapter = (
  // @ts-expect-error NextActionLink needs an adapter that forwards an anchor ref.
  <NextActionLink LinkComponent={OrdinaryLinkFixture} href="/directorio">
    Explorar directorio
  </NextActionLink>
);
void rejectedActionLinkAdapter;

const rejectedMissingActionLinkHref = (
  // @ts-expect-error NextActionLink always requires a navigation destination.
  <NextActionLink>Explorar directorio</NextActionLink>
);
void rejectedMissingActionLinkHref;

it("disables a loading primary button without replacing its accessible name", () => {
  renderNext(<NextButton loading>Buscar</NextButton>);
  expect(screen.getByRole("button", { name: "Buscar" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Buscar" })).toHaveAttribute("aria-busy", "true");
});

it("requires a text label for an icon-only button", () => {
  renderNext(
    <NextIconButton label="Guardar en favoritos">
      <Heart />
    </NextIconButton>,
  );
  expect(screen.getByRole("button", { name: "Guardar en favoritos" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Guardar en favoritos" }).querySelector("svg")).toHaveClass("vrn-icon");
});

it("labels an attached button group for assistive technology", () => {
  render(
    <NextButtonGroup attached label="Formato">
      <NextButton>Lista</NextButton>
      <NextButton>Grid</NextButton>
    </NextButtonGroup>,
  );

  expect(screen.getByRole("group", { name: "Formato" })).toHaveAttribute("data-attached", "true");
});

it("forwards a button group ref to its rendered div", () => {
  const ref = createRef<HTMLDivElement>();
  render(<NextButtonGroup label="Formato" ref={ref}>Formato</NextButtonGroup>);

  expect(ref.current).toBe(screen.getByRole("group", { name: "Formato" }));
});

it("renders an action link through its supplied navigation adapter without nesting a button", () => {
  let capturedHref: string | undefined;
  const LinkFixture = forwardRef<HTMLAnchorElement, VorealNextLinkProps>(function LinkFixture({ href, ...props }, linkRef) {
    capturedHref = href;
    return <a {...props} ref={linkRef} href={href} />;
  });

  render(
    <NextActionLink LinkComponent={LinkFixture} href="/directorio">
      Explorar directorio
    </NextActionLink>,
  );

  const link = screen.getByRole("link", { name: "Explorar directorio" });
  expect(capturedHref).toBe("/directorio");
  expect(link).toHaveAttribute("href", "/directorio");
  expect(link.querySelector("button")).toBeNull();
});

it("keeps a small action link at the shared 44px minimum target", () => {
  render(<NextActionLink href="/directorio" size="sm">Ir</NextActionLink>);

  const styles = getComputedStyle(screen.getByRole("link", { name: "Ir" }));
  expect(styles.minBlockSize).toBe("44px");
  expect(styles.minInlineSize).toBe("44px");
});

it("keeps short-label small buttons and small icon buttons at 44px in both axes", () => {
  renderNext(
    <>
      <NextButton size="sm">A</NextButton>
      <NextIconButton label="Favorite" size="sm"><Heart /></NextIconButton>
    </>,
  );

  for (const button of [
    screen.getByRole("button", { name: "A" }),
    screen.getByRole("button", { name: "Favorite" }),
  ]) {
    const styles = getComputedStyle(button);
    expect(styles.minBlockSize).toBe("44px");
    expect(styles.minInlineSize).toBe("44px");
  }
});

it("forwards an action link ref through a forwarding link adapter", () => {
  const ref = createRef<HTMLAnchorElement>();
  const LinkFixture = forwardRef<HTMLAnchorElement, VorealNextLinkProps>(function LinkFixture({ href, ...props }, linkRef) {
    return <a {...props} ref={linkRef} href={href} />;
  });
  render(
    <NextActionLink LinkComponent={LinkFixture} href="/directorio" ref={ref}>
      Explorar directorio
    </NextActionLink>,
  );

  expect(ref.current).toBe(screen.getByRole("link", { name: "Explorar directorio" }));
});

it("forwards an action link ref to a native anchor adapter", () => {
  const ref = createRef<HTMLAnchorElement>();
  render(
    <NextActionLink LinkComponent="a" href="/directorio" ref={ref}>
      Explorar directorio
    </NextActionLink>,
  );

  expect(ref.current).toBe(screen.getByRole("link", { name: "Explorar directorio" }));
});
