import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-row Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-row/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should render basic row', async ({ page }) => {
    const row = page.locator('[data-testid="row-basic"]')
    await expect(row).toBeVisible()
    await expect(row).toHaveClass(/pa-row/)
  });

  test('should render row with gutter', async ({ page }) => {
    const row = page.locator('[data-testid="row-gutter"]')
    await expect(row).toBeVisible()
    await expect(row).toHaveClass(/pa-row/)
  });

  test('should render row with justify center', async ({ page }) => {
    const row = page.locator('[data-testid="row-justify-center"]')
    await expect(row).toBeVisible()
    await expect(row).toHaveClass(/pa-row--center/)
  });

  test('should render row with justify end', async ({ page }) => {
    const row = page.locator('[data-testid="row-justify-end"]')
    await expect(row).toBeVisible()
    await expect(row).toHaveClass(/pa-row--end/)
  });

  test('should render row with justify space-between', async ({ page }) => {
    const row = page.locator('[data-testid="row-justify-between"]')
    await expect(row).toBeVisible()
    await expect(row).toHaveClass(/pa-row--space-between/)
  });

  test('should render row with justify space-around', async ({ page }) => {
    const row = page.locator('[data-testid="row-justify-around"]')
    await expect(row).toBeVisible()
    await expect(row).toHaveClass(/pa-row--space-around/)
  });

  test('should render row with align center', async ({ page }) => {
    const row = page.locator('[data-testid="row-align-center"]')
    await expect(row).toBeVisible()
    await expect(row).toHaveClass(/pa-row--align-center/)
  });

  test('should render row with align bottom', async ({ page }) => {
    const row = page.locator('[data-testid="row-align-bottom"]')
    await expect(row).toBeVisible()
    await expect(row).toHaveClass(/pa-row--align-bottom/)
  });

  test('should render row with all props combined', async ({ page }) => {
    const row = page.locator('[data-testid="row-all-props"]')
    await expect(row).toBeVisible()
    await expect(row).toHaveClass(/pa-row/)
    await expect(row).toHaveClass(/pa-row--space-between/)
    await expect(row).toHaveClass(/pa-row--align-center/)
  });

  test('should render children columns', async ({ page }) => {
    await expect(page.locator('[data-testid="col-1"]')).toBeVisible()
    await expect(page.locator('[data-testid="col-2"]')).toBeVisible()
    await expect(page.locator('[data-testid="col-gutter-1"]')).toBeVisible()
  });
});
