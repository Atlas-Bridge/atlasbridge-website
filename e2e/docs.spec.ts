import { test, expect } from "@playwright/test";

test.describe("Documentation pages", () => {
  test("docs page renders layout and sidebar", async ({ page }) => {
    await page.goto("/docs");

    // Nav bar renders
    await expect(page.locator("nav").first()).toBeVisible();
    await expect(page.locator("text=AtlasBridge")).toBeVisible();
    await expect(page.locator("text=Documentation")).toBeVisible();

    // Sidebar navigation items are present
    await expect(page.getByTestId("nav-doc-index")).toBeVisible();
    await expect(page.getByTestId("nav-doc-installation")).toBeVisible();
    await expect(page.getByTestId("nav-doc-dashboard")).toBeVisible();
    await expect(page.getByTestId("nav-doc-faq")).toBeVisible();
  });

  test("sidebar links navigate to doc slugs", async ({ page }) => {
    await page.goto("/docs");

    // Click a sidebar link
    await page.getByTestId("nav-doc-installation").click();
    await expect(page).toHaveURL(/\/docs\/installation/);

    // Click another
    await page.getByTestId("nav-doc-dashboard").click();
    await expect(page).toHaveURL(/\/docs\/dashboard/);
  });

  test("back button navigates home", async ({ page }) => {
    await page.goto("/docs");
    await page.getByTestId("link-back-home").click();
    await expect(page).toHaveURL("/");
  });

  test("unknown doc slug shows not-found or error state", async ({ page }) => {
    await page.goto("/docs/nonexistent-page-xyz");

    // Should show either 404 message or error state (no API in test env)
    await page.waitForTimeout(2000);
    const body = await page.locator("main").textContent();
    const hasErrorState =
      body?.includes("not found") ||
      body?.includes("Unable to load") ||
      body?.includes("Document not found");
    expect(hasErrorState).toBe(true);
  });

  test("mobile sidebar toggle works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/docs");

    // Sidebar should be hidden on mobile
    const sidebar = page.locator("aside");
    await expect(sidebar).toHaveClass(/-translate-x-full/);

    // Toggle sidebar open
    await page.getByTestId("button-toggle-sidebar").click();
    await expect(sidebar).toHaveClass(/translate-x-0/);

    // Toggle sidebar closed
    await page.getByTestId("button-toggle-sidebar").click();
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  });
});
