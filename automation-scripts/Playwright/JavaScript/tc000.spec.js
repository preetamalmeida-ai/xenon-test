const { test, expect } = require('@playwright/test');

const loginURL = 'https://fa-esev-dev18-saasfademo1.ds-fa.oraclepdemos.com/xmlpserver/services/ExternalReportWSSService';
const username = '/* CREDENTIALS NOT CONFIGURED - Add in Configurations */';
const password = '/* CREDENTIALS NOT CONFIGURED - Add in Configurations */';

const lastName = `Test Lead ${Date.now()}`;
const company = `Test Company ${Date.now()}`;

test.describe('Create Lead with All Required Fields Populated Successfully', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto(loginURL);

    // 2. Wait for the username field to be visible
    await page.waitForSelector('input#username', { state: 'visible' });

    // 3. Fill in the username
    await page.fill('input#username', username);

    // 4. Fill in the password
    await page.fill('input#password', password);

    // 5. Click the login button
    await page.click('input#Login');

    // 6. Wait for the home page to load (example: global header)
    await page.waitForSelector('.slds-global-header', { state: 'visible' });

    // Handle any potential welcome modals or pop-ups (example, based on existing locators) - adapt as needed for actual popups
    // try {
    //   await page.waitForSelector(LeadPage.elem_czr9sw, { state: 'visible', timeout: 5000 }); // Adjust timeout as needed
    //   await page.click(LeadPage.elem_czr9sw);
    // } catch (error) {
    //   // Ignore if the element is not found
    //   console.log('No welcome modal found.');
    // }
  });

  test(`Create Lead with All Required Fields Populated Successfully - TC000 - ${Date.now()}`, async ({ page }) => {
    // 1. Navigate to the Lead tab.
    await page.goto('https://fa-esev-dev18-saasfademo1.ds-fa.oraclepdemos.com/lightning/o/Lead/home');
    await page.waitForSelector('.slds-page-header', { state: 'visible' });

    // 2. Click the 'New' button.
    await page.waitForSelector('div[title="New"]', { state: 'visible' });
    await page.click('div[title="New"]');

    // 3. Enter valid data into all required fields (e.g., Last Name, Company).
    await page.waitForSelector('lightning-input[field-name="LastName"] input', { state: 'visible' });
    await page.fill('lightning-input[field-name="LastName"] input', lastName);

    await page.waitForSelector('lightning-input[field-name="Company"] input', { state: 'visible' });
    await page.fill('lightning-input[field-name="Company"] input', company);

    // 4. Enter valid data into all non-required fields.
    // Fill in optional field - Lead Source
    await page.click('lightning-combobox[field-name="LeadSource"] button');
    await page.waitForSelector('lightning-base-combobox-item[data-value="Web"]', { state: 'visible' });
    await page.click('lightning-base-combobox-item[data-value="Web"]');

    // 5. Click the 'Save' button.
    await page.waitForSelector('button[name="SaveEdit"]', { state: 'visible' });
    await page.click('button[name="SaveEdit"]');

    // Expected Results:
    // 1. A new Lead record is created.
    // 2. The Lead record details page is displayed.
    await page.waitForSelector('records-record-layout-event-broker', { state: 'visible' });

    // 3. All entered data is correctly displayed on the Lead record details page.
    const lastNameValue = await page.textContent('lightning-output-field[field-name="LastName"] lightning-formatted-text');
    expect(lastNameValue).toBe(lastName);

    const companyValue = await page.textContent('lightning-output-field[field-name="Company"] lightning-formatted-text');
    expect(companyValue).toBe(company);

    // 4. A success message is displayed.
    await page.waitForSelector('div.forceToastMessage', { state: 'visible', timeout: 10000 });
    const toastText = await page.textContent('div.forceToastMessage');
    expect(toastText).toContain('was created');
  });

  test.afterEach(async ({ page }) => {
    // Logout
    await page.waitForSelector('button.branding-userProfile-button', { state: 'visible' });
    await page.click('button.branding-userProfile-button');

    await page.waitForSelector('a[href*="logout"]', { state: 'visible' });
    await page.click('a[href*="logout"]');

    await page.waitForSelector('input#username', { state: 'visible' }); // Wait for logout to complete
  });
});