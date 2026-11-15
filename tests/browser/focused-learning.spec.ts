import {test, expect} from '@playwright/test';

test.describe('Focused Learning Mode & Usability Refinement (Version 18)', () => {
  test('chapter mode tabs switch between Guided Learning, Detailed Reference, and Practice & Quiz', async ({page}) => {
    await page.goto('./#/chapter/2');
    
    // Default mode is Guided Learning
    const guidedTab = page.getByRole('tab', {name: /Guided Learning/});
    const refTab = page.getByRole('tab', {name: /Detailed Reference/});
    const practiceTab = page.getByRole('tab', {name: /Practice & Quiz/});

    await expect(guidedTab).toHaveAttribute('aria-selected', 'true');
    await expect(refTab).toHaveAttribute('aria-selected', 'false');
    await expect(practiceTab).toHaveAttribute('aria-selected', 'false');

    // Panel guided is visible with checkpoint and pilot lesson
    await expect(page.locator('#panel-guided')).toBeVisible();
    await expect(page.locator('#panel-reference')).not.toBeVisible();
    await expect(page.locator('#panel-practice')).not.toBeVisible();
    await expect(page.getByRole('heading', {name: 'Try a real task'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Chai shop bill'})).toBeVisible();

    // Switch to Detailed Reference
    await refTab.click();
    await expect(refTab).toHaveAttribute('aria-selected', 'true');
    await expect(guidedTab).toHaveAttribute('aria-selected', 'false');
    await expect(page.locator('#panel-reference')).toBeVisible();
    await expect(page.locator('#panel-guided')).not.toBeVisible();
    await expect(page.getByRole('heading', {name: 'Comprehensive Chapter Notes & Concepts'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'A familiar problem'})).toBeVisible();

    // Switch to Practice & Quiz
    await practiceTab.click();
    await expect(practiceTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-practice')).toBeVisible();
    await expect(page.locator('#panel-reference')).not.toBeVisible();
    await expect(page.getByRole('heading', {name: 'Practice', exact: true})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Chapter quiz', exact: true})).toBeVisible();
  });

  test('tab keyboard navigation supports ArrowRight, ArrowLeft, Home, and End', async ({page}) => {
    await page.goto('./#/chapter/2');
    const guidedTab = page.getByRole('tab', {name: /Guided Learning/});
    const refTab = page.getByRole('tab', {name: /Detailed Reference/});
    const practiceTab = page.getByRole('tab', {name: /Practice & Quiz/});

    await guidedTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(refTab).toHaveAttribute('aria-selected', 'true');
    await expect(refTab).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(practiceTab).toHaveAttribute('aria-selected', 'true');
    await expect(practiceTab).toBeFocused();

    await page.keyboard.press('ArrowLeft');
    await expect(refTab).toHaveAttribute('aria-selected', 'true');
    await expect(refTab).toBeFocused();

    await page.keyboard.press('End');
    await expect(practiceTab).toHaveAttribute('aria-selected', 'true');
    await expect(practiceTab).toBeFocused();

    await page.keyboard.press('Home');
    await expect(guidedTab).toHaveAttribute('aria-selected', 'true');
    await expect(guidedTab).toBeFocused();
  });

  test('cross-mode quick jumps and footer actions switch tabs automatically', async ({page}) => {
    await page.goto('./#/chapter/2');

    // Quick jump "Concepts" switches to reference mode
    await page.getByRole('navigation', {name: 'In this chapter'}).getByRole('button', {name: 'Concepts'}).click();
    await expect(page.getByRole('tab', {name: /Detailed Reference/})).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-reference')).toBeVisible();

    // Quick jump "Quiz" switches to practice mode
    await page.getByRole('navigation', {name: 'In this chapter'}).getByRole('button', {name: 'Quiz'}).click();
    await expect(page.getByRole('tab', {name: /Practice & Quiz/})).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-practice')).toBeVisible();

    // Switch back to Guided Learning and use guided mode footer
    await page.getByRole('tab', {name: /Guided Learning/}).click();
    await expect(page.locator('#panel-guided')).toBeVisible();
    await page.locator('#panel-guided').getByRole('button', {name: /Go to Practice & Quiz/}).click();
    await expect(page.getByRole('tab', {name: /Practice & Quiz/})).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-practice')).toBeVisible();
  });

  test('editor drafts are preserved when switching between modes', async ({page}) => {
    await page.goto('./#/chapter/2');
    const editor = page.getByLabel('Python code: example_1.py', {exact: true});
    await editor.fill('print("focused mode test draft")');

    // Switch to reference tab
    await page.getByRole('tab', {name: /Detailed Reference/}).click();
    const refEditor = page.getByLabel('Python code: example_1.py', {exact: true});
    await expect(refEditor).toHaveValue('print("focused mode test draft")');

    // Switch back to guided tab
    await page.getByRole('tab', {name: /Guided Learning/}).click();
    const guidedEditor = page.getByLabel('Python code: example_1.py', {exact: true});
    await expect(guidedEditor).toHaveValue('print("focused mode test draft")');
  });

  test('chapters 0 and 1 preserve continuous beginner flow without mode tabs', async ({page}) => {
    for (const ch of [0, 1]) {
      await page.goto(`./#/chapter/${ch}`);
      await expect(page.locator('.chapter-mode-tabs')).toHaveCount(0);
      await expect(page.getByRole('heading', {name: 'Try a real task'})).toBeVisible();
      await expect(page.getByRole('heading', {name: 'Predict, run and change'})).toBeVisible();
      await expect(page.getByRole('heading', {name: 'Break it & fix it'})).toBeVisible();
    }
  });

  test('focused learning layout is responsive on mobile with zero horizontal overflow', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto('./#/chapter/2');

    const tabs = page.locator('.chapter-mode-tabs');
    await expect(tabs).toBeVisible();
    await expect(page.locator('#panel-guided')).toBeVisible();

    // Check zero horizontal overflow
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    // Switch to reference on mobile
    await page.getByRole('tab', {name: /Detailed Reference/}).click();
    await expect(page.locator('#panel-reference')).toBeVisible();
    const refOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(refOverflow).toBeLessThanOrEqual(1);

    // Switch to practice on mobile
    await page.getByRole('tab', {name: /Practice & Quiz/}).click();
    await expect(page.locator('#panel-practice')).toBeVisible();
    const practiceOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(practiceOverflow).toBeLessThanOrEqual(1);
  });
});
