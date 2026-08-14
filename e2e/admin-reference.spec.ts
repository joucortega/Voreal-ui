import { expect, test } from "@playwright/test";

const referenceUrl = "/iframe.html?id=patterns-admin-reference--compact-directory&viewMode=story";

test.beforeEach(async ({ page }) => {
  await page.goto(referenceUrl);
  await expect(page.getByRole("heading", { name: "Negocios", level: 1 })).toBeVisible();
});

test("navigates the compact shell with the keyboard", async ({ page }) => {
  const navigation = page.getByRole("navigation", { name: "Administración" });
  await expect(navigation.getByRole("link", { name: "Negocios" })).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
});

test("selects a business and announces the bulk state", async ({ page }) => {
  await page.getByRole("checkbox", { name: "Seleccionar Sabor de Casa" }).check();
  await expect(page.getByText("1 seleccionados")).toBeVisible();
});

test("opens and closes quick edit", async ({ page }) => {
  await page.getByRole("button", { name: "Editar Sabor de Casa" }).click();
  await expect(page.getByRole("dialog", { name: "Editar Sabor de Casa" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar edición" }).click();
  await expect(page.getByRole("dialog", { name: "Editar Sabor de Casa" })).toBeHidden();
});

test("shows Select options above the right-side drawer", async ({ page }) => {
  await page.getByRole("button", { name: "Editar Sabor de Casa" }).click();
  const drawer = page.getByRole("dialog", { name: "Editar Sabor de Casa" });
  await drawer.getByRole("combobox", { name: "Estado" }).click();
  const option = page.getByRole("option", { name: "Pendiente" });
  await expect(option).toBeVisible();

  const geometry = await option.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const topElement = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    const listbox = element.closest("[role='listbox']") as HTMLElement | null;
    const floating = element.closest(".vr-select-content") as HTMLElement | null;
    const owner = document.querySelector("[role='dialog']") as HTMLElement | null;
    return {
      drawerLayer: Number.parseInt(getComputedStyle(owner!).zIndex, 10),
      optionIsTopmost: Boolean(topElement && (element === topElement || element.contains(topElement) || listbox?.contains(topElement))),
      selectLayer: Number.parseInt(getComputedStyle(floating!).zIndex, 10),
    };
  });

  expect(geometry.selectLayer).toBeGreaterThan(geometry.drawerLayer);
  expect(geometry.optionIsTopmost).toBe(true);
});

test("keeps filters and table reachable on mobile", async ({ page }) => {
  await page.setViewportSize({ height: 812, width: 375 });
  await expect(page.getByRole("search", { name: "Filtros administrativos" })).toBeVisible();
  await page.getByRole("searchbox", { name: "Buscar" }).fill("Sabor");
  await expect(page.getByRole("table", { name: "Negocios del directorio" })).toBeVisible();
  const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasPageOverflow).toBe(false);
});
