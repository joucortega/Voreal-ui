import { expect, test } from "@playwright/test";
import axe from "axe-core";

const progressiveUrl = "/iframe.html?id=patterns-directory-search--progressive-suggestions&viewMode=story";
const outOfOrderUrl = "/iframe.html?id=patterns-directory-search--out-of-order-responses&viewMode=story";

async function expectVisibleFocus(locator: import("@playwright/test").Locator) {
  await expect(locator).toBeFocused();
  const focus = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
  });
  expect(focus.style).not.toBe("none");
  expect(focus.width).toBeGreaterThanOrEqual(2);
}

test("uses suggestions but keeps native submit and history canonical", async ({ page }) => {
  await page.goto(progressiveUrl);
  const query = page.getByRole("combobox", { name: "¿Qué buscas?" });
  await query.fill("ta");
  await expect(page.getByRole("option", { name: /Sabor de Casa/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(query).toHaveValue("ta");
  await page.getByRole("button", { name: "Buscar" }).click();
  await expect(page.getByTestId("confirmed-search")).toContainText("q=ta");
  await page.goBack();
  await expect(page.getByTestId("confirmed-search")).toContainText("Sin búsqueda confirmada");
  await page.goForward();
  await expect(page.getByTestId("confirmed-search")).toContainText("q=ta");
});

test("restores query and location from a direct shared canonical URL", async ({ page }) => {
  await page.goto(`${progressiveUrl}&q=arepas&location=21222`);
  await expect(page.getByRole("combobox", { name: "¿Qué buscas?" })).toHaveValue("arepas");
  await expect(page.getByRole("textbox", { name: "¿Dónde?" })).toHaveValue("21222");
  await expect(page.getByTestId("confirmed-search")).toHaveText("?q=arepas&location=21222");
});

test("keeps visible keyboard focus on native query and location inputs", async ({ page }) => {
  await page.goto("/iframe.html?id=patterns-directory-search--server-fallback&viewMode=story");
  await page.keyboard.press("Tab");
  await expectVisibleFocus(page.getByRole("searchbox", { name: "¿Qué buscas?" }));
  await page.keyboard.press("Tab");
  await expectVisibleFocus(page.getByRole("textbox", { name: "¿Dónde?" }));
});

test("keeps native input focus visible in forced colors", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/iframe.html?id=patterns-directory-search--server-fallback&viewMode=story");
  await page.keyboard.press("Tab");
  await expectVisibleFocus(page.getByRole("searchbox", { name: "¿Qué buscas?" }));
  await page.keyboard.press("Tab");
  await expectVisibleFocus(page.getByRole("textbox", { name: "¿Dónde?" }));
});

test("submits canonical fields through the fallback form's native GET request", async ({ page }) => {
  await page.goto("/iframe.html?id=patterns-directory-search--server-fallback&viewMode=story");
  await page.getByRole("searchbox", { name: "¿Qué buscas?" }).fill("tacos");
  await page.getByRole("textbox", { name: "¿Dónde?" }).fill("21222");
  const requestPromise = page.waitForRequest((request) => new URL(request.url()).pathname === "/directorio");
  await page.getByRole("button", { name: "Buscar" }).click();
  const requestUrl = new URL((await requestPromise).url());
  expect(requestUrl.searchParams.get("q")).toBe("tacos");
  expect(requestUrl.searchParams.get("location")).toBe("21222");
  expect(requestUrl.searchParams.get("page")).toBe("1");
});

test("keeps the suggestion panel inside a 375px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(progressiveUrl);
  await page.getByRole("combobox", { name: "¿Qué buscas?" }).fill("ta");
  const panel = page.getByRole("listbox", { name: "Sugerencias" });
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(375);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
});

test("moves the active option with arrow keys while input focus remains on the combobox", async ({ page }) => {
  await page.goto(progressiveUrl);
  const query = page.getByRole("combobox", { name: "¿Qué buscas?" });
  await query.fill("ta");
  await expect(page.getByRole("option", { name: /Sabor de Casa/ })).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: /Sabor de Casa/ })).toHaveAttribute("aria-selected", "true");
  await expectVisibleFocus(query);
});

test("ignores a late stale response after both deterministic requests resolve", async ({ page }) => {
  await page.goto(outOfOrderUrl);
  const query = page.getByRole("combobox", { name: "¿Qué buscas?" });
  await query.fill("ta");
  const releaseSlowResponse = page.getByTestId("out-of-order-slow-response");
  await expect(releaseSlowResponse).toHaveAttribute("data-slow-request-observed", "true");
  await query.fill("tacos");
  await expect(page.getByRole("option", { name: /Tacos del Barrio/ })).toBeVisible();
  await expect(releaseSlowResponse).toBeEnabled();
  await releaseSlowResponse.click();
  await expect(page.getByRole("option", { name: /Tacos del Barrio/ })).toBeVisible();
  await expect(page.getByRole("option", { name: /Sabor de Casa/ })).toHaveCount(0);
});

test("keeps the native form usable after a suggestion error", async ({ page }) => {
  await page.goto("/iframe.html?id=patterns-directory-search--error&viewMode=story");
  const query = page.getByRole("combobox", { name: "¿Qué buscas?" });
  await query.fill("ta");
  await expect(page.getByText("Las sugerencias no están disponibles. Aún puedes buscar")).toBeVisible();
  await page.getByRole("button", { name: "Buscar" }).click();
  await expect(page.getByTestId("confirmed-search")).toContainText("q=ta");
});

for (const theme of ["red-latina", "mercado-nocturno", "neutral"]) {
  test(`has no WCAG AA violations in ${theme}`, async ({ page }) => {
    await page.goto(`${progressiveUrl}&globals=theme:${theme}`);
    await page.addScriptTag({ content: axe.source });
    await page.getByRole("combobox", { name: "¿Qué buscas?" }).fill("ta");
    await expect(page.getByRole("option", { name: /Sabor de Casa/ })).toBeVisible();
    const violations = await page.evaluate(async () => {
      const results = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } });
      return results.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length }));
    });
    expect(violations).toEqual([]);
  });
}

test("uses compact density for both the search and its portalled suggestions", async ({ page }) => {
  await page.goto("/iframe.html?id=patterns-directory-search--compact&viewMode=story");
  await expect(page.locator('[data-vr-density="compact"] .vr-directory-search')).toBeVisible();
  await page.getByRole("combobox", { name: "¿Qué buscas?" }).fill("ta");
  await expect(page.getByRole("option", { name: /Sabor de Casa/ })).toBeVisible();
  await expect(page.locator('[data-vr-portal][data-vr-density="compact"]')).toBeVisible();
});

test("keeps the suggestion panel anchored at tablet width", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(progressiveUrl);
  const query = page.getByRole("combobox", { name: "¿Qué buscas?" });
  await query.fill("ta");
  const panel = page.getByRole("listbox", { name: "Sugerencias" });
  await expect(page.getByRole("option", { name: /Sabor de Casa/ })).toBeVisible();
  const [queryBox, panelBox] = await Promise.all([query.boundingBox(), panel.boundingBox()]);
  expect(queryBox).not.toBeNull();
  expect(panelBox).not.toBeNull();
  expect(Math.abs(panelBox!.x - queryBox!.x)).toBeLessThanOrEqual(1);
  expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(768);
});

test("keeps long suggestion content usable at 200 percent text sizing", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/iframe.html?id=patterns-directory-search--long-content&viewMode=story");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await page.getByRole("combobox", { name: "¿Qué buscas?" }).fill("ta");
  const option = page.getByRole("option", { name: /Centro Comunitario de Servicios Integrales/ });
  await expect(option).toBeVisible();
  await expect(option).toContainText("comunidades vecinas");
  await expect(option).toContainText("Servicios comunitarios");
  const image = option.locator(".vr-directory-suggestions__image");
  await expect(image).toBeVisible();
  const imageBox = await image.boundingBox();
  expect(imageBox).not.toBeNull();
  expect(Math.abs(imageBox!.width - imageBox!.height)).toBeLessThanOrEqual(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("remains functional with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(progressiveUrl);
  await page.getByRole("combobox", { name: "¿Qué buscas?" }).fill("ta");
  await expect(page.getByRole("listbox", { name: "Sugerencias" })).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: /Sabor de Casa/ })).toHaveAttribute("aria-selected", "true");
});
