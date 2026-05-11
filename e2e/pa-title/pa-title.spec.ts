import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-title Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-title/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test('should render basic title', async ({ page }) => {
    const title = page.locator('[data-testid="title-basic"]')
    await expect(title).toHaveClass(/pa-title/)
  });

  test('should render title with text content', async ({ page }) => {
    const title = page.locator('[data-testid="title-basic"]')
    await expect(title).toContainText('主标题')
  });

  test('should render title with tips', async ({ page }) => {
    const title = page.locator('[data-testid="title-tips"]')
    await expect(title).toHaveClass(/pa-title/)
    const tips = title.locator('.pa-title_tip')
    await expect(tips).toBeVisible({ timeout: 10000 })
    await expect(tips).toContainText('这是一个提示')
  });

  test('should render title with tips on right', async ({ page }) => {
    const title = page.locator('[data-testid="title-tips-right"]')
    await expect(title).toHaveClass(/pa-title/)
  });

  test('should render title with tips on bottom', async ({ page }) => {
    const title = page.locator('[data-testid="title-tips-bottom"]')
    await expect(title).toHaveClass(/pa-title/)
    const tips = title.locator('.pa-title_tip')
    await expect(tips).toBeVisible({ timeout: 10000 })
    await expect(tips).toContainText('底部提示')
  });

  test('should render title with default style mode', async ({ page }) => {
    const title = page.locator('[data-testid="title-default"]')
    await expect(title).toHaveClass(/default/)
  });

  test('should render title with horizontal style mode', async ({ page }) => {
    const title = page.locator('[data-testid="title-horizontal"]')
    await expect(title).toHaveClass(/horizontal/)
  });

  test('should render title with vertical style mode', async ({ page }) => {
    const title = page.locator('[data-testid="title-vertical"]')
    await expect(title).toHaveClass(/vertical/)
  });

  test('should render title with line config', async ({ page }) => {
    const title = page.locator('[data-testid="title-line"]')
    await expect(title).toHaveClass(/pa-title/)
    const line = title.locator('.pa-line')
    await expect(line).toBeVisible({ timeout: 10000 })
  });

  test('should render title with padding top/bottom', async ({ page }) => {
    const title = page.locator('[data-testid="title-padding"]')
    await expect(title).toHaveClass(/pa-title/)
  });

  test('should render title with padding left/right', async ({ page }) => {
    const title = page.locator('[data-testid="title-padding-lr"]')
    await expect(title).toHaveClass(/pa-title/)
  });

  test('should render title with padding all', async ({ page }) => {
    const title = page.locator('[data-testid="title-padding-all"]')
    await expect(title).toHaveClass(/pa-title/)
  });

  test('should render title with padding null', async ({ page }) => {
    const title = page.locator('[data-testid="title-padding-null"]')
    await expect(title).toHaveClass(/pa-title/)
  });

  test('should render title with custom line config', async ({ page }) => {
    const title = page.locator('[data-testid="title-custom-line"]')
    await expect(title).toHaveClass(/pa-title/)
    const line = title.locator('.pa-line')
    await expect(line).toBeVisible({ timeout: 10000 })
  });

  test('should render title with tips slot', async ({ page }) => {
    const title = page.locator('[data-testid="title-tips-slot"]')
    await expect(title).toHaveClass(/pa-title/)
    const tips = title.locator('.pa-title_tip')
    await expect(tips).toContainText('插槽提示内容')
  });
})
