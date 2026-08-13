import { expect, test } from "@playwright/test";

const referenceUrl = "/iframe.html?id=patterns-directory-reference--mercado-contemporaneo&viewMode=story";

test.beforeEach(async ({ page }) => {
  await page.goto(referenceUrl);
  await expect(page.getByRole("heading", { name: "Lo mejor de nuestra comunidad, cerca de ti." })).toBeVisible();
});

test("enters a search and keeps keyboard order", async ({ page }) => {
  const query = page.getByRole("searchbox", { name: "¿Qué buscas?" });
  await query.fill("tacos");
  await expect(query).toHaveValue("tacos");
  await query.focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("textbox", { name: "¿Dónde?" })).toBeFocused();
});

test("opens and closes shared filters on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Filtros" }).click();
  await expect(page.getByRole("dialog", { name: "Filtrar negocios" })).toBeVisible();
  await page.getByRole("checkbox", { name: /Verificados/ }).click();
  await page.getByRole("button", { name: "Ver resultados" }).click();
  await expect(page.getByRole("dialog", { name: "Filtrar negocios" })).toBeHidden();
});

test("switches between list and map without losing navigation", async ({ page }) => {
  await page.getByRole("radio", { name: "Mapa" }).click();
  await expect(page.getByRole("img", { name: "Mapa de resultados en Baltimore" })).toBeVisible();
  await page.getByRole("radio", { name: "Lista" }).click();
  await expect(page.getByRole("link", { name: "Ver Sabor de Casa" })).toHaveAttribute("href", "/negocios/sabor-de-casa");
});

test("keeps mobile category overflow scrollable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const categories = page.getByRole("radiogroup", { name: "Categorías" });
  await expect(categories).toBeVisible();
  const overflows = await categories.evaluate((element) => element.scrollWidth > element.clientWidth);
  expect(overflows).toBe(true);
});
