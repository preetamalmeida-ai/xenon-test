const { test, expect } = require('@playwright/test');

test.describe('Salesforce Lead Creation', () => {
  test('Verify successful Lead creation with required fields', async ({ page }) => {
    test.setTimeout(120000);

    // Open Salesforce Home (already authenticated)
    await page.goto(
      'https://orgfarm-5694adb5bf-dev-ed.develop.lightning.force.com/lightning/page/home'
    );

    // ---------------- APP LAUNCHER ----------------
    await page.waitForSelector('button[title="App Launcher"]', { timeout: 60000 });
    await page.click('button[title="App Launcher"]');

    await page.click('button:has-text("View All")');

    await page.click('one-app-launcher-app-tile[data-name="Sales"]');

    // ---------------- LEADS ----------------
    await page.waitForSelector('a[title="Leads"]', { timeout: 60000 });
    await page.click('a[title="Leads"]');

    // Click New Lead
    await page.locator('button[name="New"]').waitFor({ state: 'visible' });
    await page.locator('button[name="New"]').click();

    // ---------------- NEW LEAD MODAL ----------------
    // Wait for modal to appear
    await page.waitForSelector('records-modal', { timeout: 60000 });

    // Fill required fields
    await page.fill('input[name="LastName"]', 'Playwright Lead');
    await page.fill('input[name="Company"]', 'Automation Corp');

    // Save
    await page.click('button[name="SaveEdit"]');

    // ---------------- VALIDATION ----------------
    const toast = page.locator('span.toastMessage');
    await expect(toast).toContainText('was created');
  });
});
