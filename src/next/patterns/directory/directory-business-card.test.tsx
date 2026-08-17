import { screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { expect, it } from "vitest";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextDirectoryBusinessCard } from "./directory-business-card";
import type { VorealNextImageProps, VorealNextLinkProps } from "./directory.types";
import "./directory.css";

const completeBusiness = {
  category: "Impuestos y contabilidad",
  description: "Atención bilingüe para familias y pequeñas empresas.",
  distance: "4.2 mi",
  href: "/negocios/martinez-tax-services",
  id: "martinez-tax",
  image: {
    alt: "Oficina de Martínez Tax Services",
    height: 800,
    src: "/voreal-next/directory/martinez-tax.webp",
    width: 1200,
  },
  location: "Dundalk, MD",
  name: "Martínez Tax Services",
  rating: 4.8,
  reviewCount: 96,
  status: { kind: "open" as const, label: "Abierto" },
  verified: true,
};

const partialBusiness = {
  category: "Servicios comunitarios",
  href: "/negocios/centro-integral",
  id: "centro-integral",
  location: "Silver Spring, MD",
  name: "Centro Integral",
};

function TestLink({ href, ...props }: VorealNextLinkProps) {
  return <a {...props} data-test-link="true" href={href} />;
}

function TestImage(props: VorealNextImageProps) {
  return <img {...props} data-test-image="true" />;
}

it("keeps the approved card anatomy and injected navigation/media adapters", () => {
  renderNext(
    <NextDirectoryBusinessCard
      business={completeBusiness}
      favoriteControl={<button aria-label="Guardar Martínez Tax Services" type="button" />}
      ImageComponent={TestImage}
      LinkComponent={TestLink}
    />,
  );

  const article = screen.getByRole("article", { name: "Martínez Tax Services" });
  expect(within(article).getByText("Impuestos y contabilidad")).toBeVisible();
  expect(within(article).getByRole("heading", { level: 3, name: "Martínez Tax Services" })).toBeVisible();
  expect(within(article).getByText("Atención bilingüe para familias y pequeñas empresas.")).toBeVisible();
  expect(within(article).getByText("Dundalk, MD · 4.2 mi")).toBeVisible();
  expect(within(article).getByText("4.8 · 96 reseñas")).toBeVisible();
  expect(within(article).getByText("Abierto")).toBeVisible();
  expect(within(article).getByText("Verificado")).toBeVisible();
  expect(within(article).getByRole("link", { name: "Ver Martínez Tax Services" })).toHaveAttribute("data-test-link", "true");

  const image = within(article).getByRole("img", { name: "Oficina de Martínez Tax Services" });
  expect(image).toHaveAttribute("data-test-image", "true");
  expect(image).toHaveAttribute("src", "/voreal-next/directory/martinez-tax.webp");
  expect(image).toHaveAttribute("width", "1200");
  expect(image).toHaveAttribute("height", "800");
  expect(image).toHaveAttribute("sizes", "(max-width: 47.99rem) calc(100vw - 2rem), (max-width: 74.99rem) calc(50vw - 3rem), 22rem");
  expect(image).toHaveAttribute("loading", "lazy");
  expect(image).toHaveClass("vrn-directory-card__image");
});

it("renders a stable neutral fallback and no invented rating", () => {
  const { container } = renderNext(<NextDirectoryBusinessCard business={partialBusiness} />);

  expect(screen.getByRole("img", { name: "Imagen no disponible para Centro Integral" })).toBeVisible();
  expect(screen.getByText("Sin reseñas")).toBeVisible();
  expect(screen.queryByText(/0\.0/u)).not.toBeInTheDocument();
  expect(screen.queryByText("Abierto")).not.toBeInTheDocument();
  expect(screen.queryByText("Verificado")).not.toBeInTheDocument();
  const description = container.querySelector(".vrn-directory-card__description");
  expect(description).toBeInTheDocument();
  expect(description).toBeEmptyDOMElement();
  expect(description).toHaveAttribute("aria-hidden", "true");
});

it.each([
  ["negative rating", -0.1, 8],
  ["rating above five", 5.1, 8],
  ["non-finite rating", Number.POSITIVE_INFINITY, 8],
  ["fractional review count", 4.8, 1.5],
  ["unsafe review count", 4.8, Number.MAX_SAFE_INTEGER + 1],
] as const)("does not render invalid review data: %s", (_label, rating, reviewCount) => {
  renderNext(<NextDirectoryBusinessCard business={{ ...partialBusiness, rating, reviewCount }} />);

  expect(screen.getByText("Sin reseñas")).toBeVisible();
  expect(screen.queryByText(new RegExp(String(rating), "u"))).not.toBeInTheDocument();
});

it("accepts inclusive zero-to-five rating boundaries with positive integer reviews", () => {
  renderNext(
    <>
      <NextDirectoryBusinessCard business={{ ...partialBusiness, id: "zero", name: "Cero", rating: 0, reviewCount: 1 }} />
      <NextDirectoryBusinessCard business={{ ...partialBusiness, id: "five", name: "Cinco", rating: 5, reviewCount: 2 }} />
    </>,
  );

  expect(screen.getByText("0.0 · 1 reseña")).toBeVisible();
  expect(screen.getByText("5.0 · 2 reseñas")).toBeVisible();
});

it("keeps favorite interaction outside the card link", () => {
  const { container } = renderNext(
    <NextDirectoryBusinessCard business={completeBusiness} favoriteControl={<button aria-label="Guardar negocio" type="button" />} />,
  );

  expect(container.querySelector("a button, button a")).toBeNull();
  const favorite = getComputedStyle(screen.getByRole("button", { name: "Guardar negocio" }));
  expect(favorite.minBlockSize).toBe("44px");
  expect(favorite.minInlineSize).toBe("44px");
});

it("preserves the 3:2 media crop, wrapping name, two-line description and bottom CTA", () => {
  renderNext(<NextDirectoryBusinessCard business={completeBusiness} />);

  const image = screen.getByRole("img", { name: "Oficina de Martínez Tax Services" });
  const media = image.parentElement!;
  const heading = screen.getByRole("heading", { name: "Martínez Tax Services" });
  const description = screen.getByText("Atención bilingüe para familias y pequeñas empresas.");
  const cta = screen.getByRole("link", { name: "Ver Martínez Tax Services" });

  expect(getComputedStyle(media).aspectRatio).toBe("3 / 2");
  expect(getComputedStyle(media).overflow).toBe("hidden");
  expect(getComputedStyle(image).objectFit).toBe("cover");
  expect(getComputedStyle(heading).whiteSpace).not.toBe("nowrap");
  expect(getComputedStyle(description).webkitLineClamp).toBe("2");
  expect(getComputedStyle(cta).marginBlockStart).toBe("auto");
});

it("allows every textual card row to wrap long content without widening the card", () => {
  const longWord = "ServiciosComunitariosMultilingüesSinSeparadores";
  const { container } = renderNext(
    <NextDirectoryBusinessCard
      business={{
        ...completeBusiness,
        category: longWord,
        description: `${longWord}${longWord}`,
        location: `${longWord}, MD`,
      }}
    />,
  );

  for (const selector of [
    ".vrn-directory-card__category",
    ".vrn-directory-card__description",
    ".vrn-directory-card__location",
    ".vrn-directory-card__location > span",
  ]) {
    const element = container.querySelector(selector);
    expect(element).toBeInTheDocument();
    const style = getComputedStyle(element!);
    expect(style.minInlineSize).toMatch(/^0(?:px)?$/u);
    expect(style.overflowWrap).toBe("anywhere");
  }
});

it("Voreal Next business card has no detectable accessibility violations", async () => {
  const { container } = renderNext(
    <NextDirectoryBusinessCard
      business={completeBusiness}
      favoriteControl={<button aria-label="Guardar Martínez Tax Services" type="button" />}
    />,
  );

  const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});
