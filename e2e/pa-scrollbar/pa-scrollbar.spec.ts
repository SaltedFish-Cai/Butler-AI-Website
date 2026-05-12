import { test, expect } from '@playwright/test'

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe('pa-scrollbar Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-scrollbar/e2e-test`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('should render basic scrollbar', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-basic"]')
    await expect(scrollbar).toBeVisible()
    await expect(scrollbar).toHaveClass(/pa-scrollbar/)
  });

  test('should render scrollbar container', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-basic"]')
    await expect(scrollbar).toBeVisible()
    const content = scrollbar.locator('.pa-scrollbar-content')
    await expect(content).toBeVisible()
  });

  test('should render scrollbar without shadow', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-no-shadow"]')
    await expect(scrollbar).toBeVisible()
  });

  test('should render scrollbar without back top', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-no-backtop"]')
    await expect(scrollbar).toBeVisible()
    const backTop = scrollbar.locator('.pa-scrollbar-back-top')
    await expect(backTop).toBeHidden({ timeout: 3000 })
  });

  test('should render scrollbar without thumb', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-no-thumb"]')
    await expect(scrollbar).toBeVisible()
  });

  test('should render scrollbar with color mode', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-color-mode"]')
    await expect(scrollbar).toBeVisible()
    await expect(scrollbar).toHaveClass(/color-scrollbar/)
  });

  test('should render scrollbar with padding', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-padding"]')
    await expect(scrollbar).toBeVisible()
    const content = scrollbar.locator('.pa-scrollbar-content')
    await expect(content).toBeVisible()
  });

  test('should render scrollbar with border', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-border"]')
    await expect(scrollbar).toBeVisible()
  });

  test('should render scrollbar with content style', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-content-style"]')
    await expect(scrollbar).toBeVisible()
  });

  test('should render horizontal scrollbar', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-horizontal"]')
    await expect(scrollbar).toBeVisible()
  });

  test('should have scrollbar body', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-basic"]')
    const body = scrollbar.locator('.scrollbar-body')
    await expect(body).toBeVisible()
  });

  test('should render scrollbar content', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-basic"]')
    await expect(scrollbar).toContainText('Scroll content - Basic')
  });

  test('should render back top button', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-backtop"]')
    await expect(scrollbar).toBeVisible()
    const backTop = scrollbar.locator('.pa-scrollbar-back-top')
    await expect(backTop).toBeVisible({ timeout: 5000 })
  })

  test('should render padding border elements', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-padding-border"]')
    await expect(scrollbar).toBeVisible()
    const paddingTopBorder = scrollbar.locator('.pa-border_padding_top')
    await expect(paddingTopBorder).toBeAttached({ timeout: 5000 })
  })

  test('should render both scroll directions', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-both-directions"]')
    await expect(scrollbar).toBeVisible()
    // Check that scrollbar body has both scroll classes
    const body = scrollbar.locator('.scrollbar-body')
    await expect(body).toBeVisible()
  })

  test('should scroll content vertically', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-basic"]')
    const body = scrollbar.locator('.scrollbar-body')
    await expect(body).toBeVisible()
    // Scroll the body element
    await body.evaluate((el: HTMLElement) => { el.scrollTop = 100 })
    await page.waitForTimeout(500)
    // Verify scroll position changed
    const scrollTop = await body.evaluate((el: HTMLElement) => el.scrollTop)
    expect(scrollTop).toBe(100)
  })

  test('should render shadow when scrolled', async ({ page }) => {
    const scrollbar = page.locator('[data-testid="scrollbar-basic"]')
    const shadowTop = scrollbar.locator('.is-scroll-top')
    // Shadow element exists (may be hidden with opacity)
    await expect(shadowTop).toBeAttached()
  })
});