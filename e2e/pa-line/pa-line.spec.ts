import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-line Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-line/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test('should render basic line', async ({ page }) => {
    const line = page.locator('[data-testid="line-basic"]')
    await expect(line).toHaveClass(/pa-line/)
  });

  test('should render line with custom height', async ({ page }) => {
    const line = page.locator('[data-testid="line-height"]')
    await expect(line).toHaveClass(/pa-line/)
  });

  test('should render line with custom width', async ({ page }) => {
    const line = page.locator('[data-testid="line-width"]')
    await expect(line).toHaveClass(/pa-line/)
    const width = await line.evaluate(el => el.style.getPropertyValue('--pa-line-width'))
    expect(width).toBe('200px')
  });

  test('should render line with custom color', async ({ page }) => {
    const line = page.locator('[data-testid="line-color"]')
    await expect(line).toHaveClass(/pa-line/)
    const color = await line.evaluate(el => el.style.getPropertyValue('--pa-line-border-color'))
    // Color can be either hex or rgb format
    expect(color).toMatch(/(rgb\(255,\s*0,\s*0\)|#ff0000)/i)
  });

  test('should render line with solid style', async ({ page }) => {
    const line = page.locator('[data-testid="line-solid"]')
    await expect(line).toHaveClass(/pa-line/)
    const style = await line.evaluate(el => el.style.getPropertyValue('--pa-line-border-style'))
    expect(style).toBe('solid')
  });

  test('should render line with dashed style', async ({ page }) => {
    const line = page.locator('[data-testid="line-dashed"]')
    await expect(line).toHaveClass(/pa-line/)
    const style = await line.evaluate(el => el.style.getPropertyValue('--pa-line-border-style'))
    expect(style).toBe('dashed')
  });

  test('should render line with dotted style', async ({ page }) => {
    const line = page.locator('[data-testid="line-dotted"]')
    await expect(line).toHaveClass(/pa-line/)
    const style = await line.evaluate(el => el.style.getPropertyValue('--pa-line-border-style'))
    expect(style).toBe('dotted')
  });

  test('should render line with double style', async ({ page }) => {
    const line = page.locator('[data-testid="line-double"]')
    await expect(line).toHaveClass(/pa-line/)
    const style = await line.evaluate(el => el.style.getPropertyValue('--pa-line-border-style'))
    expect(style).toBe('double')
  });

  test('should render line with custom padding', async ({ page }) => {
    const line = page.locator('[data-testid="line-padding"]')
    await expect(line).toHaveClass(/pa-line/)
  });

  test('should render line with slot content', async ({ page }) => {
    const line = page.locator('[data-testid="line-slot"]')
    await expect(line).toHaveClass(/pa-line/)
    const slotContent = line.locator('.ml-size')
    await expect(slotContent).toContainText('插槽内容')
  });

  test('should render line with combined styles', async ({ page }) => {
    const line = page.locator('[data-testid="line-combined"]')
    await expect(line).toHaveClass(/pa-line/)
  });

  test('should render line with groove style', async ({ page }) => {
    const line = page.locator('[data-testid="line-groove"]')
    await expect(line).toHaveClass(/pa-line/)
    const style = await line.evaluate(el => el.style.getPropertyValue('--pa-line-border-style'))
    expect(style).toBe('groove')
  })

  test('should render line with inset style', async ({ page }) => {
    const line = page.locator('[data-testid="line-inset"]')
    await expect(line).toHaveClass(/pa-line/)
    const style = await line.evaluate(el => el.style.getPropertyValue('--pa-line-border-style'))
    expect(style).toBe('inset')
  })

  test('should render line with outset style', async ({ page }) => {
    const line = page.locator('[data-testid="line-outset"]')
    await expect(line).toHaveClass(/pa-line/)
    const style = await line.evaluate(el => el.style.getPropertyValue('--pa-line-border-style'))
    expect(style).toBe('outset')
  })

  test('should render line with ridge style', async ({ page }) => {
    const line = page.locator('[data-testid="line-ridge"]')
    await expect(line).toHaveClass(/pa-line/)
    const style = await line.evaluate(el => el.style.getPropertyValue('--pa-line-border-style'))
    expect(style).toBe('ridge')
  })
})
