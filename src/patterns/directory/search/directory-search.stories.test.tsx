import { render, waitFor } from "@testing-library/react";
import { expect, it } from "vitest";
import directorySearchMeta, {
  getCanonicalConfirmedDirectorySearch,
  Mobile375,
  Tablet768,
} from "./directory-search.stories";

it("signals when the interactive directory search story is ready", async () => {
  const DirectorySearchStory = directorySearchMeta.component;

  render(<DirectorySearchStory />);

  await waitFor(() => {
    expect(document.querySelector("[data-vr-story-ready='true']")).toBeInTheDocument();
  });
});

it("uses an exact 375px viewport for the Mobile375 story", () => {
  expect(Mobile375.parameters?.viewport).toMatchObject({
    defaultViewport: "directory-mobile-375",
    viewports: {
      "directory-mobile-375": {
        styles: { height: "812px", width: "375px" },
      },
    },
  });
});

it("uses an exact tablet viewport for the Tablet768 story", () => {
  expect(Tablet768.parameters?.viewport).toMatchObject({
    defaultViewport: "directory-tablet-768",
    viewports: {
      "directory-tablet-768": {
        styles: { height: "1024px", width: "768px" },
      },
    },
  });
});

it("extracts only canonical confirmed-search parameters from Storybook history", () => {
  expect(getCanonicalConfirmedDirectorySearch("?id=patterns-directory-search--progressive-suggestions&viewMode=story")).toBe("");
  expect(getCanonicalConfirmedDirectorySearch("?id=story&viewMode=story&sort=relevance&page=1")).toBe("");
  expect(getCanonicalConfirmedDirectorySearch(
    "?id=patterns-directory-search--progressive-suggestions&viewMode=story&q=%20tacos%20&location=21222&page=1",
  )).toBe("?q=tacos&location=21222");
});
