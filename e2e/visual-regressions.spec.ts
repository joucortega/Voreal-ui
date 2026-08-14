import { expect, test } from "@playwright/test";
import axe from "axe-core";

test("keeps transient toast copy and controls in separate regions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/iframe.html?id=interaction-navigation-overlays-and-feedback--transient-toast&viewMode=story");
  await page.getByRole("button", { name: "Guardar cambios" }).click();

  const title = page.locator(".vr-toast__title");
  const description = page.locator(".vr-toast__description");
  const close = page.locator(".vr-toast__close");
  await expect(title).toBeVisible();
  await expect.poll(() => close.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThanOrEqual(44);

  const [titleBox, descriptionBox, closeBox] = await Promise.all([
    title.boundingBox(),
    description.boundingBox(),
    close.boundingBox(),
  ]);
  expect(titleBox).not.toBeNull();
  expect(descriptionBox).not.toBeNull();
  expect(closeBox).not.toBeNull();
  expect(Math.abs(titleBox!.x - descriptionBox!.x)).toBeLessThanOrEqual(2);
  expect(descriptionBox!.y).toBeGreaterThanOrEqual(titleBox!.y + titleBox!.height);
  expect(closeBox!.x).toBeGreaterThan(titleBox!.x + titleBox!.width);
  expect(closeBox!.width).toBeGreaterThanOrEqual(44);
  expect(closeBox!.height).toBeGreaterThanOrEqual(44);
});

for (const viewport of [
  { height: 812, name: "mobile", width: 375 },
  { height: 900, name: "desktop", width: 1440 },
]) {
  test(`keeps CommunityHub geometry stable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ height: viewport.height, width: viewport.width });
    await page.goto("/iframe.html?id=identity-avatar-language--community-orbit&viewMode=story");

    const stage = page.locator(".vr-community-hub__stage");
    const orbit = page.locator(".vr-community-hub__orbit");
    await expect(stage).toBeVisible();
    const [stageBox, orbitBox] = await Promise.all([stage.boundingBox(), orbit.boundingBox()]);
    expect(stageBox).not.toBeNull();
    expect(orbitBox).not.toBeNull();
    const stageCenter = stageBox!.x + stageBox!.width / 2;
    const orbitCenter = orbitBox!.x + orbitBox!.width / 2;
    expect(Math.abs(stageCenter - orbitCenter)).toBeLessThanOrEqual(4);
    expect(orbitBox!.x).toBeGreaterThanOrEqual(stageBox!.x);
    expect(orbitBox!.x + orbitBox!.width).toBeLessThanOrEqual(stageBox!.x + stageBox!.width);
  });
}

test("passes WCAG AA checks in Red Latina and Mercado Nocturno", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/iframe.html?id=patterns-directory-reference--mercado-contemporaneo&viewMode=story");
  await page.addScriptTag({ content: axe.source });

  for (const theme of ["red-latina", "mercado-nocturno"]) {
    await page.locator("[data-vr-root]").evaluate((root, nextTheme) => root.setAttribute("data-vr-theme", nextTheme), theme);
    const expectedMutedColor = theme === "red-latina" ? "rgb(86, 97, 122)" : "rgb(197, 206, 222)";
    await expect.poll(() => page.locator(".vr-action-rail__item").last().evaluate((element) => getComputedStyle(element).color)).toBe(expectedMutedColor);
    const violations = await page.evaluate(async () => {
      const results = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2aa"] } });
      return results.violations;
    });
    expect(violations, `${theme}: ${violations.map((item) => `${item.id}: ${item.nodes.length}`).join(", ")}`).toEqual([]);
  }
});

declare global {
  interface Window {
    axe: typeof axe;
  }
}
