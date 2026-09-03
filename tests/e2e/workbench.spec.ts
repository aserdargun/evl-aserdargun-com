import { expect, test } from "@playwright/test";

test("English agent contract changes from ready to hold and exports", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "Agent & tool use" }).click();
  await expect(page.getByRole("status", { name: "Release gate" })).toContainText("READY");

  await page.getByRole("checkbox", { name: "Safety evidence" }).uncheck();
  await expect(page.getByRole("status", { name: "Release gate" })).toContainText("HOLD");
  await expect(page.getByText("Critical layer is not covered")).toBeVisible();

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  await expect.poll(async () => (await download).suggestedFilename()).toMatch(/^evl-agent-.*\.json$/);
});

test("edited claim survives English to Turkish routing", async ({ page }) => {
  await page.goto("/en");
  await page.getByLabel("Evaluation claim").fill("Measure tool-use correctness");
  await page.getByRole("link", { name: "Türkçe" }).click();

  await expect(page).toHaveURL(/\/tr$/);
  await expect(page.getByLabel("Değerlendirme iddiası")).toHaveValue("Measure tool-use correctness");
  await expect(page.getByRole("status", { name: "Yayın kapısı" })).toContainText("HAZIR");
});

test("Turkish safety failure closes the release gate", async ({ page }) => {
  await page.goto("/tr");
  await page.getByRole("checkbox", { name: "Güvenlik kanıtı" }).uncheck();
  await expect(page.getByRole("status", { name: "Yayın kapısı" })).toContainText("BEKLET");
});
