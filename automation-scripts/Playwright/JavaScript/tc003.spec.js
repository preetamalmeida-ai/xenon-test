const { test, expect } = require('@playwright/test');

test.describe('Salesforce Lead Creation - Leads List Page', () => {
  test('Create Lead from Recently Viewed list', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto(
      'https://business-momentum-3532.lightning.force.com/lightning/o/Lead/list?filterName=Recent'
    );

    // Ensure Leads page loaded
    await page.waitForSelector('h1:has-text("Leads")', { timeout: 60000 });

    // ✅ Correct Lightning locator
    await page.waitForSelector('button[name="New"]', { timeout: 60000 });
    await page.locator('button[name="New"]').click();

    // Wait for modal
    await page.waitForSelector('records-modal', { timeout: 60000 });

    // Required fields
    await page.fill('input[name="LastName"]', 'Playwright Lead');
    await page.fill('input[name="Company"]', 'Automation Corp');

    // Save
    await page.click('button[name="SaveEdit"]');

    // Validate success
    const toast = page.locator('span.toastMessage');
    await expect(toast).toContainText('was created');
  });
});
