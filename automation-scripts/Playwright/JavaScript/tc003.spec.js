const { test, expect } = require('@playwright/test');

test.describe('Salesforce Lead Creation - Leads List Page', () => {
  test('Create Lead from Recently Viewed list', async ({ page }) => {
    // Increase timeout for Salesforce Lightning
    test.setTimeout(120000);

    // --------------------------------------------------
    // Navigate directly to Leads list (already logged in)
    // --------------------------------------------------
    await page.goto(
      'https://business-momentum-3532.lightning.force.com/lightning/o/Lead/list?filterName=Recent'
    );

    // Ensure Leads page is loaded
    await page.waitForSelector('h1:has-text("Leads")', { timeout: 60000 });

    // --------------------------------------------------
    // Click "Add a Lead" (empty-state CTA)
    // --------------------------------------------------
    const addLeadBtn = page.locator('button:has-text("Add a Lead")');
    await addLeadBtn.waitFor({ state: 'visible', timeout: 60000 });
    await addLeadBtn.click();

    // --------------------------------------------------
    // Wait for New Lead modal (wait for real fields)
    // --------------------------------------------------
    await page.waitForSelector('input[name="lastName"]', { timeout: 60000 });

    // --------------------------------------------------
    // Fill required fields (case-sensitive!)
    // --------------------------------------------------
    await page.fill('input[name="lastName"]', 'Playwright');
    await page.fill('input[name="Company"]', 'Automation Corp');

    // --------------------------------------------------
    // Save Lead
    // --------------------------------------------------
    const saveBtn = page.locator('button[name="SaveEdit"]');
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
