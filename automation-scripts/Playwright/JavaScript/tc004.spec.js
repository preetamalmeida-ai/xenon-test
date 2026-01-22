const { test, expect } = require('@playwright/test');

test('Salesforce login page – with failure step', async ({ page }) => {
  // Open Salesforce login page
  await page.goto('https://login.salesforce.com');

  // This will PASS
  await expect(page).toHaveTitle(/Salesforce/i);

  // This will PASS
  await expect(page.locator('#username')).toBeVisible();

  await expect(page.locator('#yourpassword')).toBeVisible();
});