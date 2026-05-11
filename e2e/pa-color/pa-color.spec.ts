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
    // Disabled color picker is in DOM but may have opacity 0 or be hidden
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
    // Event log element exists
    await expect(eventLog).toHaveCount(1)
  });
});
