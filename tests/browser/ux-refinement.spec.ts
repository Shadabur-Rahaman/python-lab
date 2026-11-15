import {test,expect} from '@playwright/test';

test.describe('Python Lab Version 17 UX & Learning Journey Refinements', () => {
  test('first-time learner homepage presents clear welcoming hero, primary Start Learning, and Try Python', async ({page}) => {
    await page.setViewportSize({width: 1366, height: 800});
    await page.goto('./#/home');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Verify headline and supportive message
    await expect(page.locator('#hero-title')).toHaveText('Learn Python by doing, one small step at a time.');
    await expect(page.locator('.beginner-intro > p')).toContainText('Start with zero experience. Learn through real code, visual examples, and guided challenges.');

    // Verify primary and secondary action
    const startBtn = page.getByRole('link', {name: /Start Learning/});
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toHaveAttribute('href', '#/chapter/0');

    const tryBtn = page.getByRole('button', {name: /Try Python/});
    await expect(tryBtn).toBeVisible();

    // Feature pills
    await expect(page.getByText('Real Python in your browser')).toBeVisible();
    await expect(page.getByText('Visual interactive models')).toBeVisible();
    await expect(page.getByText('Friendly error guidance')).toBeVisible();

    // Try first line demo
    await expect(page.locator('#first-code')).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Try your first line'})).toBeVisible();

    // 4 Consolidated learning paths
    await expect(page.getByRole('link', {name: /I’m completely new to coding/})).toBeVisible();
    await expect(page.getByRole('link', {name: /Explore the Roadmap/})).toBeVisible();
    await expect(page.getByRole('link', {name: /Practice Python/})).toBeVisible();
    await expect(page.getByRole('link', {name: /Find Python Syntax/})).toBeVisible();

    await page.screenshot({path: 'docs/screenshots/refined-home-desktop.png', fullPage: false});
  });

  test('returning learner homepage prioritizes prominent continuation card without hello world onboarding', async ({page}) => {
    await page.setViewportSize({width: 1366, height: 800});
    await page.goto('./#/home');

    // Simulate returning learner who completed chapters 0 & 1 and is on chapter 2
    await page.evaluate(() => {
      localStorage.setItem('python-lab.progress.v2', JSON.stringify({
        version: 2,
        visited: [0, 1, 2],
        completed: [0, 1],
        solved: ['0-0', '1-0'],
        projects: [],
        scores: {'0': 100, '1': 90},
        bookmarks: [],
        last: 2,
        firstProgram: true,
        recent: [2, 1, 0]
      }));
    });
    await page.reload();

    // Welcome back hero card
    const heroCard = page.locator('.continue-learning-hero');
    await expect(heroCard).toBeVisible();
    await expect(heroCard.locator('.eyebrow')).toHaveText('WELCOME BACK');
    await expect(heroCard).toContainText('Chapter 2: Variables and Values');
    await expect(heroCard).toContainText('2 of 16 chapters completed');

    const continueBtn = heroCard.getByRole('link', {name: /Continue Learning/i});
    await expect(continueBtn).toBeVisible();
    await expect(continueBtn).toHaveAttribute('href', '#/chapter/2');

    // Quick tools
    await expect(page.locator('.beginner-path-grid').getByRole('link', {name: /Curriculum Roadmap/})).toBeVisible();
    await expect(page.locator('.beginner-path-grid').getByRole('link', {name: /Practice Arena/})).toBeVisible();
    await expect(page.locator('.beginner-path-grid').getByRole('link', {name: /Syntax Academy/})).toBeVisible();

    await page.screenshot({path: 'docs/screenshots/refined-home-returning-desktop.png', fullPage: false});

    // Mobile viewport
    await page.setViewportSize({width: 390, height: 844});
    await page.screenshot({path: 'docs/screenshots/refined-home-mobile.png', fullPage: false});
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('learner dashboard provides clear continuation card, metrics, recents, and safe backup', async ({page}) => {
    await page.setViewportSize({width: 1366, height: 800});
    await page.goto('./#/progress');

    // Continuation card on progress dashboard
    const continueCard = page.locator('.continue-learning-hero');
    await expect(continueCard).toBeVisible();
    await expect(continueCard.getByRole('link', {name: /Continue learning/})).toBeVisible();

    // Stats grid
    await expect(page.locator('.stats-grid')).toBeVisible();
    await expect(page.locator('.stats-grid').getByText('Chapters completed')).toBeVisible();
    await expect(page.locator('.stats-grid').getByText('Exercises solved')).toBeVisible();
    await expect(page.locator('.stats-grid').getByText('Projects completed')).toBeVisible();

    // Recently visited section
    await expect(page.getByRole('heading', {name: 'Recently Visited Lessons'})).toBeVisible();
    await expect(page.locator('.recent-chapters-grid')).toBeVisible();

    // Milestones and Quiz scores
    await expect(page.getByRole('heading', {name: 'Your milestones'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Quiz best scores'})).toBeVisible();

    // Progress backup tools
    await expect(page.getByRole('heading', {name: 'Back up your progress'})).toBeVisible();

    await page.screenshot({path: 'docs/screenshots/refined-dashboard-desktop.png', fullPage: false});

    // Mobile view
    await page.setViewportSize({width: 390, height: 844});
    await page.screenshot({path: 'docs/screenshots/refined-dashboard-mobile.png', fullPage: false});
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('chapter guided activity features stage navigation and clear completion next step', async ({page}) => {
    await page.setViewportSize({width: 1366, height: 800});
    await page.goto('./#/chapter/2');

    // Verify breadcrumb
    await expect(page.locator('.breadcrumbs')).toContainText('Home');
    await expect(page.locator('.breadcrumbs')).toContainText('Chapter 2: Variables and Values');

    // In Pilot Activity, advance to Remember stage (Step 5)
    await page.getByRole('button', {name: 'Remember'}).click();
    await expect(page.locator('.pilot-completion-actions')).toBeVisible();
    await expect(page.locator('.pilot-completed-tag')).toHaveText('✓ Guided activity completed');
    await expect(page.getByRole('button', {name: 'Take Chapter Quiz'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Read In-Depth Reference'})).toBeVisible();

    // Both previous and next links in LessonView
    await expect(page.locator('.lesson-nav')).toBeVisible();

    await page.screenshot({path: 'docs/screenshots/refined-chapter2-desktop.png', fullPage: false});

    // Mobile view
    await page.setViewportSize({width: 390, height: 844});
    await page.screenshot({path: 'docs/screenshots/refined-chapter2-mobile.png', fullPage: false});
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('responsive layout verification across standard viewports', async ({page}) => {
    for (const width of [360, 390, 768, 1366, 1440]) {
      await page.setViewportSize({width, height: 850});
      for (const route of ['/#/home', '/#/progress', '/#/chapters', '/#/chapter/0', '/#/chapter/2', '/#/syntax']) {
        await page.goto('.' + route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(1);
      }
    }
  });
});
