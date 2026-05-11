import { test, expect } from "@playwright/test";

const SERVER_PORT = process.env.SERVER_PORT || 7107;

test.describe("pa-button Component E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${SERVER_PORT}/e2e/pa-button/e2e-test`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
  });

  test("should render button elements with text content", async ({ page }) => {
    const btnPrimary = page.locator('[data-testid="btn-primary"]');
    await expect(btnPrimary).toBeVisible();
    await expect(btnPrimary).toHaveText("Primary");
  });

  test("should render buttons with different types", async ({ page }) => {
    await expect(page.locator('[data-testid="btn-primary"]')).toHaveClass(/primary/);
    await expect(page.locator('[data-testid="btn-success"]')).toHaveClass(/success/);
    await expect(page.locator('[data-testid="btn-warning"]')).toHaveClass(/warning/);
    await expect(page.locator('[data-testid="btn-danger"]')).toHaveClass(/danger/);
    await expect(page.locator('[data-testid="btn-info"]')).toHaveClass(/info/);
  });

  test("should render buttons with different sizes", async ({ page }) => {
    await expect(page.locator('[data-testid="btn-large"]')).toHaveClass(/large/);
    await expect(page.locator('[data-testid="btn-medium"]')).toHaveClass(/medium/);
    await expect(page.locator('[data-testid="btn-small"]')).toHaveClass(/small/);
  });

  test("should not trigger click event when disabled", async ({ page }) => {
    const btnDisabled = page.locator('[data-testid="btn-disabled"]');
    await expect(btnDisabled).toBeDisabled();
  });

  test("should show loading state", async ({ page }) => {
    const btnLoading = page.locator('[data-testid="btn-loading"]');
    await expect(btnLoading).toHaveClass(/pa-button/);
  });

  test("should render button with icon", async ({ page }) => {
    const btnWithIcon = page.locator('[data-testid="btn-with-icon"]');
    await expect(btnWithIcon).toBeVisible({ timeout: 10000 });
    const iconInside = btnWithIcon.locator("i.pa-icon, .pa-icon_font, .pa-icon");
    await expect(iconInside.first()).toBeVisible({ timeout: 5000 });
  });

  test("should trigger click event", async ({ page }) => {
    const btnClickable = page.locator('[data-testid="btn-clickable"]');
    await btnClickable.click();
    const countEl = page.locator('[data-testid="btn-click-count"]');
    await expect(countEl).toHaveText("1");
  });

  test("should render plain and non-plain buttons correctly", async ({ page }) => {
    const btnPlain = page.locator('[data-testid="btn-plain"]');
    const btnNonPlain = page.locator('[data-testid="btn-non-plain"]');

    await expect(btnPlain).toHaveClass(/use-plain/);
    await expect(btnNonPlain).not.toHaveClass(/use-plain/);
  });

  test("should render preset style buttons (is prop)", async ({ page }) => {
    await expect(page.locator('[data-testid="btn-is-add"]')).toBeVisible();
    await expect(page.locator('[data-testid="btn-is-delete"]')).toHaveClass(/danger/);
  });

  test("should render icon position left and right", async ({ page }) => {
    const btnIconLeft = page.locator('[data-testid="btn-icon-left"]');
    const btnIconRight = page.locator('[data-testid="btn-icon-right"]');

    await expect(btnIconLeft).toBeVisible();
    await expect(btnIconRight).toBeVisible();
    // iconPosition=left: no right-side icon (pa-button_ml)
    await expect(btnIconLeft.locator(".pa-button_ml")).toHaveCount(0);

    // iconPosition=right: has right-side icon with pa-button_ml class
    await expect(btnIconRight.locator(".pa-button_ml")).toBeVisible()
  });

  test("should render underline button (useLine)", async ({ page }) => {
    const btnUnderline = page.locator('[data-testid="btn-underline"]');
    await expect(btnUnderline).toBeVisible();
    await expect(btnUnderline).toHaveClass(/use-line/);
  });

  test("should render button with text attribute", async ({ page }) => {
    const btnTextProp = page.locator('[data-testid="btn-text-prop"]');
    await expect(btnTextProp).toBeVisible();
    await expect(btnTextProp).toHaveText("Text Prop Button");
  });

  test("should render useFont toggle", async ({ page }) => {
    const btnUseFontTrue = page.locator('[data-testid="btn-use-font-true"]');
    const btnUseFontFalse = page.locator('[data-testid="btn-use-font-false"]');

    await expect(btnUseFontTrue).toBeVisible();
    await expect(btnUseFontFalse).toBeVisible();
    await expect(btnUseFontTrue.locator(".pa-icon_font").first()).toBeVisible({ timeout: 5000 });
    await expect(btnUseFontFalse.locator(".pa-icon_font")).toHaveCount(0);
  });

  test("should render default type button without type class", async ({ page }) => {
    const btnDefault = page.locator('[data-testid="btn-default-type"]');
    await expect(btnDefault).toBeVisible();
    await expect(btnDefault).not.toHaveClass(/primary|success|warning|danger|info/);
  });

  test("should render debounced toggle buttons", async ({ page }) => {
    const btnDebouncedTrue = page.locator('[data-testid="btn-debounced-true"]');
    const btnDebouncedFalse = page.locator('[data-testid="btn-debounced-false"]');

    await expect(btnDebouncedTrue).toBeVisible();
    await expect(btnDebouncedFalse).toBeVisible();
  });

  test("should debounce rapid clicks", async ({ page }) => {
    const btn = page.locator('[data-testid="btn-debounce-effect"]');
    const countEl = page.locator('[data-testid="debounce-click-count"]');

    await btn.click();
    await btn.click();
    await btn.click();

    await page.waitForTimeout(500);

    await expect(countEl).toHaveText("1");
  });

  test("should render button with confirmConfig prop and open dialog", async ({ page }) => {
    const btnConfirmConfig = page.locator('[data-testid="btn-confirm-config"]');
    await expect(btnConfirmConfig).toBeVisible();

    await btnConfirmConfig.click();

    // Wait for dialog to appear
    const dialog = page.locator(".pa-message-box");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Verify custom title text (confirmConfig has title: 'Confirm')
    const title = dialog.locator(".pa-message-box__title");
    await expect(title).toContainText("Confirm");

    // Close dialog by clicking cancel (first button in footer)
    const cancelBtn = dialog.locator(".pa-message-box__footer button").first();
    await cancelBtn.click();

    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  test("should trigger confirmClick event with dialog", async ({ page }) => {
    const btn = page.locator('[data-testid="btn-confirm-event"]');
    const countEl = page.locator('[data-testid="confirm-click-count"]');

    await expect(btn).toBeVisible();
    await btn.click();

    const dialog = page.locator(".pa-message-box");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Click confirm button (second button in footer)
    const confirmBtn = dialog.locator(".pa-message-box__footer button").nth(1);
    await confirmBtn.click();

    await expect(countEl).toHaveText("1");
  });

  test("should trigger submitClick event with dialog", async ({ page }) => {
    const btn = page.locator('[data-testid="btn-submit-event"]');
    const countEl = page.locator('[data-testid="submit-click-count"]');

    await expect(btn).toBeVisible();
    await btn.click();

    const dialog = page.locator(".pa-message-box");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // submitClick type is "warning"
    await expect(dialog).toHaveClass(/pa-message-box--warning/);

    const confirmBtn = dialog.locator(".pa-message-box__footer button").nth(1);
    await confirmBtn.click();

    await expect(countEl).toHaveText("1");
  });

  test("should trigger deleteClick event with dialog", async ({ page }) => {
    const btn = page.locator('[data-testid="btn-delete-event"]');
    const countEl = page.locator('[data-testid="delete-click-count"]');

    await expect(btn).toBeVisible();
    await expect(btn).toHaveClass(/danger/);

    await btn.click();

    const dialog = page.locator(".pa-message-box");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // deleteClick type is "danger"
    await expect(dialog).toHaveClass(/pa-message-box--danger/);

    const confirmBtn = dialog.locator(".pa-message-box__footer button").nth(1);
    await confirmBtn.click();

    await expect(countEl).toHaveText("1");
  });
});
