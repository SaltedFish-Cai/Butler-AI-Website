import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107

test.describe('pa-select Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-select/e2e-test`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('should render single select with initial value', async ({ page }) => {
    // Look for the select by its parent div with pa-select class
    const selectSingle = page.locator('.pa-select').first()
    await expect(selectSingle).toBeVisible()
    
    // Check value display
    const valueDisplay = page.locator('[data-testid="select-single-value"]')
    await expect(valueDisplay).toHaveText('apple')
  })

  test('should render multiple select with initial values', async ({ page }) => {
    // Multiple select has type="multiple-select"
    const selectMultiple = page.locator('.pa-select').nth(1)
    await expect(selectMultiple).toBeVisible()
    
    // Check value display  
    const valueDisplay = page.locator('[data-testid="select-multiple-value"]')
    await expect(valueDisplay).toContainText('apple')
    await expect(valueDisplay).toContainText('banana')
  })

  test('should render select with placeholder', async ({ page }) => {
    // Find select with placeholder text
    const selectPlaceholder = page.locator('.pa-select').nth(2)
    await expect(selectPlaceholder).toBeVisible()
  })

  test('should render disabled select', async ({ page }) => {
    const selectDisabled = page.locator('.pa-select.is-disabled').first()
    await expect(selectDisabled).toBeVisible()
  })

  test('should render select with title', async ({ page }) => {
    const selectWithTitle = page.locator('.pa-select').filter({ has: page.locator('.pa-cell-label') })
    await expect(selectWithTitle).toBeVisible()
  })

  test('should render select in display mode', async ({ page }) => {
    const selectDisplay = page.locator('.pa-display-style').first()
    await expect(selectDisplay).toBeVisible()
  })

  test('should open dropdown when clicking select', async ({ page }) => {
    const selectSingle = page.locator('.pa-select').first()
    await selectSingle.click()
    await page.waitForTimeout(800)
    
    // The popover should be visible after clicking
    const popover = page.locator('.pa-select-options')
    await expect(popover).toBeVisible({ timeout: 5000 })
  })

  test('should select option from dropdown', async ({ page }) => {
    const selectSingle = page.locator('.pa-select').first()
    await selectSingle.click()
    await page.waitForTimeout(800)
    
    // Find and click on Banana option
    const popover = page.locator('.pa-select-options')
    await expect(popover).toBeVisible({ timeout: 5000 })
    const bananaOption = popover.locator('.pa-select-option', { hasText: 'Banana' })
    await bananaOption.click()
    
    // Value should update
    await page.waitForTimeout(500)
    const valueDisplay = page.locator('[data-testid="select-single-value"]')
    await expect(valueDisplay).toHaveText('banana')
  })

  test('should select multiple options in multiple-select mode', async ({ page }) => {
    const selectMultiple = page.locator('.pa-select').nth(1)
    await selectMultiple.click()
    await page.waitForTimeout(800)
    
    const popover = page.locator('.pa-select-options')
    await expect(popover).toBeVisible({ timeout: 5000 })
    
    // Click on Orange option
    const orangeOption = popover.locator('.pa-select-option', { hasText: 'Orange' })
    await orangeOption.click()
    await page.waitForTimeout(500)
    
    // Check value updated
    const valueDisplay = page.locator('[data-testid="select-multiple-value"]')
    await expect(valueDisplay).toContainText('orange')
  })

  test('should emit change event when selecting option', async ({ page }) => {
    const selectSingle = page.locator('.pa-select').first()
    await selectSingle.click()
    await page.waitForTimeout(800)
    
    const popover = page.locator('.pa-select-options')
    await expect(popover).toBeVisible({ timeout: 5000 })
    const grapeOption = popover.locator('.pa-select-option', { hasText: 'Grape' })
    await grapeOption.click()
    
    await page.waitForTimeout(500)
    const eventsCount = page.locator('[data-testid="change-events-count"]')
    await expect(eventsCount).toHaveText('1')
  })

  test('should have options with active state', async ({ page }) => {
    const selectSingle = page.locator('.pa-select').first()
    await selectSingle.click()
    await page.waitForTimeout(800)
    
    const popover = page.locator('.pa-select-options')
    await expect(popover).toBeVisible({ timeout: 5000 })
    
    // Check that active option has is-active class
    const activeOption = popover.locator('.pa-select-option.is-active', { hasText: 'Apple' })
    await expect(activeOption).toBeVisible()
  })
})
