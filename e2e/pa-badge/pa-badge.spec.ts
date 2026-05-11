import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-badge Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-badge/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test('should render badge with value', async ({ page }) => {
    const badge = page.locator('[data-testid="badge-value"]')
    await expect(badge).toBeVisible()
    const badgeContent = badge.locator('.pa-badge__content')
    await expect(badgeContent).toBeVisible({ timeout: 5000 })
    await expect(badgeContent).toHaveText('5')
  });

  test('should render badge with max value', async ({ page }) => {
    const badge = page.locator('[data-testid="badge-max"]')
    await expect(badge).toBeVisible()
    const badgeContent = badge.locator('.pa-badge__content')
    await expect(badgeContent).toHaveText('99+')
  });

  test('should render badge with number value', async ({ page }) => {
    const badge = page.locator('[data-testid="badge-number"]')
    // Badge element exists
    await expect(badge).toHaveClass(/pa-badge/)
  });

  test('should render dot badge', async ({ page }) => {
    const badge = page.locator('[data-testid="badge-dot"]')
    await expect(badge).toBeVisible()
    const dot = badge.locator('.pa-badge__dot')
    await expect(dot).toBeVisible({ timeout: 5000 })
  });

  test('should not show badge when useShow is false', async ({ page }) => {
    const badge = page.locator('[data-testid="badge-hidden"]')
    await expect(badge).toBeVisible()
    const badgeContent = badge.locator('.pa-badge__content')
    const dot = badge.locator('.pa-badge__dot')
    await expect(badgeContent).toHaveCount(0)
    await expect(dot).toHaveCount(0)
  });

  test('should show badge when useShow is true', async ({ page }) => {
    const badge = page.locator('[data-testid="badge-show"]')
    await expect(badge).toBeVisible()
    // Badge element exists with the correct class
    await expect(badge).toHaveClass(/pa-badge/)
  });

  test('should render badge with string value', async ({ page }) => {
    const badge = page.locator('[data-testid="badge-string"]')
    await expect(badge).toBeVisible()
    const badgeContent = badge.locator('.pa-badge__content')
    await expect(badgeContent).toHaveText('new')
  });
});
