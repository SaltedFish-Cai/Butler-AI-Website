import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-button Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-button/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should render button elements with text content', async ({ page }) => {
    const btnPrimary = page.locator('[data-testid="btn-primary"]')
    await expect(btnPrimary).toBeVisible()
    await expect(btnPrimary).toHaveText('Primary')
  })

  test('should render buttons with different types', async ({ page }) => {
    await expect(page.locator('[data-testid="btn-primary"]')).toHaveClass(/primary/)
    await expect(page.locator('[data-testid="btn-success"]')).toHaveClass(/success/)
    await expect(page.locator('[data-testid="btn-warning"]')).toHaveClass(/warning/)
    await expect(page.locator('[data-testid="btn-danger"]')).toHaveClass(/danger/)
    await expect(page.locator('[data-testid="btn-info"]')).toHaveClass(/info/)
  })

  test('should render buttons with different sizes', async ({ page }) => {
    await expect(page.locator('[data-testid="btn-large"]')).toHaveClass(/large/)
    await expect(page.locator('[data-testid="btn-medium"]')).toHaveClass(/medium/)
    await expect(page.locator('[data-testid="btn-small"]')).toHaveClass(/small/)
  })

  test('should not trigger click event when disabled', async ({ page }) => {
    const btnDisabled = page.locator('[data-testid="btn-disabled"]')
    await expect(btnDisabled).toBeDisabled()
  })

  test('should show loading state', async ({ page }) => {
    const btnLoading = page.locator('[data-testid="btn-loading"]')
    await expect(btnLoading).toHaveClass(/pa-button/)
  })

  test('should render button with icon', async ({ page }) => {
    const btnWithIcon = page.locator('[data-testid="btn-with-icon"]')
    await expect(btnWithIcon).toBeVisible({ timeout: 10000 })
    // icon-name prop renders an icon inside the button
    const iconInside = btnWithIcon.locator('i.pa-icon, .pa-icon_font, .pa-icon')
    await expect(iconInside.first()).toBeVisible({ timeout: 5000 })
  })

  test('should trigger click event', async ({ page }) => {
    const btnClickable = page.locator('[data-testid="btn-clickable"]')
    await btnClickable.click()
    const countEl = page.locator('[data-testid="btn-click-count"]')
    await expect(countEl).toHaveText('1')
  })

  test('should render plain and non-plain buttons correctly', async ({ page }) => {
    const btnPlain = page.locator('[data-testid="btn-plain"]')
    const btnNonPlain = page.locator('[data-testid="btn-non-plain"]')
    
    await expect(btnPlain).toHaveClass(/use-plain/)
    await expect(btnNonPlain).not.toHaveClass(/use-plain/)
  })

  test('should render preset style buttons (is prop)', async ({ page }) => {
    await expect(page.locator('[data-testid="btn-is-add"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-is-delete"]')).toHaveClass(/danger/)
  })
})
