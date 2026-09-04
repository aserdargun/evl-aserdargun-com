import { expect, test } from "@playwright/test";

const consoleErrors: string[] = [];

test.beforeEach(({ page }) => {
  consoleErrors.length = 0;
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
});

test("desktop render matches the open-rail composition", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/en");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".workbench-layout")).toHaveCSS("grid-template-columns", /264px .* 328px/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth)).toBe(true);
  await page.screenshot({ path: "docs/design/evl-rendered-desktop.png" });
  expect(consoleErrors).toEqual([]);
});

test("mobile render is linear, operable, and overflow free", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const target = page.getByRole("combobox", { name: "Evaluation target" });
  await expect(target).toBeVisible();
  expect((await target.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await expect(page.locator(".decision-rail")).not.toHaveClass(/is-sticky/);
  const layerColumns = await page.locator(".coverage-cell").evaluateAll((cells) =>
    new Set(cells.map((cell) => Math.round(cell.getBoundingClientRect().left))).size,
  );
  expect(layerColumns).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth)).toBe(true);
  await page.screenshot({ path: "docs/design/evl-rendered-mobile.png" });

  await page.getByLabel("Evaluation claim").focus();
  const focusedIsVisible = await page.evaluate(() => {
    const rect = document.activeElement?.getBoundingClientRect();
    return Boolean(rect && rect.left >= 0 && rect.right <= window.innerWidth);
  });
  expect(focusedIsVisible).toBe(true);
  await page.getByRole("checkbox", { name: "Safety evidence" }).uncheck();
  await expect(page.getByText("Critical layer is not covered")).toBeVisible();
  await expect(page.getByText("Critical Safety layer is missing.")).toBeVisible();
  await page.locator("#patterns").scrollIntoViewIfNeeded();
  await expect(page.locator(".decision-rail")).toHaveClass(/is-sticky/);
  expect(consoleErrors).toEqual([]);
});
