import {test,expect} from '@playwright/test';

test.describe('Beginner-First Visual Models (Chapters 0-5)', () => {
  test('chapter 0 renders recipe algorithm sequencer with scaled ingredients', async ({page}) => {
    await page.goto('./#/chapter/0');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-recipe-steps')).toBeVisible();
    await expect(model.locator('.recipe-step-card')).toHaveCount(4);
    await expect(model.getByText('1 tsp')).toBeVisible();

    // Select 2 cups
    await model.getByRole('combobox', {name: /Cups requested/}).selectOption({index: 1});
    await expect(model.getByText('2 tsp')).toBeVisible();
    await expect(model.getByText('Total 400 mL')).toBeVisible();
  });

  test('chapter 1 displays statement-to-output mapping and string vs number contrast', async ({page}) => {
    await page.goto('./#/chapter/1');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-statement-map')).toBeVisible();
    await expect(model.locator('.statement-row')).toBeVisible();
    await expect(model.locator('.token-contrast-row')).toBeVisible();
    await expect(model.getByText('"10" + "20"')).toBeVisible();
    await expect(model.getByText('10 + 20')).toBeVisible();
  });

  test('chapter 2 visualizes labeled memory storage boxes with live updates', async ({page}) => {
    await page.goto('./#/chapter/2');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-memory-boxes')).toBeVisible();
    await expect(model.locator('.memory-box')).toHaveCount(3);
    await expect(model.locator('.chip-price')).toHaveText('₹80');
    await expect(model.locator('.chip-total')).toHaveText('₹240');

    // Select price ₹100
    await model.getByRole('combobox', {name: /New price/}).selectOption('1');
    await expect(model.locator('.chip-price')).toHaveText('₹100');
    await expect(model.locator('.chip-total')).toHaveText('₹300');
  });

  test('chapter 3 type conversion funnel shows string to numeric badges', async ({page}) => {
    await page.goto('./#/chapter/3');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-conversion-funnel')).toBeVisible();
    await expect(model.locator('.funnel-stage')).toHaveCount(3);
    await expect(model.locator('.pill-str')).toBeVisible();
    await expect(model.locator('.pill-int')).toBeVisible();
  });

  test('chapter 4 input pipeline visualizes text arrival and numeric conversion', async ({page}) => {
    await page.goto('./#/chapter/4');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-input-pipeline')).toBeVisible();
    await expect(model.locator('.pipeline-step')).toHaveCount(4);
    await expect(model.getByText('Always text string')).toBeVisible();
  });

  test('chapter 5 packaging visualizes full boxes (//) and loose leftovers (%)', async ({page}) => {
    await page.goto('./#/chapter/5');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-packaging')).toBeVisible();
    await expect(model.locator('.pack-boxes')).toBeVisible();
    await expect(model.locator('.pack-leftovers')).toBeVisible();
    // Default 12 items: 2 full boxes, 2 loose
    await expect(model.locator('.sweet-box')).toHaveCount(2);

    // Select 17 items: 3 full boxes, 2 loose
    await model.getByRole('combobox', {name: /Items available/}).selectOption('1');
    await expect(model.locator('.sweet-box')).toHaveCount(3);
    await expect(model.locator('.loose-dot')).toHaveCount(2);
  });
});
