import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("home page loads and shows hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Every calculator you need");
    await expect(page.getByRole("link", { name: "CalcHub" }).first()).toBeVisible();
  });

  test("can navigate from home to a calculator and get a result", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /BMI Calculator/i }).first().click();
    await expect(page).toHaveURL(/\/health\/bmi/);
    await expect(page.getByText("Your BMI")).toBeVisible();
  });

  test("BMI calculator produces a live result from default values", async ({ page }) => {
    await page.goto("/health/bmi");
    await expect(page.getByText("22.9")).toBeVisible();
  });

  test("category page lists calculators", async ({ page }) => {
    await page.goto("/finance");
    await expect(page.getByRole("heading", { name: /Finance calculators/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Mortgage Calculator/i })).toBeVisible();
  });

  test("search command palette opens and finds a calculator", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const searchInput = page.getByPlaceholder(/Search 30\+ calculators/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill("mortgage");
    await expect(page.getByText("Mortgage Calculator")).toBeVisible();
  });

  test("dark mode toggle switches the theme", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /switch to dark theme/i });
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("404 page renders for an unknown route", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("404")).toBeVisible();
  });

  test("blog index and post page render", async ({ page }) => {
    await page.goto("/blog");
    await page.getByRole("link", { name: /How Mortgage Amortization Actually Works/i }).click();
    await expect(page).toHaveURL(/\/blog\/how-mortgage-amortization-works/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("How Mortgage Amortization");
  });
});
