import { test, expect } from '@playwright/test';


// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

test('short trip', async ({page}) => {  
  // Given user put valid info in the form
  await page.goto('/')
  await page.getByPlaceholder('Source Address').fill('300 Kingston Road, Pickering, ON, Canada')
  await page.getByPlaceholder('Destination Address').fill('750 Kingston Road, Pickering, ON, Canada')
  const leaveTimeMin = await page.getByTestId('leave-time-min')
  await leaveTimeMin.focus()
  await leaveTimeMin.clear();
  await leaveTimeMin.pressSequentially('1030AM')

  const leaveTimeMax = await page.getByTestId('leave-time-max')
  await leaveTimeMax.focus()
  await leaveTimeMax.clear();
  await leaveTimeMax.pressSequentially('1100AM')

  // When the user hits submit
  
  // Then the user will get an answer, when to leave and how long it will take  

});