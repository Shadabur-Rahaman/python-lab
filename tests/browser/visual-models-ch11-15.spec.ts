import {test,expect} from '@playwright/test';

test.describe('Visual Learning Models (Chapters 11-15)', () => {
  test('chapter 11 visualizes function machine pipeline, return value, and return vs print distinction', async ({page}) => {
    await page.goto('./#/chapter/11');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-function-machine')).toBeVisible();

    // Default price ₹20 (index 0)
    await expect(model.locator('.stage-inputs')).toContainText('price = 20');
    await expect(model.locator('.stage-inputs')).toContainText('quantity = 3');
    await expect(model.locator('.stage-body')).toContainText('total = 20 × 3 = 60');
    await expect(model.locator('.stage-body .return-badge')).toContainText('➔ 60');
    await expect(model.locator('.stage-output')).toContainText('result = calculate_bill(20, 3)');
    await expect(model.locator('.stage-output .terminal-samp')).toHaveText('60');

    // Select price ₹50 (index 1)
    await model.getByRole('combobox', {name: /Price argument/}).selectOption({index: 1});
    await expect(model.locator('.stage-inputs')).toContainText('price = 50');
    await expect(model.locator('.stage-body')).toContainText('total = 50 × 3 = 150');
    await expect(model.locator('.stage-body .return-badge')).toContainText('➔ 150');
    await expect(model.locator('.stage-output')).toContainText('result = calculate_bill(50, 3)');
    await expect(model.locator('.stage-output .terminal-samp')).toHaveText('150');

    // Distinction banner between return and print()
    await expect(model.locator('.tag-return')).toContainText('return');
    await expect(model.locator('.tag-print')).toContainText('print()');
    await expect(model.locator('.function-distinction-banner')).toContainText('Sends data back to code');
    await expect(model.locator('.function-distinction-banner')).toContainText('Only displays characters');
  });

  test('chapter 12 visualizes mini-project 3-stage architecture, error guards, and 7-stage engineering workflow', async ({page}) => {
    await page.goto('./#/chapter/12');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-project-builder')).toBeVisible();

    // Default: Normal division
    await expect(model.locator('.project-case-badge')).toContainText('Valid operation');
    await expect(model.locator('.project-stage').nth(0)).toContainText('8 ÷ 2');
    await expect(model.locator('.project-stage').nth(1)).toContainText('8 / 2');
    await expect(model.locator('.project-stage').nth(2)).toContainText('4.0');

    // Select Negative result (index 1)
    await model.getByRole('combobox', {name: /Test case/}).selectOption({index: 1});
    await expect(model.locator('.project-case-badge')).toContainText('Signed calculation');
    await expect(model.locator('.project-stage').nth(0)).toContainText('−8 ÷ 2');
    await expect(model.locator('.project-stage').nth(2)).toContainText('-4.0');

    // Select Zero divisor (index 2)
    await model.getByRole('combobox', {name: /Test case/}).selectOption({index: 2});
    await expect(model.locator('.project-case-badge')).toContainText('Handled gracefully');
    await expect(model.locator('.project-stage').nth(0)).toContainText('8 ÷ 0');
    await expect(model.locator('.project-stage').nth(1)).toContainText('try / except ZeroDivisionError');
    await expect(model.locator('.project-stage').nth(2)).toContainText('ZeroDivisionError handled');

    // 7-Stage Blueprint
    const steps = model.locator('.blueprint-step-pill');
    await expect(steps).toHaveCount(7);
    await expect(steps.nth(0)).toContainText('Understand');
    await expect(steps.nth(3)).toContainText('Implement');
    await expect(steps.nth(6)).toContainText('Reflect');
  });

  test('chapter 13 visualizes data transformation pipeline, filtering threshold, and list comprehension anatomy', async ({page}) => {
    await page.goto('./#/chapter/13');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-data-pipeline')).toBeVisible();

    // Default threshold 50: all 3 items pass
    const chips = model.locator('.data-cards-row .data-chip');
    await expect(chips).toHaveCount(3);
    await expect(chips.nth(0)).toHaveClass(/chip-pass/);
    await expect(chips.nth(0)).toContainText('✓ Keep');
    await expect(chips.nth(1)).toHaveClass(/chip-pass/);
    await expect(chips.nth(2)).toHaveClass(/chip-pass/);
    await expect(model.locator('.pipeline-result-section')).toContainText('large = [50, 100, 200]');
    await expect(model.locator('.pipeline-result-section')).toContainText('Length: 3 items');

    // Select threshold 100 (index 1): 50 is skipped, 100 and 200 pass
    await model.getByRole('combobox', {name: /Minimum amount/}).selectOption({index: 1});
    await expect(chips.nth(0)).toHaveClass(/chip-skip/);
    await expect(chips.nth(0)).toContainText('✗ Skip');
    await expect(chips.nth(1)).toHaveClass(/chip-pass/);
    await expect(chips.nth(1)).toContainText('✓ Keep');
    await expect(chips.nth(2)).toHaveClass(/chip-pass/);
    await expect(model.locator('.pipeline-result-section')).toContainText('large = [100, 200]');
    await expect(model.locator('.pipeline-result-section')).toContainText('Length: 2 items');

    // Select threshold 200 (index 2): 50 and 100 skipped, 200 passes
    await model.getByRole('combobox', {name: /Minimum amount/}).selectOption({index: 2});
    await expect(chips.nth(0)).toHaveClass(/chip-skip/);
    await expect(chips.nth(1)).toHaveClass(/chip-skip/);
    await expect(chips.nth(2)).toHaveClass(/chip-pass/);
    await expect(model.locator('.pipeline-result-section')).toContainText('large = [200]');
    await expect(model.locator('.pipeline-result-section')).toContainText('Length: 1 items');

    // Comprehension anatomy block
    await expect(model.locator('.comprehension-anatomy-card')).toContainText('[item for item in expenses if item >= 200]');
    await expect(model.locator('.comprehension-legend')).toContainText('Output expression');
    await expect(model.locator('.comprehension-legend')).toContainText('Iteration');
    await expect(model.locator('.comprehension-legend')).toContainText('Filter condition');
  });

  test('chapter 14 visualizes file loading journey, try/except safety, and program survival', async ({page}) => {
    await page.goto('./#/chapter/14');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-file-journey')).toBeVisible();

    // Default: Valid JSON
    await expect(model.locator('.file-name')).toHaveText('data.json');
    await expect(model.locator('.file-preview')).toHaveText('{"units": 3}');
    await expect(model.locator('.outcome-val')).toHaveText("{'units': 3}");
    await expect(model.locator('.outcome-note')).toContainText('Parsed into Python dictionary successfully');
    await expect(model.locator('.safety-badge')).toBeVisible();

    // Select Missing file (index 1)
    await model.getByRole('combobox', {name: /File state/}).selectOption({index: 1});
    await expect(model.locator('.file-name')).toHaveText('data.json (absent)');
    await expect(model.locator('.file-preview')).toHaveText('No file at path');
    await expect(model.locator('.outcome-val')).toHaveText('Handled: FileNotFoundError');
    await expect(model.locator('.outcome-note')).toContainText('Caught by except FileNotFoundError');
    await expect(model.locator('.safety-badge')).toBeVisible();

    // Select Malformed JSON (index 2)
    await model.getByRole('combobox', {name: /File state/}).selectOption({index: 2});
    await expect(model.locator('.file-name')).toHaveText('data.json (corrupt)');
    await expect(model.locator('.file-preview')).toHaveText('{"units": }');
    await expect(model.locator('.outcome-val')).toHaveText('Handled: JSONDecodeError');
    await expect(model.locator('.outcome-note')).toContainText('Caught by except json.JSONDecodeError');
    await expect(model.locator('.safety-badge')).toBeVisible();
  });

  test('chapter 15 visualizes independent object state instances and mutable class attribute pitfall', async ({page}) => {
    await page.goto('./#/chapter/15');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-object-state')).toBeVisible();

    // Default: 0 items added to Cart A
    await expect(model.locator('.instance-a .inst-total')).toHaveText('₹0');
    await expect(model.locator('.instance-b .inst-total')).toHaveText('₹0');

    // Select 2 items added to Cart A (index 2)
    await model.getByRole('combobox', {name: /Items added to cart A/}).selectOption({index: 2});
    await expect(model.locator('.instance-a .instance-badge')).toHaveText('Modified 2×');
    await expect(model.locator('.instance-a .instance-body code')).toContainText('[₹40, ₹40]');
    await expect(model.locator('.instance-a .inst-total')).toHaveText('₹80');

    // Verify Cart B remains strictly isolated at 0 items / ₹0
    await expect(model.locator('.instance-b .instance-badge')).toHaveText('Independent');
    await expect(model.locator('.instance-b .instance-body code')).toContainText('[]');
    await expect(model.locator('.instance-b .inst-total')).toHaveText('₹0');

    // Select 3 items added to Cart A (index 3)
    await model.getByRole('combobox', {name: /Items added to cart A/}).selectOption({index: 3});
    await expect(model.locator('.instance-a .inst-total')).toHaveText('₹120');
    await expect(model.locator('.instance-b .inst-total')).toHaveText('₹0');

    // Insight and pitfall cards
    await expect(model.locator('.state-independence-banner')).toContainText('Cart B remains at 0 items (₹0)!');
    await expect(model.locator('.shared-state-warning-card')).toBeVisible();
    await expect(model.locator('.contrast-bad')).toContainText('class Cart:');
    await expect(model.locator('.contrast-bad')).toContainText('amounts = [] # Shared list!');
    await expect(model.locator('.contrast-good')).toContainText('def __init__(self):');
    await expect(model.locator('.contrast-good')).toContainText('self.amounts = [] # New list per cart!');
  });

  test('chapters 11 to 15 have zero horizontal overflow on mobile viewports', async ({page}) => {
    for (const width of [360, 390]) {
      await page.setViewportSize({width, height: 800});
      for (const chapterId of [11, 12, 13, 14, 15]) {
        await page.goto('./#/chapter/' + chapterId);
        await expect(page.locator('.lesson-content .concept-model')).toBeVisible();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(1);
      }
    }
  });
});
