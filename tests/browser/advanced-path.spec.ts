import {test, expect} from '@playwright/test';

test.describe('Advanced Python & Software Engineering Studio', () => {
  test('navigates to advanced path and renders hero, 5 modules and capstone pill', async ({page}) => {
    await page.goto('./#/advanced');

    // Verify hero and metrics
    await expect(page.getByRole('heading', {level: 2, name: /Advanced Python & Software Engineering Studio/i})).toBeVisible();
    await expect(page.getByText('Modules Completed')).toBeVisible();
    await expect(page.getByText('Challenges Solved')).toBeVisible();
    await expect(page.getByText('Pathway Mastery')).toBeVisible();

    // Verify all 5 module tab pills and capstone pill
    const tabs = page.locator('.intermediate-module-nav button[role="tab"]');
    await expect(tabs).toHaveCount(5);
    await expect(page.locator('.module-tab-pill.capstone-pill')).toBeVisible();

    // Default module 1 is selected
    await expect(page.getByRole('heading', {name: /Advanced OOP, Dataclasses & Special Methods/i})).toBeVisible();
  });

  test('interacts with Three Core Practice Formats in advanced module 1', async ({page}) => {
    await page.goto('./#/advanced/advanced-oop');

    // Switch to Practice Studio tab
    const practiceTab = page.getByRole('button', {name: /2\. Practice Studio/i});
    await expect(practiceTab).toBeVisible();
    await practiceTab.click();

    // Format A: Predict the Output
    const predictCard = page.locator('[data-testid="practice-predict"]');
    await expect(predictCard).toBeVisible();
    const predictInput = predictCard.locator('#user-prediction-input');
    await predictInput.fill('464');
    await predictCard.getByRole('button', {name: 'Check Prediction'}).click();
    await expect(predictCard.locator('.feedback-callout.success')).toBeVisible();
    await expect(predictCard.getByText('Correct!')).toBeVisible();

    // Format B: Debug the Bug
    const debugCard = page.locator('[data-testid="practice-debug"]');
    await expect(debugCard).toBeVisible();
    const hintBtn = debugCard.getByRole('button', {name: /Reveal Hint 1/i});
    await expect(hintBtn).toBeVisible();
    await hintBtn.click();
    await expect(debugCard.getByText('Direction:')).toBeVisible();

    // Format C: Coding Challenge TaskCard
    await expect(page.getByRole('heading', {name: /Encapsulated Bank Account with History/i})).toBeVisible();
  });

  test('interacts with interactive visualizers across modules', async ({page}) => {
    // Module 1: Composition Visualizer
    await page.goto('./#/advanced/advanced-oop');
    const compVis = page.locator('[data-testid="visualizer-composition"]');
    await expect(compVis).toBeVisible();
    await expect(compVis.getByText('class ShoppingCart')).toBeVisible();
    await expect(compVis.getByText('len(cart)')).toBeVisible();

    // Increase quantity of first item
    const incBtn = compVis.locator('.icon-btn').filter({hasText: '+'}).first();
    await incBtn.click();
    await expect(compVis.getByText('5 total items')).toBeVisible();

    // Module 2: Decorator Flow Visualizer
    await page.goto('./#/advanced/decorators-and-closures');
    const decVis = page.locator('[data-testid="visualizer-decorator-flow"]');
    await expect(decVis).toBeVisible();
    await expect(decVis.getByText('Stage 1 of 5')).toBeVisible();
    await decVis.getByRole('button', {name: /Next Stage/i}).click();
    await expect(decVis.getByText('Stage 2 of 5')).toBeVisible();

    // Module 4: Complexity Matrix Visualizer
    await page.goto('./#/advanced/data-structures-algorithms');
    const compMatrix = page.locator('[data-testid="visualizer-complexity-matrix"]');
    await expect(compMatrix).toBeVisible();
    await expect(compMatrix.getByText('O(1)')).toBeVisible();
    await expect(compMatrix.getByText('O(n^2)')).toBeVisible();
    // Test preset button
    await compMatrix.getByRole('button', {name: 'n = 5,000'}).click();
    await expect(compMatrix.getByText('5,000 items')).toBeVisible();
  });

  test('navigates to Event Scheduling Capstone project and inspects milestones', async ({page}) => {
    await page.goto('./#/projects/event-scheduler-pro');

    // Verify Project Studio loaded Event Scheduler
    await expect(page.getByRole('heading', {level: 2, name: 'Event Scheduling & Conflict Detection System'})).toBeVisible();
    await expect(page.getByText('Advanced', {exact: true})).toBeVisible();

    // Verify milestones
    const selector = page.locator('.milestones-selector');
    await expect(selector.getByText('Event Data Modeling & Defensive Validation')).toBeVisible();
    await expect(selector.getByText('Chronological Ordering & Conflict Detection')).toBeVisible();
    await expect(selector.getByText('Schedule Manager & Greedy Conflict Resolver')).toBeVisible();
    await expect(selector.getByText('Formatted Reporting & Automated Verification')).toBeVisible();

    // Verify starter code editor
    await expect(page.locator('.milestone-editor-card')).toBeVisible();
    await expect(page.getByText('event-scheduler-pro_m1.py').first()).toBeVisible();
  });

  test('switches between advanced modules and checks assessment quiz', async ({page}) => {
    await page.goto('./#/advanced');

    // Click module 3 (Exception Handling)
    const m3Btn = page.locator('.module-tab-pill').filter({hasText: 'Robust Systems & Deep Exception Handling'});
    await expect(m3Btn).toBeVisible();
    await m3Btn.click();

    // URL should reflect module
    await expect(page).toHaveURL(/#\/advanced\/robust-python-exceptions/);
    await expect(page.getByRole('heading', {level: 2, name: /Robust Systems & Deep Exception Handling/i})).toBeVisible();

    // Check quiz tab
    const quizTab = page.getByRole('button', {name: /3\. Module Assessment/i});
    await expect(quizTab).toBeVisible();
    await quizTab.click();

    await expect(page.getByRole('heading', {name: /Checkpoint Assessment/i})).toBeVisible();
    await expect(page.getByText('when does the else block execute?')).toBeVisible();
  });
});
