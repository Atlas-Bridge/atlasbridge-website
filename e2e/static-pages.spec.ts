import { test, expect } from "@playwright/test";

test.describe("Static pages", () => {
  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("body")).toContainText(/privacy/i);
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("body")).toContainText(/terms/i);
  });

  test("security page loads", async ({ page }) => {
    await page.goto("/security");
    await expect(page.locator("body")).toContainText(/security/i);
  });

  test("404 page renders for unknown routes", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.locator("body")).toContainText(/404/);
  });
});
