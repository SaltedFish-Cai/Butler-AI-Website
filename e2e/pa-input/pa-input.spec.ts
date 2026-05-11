import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-input Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-input/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test('should render basic input element', async ({ page }) => {
    const input = page.locator('[data-testid="input-basic"]')
    await expect(input).toBeVisible()
    const textarea = input.locator('textarea')
    await expect(textarea).toBeVisible()
  });

  test('should render input with placeholder', async ({ page }) => {
    const input = page.locator('[data-testid="input-basic"]')
    const textarea = input.locator('textarea')
    await expect(textarea).toHaveAttribute('placeholder', 'Please enter text')
  });

  test('should render input with initial value', async ({ page }) => {
    const input = page.locator('[data-testid="input-with-value"]')
    await expect(input).toBeVisible()
    const textarea = input.locator('textarea')
    await expect(textarea).toHaveValue('Initial Value')
  });

  test('should update input value on typing', async ({ page }) => {
    const input = page.locator('[data-testid="input-basic"]')
    const textarea = input.locator('textarea')
    await textarea.fill('Hello World')
    await expect(textarea).toHaveValue('Hello World')
  });

  test('should enforce maxLength restriction', async ({ page }) => {
    const input = page.locator('[data-testid="input-maxlength"]')
    const textarea = input.locator('textarea')
    await textarea.fill('This is a very long text that exceeds the limit')
    const value = await textarea.inputValue()
    expect(value.length).toBeLessThanOrEqual(10)
  });

  test('should render disabled input', async ({ page }) => {
    const input = page.locator('[data-testid="input-disabled"]')
    await expect(input).toBeVisible()
    // Check the inner pa-input_body has is-disabled class
    const inputBody = input.locator('.pa-input_body')
    await expect(inputBody).toHaveClass(/is-disabled/)
    const textarea = input.locator('textarea')
    await expect(textarea).toBeDisabled()
  });

  test('should render display mode', async ({ page }) => {
    const input = page.locator('[data-testid="input-display"]')
    await expect(input).toBeVisible()
    // In display mode, the component renders .pa-display-style directly
    const displayStyle = input.locator('.pa-display-style')
    await expect(displayStyle).toBeVisible()
  });

  test('should render input with title/label', async ({ page }) => {
    const input = page.locator('[data-testid="input-with-title"]')
    await expect(input).toBeVisible()
    const label = input.locator('.pa-cell-label')
    await expect(label).toHaveText('Label')
  });

  test('should have clear icon in DOM when clearable and has value', async ({ page }) => {
    const input = page.locator('[data-testid="input-clearable"]')
    await expect(input).toBeVisible()
    // Clear icon exists in DOM (CSS controls visibility via hover)
    const clearIcon = input.locator('.clear-icon')
    await expect(clearIcon).toBeAttached()
  });

  test('should trigger focus event', async ({ page }) => {
    const input = page.locator('[data-testid="input-events"]')
    const textarea = input.locator('textarea')
    await textarea.focus()
    const focusCount = page.locator('[data-testid="focus-count"]')
    await expect(focusCount).toContainText('Focus: 1')
  });

  test('should trigger blur event', async ({ page }) => {
    const input = page.locator('[data-testid="input-events"]')
    const textarea = input.locator('textarea')
    await textarea.focus()
    await textarea.blur()
    const blurCount = page.locator('[data-testid="blur-count"]')
    await expect(blurCount).toContainText('Blur: 1')
  });

  test('should trigger enter event on Enter key', async ({ page }) => {
    const input = page.locator('[data-testid="input-events"]')
    const textarea = input.locator('textarea')
    await textarea.focus()
    await textarea.press('Enter')
    const enterCount = page.locator('[data-testid="enter-count"]')
    await expect(enterCount).toContainText('Enter: 1')
  });

  test('should render multiple inputs independently', async ({ page }) => {
    const input1 = page.locator('[data-testid="input-1"]')
    const input2 = page.locator('[data-testid="input-2"]')
    await expect(input1).toBeVisible()
    await expect(input2).toBeVisible()
    const textarea1 = input1.locator('textarea')
    const textarea2 = input2.locator('textarea')
    await expect(textarea1).toHaveValue('Initial Value')
    await expect(textarea2).toHaveValue('')
  });
})
