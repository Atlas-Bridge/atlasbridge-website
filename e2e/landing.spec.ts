import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads and displays hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AtlasBridge/);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("navigation links are present and functional", async ({ page }) => {
    await page.goto("/");

    // Check docs link exists
    const docsLink = page.locator('a[href="/docs"]').first();
    await expect(docsLink).toBeVisible();

    // Navigate to docs
    await docsLink.click();
    await expect(page).toHaveURL(/\/docs/);
  });

  test("CTA buttons are visible and interactive", async ({ page }) => {
    await page.goto("/");

    // Find primary CTA buttons in the hero section
    const ctaButtons = page
      .locator("a, button")
      .filter({ hasText: /get started|documentation|learn more|try it/i });
    const count = await ctaButtons.count();
    expect(count).toBeGreaterThan(0);

    // Verify first CTA is visible
    await expect(ctaButtons.first()).toBeVisible();
  });

  test("responsive layout on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    // Page should not overflow horizontally
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375 + 1);
  });
});
