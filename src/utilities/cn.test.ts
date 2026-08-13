import { expect, it } from "vitest";
import { cn } from "./cn";

it("keeps the last Tailwind utility while preserving Voreal classes", () => {
  expect(cn("vr-control", "px-2", false && "hidden", "px-4")).toBe("vr-control px-4");
});
