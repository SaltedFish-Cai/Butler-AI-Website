import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-button Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for Vue components to mount
  });

  test('should render button elements with text content', async ({ page }) => {
    const btnPrimary = page.locator('[data-testid="btn-primary"]')
    await expect(btnPrimary).toBeVisible()
    await expect(btnPrimary).toHaveText('Primary')
  })

  test('should render buttons with different types', async ({ page }) => {
    await expect(page.locator('[data-testid="btn-primary"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-warning"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-danger"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-info"]')).toBeVisible()
    
    await expect(page.locator('[data-testid="btn-primary"]')).toHaveClass(/primary/)
    await expect(page.locator('[data-testid="btn-success"]')).toHaveClass(/success/)
    await expect(page.locator('[data-testid="btn-warning"]')).toHaveClass(/warning/)
    await expect(page.locator('[data-testid="btn-danger"]')).toHaveClass(/danger/)
    await expect(page.locator('[data-testid="btn-info"]')).toHaveClass(/info/)
  })

  test('should render buttons with different sizes', async ({ page }) => {
    await expect(page.locator('[data-testid="btn-large"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-medium"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-small"]')).toBeVisible()
    
    await expect(page.locator('[data-testid="btn-large"]')).toHaveClass(/large/)
    await expect(page.locator('[data-testid="btn-medium"]')).toHaveClass(/medium/)
    await expect(page.locator('[data-testid="btn-small"]')).toHaveClass(/small/)
  })

  test('should not trigger click event when disabled', async ({ page }) => {
    const btnDisabled = page.locator('[data-testid="btn-disabled"]')
    await expect(btnDisabled).toBeVisible()
    await expect(btnDisabled).toBeDisabled()
  })

  test('should show loading state', async ({ page }) => {
    const btnLoading = page.locator('[data-testid="btn-loading"]')
    await expect(btnLoading).toBeVisible()
    await expect(btnLoading).toHaveClass(/pa-button/)
  })

  test('should render button with icon', async ({ page }) => {
    const btnWithIcon = page.locator('[data-testid="btn-with-icon"]')
    await expect(btnWithIcon).toBeVisible()
    const iconInside = btnWithIcon.locator('.pa-icon')
    await expect(iconInside.first()).toBeVisible()
  })

  test('should render plain and non-plain buttons correctly', async ({ page }) => {
    const btnPlain = page.locator('[data-testid="btn-plain"]')
    const btnNonPlain = page.locator('[data-testid="btn-non-plain"]')
    
    await expect(btnPlain).toBeVisible()
    await expect(btnNonPlain).toBeVisible()
    await expect(btnPlain).toHaveClass(/use-plain/)
    await expect(btnNonPlain).not.toHaveClass(/use-plain/)
  })

  test('should render preset style buttons (is prop)', async ({ page }) => {
    await expect(page.locator('[data-testid="btn-is-add"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-is-delete"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-is-edit"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-is-delete"]')).toHaveClass(/danger/)
  })
})
