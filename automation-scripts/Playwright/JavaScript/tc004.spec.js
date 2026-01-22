const { test, expect } = require('@playwright/test');

test.describe('Salesforce Lead Creation - Leads List Page', () => {
  test('Create Lead from Recently Viewed list', async ({ page }) => {
    // Salesforce is slow – give it time
    test.setTimeout(120000);

    // --------------------------------------------------
    // Navigate directly to Leads list (already authenticated)
    // --------------------------------------------------
    await page.goto(
      'https://business-momentum-3532.lightning.force.com/lightning/o/Lead/list?filterName=Recent'
    );

    // Salesforce-safe page load check
    await page.waitForURL(/\/lightning\/o\/Lead\/list/, { timeout: 60000 });
    await page.waitForLoadState('networkidle');

    // --------------------------------------------------
    // Click "New" Lead (most reliable way)
    // --------------------------------------------------
    const newBtn = page.getByRole('button', { name: 'New' });
    await newBtn.waitFor({ state: 'visible', timeout: 60000 });
    await newBtn.click();

    // --------------------------------------------------
    // Handle Record Type screen (if it appears)
    // --------------------------------------------------
    const nextBtn = page.getByRole('button', { name: 'Next' });
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click();
    }

    // --------------------------------------------------
    // Wait for Lead form (REAL DOM fields)
    // --------------------------------------------------
    await page.waitForSelector('input[name="lastName"]', { timeout: 60000 });
    await page.waitForSelector('input[name="Company"]', { timeout: 60000 });

    // --------------------------------------------------
    // Fill required fields (case-sensitive!)
    // --------------------------------------------------
    await page.fill('input[name="lastName"]', 'Playwright');
    await page.fill('input[name="Company"]', 'Automation Corp');

    // --------------------------------------------------
    // Save Lead
    // --------------------------------------------------
    const saveBtn = page.getByRole('button', { name: 'Save' });
    await saveBtn.waitFor({ state: 'visible', timeout: 60000 });
    await saveBtn.click();

    // --------------------------------------------------
    // Verify success toast
    // --------------------------------------------------
    const toast = page.locator('span.toastMessage');
    await expect(toast).toBeVisible({ timeout: 60000 });
    await expect(toast).toContainText('was created');
  });
});
