import {test, expect} from '@playwright/test';

test('unconfigured classroom routes leave the course usable', async ({page}) => {
  await page.goto('./#/chapter/2');
  await page.getByRole('link',{name:'Browse materials for this chapter'}).click();
  await expect(page).toHaveURL(/#\/resources\?chapter=2$/);
  await expect(page.getByText(/Study materials are unavailable until/)).toBeVisible();
  await page.getByRole('link',{name:'Teacher Dashboard'}).click();
  await expect(page).toHaveURL(/#\/teacher\/resources$/);
  await expect(page.getByText(/Connect a dedicated Python Lab Supabase project/)).toBeVisible();
  await page.goto('./#/syntax/control/loops');
  await expect(page.getByRole('heading',{name:'for, while, range and loop control'})).toBeVisible();
});
