import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107

test.describe('pa-select-icon Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-select-icon/e2e-test`)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('should render icon selector with initial value', async ({ page }) => {
    // pa-select-icon renders with pa-button inside
    const selectIcon = page.locator('.pa-select-icon').first()
    await expect(selectIcon).toBeVisible()
    
    // Check value display
    const valueDisplay = page.locator('[data-testid="icon-value"]')
    await expect(valueDisplay).toHaveText('search_line')
  })

  test('should render icon selector with placeholder', async ({ page }) => {
    const selectIcon = page.locator('.pa-select-icon').nth(1)
    await expect(selectIcon).toBeVisible()
  })

  test('should render disabled icon selector', async ({ page }) => {
    const selectIcon = page.locator('.pa-select-icon.is-disabled').first()
    await expect(selectIcon).toBeVisible()
  })

  test('should render icon selector with title', async ({ page }) => {
    const selectIcon = page.locator('.pa-select-icon').filter({ has: page.locator('.pa-cell-label') })
    await expect(selectIcon).toBeVisible()
  })

  test('should render icon selector in display mode', async ({ page }) => {
    const selectIcon = page.locator('.pa-display-style').first()
    await expect(selectIcon).toBeVisible()
  })

  test('should open icon popover when clicking', async ({ page }) => {
    const selectIcon = page.locator('.pa-select-icon').first()
    await selectIcon.click()
    await page.waitForTimeout(1000)
    
    // The popover should contain icon grid
    const iconGrid = page.locator('.pa-select-icon_popover').first()
    await expect(iconGrid).toBeVisible({ timeout: 5000 })
  })

  test('should show icon grid in popover', async ({ page }) => {
    const selectIcon = page.locator('.pa-select-icon').first()
    await selectIcon.click()
    await page.waitForTimeout(1000)
    
    // Find icons in the popover - use first() to avoid strict mode violation
    const iconGrid = page.locator('.pa-select-icon_popover').first()
    await expect(iconGrid).toBeVisible({ timeout: 5000 })
    
    // Should have some icon elements
    const icons = iconGrid.locator('i')
    await expect(icons.first()).toBeVisible({ timeout: 5000 })
  })

  test('should select icon when clicking', async ({ page }) => {
    const selectIcon = page.locator('.pa-select-icon').first()
    await selectIcon.click()
    await page.waitForTimeout(1000)
    
    // Find the icon grid
    const iconGrid = page.locator('.pa-select-icon_popover').first()
    await expect(iconGrid).toBeVisible({ timeout: 5000 })
    
    // Find a specific icon and click it
    const icons = iconGrid.locator('i')
    const firstIcon = icons.first()
    await firstIcon.click()
    
    await page.waitForTimeout(500)
  })

  test('should emit change event when selecting icon', async ({ page }) => {
    const selectIcon = page.locator('.pa-select-icon').first()
    await selectIcon.click()
    await page.waitForTimeout(1000)
    
    // Find and click an icon
    const iconGrid = page.locator('.pa-select-icon_popover').first()
    await expect(iconGrid).toBeVisible({ timeout: 5000 })
    
    const icons = iconGrid.locator('i')
    await icons.first().click()
    
    await page.waitForTimeout(500)
    const eventsCount = page.locator('[data-testid="icon-change-events-count"]')
    await expect(eventsCount).toHaveText('1')
  })
})
