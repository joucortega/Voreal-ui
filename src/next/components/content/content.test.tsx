import { createRef } from "react";
import { screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { expect, it } from "vitest";
import type { VorealNextImageProps } from "../../adapters";
import { renderVorealNext as renderNext } from "../../testing/render-voreal-next";
import { NextAvatar, NextRating, NextReviewSummary } from "./content";
import "./content.css";

function TestImage(props: VorealNextImageProps) {
  return <img {...props} data-test-image="true" />;
}

it("renders useful initials when an avatar image is unavailable", () => {
  renderNext(<NextAvatar name="  Ana María Pérez  " />);

  const fallback = screen.getByRole("img", { name: "Ana María Pérez" });
  expect(fallback).toHaveTextContent("AP");
  expect(fallback).toHaveClass("vrn-avatar__fallback");
});

it("renders avatar media through the shared adapter with stable dimensions", () => {
  renderNext(<NextAvatar ImageComponent={TestImage} imageAlt="Retrato de Ana" name="Ana Pérez" src="/ana.webp" />);

  const image = screen.getByRole("img", { name: "Retrato de Ana" });
  expect(image).toHaveAttribute("data-test-image", "true");
  expect(image).toHaveAttribute("src", "/ana.webp");
  expect(image).toHaveAttribute("width", "40");
  expect(image).toHaveAttribute("height", "40");
  expect(image).toHaveClass("vrn-avatar__image");
  expect(getComputedStyle(image).objectFit).toBe("cover");
});

it("normalizes invalid avatar dimensions without losing consumer props or refs", () => {
  const ref = createRef<HTMLSpanElement>();
  renderNext(
    <NextAvatar
      ref={ref}
      ImageComponent={TestImage}
      className="profile-avatar"
      data-owner="ana"
      imageHeight={Number.NaN}
      imageWidth={0}
      name="Ana Pérez"
      size="lg"
      src="/ana.webp"
    />,
  );

  const avatar = screen.getByRole("img", { name: "Ana Pérez" }).closest(".vrn-avatar");
  const image = screen.getByRole("img", { name: "Ana Pérez" });
  expect(ref.current).toBe(avatar);
  expect(avatar).toHaveClass("vrn-avatar", "profile-avatar");
  expect(avatar).toHaveAttribute("data-owner", "ana");
  expect(image).toHaveAttribute("width", "56");
  expect(image).toHaveAttribute("height", "56");
});

it("exposes a localized rating label and renders stars through the icon adapter", () => {
  renderNext(<NextRating value={4.7} reviewCount={128} />);

  const rating = screen.getByLabelText("4.7 de 5, 128 reseñas");
  expect(rating.querySelectorAll("svg")).toHaveLength(5);
  expect(rating).not.toHaveTextContent(/[★☆]/u);
});

it.each([
  ["non-finite", Number.POSITIVE_INFINITY, "0 de 5"],
  ["negative", -2, "0 de 5"],
  ["above maximum", 8, "5 de 5"],
] as const)("normalizes a %s rating instead of exposing invalid data", (_case, value, accessibleName) => {
  renderNext(<NextRating value={value} />);
  expect(screen.getByLabelText(accessibleName)).toBeInTheDocument();
});

it("keeps an explicit rating label and normalizes an invalid review count", () => {
  renderNext(<NextRating label="Calificación del negocio" reviewCount={-4} value={4} />);
  const rating = screen.getByLabelText("Calificación del negocio");
  expect(rating).toHaveTextContent("0 reseñas");
  expect(rating).not.toHaveTextContent("-4");
});

it("renders a dedicated zero-review state without review bars", () => {
  const { container } = renderNext(<NextReviewSummary distribution={[]} total={0} />);

  expect(screen.getByText("Sin reseñas todavía")).toBeInTheDocument();
  expect(container.querySelector("progress")).toBeNull();
});

it("uses the valid distribution sum when it disagrees with the reported total", () => {
  renderNext(
    <NextReviewSummary
      average={4.5}
      distribution={[
        { count: 3, rating: 5 },
        { count: 1, rating: 4 },
      ]}
      total={100}
    />,
  );

  const summary = screen.getByLabelText("Resumen de 100 reseñas");
  expect(within(summary).getByLabelText("5 estrellas: 3 de 4")).toHaveAttribute("max", "4");
  expect(within(summary).getByLabelText("5 estrellas: 3 de 4")).toHaveAttribute("value", "3");
  expect(within(summary).getByText("100 reseñas")).toBeVisible();
});

it("derives a finite average from valid distribution data when the supplied average is invalid", () => {
  renderNext(
    <NextReviewSummary
      average={Number.NaN}
      distribution={[{ count: 2, rating: 5 }]}
      total={2}
    />,
  );

  expect(screen.getByLabelText("5 de 5, 2 reseñas")).toBeInTheDocument();
});

it("keeps an empty distribution finite when reviews are reported", () => {
  renderNext(<NextReviewSummary distribution={[]} total={3} />);

  const bars = screen.getByLabelText("Resumen de 3 reseñas").querySelectorAll("progress");
  expect(bars).toHaveLength(5);
  for (const bar of bars) {
    expect(bar).toHaveAttribute("max", "3");
    expect(bar).toHaveAttribute("value", "0");
  }
});

it("preserves summary props and contains every review row when labels grow", () => {
  const ref = createRef<HTMLDivElement>();
  const { container } = renderNext(
    <NextReviewSummary
      ref={ref}
      className="business-reviews"
      data-section="reviews"
      distribution={[{ count: 1, rating: 1 }]}
      total={1}
    />,
  );

  const summary = screen.getByLabelText("Resumen de 1 reseña");
  expect(ref.current).toBe(summary);
  expect(summary).toHaveClass("vrn-review-summary", "business-reviews");
  expect(summary).toHaveAttribute("data-section", "reviews");
  for (const row of container.querySelectorAll(".vrn-review-summary__row")) {
    const styles = getComputedStyle(row);
    expect(styles.minInlineSize).toMatch(/^0(?:px)?$/u);
    expect(styles.gridTemplateColumns).toContain("minmax(0");
  }
});

it("has no detectable accessibility violations for avatars, ratings, and review summaries", async () => {
  const { container } = renderNext(
    <>
      <NextAvatar name="Ana Pérez" />
      <NextRating reviewCount={12} value={4.4} />
      <NextReviewSummary
        average={4.4}
        distribution={[
          { count: 8, rating: 5 },
          { count: 4, rating: 4 },
        ]}
        total={12}
      />
    </>,
  );

  const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
  expect(results.violations).toEqual([]);
});
