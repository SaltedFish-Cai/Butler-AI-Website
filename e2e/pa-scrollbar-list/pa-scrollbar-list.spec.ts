import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-scrollbar-list Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-scrollbar-list/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test('should render scrollbar list with API', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-api"]')
    await expect(scrollbarList).toBeVisible()
    await expect(scrollbarList).toHaveClass(/pa-scrollbar-list/)
  });

  test('should render scrollbar list empty state', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-empty"]')
    await expect(scrollbarList).toBeVisible()
  });

  test('should render scrollbar list with color mode', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-color"]')
    await expect(scrollbarList).toBeVisible()
  });

  test('should render scrollbar list without pagination', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-no-pagination"]')
    await expect(scrollbarList).toBeVisible()
  });

  test('should render scrollbar list with padding', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-padding"]')
    await expect(scrollbarList).toBeVisible()
  });

  test('should render scrollbar list with footer slot', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-footer"]')
    await expect(scrollbarList).toBeVisible()
  });

  test('should have scrollbar inside scrollbar list', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-api"]')
    await expect(scrollbarList).toBeVisible()
    const scrollbar = scrollbarList.locator('.pa-scrollbar')
    await expect(scrollbar).toBeVisible({ timeout: 5000 })
  });
});
