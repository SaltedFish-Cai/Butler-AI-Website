import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-col Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-col/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should render basic column', async ({ page }) => {
    const col = page.locator('[data-testid="col-basic"]')
    await expect(col).toBeVisible()
    await expect(col).toHaveClass(/pa-col/)
  });

  test('should render columns with different span values', async ({ page }) => {
    await expect(page.locator('[data-testid="col-span-4"]')).toBeVisible()
    await expect(page.locator('[data-testid="col-span-8"]')).toBeVisible()
    await expect(page.locator('[data-testid="col-span-12"]')).toBeVisible()
  });

  test('should render column with offset', async ({ page }) => {
    const col = page.locator('[data-testid="col-offset-4"]')
    await expect(col).toBeVisible()
    await expect(col).toHaveClass(/pa-col-offset-4/)
  });

  test('should render column with multiple offsets', async ({ page }) => {
    const col = page.locator('[data-testid="col-offset-8"]')
    await expect(col).toBeVisible()
    await expect(col).toHaveClass(/pa-col-offset-8/)
  });

  test('should render column with xs responsive', async ({ page }) => {
    const col = page.locator('[data-testid="col-xs-24"]')
    await expect(col).toBeVisible()
    await expect(col).toHaveClass(/pa-col/)
  });

  test('should render columns with xs responsive split', async ({ page }) => {
    await expect(page.locator('[data-testid="col-xs-12"]')).toBeVisible()
    await expect(page.locator('[data-testid="col-xs-12-2"]')).toBeVisible()
  });

  test('should render column with sm responsive', async ({ page }) => {
    const col = page.locator('[data-testid="col-sm-12"]')
    await expect(col).toBeVisible()
    await expect(col).toHaveClass(/pa-col/)
  });

  test('should render columns with md responsive', async ({ page }) => {
    await expect(page.locator('[data-testid="col-md-8"]')).toBeVisible()
    await expect(page.locator('[data-testid="col-md-8-2"]')).toBeVisible()
    await expect(page.locator('[data-testid="col-md-8-3"]')).toBeVisible()
  });

  test('should render columns with lg responsive', async ({ page }) => {
    await expect(page.locator('[data-testid="col-lg-6"]')).toBeVisible()
    await expect(page.locator('[data-testid="col-lg-6-2"]')).toBeVisible()
    await expect(page.locator('[data-testid="col-lg-6-3"]')).toBeVisible()
    await expect(page.locator('[data-testid="col-lg-6-4"]')).toBeVisible()
  });

  test('should render column with responsive object', async ({ page }) => {
    const col = page.locator('[data-testid="col-responsive-obj"]')
    await expect(col).toBeVisible()
    await expect(col).toHaveClass(/pa-col/)
  });

  test('should render column with responsive offset object', async ({ page }) => {
    const col = page.locator('[data-testid="col-responsive-offset"]')
    await expect(col).toBeVisible()
    await expect(col).toHaveClass(/pa-col/)
  });

  test('should render column with all props combined', async ({ page }) => {
    const col = page.locator('[data-testid="col-all-props"]')
    await expect(col).toBeVisible()
    await expect(col).toHaveClass(/pa-col/)
  });
});
