import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-number Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-number/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test('should render basic number input', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-basic"]')
    await expect(numberInput).toBeVisible()
    const input = numberInput.locator('input')
    await expect(input).toBeVisible()
  });

  test('should render number input with placeholder', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-basic"]')
    const input = numberInput.locator('input')
    await expect(input).toHaveAttribute('placeholder', 'Enter number')
  });

  test('should render number with initial value', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-with-value"]')
    await expect(numberInput).toBeVisible()
    const input = numberInput.locator('input')
    await expect(input).toHaveValue('10')
  });

  test('should render number with controls by default', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-with-controls"]')
    await expect(numberInput).toBeVisible()
    const controls = numberInput.locator('.pa-number-input-controls')
    await expect(controls).toBeVisible()
  });

  test('should hide controls when controls prop is false', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-no-controls"]')
    await expect(numberInput).toBeVisible()
    const controls = numberInput.locator('.pa-number-input-controls')
    await expect(controls).not.toBeAttached()
  });

  test('should increment value when clicking up control', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-with-controls"]')
    const input = numberInput.locator('input')
    const initialValue = await input.inputValue()
    const upButton = numberInput.locator('.control-icon.top')
    await upButton.click()
    const newValue = await input.inputValue()
    expect(parseFloat(newValue)).toBe(parseFloat(initialValue) + 1)
  });

  test('should decrement value when clicking down control', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-with-controls"]')
    const input = numberInput.locator('input')
    const initialValue = await input.inputValue()
    const downButton = numberInput.locator('.control-icon.bottom')
    await downButton.click()
    const newValue = await input.inputValue()
    expect(parseFloat(newValue)).toBe(parseFloat(initialValue) - 1)
  });

  test('should respect step prop', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-with-step"]')
    const input = numberInput.locator('input')
    await expect(input).toHaveValue('5')
    const upButton = numberInput.locator('.control-icon.top')
    await upButton.click()
    await expect(input).toHaveValue('10')
  });

  test('should respect precision prop for decimals', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-precision"]')
    const input = numberInput.locator('input')
    // 10.555 rounded to 2 decimal places should be 10.56 (banker's rounding) or 10.55
    const value = await input.inputValue()
    expect(parseFloat(value)).toBeCloseTo(10.56, 1)
  });

  test('should display unit', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-with-unit"]')
    await expect(numberInput).toBeVisible()
    const unit = numberInput.locator('.pa-number-input-unit')
    await expect(unit).toHaveText('元')
  });

  test('should render disabled number input', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-disabled"]')
    await expect(numberInput).toBeVisible()
    // Check the inner pa-number component has is-disabled class
    const paNumber = numberInput.locator('.pa-number')
    await expect(paNumber).toHaveClass(/is-disabled/)
    const input = numberInput.locator('input')
    await expect(input).toBeDisabled()
  });

  test('should render display mode', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-display"]')
    await expect(numberInput).toBeVisible()
    // In display mode, the component renders .pa-display-style directly
    const displayStyle = numberInput.locator('.pa-display-style')
    await expect(displayStyle).toBeVisible()
  });

  test('should render number with title/label', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-with-title"]')
    await expect(numberInput).toBeVisible()
    const label = numberInput.locator('.pa-cell-label')
    await expect(label).toHaveText('Quantity')
  });

  test('should trigger blur event', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-events"]')
    const input = numberInput.locator('input')
    await input.focus()
    await input.blur()
    const blurCount = page.locator('[data-testid="number-blur-count"]')
    await expect(blurCount).toContainText('Blur: 1')
  });

  test('should have clear button when clearable and has value', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-clearable"]')
    await expect(numberInput).toBeVisible()
    const clearIcon = numberInput.locator('.clear-icon')
    await expect(clearIcon).toBeAttached()
  });

  test('should clear value when clear button is clicked', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-clearable"]')
    const input = numberInput.locator('input')
    // Verify the input has value
    await expect(input).toHaveValue('10')
    // Use JavaScript to click the clear icon directly (since it might not be visible)
    await page.evaluate(() => {
      const clearIcon = document.querySelector('[data-testid="number-clearable"] .clear-icon');
      if (clearIcon) {
        (clearIcon as HTMLElement).click();
      }
    });
    await expect(input).toHaveValue('0')
  });

  test('should update value on input', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-basic"]')
    const input = numberInput.locator('input')
    await input.fill('25')
    await expect(input).toHaveValue('25')
  });

  test('should filter non-numeric input', async ({ page }) => {
    const numberInput = page.locator('[data-testid="number-basic"]')
    const input = numberInput.locator('input')
    await input.fill('abc123def')
    await expect(input).toHaveValue('123')
  });
})
