const { test, expect } = require('@playwright/test');

test('Open Salesforce login page', async ({ page }) => {
  // Go to Salesforce login page
  await page.goto('https://login.salesforce.com');

  // Verify page title
  await expect(page).toHaveTitle(/Salesforce/i);

  // Verify username field is visible
  await expect(page.locator('#username')).toBeVisible();

  // Verify password field is visible
  await expect(page.locator('#password')).toBeVisible();
});
