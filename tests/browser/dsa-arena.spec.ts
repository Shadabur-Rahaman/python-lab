import {test, expect} from '@playwright/test';

test.describe('DSA & Problem-Solving Arena', () => {
  test('navigates to #/arena and renders 5-stage banner, metrics and problem workspace', async ({page}) => {
    await page.goto('./#/arena');

    // Verify 5-stage continuum banner
    await expect(page.locator('.intermediate-journey-banner')).toBeVisible();
    await expect(page.getByText('STAGE 4 · YOU ARE HERE')).toBeVisible();

    // Verify hero card and metrics
    await expect(page.getByRole('heading', {level: 2, name: /Master Algorithmic Thinking in Python/i})).toBeVisible();
    await expect(page.getByText(/of 24 Solved/i)).toBeVisible();
    await expect(page.getByText(/Topics Mastered/i)).toBeVisible();

    // Verify 3 main tabs
    await expect(page.getByRole('tab', {name: /Problem-Solving Arena \(24\)/i})).toBeVisible();
    await expect(page.getByRole('tab', {name: /Algorithm Visualizers \(6\)/i})).toBeVisible();
    await expect(page.getByRole('tab', {name: /Structured Concept Guides \(5\)/i})).toBeVisible();

    // Verify problems list has items
    const problemItems = page.locator('.problem-item-card');
    await expect(problemItems.first()).toBeVisible();

    // Verify default problem workspace
    await expect(page.getByRole('heading', {level: 2, name: /Running Sum of 1D Array/i})).toBeVisible();
    await expect(page.getByText('Progressive Hint Ladder')).toBeVisible();
    await expect(page.locator('.dsa-editor-card')).toBeVisible();
  });

  test('filters problems by topic and difficulty', async ({page}) => {
    await page.goto('./#/arena');

    // Filter by Difficulty: Intermediate
    const diffSelect = page.locator('.filter-select').nth(1);
    await diffSelect.selectOption('Intermediate');

    // Verify only Intermediate badges appear
    const badges = page.locator('.problem-item-card .difficulty-badge');
    await expect(badges.first()).toBeVisible();
    const count = await badges.count();
    for (let i = 0; i < count; i++) {
      await expect(badges.nth(i)).toHaveText('Intermediate');
    }

    // Filter by Topic: Searching & Sorting
    const topicSelect = page.locator('.filter-select').first();
    await topicSelect.selectOption('searching-sorting');

    // Verify filtered problems list contains searching problems
    await expect(page.getByText('Sort Records by Custom Multi-Key Criteria')).toBeVisible();
  });

  test('interacts with progressive hint ladder and reference solution', async ({page}) => {
    await page.goto('./#/arena/binary-search-basic');

    await expect(page.getByRole('heading', {level: 2, name: /Classic Binary Search/i})).toBeVisible();

    // Progressive hint ladder: reveal Hint 1
    const revealBtn = page.getByRole('button', {name: /Reveal Hint 1/i});
    await expect(revealBtn).toBeVisible();
    await revealBtn.click();

    await expect(page.getByText(/Hint 1:/i)).toBeVisible();
    await expect(page.getByRole('button', {name: /Reveal Hint 2/i})).toBeVisible();

    // Reveal reference solution accordion
    const solutionBtn = page.getByRole('button', {name: /View Reference Solution/i});
    await expect(solutionBtn).toBeVisible();
    await solutionBtn.click();

    await expect(page.getByText(/Why this works:/i)).toBeVisible();
    await expect(page.getByText('Hide Reference Solution')).toBeVisible();
  });

  test('interacts with Algorithm Visualizers suite and stepper controls', async ({page}) => {
    await page.goto('./#/arena');

    // Switch to Algorithm Visualizers tab
    const visualizerTab = page.getByRole('tab', {name: /Algorithm Visualizers \(6\)/i});
    await visualizerTab.click();

    await expect(page.getByRole('heading', {level: 3, name: /Binary Search Invariants/i})).toBeVisible();
    await expect(page.getByText('Step 1 of')).toBeVisible();

    // Step Next
    const nextBtn = page.getByRole('button', {name: /Next/i});
    await nextBtn.click();
    await expect(page.getByText('Step 2 of')).toBeVisible();

    // Reset
    const resetBtn = page.getByRole('button', {name: /Reset/i});
    await resetBtn.click();
    await expect(page.getByText('Step 1 of')).toBeVisible();

    // Switch to Two-Pointer Visualizer
    const twoPointerBtn = page.getByRole('tab', {name: /Converging Two-Pointer/i});
    await twoPointerBtn.click();
    await expect(page.getByRole('heading', {level: 3, name: /Converging Two-Pointer Traversal/i})).toBeVisible();
  });

  test('renders Structured Concept Guides tab with mistake comparisons and cheat sheets', async ({page}) => {
    await page.goto('./#/arena');

    // Switch to Concept Guides tab
    const modulesTab = page.getByRole('tab', {name: /Structured Concept Guides \(5\)/i});
    await modulesTab.click();

    // Verify all 5 module cards render
    const moduleCards = page.locator('.dsa-module-card');
    await expect(moduleCards).toHaveCount(5);

    // Verify module 1 details
    await expect(page.getByRole('heading', {level: 3, name: /Arrays, Lists & Strings: Traversals & Prefix Accumulation/i})).toBeVisible();
    await expect(page.getByText('Buggy Approach').first()).toBeVisible();
    await expect(page.getByText('Optimal Fix').first()).toBeVisible();
    await expect(page.getByText('Quick Invariants Cheat Sheet:').first()).toBeVisible();
  });
});
