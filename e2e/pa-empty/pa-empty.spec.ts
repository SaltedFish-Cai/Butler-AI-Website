import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-empty Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-empty/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test('should render basic empty state', async ({ page }) => {
    const empty = page.locator('[data-testid="empty-basic"]')
    await expect(empty).toHaveClass(/pa-empty/)
  });

  test('should render empty with icon', async ({ page }) => {
    const empty = page.locator('[data-testid="empty-basic"]')
    await expect(empty).toHaveClass(/pa-empty/)
    const icon = empty.locator('.pa-empty_icon')
    await expect(icon).toBeVisible({ timeout: 10000 })
  });

  test('should render empty with default message', async ({ page }) => {
    const empty = page.locator('[data-testid="empty-default"]')
    await expect(empty).toHaveClass(/pa-empty/)
    const message = empty.locator('.pa-empty_message')
    await expect(message).toHaveText('暂无数据')
  });

  test('should render empty with custom message', async ({ page }) => {
    const empty = page.locator('[data-testid="empty-custom"]')
    await expect(empty).toHaveClass(/pa-empty/)
    const message = empty.locator('.pa-empty_message')
    await expect(message).toHaveText('没有找到任何内容')
  });

  test('should render empty with custom icon', async ({ page }) => {
    const empty = page.locator('[data-testid="empty-icon"]')
    await expect(empty).toHaveClass(/pa-empty/)
    const icon = empty.locator('.pa-empty_icon')
    await expect(icon).toBeVisible({ timeout: 10000 })
  });

  test('should render empty with different icon and message', async ({ page }) => {
    const empty = page.locator('[data-testid="empty-icon-search"]')
    await expect(empty).toHaveClass(/pa-empty/)
    const message = empty.locator('.pa-empty_message')
    await expect(message).toHaveText('未找到搜索结果')
  });

  test('should render empty with long message', async ({ page }) => {
    const empty = page.locator('[data-testid="empty-long"]')
    await expect(empty).toHaveClass(/pa-empty/)
    const message = empty.locator('.pa-empty_message')
    await expect(message).toContainText('这是一个较长的提示信息')
  });
});
