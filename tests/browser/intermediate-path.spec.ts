import {test, expect} from '@playwright/test';

test.describe('Intermediate Python Learning Path & Capstone', () => {
  test('navigates to intermediate path and renders journey banner and 5 modules', async ({page}) => {
    await page.goto('./#/intermediate');

    // Verify journey banner stages
    const journey = page.locator('.intermediate-journey-banner');
    await expect(journey).toBeVisible();
    await expect(journey.getByText('Python Foundations')).toBeVisible();
    await expect(journey.getByText('Intermediate Python')).toBeVisible();
    await expect(journey.getByText('Data Science & Backend')).toBeVisible();

    // Verify hero and metrics
    await expect(page.getByRole('heading', {level: 1, name: /Intermediate Python Learning Path/i})).toBeVisible();
    await expect(page.locator('.metric-lbl').filter({hasText: 'Modules Completed'})).toBeVisible();
    await expect(page.locator('.metric-lbl').filter({hasText: 'Challenges Solved'})).toBeVisible();
    await expect(page.locator('.metric-lbl').filter({hasText: 'Capstone Project'})).toBeVisible();

    // Verify all 5 module tab pills and capstone pill
    const tabs = page.locator('.intermediate-module-nav button[role="tab"]');
    await expect(tabs).toHaveCount(5);
    await expect(page.locator('.module-tab-pill.capstone-pill')).toBeVisible();

    // Default module 1 is selected
    await expect(page.getByRole('heading', {name: /Modules & The Standard Library/i})).toBeVisible();
  });

  test('interacts with Three Core Practice Formats in module 1', async ({page}) => {
    await page.goto('./#/intermediate/modules-and-stdlib');

    // Switch to Practice Studio tab
    const practiceTab = page.getByRole('button', {name: /2\. Practice Studio/i});
    await expect(practiceTab).toBeVisible();
    await practiceTab.click();

    // Format A: Predict the Output
    const predictCard = page.locator('#predict-format');
    await expect(predictCard).toBeVisible();
    const predictInput = predictCard.locator('input[aria-label="Output prediction"]');
    await predictInput.fill('5');
    await predictCard.getByRole('button', {name: 'Check Prediction'}).click();
    await expect(predictCard.locator('.feedback-banner.success')).toBeVisible();
    await expect(predictCard.getByText('Spot on!')).toBeVisible();

    // Format B: Debug the Bug
    const debugCard = page.locator('#debug-format');
    await expect(debugCard).toBeVisible();
    const hintBtn = debugCard.getByRole('button', {name: /Reveal Hint 1 of 3/i});
    await expect(hintBtn).toBeVisible();
    await hintBtn.click();
    await expect(debugCard.getByText('Hint 1:')).toBeVisible();

    // Format C: Coding Challenge TaskCard
    const challengeCard = page.locator('#challenge-format');
    await expect(challengeCard).toBeVisible();
    await expect(challengeCard.getByRole('heading', {name: /Calculate Summary Statistics/i})).toBeVisible();
  });

  test('switches between intermediate modules cleanly', async ({page}) => {
    await page.goto('./#/intermediate');

    // Click module 4 (CSV)
    const m4Btn = page.locator('.module-tab-pill').filter({hasText: 'Structured Data with CSV'});
    await expect(m4Btn).toBeVisible();
    await m4Btn.click();

    // URL should reflect module
    await expect(page).toHaveURL(/#\/intermediate\/csv-structured-data/);
    await expect(page.getByRole('heading', {name: /Structured Data with CSV/i})).toBeVisible();
    await expect(page.getByText('DictReader maps each column to its header name')).toBeVisible();
  });

  test('capstone project workspace displays complete architecture, sample data, and editor', async ({page}) => {
    await page.goto('./#/projects/student-marks-analyzer');

    // Verify header and eyebrow
    await expect(page.locator('.capstone-hero').getByRole('heading', {name: 'Student Marks Analyzer'})).toBeVisible();
    await expect(page.getByText('CAPSTONE PROJECT · INTERMEDIATE PYTHON')).toBeVisible();

    // Verify pipeline steps
    await expect(page.getByText('Complete Processing Pipeline')).toBeVisible();
    await expect(page.locator('.flow-step strong').filter({hasText: 'CSV Ingestion'})).toBeVisible();
    await expect(page.locator('.flow-step strong').filter({hasText: 'Data Cleaning'})).toBeVisible();
    await expect(page.locator('.flow-step strong').filter({hasText: 'Metrics Computation'})).toBeVisible();
    await expect(page.locator('.flow-step strong').filter({hasText: 'Class Analytics'})).toBeVisible();

    // Verify sample CSV and requirements
    await expect(page.getByText('gradebook.csv')).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Core Functional Requirements'})).toBeVisible();

    // Verify editor is rendered
    await expect(page.locator('.capstone-editor-card')).toBeVisible();
    await expect(page.getByText('student_marks_analyzer.py').first()).toBeVisible();

    // Verify completion checkbox toggle
    const checkbox = page.locator('.project-check input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
    await checkbox.check();
    await expect(page.getByText('✓ Capstone Completed')).toBeVisible();
  });

  test('course catalog features intermediate progression banner', async ({page}) => {
    await page.goto('./#/chapters');

    const banner = page.locator('.catalog-intermediate-banner');
    await expect(banner).toBeVisible();
    await expect(banner.getByRole('heading', {name: 'Intermediate Python Learning Path'})).toBeVisible();
    const link = banner.getByRole('link', {name: /Explore Intermediate Path/i});
    await expect(link).toBeVisible();
    await link.click();

    await expect(page).toHaveURL(/#\/intermediate/);
    await expect(page.getByRole('heading', {level: 1, name: /Intermediate Python Learning Path/i})).toBeVisible();
  });

  test('intermediate path and capstone have zero horizontal scroll on mobile viewport', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto('./#/intermediate');

    const intermediateOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(intermediateOverflow).toBe(false);

    await page.goto('./#/projects/student-marks-analyzer');
    const capstoneOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(capstoneOverflow).toBe(false);
  });
});
