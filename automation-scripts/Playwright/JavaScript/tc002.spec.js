const { test, expect } = require('@playwright/test');

test('Salesforce login page – with failure step', async ({ page }) => {
  // Open Salesforce login page
  await page.goto('https://login.salesforce.com');

  // This will PASS
  await expect(page).toHaveTitle(/Salesforce/i);

  // This will PASS
  await expect(page.locator('#username')).toBeVisible();

  // ❌ INTENTIONAL FAILURE:
  // Salesforce does NOT have an element with id="non_existing_element"
  await expect(page.locator('#non_existing_element')).toBeVisible();
});
