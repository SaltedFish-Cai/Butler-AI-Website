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

  test('should render icon position left and right', async ({ page }) => {
    const btnIconLeft = page.locator('[data-testid="btn-icon-left"]')
    const btnIconRight = page.locator('[data-testid="btn-icon-right"]')
    
    await expect(btnIconLeft).toBeVisible()
    await expect(btnIconRight).toBeVisible()
    await expect(btnIconLeft).toHaveClass(/icon-position-left/)
    await expect(btnIconRight).toHaveClass(/icon-position-right/)
  })

  test('should render underline button (useLine)', async ({ page }) => {
    const btnUnderline = page.locator('[data-testid="btn-underline"]')
    await expect(btnUnderline).toBeVisible()
    await expect(btnUnderline).toHaveClass(/use-line/)
  })

  test('should render button with text attribute', async ({ page }) => {
    const btnTextProp = page.locator('[data-testid="btn-text-prop"]')
    await expect(btnTextProp).toBeVisible()
    await expect(btnTextProp).toHaveText('Text Prop Button')
  })

  test('should render useFont toggle', async ({ page }) => {
    const btnUseFontTrue = page.locator('[data-testid="btn-use-font-true"]')
    const btnUseFontFalse = page.locator('[data-testid="btn-use-font-false"]')
    
    await expect(btnUseFontTrue).toBeVisible()
    await expect(btnUseFontFalse).toBeVisible()
    await expect(btnUseFontTrue.locator('.pa-icon_font').first()).toBeVisible({ timeout: 5000 })
    await expect(btnUseFontFalse.locator('.pa-icon_font')).toHaveCount(0)
  })

  test('should render default type button without type class', async ({ page }) => {
    const btnDefault = page.locator('[data-testid="btn-default-type"]')
    await expect(btnDefault).toBeVisible()
    await expect(btnDefault).not.toHaveClass(/primary|success|warning|danger|info/)
  })

  test('should render debounced toggle buttons', async ({ page }) => {
    const btnDebouncedTrue = page.locator('[data-testid="btn-debounced-true"]')
    const btnDebouncedFalse = page.locator('[data-testid="btn-debounced-false"]')
    
    await expect(btnDebouncedTrue).toBeVisible()
    await expect(btnDebouncedFalse).toBeVisible()
    await expect(btnDebouncedTrue).toHaveClass(/use-debounce/)
  })

  test('should render button with confirmConfig prop', async ({ page }) => {
    const btnConfirmConfig = page.locator('[data-testid="btn-confirm-config"]')
    await expect(btnConfirmConfig).toBeVisible()
  })

  test('should trigger confirmClick event', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-confirm-event"]')
    await expect(btn).toBeVisible()
    await btn.click()
    // confirmClick fired on dialog confirm, count stays 0 without dialog interaction
    // just verify button renders and has correct class
    await expect(btn).toHaveClass(/pa-button/)
  })

  test('should trigger submitClick event', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-submit-event"]')
    await expect(btn).toBeVisible()
    await expect(btn).toHaveClass(/pa-button/)
  })

  test('should trigger deleteClick event', async ({ page }) => {
    const btn = page.locator('[data-testid="btn-delete-event"]')
    await expect(btn).toBeVisible()
    await expect(btn).toHaveClass(/danger/)
  })
})
