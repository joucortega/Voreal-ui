import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { renderVorealNext as renderNext } from "../testing/render-voreal-next";
import { NextRating, NextReviewSummary } from "./content";
import { NextProgress } from "./feedback";
import { NextBreadcrumbs, NextStepper } from "./navigation";
import { NextDialog } from "./overlays";

const englishReviewMessages = {
  emptyLabel: "No reviews yet",
  formatAccessibleLabel: ({ max, reviewCount, value }: { max: number; reviewCount?: number; value: number }) =>
    `${value} out of ${max}${reviewCount === undefined ? "" : `, ${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`}`,
  formatDistributionLabel: ({ count, rating, total }: { count: number; rating: number; total: number }) =>
    `${rating} ${rating === 1 ? "star" : "stars"}: ${count} of ${total}`,
  formatReviewCount: (count: number) => `${count} ${count === 1 ? "review" : "reviews"}`,
  formatStarLabel: (rating: number) => `${rating} ${rating === 1 ? "star" : "stars"}`,
  formatSummaryLabel: (total: number) => `Summary of ${total} ${total === 1 ? "review" : "reviews"}`,
};

it("composes English copy across navigation, feedback, content, and overlays", async () => {
  renderNext(
    <>
      <NextBreadcrumbs label="Breadcrumbs" items={[{ href: "/", label: "Home" }, { label: "Current" }]} />
      <NextStepper
        label="Publishing"
        statusLabels={{ complete: "Complete", current: "Current", error: "Error", upcoming: "Upcoming" }}
        steps={[
          { label: "Details", status: "complete", value: "details" },
          { label: "Review", status: "current", value: "review" },
          { label: "Publish", status: "upcoming", value: "publish" },
          { label: "Fix", status: "error", value: "fix" },
        ]}
        value="review"
      />
      <NextProgress indeterminateLabel="In progress" label="Uploading" />
      <NextRating messages={englishReviewMessages} reviewCount={2} value={4.5} />
      <NextReviewSummary
        distribution={[{ count: 2, rating: 5 }]}
        messages={englishReviewMessages}
        total={2}
      />
      <NextReviewSummary distribution={[]} messages={englishReviewMessages} total={0} />
      <NextDialog closeLabel="Close profile" title="Profile" trigger={<button>Open profile</button>}>
        Content
      </NextDialog>
    </>,
  );

  expect(screen.getByRole("navigation", { name: "Breadcrumbs" })).toBeVisible();
  const stepper = screen.getByRole("navigation", { name: "Publishing" });
  for (const status of ["Complete", "Current", "Upcoming", "Error"]) {
    expect(within(stepper).getByText(status)).toBeVisible();
  }
  expect(screen.getByRole("progressbar", { name: "Uploading" })).toHaveAttribute("aria-valuetext", "In progress");
  expect(screen.getByLabelText("4.5 out of 5, 2 reviews")).toHaveTextContent("2 reviews");

  const summary = screen.getByRole("group", { name: "Summary of 2 reviews" });
  expect(within(summary).getByText("5 stars")).toBeVisible();
  expect(within(summary).getByRole("progressbar", { name: "5 stars: 2 of 2" })).toBeVisible();
  expect(screen.getByText("No reviews yet")).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "Open profile" }));
  expect(screen.getByRole("button", { name: "Close profile" })).toBeVisible();
});
