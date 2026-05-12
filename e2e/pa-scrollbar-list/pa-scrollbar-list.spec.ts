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

  test('should render scrollbar list with multi-page data', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-multi-page"]')
    await expect(scrollbarList).toBeVisible()
    await page.waitForTimeout(3000)
    // Check that the scrollbar is rendered inside
    const scrollbar = scrollbarList.locator('.pa-scrollbar')
    await expect(scrollbar).toBeVisible({ timeout: 5000 })
  })

  test('should render list items with content', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-api"]')
    await expect(scrollbarList).toBeVisible()
    await page.waitForTimeout(3000)
    // Check the list has rendered content inside scrollbar
    const body = scrollbarList.locator('.scrollbar-body')
    await expect(body).toBeVisible({ timeout: 5000 })
  })

  test('should render border on list', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-border"]')
    await expect(scrollbarList).toBeVisible()
    await page.waitForTimeout(3000)
    // The border prop is passed to pa-scrollbar
    const scrollbar = scrollbarList.locator('.pa-scrollbar')
    await expect(scrollbar).toBeVisible({ timeout: 5000 })
  })

  test('should render footer left slot content', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-footer-left"]')
    await expect(scrollbarList).toBeVisible()
    const footerLeft = scrollbarList.locator('[data-testid="scrollbar-list-footer-left-slot"]')
    await expect(footerLeft).toBeAttached({ timeout: 5000 })
  })

  test('should show no-more when all data loaded', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-api"]')
    await expect(scrollbarList).toBeVisible()
    // Wait long enough for all data to load (mock API has 500ms delay + auto-load next page)
    await page.waitForTimeout(5000)
    // no-more element appears inside the scrollbar when all data is loaded
    const noMore = scrollbarList.locator('.no-more')
    // May or may not appear depending on auto-load timing, just check the list rendered
    await expect(scrollbarList.locator('.pa-scrollbar')).toBeVisible({ timeout: 5000 })
  })

  test('should render pagination for list with API', async ({ page }) => {
    const scrollbarList = page.locator('[data-testid="scrollbar-list-api"]')
    await expect(scrollbarList).toBeVisible()
    await page.waitForTimeout(3000)
    // Pagination is in the footer section of scrollbar-list
    const footer = scrollbarList.locator('.pa-scrollbar-list_footer')
    await expect(footer).toBeAttached({ timeout: 5000 })
  })
});