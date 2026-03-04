import { test, expect } from '@playwright/test';

test('short trip', async ({page}) => {  
  // Given user put valid info in the form
  await page.goto('/')
  await page.getByPlaceholder('Source Address').fill('300 Kingston Road, Pickering')
  await page.getByText('300 Kingston Road, Pickering, ON, Canada', {exact: true}).click();
  await page.getByPlaceholder('Destination Address').fill('750 Kingston Road, Pickering')
  await page.getByText('750 Kingston Road, Pickering, ON, Canada', {exact: true}).click();

  const leaveTimeMin = await page.getByTestId('leave-time-min')
  await leaveTimeMin.focus()
  await leaveTimeMin.clear();
  await leaveTimeMin.pressSequentially('1030AM')

  const leaveTimeMax = await page.getByTestId('leave-time-max')
  await leaveTimeMax.focus()
  await leaveTimeMax.clear();
  await leaveTimeMax.pressSequentially('1100AM')

  // When the user hits submit
  await page.getByText(/submit/i).click({ force: true })
  
  // Then the user will get an answer, when to leave and how long it will take  
  await expect(page.getByText(/Time to leave: \d+/i)).toBeVisible({timeout: 150000})
  await expect(page.getByText(/Expected duration: \d+/i)).toBeVisible({timeout: 150000})

});