import { readFile } from "node:fs/promises";
import { z } from "zod";
import { expect, test } from "@playwright/test";

for (const locale of ["en", "tr"] as const) {
  test(`${locale}: invalid drafts survive reload and cannot be exported`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/${locale}`);
    const claimLabel = locale === "en" ? "Evaluation claim" : "Değerlendirme iddiası";
    const gateLabel = locale === "en" ? "Release gate" : "Yayın kapısı";
    await page.getByLabel(claimLabel).fill("");
    await expect(page.getByRole("status", { name: gateLabel })).toContainText(locale === "en" ? "HOLD" : "BEKLET");
    await expect(page.getByRole("button", { name: /JSON/ })).toBeDisabled();
    await page.reload();
    await expect(page.getByLabel(claimLabel)).toHaveValue("");
    await expect(page.getByRole("button", { name: /JSON/ })).toBeDisabled();
    await page.getByLabel(claimLabel).fill("A restored, explicit claim");
    await expect(page.getByRole("button", { name: /JSON/ })).toBeEnabled();
    expect(errors).toEqual([]);
  });
}

test("target drafts survive switching, repeat selection, and page reload", async ({ page }) => {
  await page.goto("/en");
  await page.getByLabel("Evaluation claim").fill("Agent draft");
  await page.getByRole("button", { name: "Agent & tool use" }).click();
  await expect(page.getByLabel("Evaluation claim")).toHaveValue("Agent draft");
  await page.getByRole("button", { name: "Model & adaptation" }).click();
  await page.getByLabel("Evaluation claim").fill("Model draft");
  await page.reload();
  await expect(page.getByLabel("Evaluation claim")).toHaveValue("Model draft");
  await page.getByRole("button", { name: "Agent & tool use" }).click();
  await expect(page.getByLabel("Evaluation claim")).toHaveValue("Agent draft");
});

test("critical failures accept separators while typing", async ({ page }) => {
  await page.goto("/en");
  const failures = page.getByLabel("Critical failures", { exact: true });
  await failures.fill("");
  await failures.pressSequentially("Unauthorized write; Data disclosure");
  await expect(failures).toHaveValue("Unauthorized write; Data disclosure");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  const download = await pending;
  const path = await download.path();
  if (!path) throw new Error("Missing download file");
  const envelope = z.object({
    assessmentScope: z.literal("contract-planning-only"),
    contract: z.object({ criticalFailures: z.array(z.string()) }),
  }).parse(JSON.parse(await readFile(path, "utf8")));
  expect(envelope.contract.criticalFailures).toEqual(["Unauthorized write", "Data disclosure"]);
  expect(envelope.assessmentScope).toBe("contract-planning-only");
});

test("invalid numerical thresholds and trial counts close the gate", async ({ page }) => {
  await page.goto("/en");
  for (const [label, values] of [["Decision threshold", ["", "-1", "1.01"]], ["Trials", ["", "0", "2", "3.5"]]] as const) {
    for (const value of values) {
      await page.getByLabel(label, { exact: true }).fill(value);
      await expect(page.getByRole("status", { name: "Release gate" })).toContainText("HOLD");
      await expect(page.getByRole("button", { name: "Export JSON" })).toBeDisabled();
    }
    await page.getByLabel(label, { exact: true }).fill(label === "Trials" ? "100" : "0.9");
  }
  await expect(page.getByRole("status", { name: "Release gate" })).toContainText("READY");
});

test("blocked browser storage still renders a usable workbench", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
  });
  await page.goto("/en");
  await page.getByLabel("Evaluation claim").fill("Kept in memory");
  await expect(page.getByLabel("Evaluation claim")).toHaveValue("Kept in memory");
  await expect(page.getByRole("alert")).toBeVisible();
});

test("all coverage states express supporting gaps without bypassing critical controls", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("combobox", { name: "Operations Coverage" }).selectOption("partial");
  await expect(page.getByRole("status", { name: "Release gate" })).toContainText("CONDITIONAL");
  await page.getByRole("combobox", { name: "Operations Coverage" }).selectOption("not_applicable");
  await expect(page.getByRole("status", { name: "Release gate" })).toContainText("READY");
  await page.getByRole("combobox", { name: "Safety Coverage" }).selectOption("not_applicable");
  await expect(page.getByRole("status", { name: "Release gate" })).toContainText("HOLD");
  await page.getByRole("combobox", { name: "Safety Coverage" }).selectOption("covered");
  await page.getByRole("checkbox", { name: "Uncertainty is explicit" }).uncheck();
  await expect(page.getByRole("status", { name: "Release gate" })).toContainText("HOLD");
});

test("advanced fields persist and a reset dialog traps focus and restores it", async ({ page }) => {
  await page.goto("/en");
  await page.getByText("Scope and measurement design", { exact: true }).click();
  await page.getByLabel("Sampling rationale").fill("Stratified English and Turkish recovery tasks");
  await page.reload();
  await page.getByText("Scope and measurement design", { exact: true }).click();
  await expect(page.getByLabel("Sampling rationale")).toHaveValue("Stratified English and Turkish recovery tasks");
  await page.getByRole("button", { name: "Reset contract" }).click();
  const cancel = page.getByRole("button", { name: "Cancel", exact: true });
  await expect(cancel).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Reset", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(cancel).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Reset contract" })).toBeFocused();
});

test("review deadlines refresh without requiring an edit", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-11-30T23:59:40Z") });
  await page.goto("/en");
  await page.getByLabel("Review date", { exact: true }).fill("2026-11-30");
  await expect(page.getByRole("status", { name: "Release gate" })).toContainText("CONDITIONAL");
  await page.clock.fastForward(60_000);
  await expect(page.getByRole("status", { name: "Release gate" })).toContainText("HOLD");
  await expect(page.getByText("Contract review is overdue", { exact: true })).toBeVisible();
});
