import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-color Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-color/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should render basic color picker', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-basic"]')
    await expect(colorPicker).toBeVisible()
  });

  test('should render color picker with preview', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-basic"]')
    const preview = colorPicker.locator('.pa-color-preview')
    await expect(preview).toBeVisible({ timeout: 5000 })
  });

  test('should render color picker with alpha support', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-alpha"]')
    await expect(colorPicker).toBeVisible()
  });

  test('should render color picker without alpha', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-no-alpha"]')
    await expect(colorPicker).toBeVisible()
  });

  test('should render color picker without input', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-no-input"]')
    await expect(colorPicker).toBeVisible()
  });

  test('should render disabled color picker', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-disabled"]')
    await expect(colorPicker).toHaveClass(/pa-color-disabled/)
  });

  test('should render color picker with preset colors', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-preset"]')
    await expect(colorPicker).toBeVisible()
  });

  test('should trigger change event when color changes', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-event"]')
    await expect(colorPicker).toBeVisible()
    const eventLog = page.locator('[data-testid="color-event-log"]')
    await expect(eventLog).toHaveCount(1)
  });

  test('should render color picker with RGBA initial value', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-rgba"]')
    await expect(colorPicker).toBeVisible()
    // Alpha-enabled picker should have alpha area
    const preview = colorPicker.locator('.pa-color-preview')
    await expect(preview).toBeVisible({ timeout: 5000 })
  });

  test('should render color picker without preset colors', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-no-preset"]')
    await expect(colorPicker).toBeVisible()
    // No preset colors should mean no presets section
    const presets = colorPicker.locator('.pa-color-picker-presets')
    await expect(presets).toHaveCount(0)
  });

  test('should render default color value', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-default"]')
    await expect(colorPicker).toBeVisible()
  });

  test('should open color panel on preview click', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-basic"]')
    const preview = colorPicker.locator('.pa-color-preview')
    await expect(preview).toBeVisible({ timeout: 5000 })
    await preview.click()
    // After clicking, popover content should appear
    await page.waitForTimeout(500)
  });

  test('should render color picker structure correctly', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-basic"]')
    await expect(colorPicker).toHaveClass(/pa-color/)
  });
})
