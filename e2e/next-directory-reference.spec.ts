import { expect, test, type Locator, type Page } from "@playwright/test";
import axe from "axe-core";
import { isNativeControlAppearanceVisible } from "./native-control-visibility";

const referenceUrl = "/iframe.html?id=next-patterns-directory-reference--cards&viewMode=story";
const storyUrl = (story: string) => `/iframe.html?id=next-patterns-directory-reference--${story}&viewMode=story`;
const wcag22AaTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function openReference(page: Page, url = referenceUrl) {
  await page.goto(url);
  await expect(page.locator('[data-voreal-ui="next"]')).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /Restaurantes en Baltimore, MD/i })).toBeVisible();
}

async function expectNoDocumentOverflow(page: Page) {
  const geometry = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
}

async function expectVisibleFocus(locator: Locator) {
  await expect(locator).toBeFocused();
  const focusStyle = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      boxShadow: style.boxShadow,
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth) || 0,
    };
  });
  expect(
    focusStyle.outlineWidth >= 2 || (focusStyle.boxShadow !== "none" && focusStyle.boxShadow !== ""),
    `Expected a visible focus indicator, received ${JSON.stringify(focusStyle)}`,
  ).toBe(true);
}

async function waitForFontsAndDirectoryImages(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = Array.from(document.querySelectorAll<HTMLImageElement>(".vrn-directory-card__image"));
    await Promise.all(images.map((image) => {
      if (image.complete && image.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve, reject) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => reject(new Error(`Image failed: ${image.currentSrc || image.src}`)), { once: true });
      });
    }));
  });
}

async function expectMediaRatio(page: Page) {
  const ratios = await page.locator(".vrn-directory-card__media").evaluateAll((frames) => frames.map((frame) => {
    const box = frame.getBoundingClientRect();
    return box.width / box.height;
  }));
  expect(ratios.length).toBeGreaterThan(0);
  for (const ratio of ratios) expect(Math.abs(ratio - 1.5)).toBeLessThanOrEqual(0.02);
}

async function runWcag22Aa(page: Page) {
  await page.addScriptTag({ content: axe.source });
  const violations = await page.evaluate(async (tags) => {
    const results = await window.axe.run(document, { runOnly: { type: "tag", values: tags } });
    return results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.length,
    }));
  }, wcag22AaTags);
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

test("isolates the Next root and never widens the document", async ({ page }) => {
  await page.setViewportSize({ height: 812, width: 375 });
  await openReference(page);
  await expect(page.locator("html")).not.toHaveAttribute("data-voreal-ui", "next");
  await expect(page.locator("body")).not.toHaveAttribute("data-voreal-ui", "next");
  await expect(page.locator('[data-voreal-ui="next"]')).toHaveCount(1);
  await expectNoDocumentOverflow(page);
});

test("keeps native GET search names and query-location-submit Tab order", async ({ page }) => {
  await openReference(page);
  const form = page.getByRole("search", { name: "Buscar en el directorio" });
  const query = page.getByRole("searchbox", { name: "¿Qué buscas?" });
  const location = page.getByRole("textbox", { name: "¿Dónde?" });
  const submit = page.getByRole("button", { name: "Buscar", exact: true });

  await expect(form).toHaveAttribute("method", "get");
  await expect(form).toHaveAttribute("action", /\/buscar$/);
  await expect(query).toHaveAttribute("name", "q");
  await expect(location).toHaveAttribute("name", "location");
  await query.focus();
  await expectVisibleFocus(query);
  await page.keyboard.press("Tab");
  await expectVisibleFocus(location);
  await page.keyboard.press("Tab");
  await expectVisibleFocus(submit);
});

test("opens and closes the mobile menu and restores trigger focus", async ({ page }) => {
  await page.setViewportSize({ height: 812, width: 375 });
  await openReference(page);
  const trigger = page.getByRole("button", { name: "Abrir navegación" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Navegación" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Cerrar navegación" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expectVisibleFocus(trigger);

  await trigger.click();
  await dialog.getByRole("button", { name: "Cerrar navegación" }).click();
  await expect(dialog).toBeHidden();
  await expectVisibleFocus(trigger);
});

test("shows only the desktop sidebar at the desktop breakpoint", async ({ page }) => {
  const sidebar = page.getByRole("complementary", { name: "Filtros" });
  for (const viewport of [
    { height: 1100, visible: true, width: 1440 },
    { height: 1024, visible: false, width: 768 },
    { height: 812, visible: false, width: 375 },
  ]) {
    await page.setViewportSize(viewport);
    await openReference(page);
    if (viewport.visible) await expect(sidebar).toBeVisible();
    else await expect(sidebar).toBeHidden();
  }
});

for (const viewport of [
  { height: 812, label: "mobile", width: 375 },
  { height: 1024, label: "tablet", width: 768 },
]) {
  test(`operates native filter controls in the ${viewport.label} drawer`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openReference(page);
    const trigger = page.getByRole("button", { name: "Abrir filtros" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Filtros" });
    await expect(dialog).toBeVisible();

    const radius = dialog.getByRole("combobox", { name: "Distancia" });
    await expect(radius).toBeVisible();
    await expect(radius.locator("option")).toHaveText(["5 millas", "10 millas", "25 millas", "50 millas"]);
    const selectAppearance = await radius.evaluate((select) => {
      const nativeSelect = select as HTMLSelectElement;
      const box = select.getBoundingClientRect();
      const style = getComputedStyle(select);
      return {
        box: { height: box.height, width: box.width },
        hidden: Boolean(nativeSelect.hidden),
        style: {
          color: style.color,
          display: style.display,
          opacity: style.opacity,
          visibility: style.visibility,
        },
      };
    });
    expect(isNativeControlAppearanceVisible(selectAppearance)).toBe(true);

    const optionAppearances = await radius.locator("option").evaluateAll((options) => options.map((option) => {
      const style = getComputedStyle(option);
      return {
        hidden: Boolean((option as HTMLOptionElement).hidden),
        style: {
          color: style.color,
          display: style.display,
          opacity: style.opacity,
          visibility: style.visibility,
        },
      };
    }));
    expect(optionAppearances.every(isNativeControlAppearanceVisible)).toBe(true);
    await radius.selectOption("50");
    await expect(radius).toHaveValue("50");
    await expect.poll(() => radius.evaluate((select) => (
      select as HTMLSelectElement
    ).selectedOptions[0]?.textContent?.trim())).toBe("50 millas");

    const verified = dialog.getByRole("checkbox", { name: "Solo negocios verificados" });
    await verified.check();
    await expect(verified).toBeChecked();
    await dialog.getByRole("button", { name: /Ver \d+ resultados?/ }).click();
    await expect(dialog).toBeHidden();
    await expectVisibleFocus(trigger);
  });
}

for (const viewport of [
  { columns: 1, height: 812, width: 375 },
  { columns: 2, height: 1024, width: 768 },
  { columns: 3, height: 1100, width: 1440 },
]) {
  test(`renders exactly ${viewport.columns} card column(s) at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openReference(page);
    const boxes = await page.locator(".vrn-directory-card").evaluateAll((cards) => cards.map((card) => {
      const box = card.getBoundingClientRect();
      return { x: box.x, y: box.y };
    }));
    const firstRowY = boxes[0]?.y;
    expect(firstRowY).toBeDefined();
    const firstRow = boxes.filter((box) => Math.abs(box.y - firstRowY!) <= 4);
    expect(firstRow).toHaveLength(viewport.columns);
    expect(new Set(firstRow.map((box) => Math.round(box.x))).size).toBe(viewport.columns);
    await expectNoDocumentOverflow(page);
  });
}

test("keeps the 3:2 media frame stable before and after images load", async ({ page }) => {
  let releaseImages!: () => void;
  const imagesMayLoad = new Promise<void>((resolve) => { releaseImages = resolve; });
  await page.route("**/voreal-next/directory/*.webp", async (route) => {
    await imagesMayLoad;
    await route.continue();
  });
  await page.setViewportSize({ height: 1100, width: 1440 });
  await page.goto(referenceUrl, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".vrn-directory-card__media").first()).toBeVisible();
  await expectMediaRatio(page);
  releaseImages();
  await waitForFontsAndDirectoryImages(page);
  await expectMediaRatio(page);
});

test("supports long content at 200% text size without page overflow", async ({ page }) => {
  await page.setViewportSize({ height: 812, width: 375 });
  await openReference(page, storyUrl("long-content"));
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await expect(page.getByRole("heading", { name: /Martínez Tax Services y Centro/ })).toBeVisible();
  await expectNoDocumentOverflow(page);
});

for (const state of [
  { story: "loading", target: { kind: "status", name: "Cargando negocios" } },
  { story: "no-results", target: { kind: "region", name: "No encontramos negocios" } },
  { story: "error", target: { kind: "region", name: "No pudimos cargar los negocios." } },
] as const) {
  test(`renders the ${state.story} state`, async ({ page }) => {
    await openReference(page, storyUrl(state.story));
    await expect(page.getByRole(state.target.kind, { name: state.target.name })).toBeVisible();
    await expectNoDocumentOverflow(page);
  });
}

test("renders stable fallbacks in the missing-image state", async ({ page }) => {
  await openReference(page, storyUrl("missing-image"));
  await expect(page.getByRole("img", { name: /Imagen no disponible para/ })).toHaveCount(2);
  await expect(page.locator(".vrn-directory-card__media")).toHaveCount(6);
  await expectMediaRatio(page);
});

test("reaches every visible interactive control by keyboard", async ({ page }) => {
  await page.setViewportSize({ height: 1100, width: 1440 });
  await openReference(page);
  const expectedIds = await page.evaluate(() => {
    const selector = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(document.querySelectorAll<HTMLElement>(selector))
      .filter((element) => !element.hasAttribute("disabled") && element.getClientRects().length > 0)
      .map((element, index) => {
        const id = `control-${index}`;
        element.dataset.vrnE2eTab = id;
        return id;
      });
  });
  expect(expectedIds.length).toBeGreaterThan(10);
  await page.evaluate(() => {
    document.body.tabIndex = -1;
    document.body.focus();
  });
  const visited = new Set<string>();
  for (let index = 0; index < expectedIds.length + 2; index += 1) {
    await page.keyboard.press("Tab");
    const id = await page.evaluate(() => (document.activeElement as HTMLElement | null)?.dataset.vrnE2eTab ?? "");
    if (id) visited.add(id);
  }
  expect([...expectedIds].filter((id) => !visited.has(id))).toEqual([]);
});

test("has no WCAG 2.2 AA violations on the page or open dialogs", async ({ page }) => {
  await page.setViewportSize({ height: 812, width: 375 });
  await openReference(page);
  await runWcag22Aa(page);

  await page.getByRole("button", { name: "Abrir navegación" }).click();
  await expect(page.getByRole("dialog", { name: "Navegación" })).toBeVisible();
  await runWcag22Aa(page);
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Abrir filtros" }).click();
  await expect(page.getByRole("dialog", { name: "Filtros" })).toBeVisible();
  await runWcag22Aa(page);
});

test("retains focus and operation with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ height: 812, width: 375 });
  await openReference(page);
  const trigger = page.getByRole("button", { name: "Abrir filtros" });
  await trigger.focus();
  await expectVisibleFocus(trigger);
  const durations = await page.locator('[data-voreal-ui="next"] *').evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element);
    const toMilliseconds = (value: string) => Math.max(...value.split(",").map((item) => {
      const duration = Number.parseFloat(item);
      return item.trim().endsWith("ms") ? duration : duration * 1000;
    }));
    return {
      animation: toMilliseconds(style.animationDuration),
      transition: toMilliseconds(style.transitionDuration),
    };
  }));
  expect(durations.every(({ animation, transition }) => animation <= 0.011 && transition <= 0.011)).toBe(true);
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Filtros" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expectVisibleFocus(trigger);
});

test("retains focus and operation in forced colors", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.setViewportSize({ height: 812, width: 375 });
  await openReference(page);
  const trigger = page.getByRole("button", { name: "Abrir navegación" });
  await trigger.focus();
  await expectVisibleFocus(trigger);
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Navegación" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Cerrar navegación" }).click();
  await expectVisibleFocus(trigger);
});

for (const viewport of [
  { height: 812, width: 375 },
  { height: 1024, width: 768 },
  { height: 900, width: 1024 },
  { height: 1100, width: 1440 },
]) {
  test(`matches the approved directory reference at ${viewport.width}`, async ({ browserName, page }) => {
    test.skip(browserName !== "chromium", "Reviewed visual baselines are Chromium-only.");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize(viewport);
    await openReference(page);
    await waitForFontsAndDirectoryImages(page);
    await expect(page).toHaveScreenshot(`voreal-next-directory-${viewport.width}.png`, {
      animations: "disabled",
      fullPage: true,
    });
  });
}

declare global {
  interface Window {
    axe: typeof axe;
  }
}
