import {expect, test} from '@playwright/test';

test.describe('Cross-Platform Ecosystem & Unified Roadmap', () => {
  test('sidebar and topbar feature DS LAB connection and valid links', async ({page, context}) => {
    await page.goto('./#/home');

    // Topbar ecosystem pill (desktop)
    const topbarPill = page.locator('.ecosystem-pill');
    await expect(topbarPill).toBeVisible();
    await expect(topbarPill).toHaveAttribute('href', 'https://shadabur-rahaman.github.io/ds-lab/');
    await expect(topbarPill).toContainText('DS LAB');

    // Verify topbar pill opens DS LAB root
    const [topbarPopup] = await Promise.all([
      context.waitForEvent('page'),
      topbarPill.click(),
    ]);
    expect(topbarPopup.url()).toBe('https://shadabur-rahaman.github.io/ds-lab/');
    await topbarPopup.close();

    // Sidebar ecosystem link
    const sidebarLink = page.locator('.sidebar-ecosystem a[href*="ds-lab"]');
    await expect(sidebarLink).toBeVisible();
    await expect(sidebarLink).toHaveAttribute('href', 'https://shadabur-rahaman.github.io/ds-lab/roadmap');
    await expect(sidebarLink).toContainText('DS LAB');
    await expect(sidebarLink).toContainText('Data Science & ML');

    // Click sidebar link in real browser and verify intended roadmap page URL and rendered heading
    const [sidebarPopup] = await Promise.all([
      context.waitForEvent('page'),
      sidebarLink.click(),
    ]);
    expect(sidebarPopup.url()).toMatch(/^https:\/\/shadabur-rahaman\.github\.io\/ds-lab\/roadmap\/?$/);
    await expect(sidebarPopup.getByRole('heading', {name: 'Data science roadmap', level: 1})).toBeVisible({timeout: 15_000});
    await expect(sidebarPopup.locator('.roadmap-prereq-banner')).toBeVisible({timeout: 15_000});
    await sidebarPopup.close();
  });

  test('course catalog displays DS LAB ecosystem bridge banner with clean courses link', async ({page, context}) => {
    await page.goto('./#/chapters');

    const catalogBanner = page.locator('.catalog-dslab-banner');
    await expect(catalogBanner).toBeVisible();
    await expect(catalogBanner).toContainText('Data Science Lab (DS LAB)');

    const exploreLink = catalogBanner.getByRole('link', {name: /Open DS LAB/i});
    await expect(exploreLink).toBeVisible();
    await expect(exploreLink).toHaveAttribute('href', 'https://shadabur-rahaman.github.io/ds-lab/courses');

    // Click catalog banner link and confirm intended courses destination and rendered heading
    const [catalogPopup] = await Promise.all([
      context.waitForEvent('page'),
      exploreLink.click(),
    ]);
    expect(catalogPopup.url()).toMatch(/^https:\/\/shadabur-rahaman\.github\.io\/ds-lab\/courses\/?$/);
    await expect(catalogPopup.getByRole('heading', {name: 'Course explorer', level: 1})).toBeVisible({timeout: 15_000});
    await catalogPopup.close();
  });

  test('intermediate path journey banner links to DS LAB roadmap', async ({page, context}) => {
    await page.goto('./#/intermediate');

    const journeyBanner = page.locator('.intermediate-journey-banner');
    await expect(journeyBanner).toBeVisible();

    const dsLabLink = journeyBanner.locator('a[href*="ds-lab"]');
    await expect(dsLabLink).toBeVisible();
    await expect(dsLabLink).toHaveAttribute('href', 'https://shadabur-rahaman.github.io/ds-lab/roadmap');

    // Click journey banner link and confirm intended roadmap destination and rendered heading
    const [journeyPopup] = await Promise.all([
      context.waitForEvent('page'),
      dsLabLink.click(),
    ]);
    expect(journeyPopup.url()).toMatch(/^https:\/\/shadabur-rahaman\.github\.io\/ds-lab\/roadmap\/?$/);
    await expect(journeyPopup.getByRole('heading', {name: 'Data science roadmap', level: 1})).toBeVisible({timeout: 15_000});
    await journeyPopup.close();
  });

  test('project studio portfolio bridge links to DS LAB roadmap', async ({page, context}) => {
    await page.goto('./#/projects');

    // Switch to Student Project Portfolio tab
    const portfolioTab = page.getByRole('button', {name: /Student Project Portfolio/i});
    await expect(portfolioTab).toBeVisible();
    await portfolioTab.click();

    const bridgeCard = page.locator('.ds-lab-bridge-card');
    await expect(bridgeCard).toBeVisible();
    const bridgeLink = bridgeCard.getByRole('link', {name: /Explore DS LAB/i});
    await expect(bridgeLink).toHaveAttribute('href', 'https://shadabur-rahaman.github.io/ds-lab/roadmap');

    // Click portfolio bridge link and confirm intended roadmap destination and rendered heading
    const [portfolioPopup] = await Promise.all([
      context.waitForEvent('page'),
      bridgeLink.click(),
    ]);
    expect(portfolioPopup.url()).toMatch(/^https:\/\/shadabur-rahaman\.github\.io\/ds-lab\/roadmap\/?$/);
    await expect(portfolioPopup.getByRole('heading', {name: 'Data science roadmap', level: 1})).toBeVisible({timeout: 15_000});
    await portfolioPopup.close();
  });

  test('mobile navigation: drawer contains functional DS LAB ecosystem link', async ({page, context}) => {
    // Mobile viewport
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('./#/home');

    // Ensure zero horizontal overflow on mobile
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    // Open mobile navigation menu
    const menuButton = page.locator('.mobile-menu');
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const sidebarLink = page.locator('.sidebar-ecosystem a[href*="ds-lab"]');
    await expect(sidebarLink).toBeVisible();
    await expect(sidebarLink).toHaveAttribute('href', 'https://shadabur-rahaman.github.io/ds-lab/roadmap');

    const [mobilePopup] = await Promise.all([
      context.waitForEvent('page'),
      sidebarLink.click(),
    ]);
    expect(mobilePopup.url()).toMatch(/^https:\/\/shadabur-rahaman\.github\.io\/ds-lab\/roadmap\/?$/);
    await expect(mobilePopup.getByRole('heading', {name: 'Data science roadmap', level: 1})).toBeVisible({timeout: 15_000});
    await mobilePopup.close();
  });
});
