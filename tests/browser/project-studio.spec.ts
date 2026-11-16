import {test, expect} from '@playwright/test';

test.describe('Project Studio & Student Portfolio', () => {
  test('renders studio catalog with journey banner, flagship projects, and foundational projects', async ({page}) => {
    await page.goto('./#/projects');

    // Verify journey banner
    const journey = page.locator('.intermediate-journey-banner');
    await expect(journey).toBeVisible();
    await expect(journey.getByText('Python Foundations')).toBeVisible();
    await expect(journey.getByText('Intermediate Python')).toBeVisible();
    await expect(journey.getByText('Real-World Projects')).toBeVisible();

    // Verify studio tabs
    await expect(page.getByRole('button', {name: /All Studio Projects/i})).toBeVisible();
    await expect(page.getByRole('button', {name: /Student Project Portfolio/i})).toBeVisible();

    // Verify flagship studio project cards
    await expect(page.getByRole('heading', {name: 'Personal Expense & Budget Tracker'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Smart Inventory & Stock Analyzer'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Student Marks Analyzer'})).toBeVisible();

    // Verify foundational projects section
    await expect(page.getByText('Foundational Guided Projects (Chapters 1–14)')).toBeVisible();
    await expect(page.getByText('Simple Calculator')).toBeVisible();
  });

  test('interacts with milestone-based development in Expense Tracker Pro', async ({page}) => {
    await page.goto('./#/projects/expense-tracker-pro');

    // Header and title
    await expect(page.getByRole('heading', {name: 'Personal Expense & Budget Tracker', level: 1})).toBeVisible();
    await expect(page.getByText('Project Brief & Architecture')).toBeVisible();

    // Milestones selector
    const milestones = page.locator('.milestone-pill');
    await expect(milestones).toHaveCount(3);
    await expect(page.getByText('Milestone 1: Ingestion & Defensive Validation')).toBeVisible();

    // Hint ladder
    const hintBtn = page.getByRole('button', {name: /Reveal Hint 1 of 3/i});
    await expect(hintBtn).toBeVisible();
    await hintBtn.click();
    await expect(page.getByText('Hint 1:')).toBeVisible();

    // Switch to Milestone 2
    await milestones.nth(1).click();
    await expect(page.getByRole('heading', {name: /Category Aggregation & Top Spending/i})).toBeVisible();

    // Export buttons
    await expect(page.getByRole('button', {name: /Export \.py/i})).toBeVisible();
    await expect(page.getByRole('button', {name: /Export README/i})).toBeVisible();
  });

  test('student portfolio displays metrics, project cards, and export actions', async ({page}) => {
    await page.goto('./#/projects');

    // Click Student Project Portfolio tab
    const portfolioTab = page.getByRole('button', {name: /Student Project Portfolio/i});
    await portfolioTab.click();

    // Hero section and metrics
    await expect(page.getByRole('heading', {name: 'Your Demonstrated Python Projects'})).toBeVisible();
    await expect(page.locator('.metric-lbl').filter({hasText: 'Verified Completed'})).toBeVisible();
    await expect(page.locator('.metric-lbl').filter({hasText: 'In Progress'})).toBeVisible();
    await expect(page.locator('.metric-lbl').filter({hasText: 'Milestones Solved'})).toBeVisible();

    // Project cards in portfolio (3 flagship projects + 1 capstone = 4)
    const cards = page.locator('.portfolio-project-card');
    await expect(cards).toHaveCount(4);
    await expect(page.getByRole('button', {name: /Start Project|Continue Project|Review Code/i}).first()).toBeVisible();
  });

  test('student marks analyzer exposes guided milestone roadmap and export capabilities', async ({page}) => {
    await page.goto('./#/projects/student-marks-analyzer');

    // Eyebrow and title
    await expect(page.getByRole('heading', {name: 'Student Marks Analyzer'})).toBeVisible();

    // Milestone roadmap tabs
    const milestoneTabs = page.locator('.milestone-nav-tab');
    await expect(milestoneTabs).toHaveCount(4);
    await expect(page.getByText('Milestone 1: Robust CSV Ingestion')).toBeVisible();

    // Switch milestone tab
    await milestoneTabs.nth(1).click();
    await expect(page.getByText('Stage Objective: Compute totals and averages safely')).toBeVisible();

    // Export buttons
    await expect(page.getByRole('button', {name: /Export \.py/i})).toBeVisible();
    await expect(page.getByRole('button', {name: /Export README/i})).toBeVisible();
  });

  test('project studio and milestone workspaces have zero horizontal overflow on mobile viewport', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});

    // 1. Studio catalog
    await page.goto('./#/projects');
    const catalogOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(catalogOverflow).toBe(false);

    // 2. Milestone workspace
    await page.goto('./#/projects/expense-tracker-pro');
    const projectOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(projectOverflow).toBe(false);
  });
});
