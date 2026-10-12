import { expect, test, type Page } from "@playwright/test";

const SITE = "https://evl.aserdargun.com";

// The site ships one HTML document for every route, so the static markup
// declares English identity and the workbench re-points it at whichever locale
// is actually being served. A canonical must name the URL that returns 200:
// `/` is a permanent redirect to `/en`, so it is never a valid self-reference.
const canonicalOf = (page: Page) =>
  page.locator('link[rel="canonical"]').getAttribute("href");
const ogUrlOf = (page: Page) =>
  page.locator('meta[property="og:url"]').getAttribute("content");

for (const locale of ["en", "tr"] as const) {
  test(`${locale}: declares its own URL as canonical and as og:url`, async ({ page }) => {
    await page.goto(`/${locale}`);

    await expect.poll(() => canonicalOf(page)).toBe(`${SITE}/${locale}`);
    await expect.poll(() => ogUrlOf(page)).toBe(`${SITE}/${locale}`);
  });
}

test("switching language re-points the canonical instead of leaving the first route", async ({ page }) => {
  await page.goto("/en");
  await expect.poll(() => canonicalOf(page)).toBe(`${SITE}/en`);

  await page.getByRole("link", { name: "Türkçe" }).click();

  await expect(page).toHaveURL(/\/tr$/);
  await expect.poll(() => canonicalOf(page)).toBe(`${SITE}/tr`);
  await expect.poll(() => ogUrlOf(page)).toBe(`${SITE}/tr`);
});

test("the served document announces both locales as alternates", async ({ page }) => {
  await page.goto("/en");
  const alternates = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')].map(
      (link) => `${link.hreflang}=${link.href}`,
    ),
  );

  expect(alternates.sort()).toEqual(
    [`en=${SITE}/en`, `tr=${SITE}/tr`, `x-default=${SITE}/en`].sort(),
  );
});