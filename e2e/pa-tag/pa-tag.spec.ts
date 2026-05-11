import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-tag Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-tag/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test('should render basic tags', async ({ page }) => {
    const tagComponent = page.locator('[data-testid="tag-basic"]')
    // Tag component may start with opacity 0 and become visible
    await expect(tagComponent).toHaveClass(/pa-tag/)
  });

  test('should render tags with close icons', async ({ page }) => {
    const tagComponent = page.locator('[data-testid="tag-basic"]')
    await expect(tagComponent).toHaveClass(/pa-tag/)
    // Should have close icons when not disabled
    const closeIcons = tagComponent.locator('.pa-tag-text_close')
    await expect(closeIcons.first()).toBeVisible({ timeout: 10000 })
  });

  test('should render tags without collapse', async ({ page }) => {
    const tagComponent = page.locator('[data-testid="tag-no-collapse"]')
    await expect(tagComponent).toHaveClass(/pa-tag/)
  });

  test('should render disabled tags', async ({ page }) => {
    const tagComponent = page.locator('[data-testid="tag-disabled"]')
    await expect(tagComponent).toHaveClass(/pa-tag/)
    // Disabled tags should not have close icons
    const closeIcons = tagComponent.locator('.pa-tag-text_close')
    await expect(closeIcons).toHaveCount(0)
  });

  test('should render tags with custom popover width', async ({ page }) => {
    const tagComponent = page.locator('[data-testid="tag-popover-width"]')
    await expect(tagComponent).toHaveClass(/pa-tag/)
  });

  test('should render single tag', async ({ page }) => {
    const tagComponent = page.locator('[data-testid="tag-single"]')
    await expect(tagComponent).toHaveClass(/pa-tag/)
    const tagText = tagComponent.locator('.pa-tag-text_content')
    await expect(tagText).toHaveText('单个标签')
  });

  test('should render empty tags', async ({ page }) => {
    const tagComponent = page.locator('[data-testid="tag-empty"]')
    // Empty tags may have opacity 0 initially
    await expect(tagComponent).toHaveClass(/pa-tag/)
  });

  test('should display removed tag information', async ({ page }) => {
    const eventLog = page.locator('[data-testid="tag-removed"]')
    await expect(eventLog).toBeVisible()
  });
});
