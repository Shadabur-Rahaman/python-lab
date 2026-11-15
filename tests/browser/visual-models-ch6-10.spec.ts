import {test,expect} from '@playwright/test';

test.describe('Visual Learning Models (Chapters 6-10)', () => {
  test('chapter 6 visualizes decision branching with condition evaluation and live terminal output', async ({page}) => {
    await page.goto('./#/chapter/6');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-decision-branch')).toBeVisible();
    await expect(model.locator('.decision-condition-card')).toContainText('marks >= 40');

    // Default score is 39: False branch active, Review output
    await expect(model.locator('.branch-false')).toHaveClass(/branch-active/);
    await expect(model.locator('.branch-true')).toHaveClass(/branch-dimmed/);
    await expect(model.locator('.terminal-samp')).toHaveText('Review');

    // Select score 40: True branch becomes active, Pass output
    await model.getByRole('combobox', {name: /Test score/}).selectOption({index: 1});
    await expect(model.locator('.branch-true')).toHaveClass(/branch-active/);
    await expect(model.locator('.branch-false')).toHaveClass(/branch-dimmed/);
    await expect(model.locator('.terminal-samp')).toHaveText('Pass');

    // Select score 72: True branch remains active
    await model.getByRole('combobox', {name: /Test score/}).selectOption({index: 2});
    await expect(model.locator('.branch-true')).toHaveClass(/branch-active/);
    await expect(model.locator('.terminal-samp')).toHaveText('Pass');
  });

  test('chapter 7 traces loop iterations and updates running total accumulator', async ({page}) => {
    await page.goto('./#/chapter/7');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-loop-tracer')).toBeVisible();
    await expect(model.locator('.loop-iteration-badge')).toBeVisible();

    // Default 0 rows processed: total is 0
    await expect(model.locator('.loop-accumulator-badge')).toContainText('₹0');

    // Select row 1 processed
    await model.getByRole('combobox', {name: /Sales processed/}).selectOption({index: 1});
    await expect(model.locator('.loop-accumulator-badge')).toContainText('₹120');
    await expect(model.locator('.model-cells li').first()).toHaveAttribute('data-selected', 'true');

    // Select row 2 processed
    await model.getByRole('combobox', {name: /Sales processed/}).selectOption({index: 2});
    await expect(model.locator('.loop-accumulator-badge')).toContainText('₹200');

    // Select row 3 processed (all complete)
    await model.getByRole('combobox', {name: /Sales processed/}).selectOption({index: 3});
    await expect(model.locator('.loop-accumulator-badge')).toContainText('₹250');
    await expect(model.locator('.loop-iteration-badge')).toContainText('Completed');
  });

  test('chapter 8 displays dual positive and negative indexing and slice notation', async ({page}) => {
    await page.goto('./#/chapter/8');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-string-explorer')).toBeVisible();
    await expect(model.locator('.dual-index-grid')).toBeVisible();

    // Verify positive indices and negative indices are rendered
    await expect(model.locator('.pos-indices')).toContainText('+0');
    await expect(model.locator('.neg-indices')).toContainText('-1');
    await expect(model.locator('.string-slice-card')).toContainText('"PYTHON"[0:3]');
    await expect(model.locator('.slice-result')).toHaveText('"PYT"');

    // Select index 2 (character 'T')
    await model.getByRole('combobox', {name: /Index in PYTHON/}).selectOption({index: 2});
    const cells = model.locator('.char-cells li');
    await expect(cells.nth(2)).toHaveAttribute('data-selected', 'true');
    await expect(cells.nth(2)).toContainText('T');
  });

  test('chapter 9 contrasts mutable list tray with locked immutable tuple record', async ({page}) => {
    await page.goto('./#/chapter/9');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-sequence-tray')).toBeVisible();
    await expect(model.locator('.badge-mutable')).toContainText('Editable [ ]');
    await expect(model.locator('.badge-locked')).toContainText('Sealed ( )');
    await expect(model.locator('.tuple-error-note')).toContainText('TypeError');

    // Select index 1 (score 84)
    await model.getByRole('combobox', {name: /Index in the scores list/}).selectOption({index: 1});
    const listItems = model.locator('.list-cells li');
    await expect(listItems.nth(1)).toHaveAttribute('data-selected', 'true');
    await expect(listItems.nth(1)).toContainText('84');
  });

  test('chapter 10 visualizes key-value retrieval, safe fallback, and set deduplication', async ({page}) => {
    await page.goto('./#/chapter/10');
    const model = page.locator('.lesson-content .concept-model');
    await expect(model.locator('.model-dict-set')).toBeVisible();
    await expect(model.locator('.dict-lookup-card')).toBeVisible();
    await expect(model.locator('.set-dedup-card')).toBeVisible();

    // Default key "name": value is "Notebook"
    await expect(model.locator('.lookup-key-box')).toContainText('"name"');
    await expect(model.locator('.lookup-val-box')).toContainText('Notebook');

    // Set deduplication card shows deduplicated set
    await expect(model.locator('.set-result-box')).toContainText('{101, 102, 103}');

    // Select missing key "category" (option index 3)
    await model.getByRole('combobox', {name: /Key/}).selectOption({index: 3});
    await expect(model.locator('.lookup-key-box')).toContainText('"category"');
    await expect(model.locator('.lookup-val-box')).toContainText('KeyError with [ ]');
    await expect(model.locator('.get-fallback-badge')).toBeVisible();
    await expect(model.locator('.get-fallback-badge')).toContainText('.get("category", "Unknown")');
  });

  test('chapters 6 to 10 have zero horizontal overflow on mobile viewports', async ({page}) => {
    await page.setViewportSize({width: 360, height: 800});
    for (const chapterId of [6, 7, 8, 9, 10]) {
      await page.goto('./#/chapter/' + chapterId);
      await expect(page.locator('.lesson-content .concept-model')).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });
});
