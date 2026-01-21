const { test, expect } = require('@playwright/test');

test.describe('Salesforce Lead Creation - Leads List Page', () => {
  test('Create Lead from Recently Viewed list', async ({ page }) => {
    test.setTimeout(120000);

    // --------------------------------------------------
    // Navigate directly to Leads list (already logged in)
    // --------------------------------------------------
    await page.goto(
      'https://business-momentum-3532.lightning.force.com/lightning/o/Lead/list?filterName=Recent'
    );

    // Ensure Leads page loaded
    await expect(page.getByRole('heading', { name: 'Leads' }))
      .toBeVisible({ timeout: 60000 });

    // --------------------------------------------------
    // Click "New" using ARIA role (MOST RELIABLE)
    // --------------------------------------------------
    const newButton = page.getByRole('button', { name: 'New' });
    await newButton.waitFor({ state: 'visible', timeout: 60000 });
    await newButton.click();

    // --------------------------------------------------
    // Handle Record Type screen (if present)
    // --------------------------------------------------
    const nextBtn = page.getByRole('button', { name: 'Next' });
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click();
    }

    // --------------------------------------------------
    // Wait for Lead form fields (real DOM, case-sensitive)
    // --------------------------------------------------
    await page.waitForSelector('input[name="lastName"]', { timeout: 60000 });

    // --------------------------------------------------
    // Fill required fields
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
    // Validate success toast
    // --------------------------------------------------
    const toast = page.locator('span.toastMessage');
    await expect(toast).toBeVisible({ timeout: 60000 });
    await expect(toast).toContainText('was created');
  });
});
