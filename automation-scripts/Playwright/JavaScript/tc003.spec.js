const { test, expect } = require('@playwright/test');

test.describe('Salesforce Lead Creation - Leads List Page', () => {
  test('Create Lead from Recently Viewed list', async ({ page }) => {
    test.setTimeout(120000);

    // ✅ Already authenticated via storageState.json
    await page.goto(
      'https://business-momentum-3532.lightning.force.com/lightning/o/Lead/list?filterName=Recent'
    );

    // ---------------- LEADS LIST PAGE ----------------
    // Wait for Leads list header
    await page.waitForSelector('h1:has-text("Leads")', { timeout: 60000 });

    // Click New button (top right)
    const newButton = page.locator('button:has-text("New")');
    await expect(newButton).toBeVisible();
    await newButton.click();

    // ---------------- NEW LEAD MODAL ----------------
    // Lightning modal container
    await page.waitForSelector('records-modal', { timeout: 60000 });

    // Fill required fields
    await page.fill('input[name="LastName"]', 'Playwright Lead');
    await page.fill('input[name="Company"]', 'Automation Corp');

    // Optional fields (safe if present)
    await page.fill('input[name="Phone"]', '9876543210').catch(() => {});
    await page.fill('input[name="Email"]', 'test@automation.com').catch(() => {});

    // Save Lead
    await page.click('button[name="SaveEdit"]');

    // ---------------- VALIDATION ----------------
    const toast = page.locator('span.toastMessage');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('was created');

    // Optional: ensure redirect to Lead record page
    await expect(page).toHaveURL(/lightning\/r\/Lead\/.+\/view/);
  });
});
