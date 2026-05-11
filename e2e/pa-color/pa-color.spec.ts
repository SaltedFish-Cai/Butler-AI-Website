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
    const preview = colorPicker.locator('.pa-color-preview')
    await expect(preview).toBeVisible({ timeout: 5000 })
  });

  test('should render color picker without preset colors', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-no-preset"]')
    await expect(colorPicker).toBeVisible()
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
    await page.waitForTimeout(500)
  });

  test('should render color picker structure correctly', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-basic"]')
    await expect(colorPicker).toHaveClass(/pa-color/)
  });

  // 新增测试：颜色选择交互测试
  test('should change color when clicking color area', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-basic"]')
    const preview = colorPicker.locator('.pa-color-preview')
    const previewColor = preview.locator('.pa-color-preview-color')
    const previewText = preview.locator('.pa-color-preview-text')
    
    await preview.click()
    await page.waitForTimeout(300)
    
    const colorArea = page.locator('.pa-color-picker-color-area')
    await colorArea.click({ position: { x: 50, y: 50 } })
    
    await expect(previewText).not.toHaveText('#1890ff')
  });

  // 新增测试：预设颜色点击测试
  test('should select preset color when clicking', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-preset"]')
    const preview = colorPicker.locator('.pa-color-preview')
    const previewText = preview.locator('.pa-color-preview-text')
    
    await preview.click()
    await page.waitForTimeout(300)
    
    const preset = page.locator('.pa-color-picker-presets-preset').first()
    await preset.click()
    
    await expect(previewText).toHaveText('#ff0000')
  });

  // 新增测试：透明度调节测试
  test('should change alpha value when clicking alpha slider', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-alpha"]')
    const preview = colorPicker.locator('.pa-color-preview')
    const previewText = preview.locator('.pa-color-preview-text')
    
    await preview.click()
    await page.waitForTimeout(300)
    
    const alphaSlider = page.locator('.pa-color-picker-alpha-area-gradient')
    await alphaSlider.click({ position: { x: 10, y: 10 } })
    
    const text = await previewText.textContent()
    expect(text).toMatch(/rgba/)
  });

  // 新增测试：空预设颜色数组测试
  test('should handle empty preset colors array', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-no-preset"]')
    await expect(colorPicker).toBeVisible()
    const presets = colorPicker.locator('.pa-color-picker-presets')
    await expect(presets).toHaveCount(0)
  });

  // 新增测试：popover面板真正打开验证
  test('should display popover content when preview is clicked', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-basic"]')
    const preview = colorPicker.locator('.pa-color-preview')
    
    await preview.click()
    await page.waitForTimeout(300)
    
    const popoverContent = page.locator('.pa-color-picker')
    await expect(popoverContent).toBeVisible()
  });

  // 新增测试：颜色文本显示验证
  test('should display correct color text in preview', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-basic"]')
    const previewText = colorPicker.locator('.pa-color-preview-text')
    
    await expect(previewText).toHaveText('#1890ff')
  });

  // 新增测试：色相条交互测试
  test('should change hue when clicking hue slider', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-basic"]')
    const preview = colorPicker.locator('.pa-color-preview')
    const previewText = preview.locator('.pa-color-preview-text')
    
    await preview.click()
    await page.waitForTimeout(300)
    
    const hueSlider = page.locator('.pa-color-picker-hue-area-gradient')
    await hueSlider.click({ position: { x: 10, y: 10 } })
    
    await expect(previewText).not.toHaveText('#1890ff')
  });

  // 新增测试：十六进制输入框存在验证
  test('should have hex input when useInput is true', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-basic"]')
    const preview = colorPicker.locator('.pa-color-preview')
    
    await preview.click()
    await page.waitForTimeout(300)
    
    const input = page.locator('.pa-color-picker-inputs-input')
    await expect(input).toBeVisible()
  });

  // 新增测试：无输入框验证
  test('should not have hex input when useInput is false', async ({ page }) => {
    const colorPicker = page.locator('[data-testid="color-no-input"]')
    const preview = colorPicker.locator('.pa-color-preview')
    
    await preview.click()
    await page.waitForTimeout(500)
    
    // useInput=false 时 popover 内不应渲染 input 元素
    const popover = page.locator('.pa-color-picker')
    await expect(popover).toBeVisible({ timeout: 3000 })
    
    const inputsInPopover = popover.locator('.pa-color-picker-inputs-input')
    await expect(inputsInPopover).toHaveCount(0)
  });
})
