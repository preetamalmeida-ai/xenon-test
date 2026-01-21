const { test, expect } = require('@playwright/test');

test.describe('Salesforce Lead Creation - Leads List Page', () => {
  test('Create Lead from Recently Viewed list', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto(
      'https://business-momentum-3532.lightning.force.com/lightning/o/Lead/list?filterName=Recent'
    );

    // Ensure Leads page loaded
    await page.waitForSelector('h1:has-text("Leads")', { timeout: 60000 });

    // Click Add a Lead (empty state CTA)
    const addLeadBtn = page.locator('button:has-text("Add a Lead")');
    await addLeadBtn.waitFor({ state: 'visible', timeout: 60000 });
    await addLeadBtn.click();

    // ✅ WAIT FOR MODAL CONTENT (NOT records-modal)
    await page.waitForSelector('input[name="LastName"]', { timeout: 60000 });

    // Fill required fields
    await page.fill('input[name="LastName"]', 'Playwright Lead');
    await page.fill('input[name="Company"]', 'Automation Corp');

    // Save
    await page.click('button[name="SaveEdit"]');

    // Validate success
    const toast = page.locator('span.toastMessage');
    await expect(toast).toContainText('was created');
  });
});
