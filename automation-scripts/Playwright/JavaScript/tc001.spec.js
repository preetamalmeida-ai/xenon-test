const { test, expect } = require('@playwright/test');

test.describe('Salesforce Lead Creation', () => {
  test('Verify successful Lead creation with required fields', async ({ page }) => {
    // 🔹 Increase timeout
    test.setTimeout(120000);

    // ✅ Start directly on Lightning - session is already authenticated via storageState.json!
    // No login needed - the system automatically loads storageState.json
    await page.goto('https://orgfarm-5694adb5bf-dev-ed.develop.lightning.force.com/lightning/page/home');
    
   
    // ---------------- APP LAUNCHER ----------------
    await page.waitForSelector('button[title="App Launcher"]', { timeout: 60000 });
    await page.click('button[title="App Launcher"]');
    
    // Click View All
    await page.waitForSelector('button:has-text("View All")');
    await page.click('button:has-text("View All")');
    
    // Click Sales app
    await page.waitForSelector('one-app-launcher-app-tile[data-name="Sales"]', {
      timeout: 60000,
    });
    await page.click('one-app-launcher-app-tile[data-name="Sales"]');
    
    // ---------------- LEADS ----------------
    // 🔹 Click Leads tab
    await page.waitForSelector('a[title="Leads"]', { timeout: 60000 });
    await page.click('a[title="Leads"]');

    await page.locator('button[name="New"]').waitFor({ state: 'visible' });
    await page.locator('button[name="New"]').click({ force: true });

 

    // 🔹 Save
    await page.click('button[name="SaveEdit"]');

    // ✅ Verify toast
    const toast = page.locator('span.toastMessage');
    await expect(toast).toContainText('Lead');
  });
});