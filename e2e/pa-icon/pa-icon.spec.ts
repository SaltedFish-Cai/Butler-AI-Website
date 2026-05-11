import { test, expect } from "@playwright/test";

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe("pa-icon Component E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-icon/e2e-test`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
  });

  test("should render icon elements", async ({ page }) => {
    await expect(page.locator('[data-testid="icon-search"]')).toBeVisible();
    await expect(page.locator('[data-testid="icon-add"]')).toBeVisible();
    await expect(page.locator('[data-testid="icon-edit"]')).toBeVisible();
    await expect(page.locator('[data-testid="icon-delete"]')).toBeVisible();
  });

  test("should render icon with correct structure", async ({ page }) => {
    const icon = page.locator('[data-testid="icon-search"]');
    await expect(icon).toBeVisible();
    await expect(icon).toHaveClass(/pa-icon/);
  });

  test("should render icon with tip", async ({ page }) => {
    const iconWithTip = page.locator('[data-testid="icon-with-tip"]');
    await expect(iconWithTip).toBeVisible();
  });

  test("should trigger click event", async ({ page }) => {
    const clickableIcon = page.locator('[data-testid="icon-clickable"]');
    await expect(clickableIcon).toBeVisible();
  });

  test("should render different icons by name attribute", async ({ page }) => {
    const iconSearch = page.locator('[data-testid="icon-search"]');
    const iconAdd = page.locator('[data-testid="icon-add"]');

    await expect(iconSearch).toBeVisible();
    await expect(iconAdd).toBeVisible();

    const searchInner = iconSearch.locator(".pa-icon_font");
    await expect(searchInner).toHaveClass(/icon-search_line/);

    const addInner = iconAdd.locator(".pa-icon_font");
    await expect(addInner).toHaveClass(/icon-add_circle_line/);
  });

  test("should render icon with butler-iconfont fontFamily", async ({ page }) => {
    const butlerIcon = page.locator('[data-testid="icon-butler-font"]');
    await expect(butlerIcon).toBeVisible();
    // butler-iconfont uses butler- prefix class name
    const inner = butlerIcon.locator(".pa-icon_font");
    await expect(inner).toHaveClass(/butler-button/);
    // fontFamily should be set to butler-iconfont
    const style = await butlerIcon.evaluate(el => getComputedStyle(el).fontFamily);
    expect(style).toContain("butler-iconfont");
  });

  test("should render icon with fontColor gradient", async ({ page }) => {
    const fontColorIcon = page.locator('[data-testid="icon-font-color"]');
    await expect(fontColorIcon).toBeVisible();
    // fontColor with length > 0 should add background-color class
    await expect(fontColorIcon.locator(".pa-icon_font")).toHaveClass(/background-color/);
  });

  test("should render icon with custom style", async ({ page }) => {
    const customStyleIcon = page.locator('[data-testid="icon-custom-style"]');
    await expect(customStyleIcon).toBeVisible();
    // Check that fontSize style is applied
    const style = await customStyleIcon.evaluate(el => getComputedStyle(el).fontSize);
    expect(style).toBe("32px");
  });
});
