import {test, expect} from '@playwright/test';

test.describe('Practice & Mastery Studio', () => {
  test('chapter practice studio renders the three core formats and evaluates prediction', async ({page}) => {
    await page.goto('./#/chapter/2');
    
    // Switch to Practice tab
    const practiceTab = page.locator('#tab-practice');
    await expect(practiceTab).toBeVisible();
    await practiceTab.click();

    // Verify Practice Studio Header
    await expect(page.locator('#practice-studio')).toBeVisible();
    await expect(page.getByRole('heading', {name: /Chapter 2: Variables and Values/i})).toBeVisible();

    // 1. Predict the Output format
    const predictSection = page.locator('#practice-predict');
    await expect(predictSection).toBeVisible();
    await expect(predictSection.getByText('FORMAT A · PREDICT THE OUTPUT')).toBeVisible();

    // Enter incorrect prediction first
    const predInput = page.locator('#predict-input-2');
    await predInput.fill('999');
    await page.getByRole('button', {name: 'Check Prediction'}).click();
    await expect(page.locator('.feedback-banner.warning')).toBeVisible();

    // Enter correct prediction (100)
    await predInput.fill('100');
    await page.getByRole('button', {name: 'Check Prediction'}).click();
    await expect(page.locator('.feedback-banner.success')).toBeVisible();
    await expect(page.getByText('Correct prediction!')).toBeVisible();

    // Run the real Python snippet in the predict section
    const predictRunBtn = predictSection.getByRole('button', {name: 'Run Code'}).first();
    await predictRunBtn.click();
    await expect(predictSection.locator('.console pre').first()).toHaveText('60', {timeout: 45000});
  });

  test('bug fixing format provides progressive hint ladder and verifies repairs', async ({page}) => {
    await page.goto('./#/chapter/2');
    await page.locator('#tab-practice').click();

    const debugSection = page.locator('#practice-debug');
    await expect(debugSection).toBeVisible();
    await expect(debugSection.getByText('FORMAT B · FIND AND FIX THE BUG')).toBeVisible();

    // Reveal hint ladder step by step
    const hintBtn = debugSection.getByRole('button', {name: /Reveal Hint 1 of 3/i});
    await expect(hintBtn).toBeVisible();
    await hintBtn.click();
    await expect(debugSection.getByText('Hint 1 — Direction:')).toBeVisible();

    await debugSection.getByRole('button', {name: /Reveal Hint 2 of 3/i}).click();
    await expect(debugSection.getByText('Hint 2 — Specific Guidance:')).toBeVisible();

    await debugSection.getByRole('button', {name: /Reveal Hint 3 of 3/i}).click();
    await expect(debugSection.getByText('Hint 3 — Strong Hint (Target Fix):')).toBeVisible();

    // Run initial broken code to observe error
    const debugEditor = debugSection.locator('.code-input');
    await expect(debugEditor).toBeVisible();
    await debugSection.getByRole('button', {name: 'Run Code'}).first().click();
    await expect(debugSection.locator('.console')).toContainText('NameError', {timeout: 45000});

    // Fix the bug: replace 'print(totel)' with 'total = price * cups\nprint(total)'
    await debugEditor.fill('price = 20\ncups = 3\ntotal = price * cups\nprint(total)');
    await debugSection.getByRole('button', {name: 'Run Code'}).first().click();
    await expect(debugSection.locator('.console pre').first()).toHaveText('60', {timeout: 30000});
  });

  test('coding challenges show 3-level hints and transition from not-attempted to attempted and solved', async ({page}) => {
    await page.goto('./#/chapter/2');
    await page.locator('#tab-practice').click();

    const taskCard = page.locator('#task-card-2-0');
    await expect(taskCard).toBeVisible();

    // Check initial status badge
    await expect(taskCard.locator('.status-badge')).toContainText('Not attempted');

    // Progressive hints
    const hintBtn = taskCard.getByRole('button', {name: /Reveal Hint 1 of 3/i});
    await hintBtn.click();
    await expect(taskCard.getByText('Hint 1 — Direction:')).toBeVisible();

    await taskCard.getByRole('button', {name: /Reveal Hint 2 of 3/i}).click();
    await expect(taskCard.getByText('Hint 2 — Specific Guidance:')).toBeVisible();

    await taskCard.getByRole('button', {name: /Reveal Hint 3 of 3/i}).click();
    await expect(taskCard.getByText('Hint 3 — Strong Hint:')).toBeVisible();

    // Run starter code -> status updates to Attempted
    const editor = taskCard.locator('.code-input');
    await taskCard.getByRole('button', {name: 'Run Code'}).first().click();
    await expect(taskCard.locator('.status-badge')).toContainText('Attempted', {timeout: 30000});

    // Fill valid solution and Check Answer -> status updates to Verified solved
    await editor.fill('age = 20\nprint(age)');
    await taskCard.getByRole('button', {name: 'Check Answer'}).first().click();
    await expect(taskCard.locator('.status-badge')).toContainText('Solved', {timeout: 45000});
    await expect(taskCard.locator('.feedback')).toContainText('All checks passed');
  });

  test('CodeLab provides intelligent diagnostic feedback on error and output mismatch', async ({page}) => {
    await page.goto('./#/chapter/2');
    await page.locator('#tab-practice').click();

    const taskCard = page.locator('#task-card-2-0');
    const editor = taskCard.locator('.code-input');

    // 1. Missing output (calc without print)
    await editor.fill('age = 20');
    await taskCard.getByRole('button', {name: 'Check Answer'}).first().click();
    await expect(taskCard.locator('.feedback')).toContainText('produced no output', {timeout: 30000});

    // 2. Syntax error
    await editor.fill('age = = 20');
    await taskCard.getByRole('button', {name: 'Check Answer'}).first().click();
    await expect(taskCard.locator('.feedback')).toContainText('Syntax error detected', {timeout: 30000});
  });

  test('practice studio directory page (#/practice) displays metrics, filters and task toggles', async ({page}) => {
    await page.goto('./#/practice');

    // Verify stats hero banner
    await expect(page.locator('.practice-stats-hero')).toBeVisible();
    await expect(page.locator('.hero-metric-item').getByText('Verified Solved')).toBeVisible();
    await expect(page.locator('.hero-metric-item').getByText('In Progress')).toBeVisible();
    await expect(page.locator('.hero-metric-item').getByText('Remaining')).toBeVisible();

    // Search filter
    const searchInput = page.getByLabel('Search challenges');
    await searchInput.fill('recipe');
    await expect(page.locator('.practice-challenges-list')).toBeVisible();
    await expect(page.locator('.practice-challenges-list').getByText('Order the recipe')).toBeVisible();
    await searchInput.fill('');

    // Status filter
    const statusSelect = page.getByLabel('Status');
    await statusSelect.selectOption('not-attempted');
    await expect(page.locator('.practice-challenges-list')).toBeVisible();
    await statusSelect.selectOption('');

    // Toggle expand first challenge
    const firstToggle = page.locator('.practice-toggle').first();
    await firstToggle.click();
    await expect(page.locator('.practice-item-content').first()).toBeVisible();
    await firstToggle.click();
  });

  test('responsive layout on mobile viewports has no horizontal scroll', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto('./#/chapter/2');
    await page.locator('#tab-practice').click();

    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    await page.goto('./#/practice');
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    const practiceOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(practiceOverflow).toBeLessThanOrEqual(1);
  });
});
