import {expect, test} from '@playwright/test';

test.describe('Cross-Platform Ecosystem & Unified Roadmap', () => {
  test('sidebar and topbar feature DS LAB connection', async ({page}) => {
    await page.goto('./#/home');

    // Topbar ecosystem pill
    const topbarPill = page.locator('.ecosystem-pill');
    await expect(topbarPill).toBeVisible();
    await expect(topbarPill).toHaveAttribute('href', 'https://shadabur-rahaman.github.io/ds-lab/');
    await expect(topbarPill).toContainText('DS LAB');

    // Sidebar ecosystem link
    const sidebarLink = page.locator('.sidebar-ecosystem a[href*="ds-lab"]');
    await expect(sidebarLink).toBeVisible();
    await expect(sidebarLink).toHaveAttribute('href', 'https://shadabur-rahaman.github.io/ds-lab/');
    await expect(sidebarLink).toContainText('DS LAB');
    await expect(sidebarLink).toContainText('Data Science & ML');
  });

  test('course catalog displays DS LAB ecosystem bridge banner', async ({page}) => {
    await page.goto('./#/chapters');

    const catalogBanner = page.locator('.catalog-dslab-banner');
    await expect(catalogBanner).toBeVisible();
    await expect(catalogBanner).toContainText('Data Science Lab (DS LAB)');

    const exploreLink = catalogBanner.getByRole('link', {name: /Open DS LAB/i});
    await expect(exploreLink).toBeVisible();
    await expect(exploreLink).toHaveAttribute('href', 'https://shadabur-rahaman.github.io/ds-lab/');
  });

  test('intermediate path journey banner links to DS LAB', async ({page}) => {
    await page.goto('./#/intermediate');

    const journeyBanner = page.locator('.intermediate-journey-banner');
    await expect(journeyBanner).toBeVisible();

    const dsLabLink = journeyBanner.locator('a[href*="ds-lab"]');
    await expect(dsLabLink).toBeVisible();
    await expect(dsLabLink).toHaveAttribute('href', 'https://shadabur-rahaman.github.io/ds-lab/');
  });

  test('project studio portfolio bridge links to DS LAB', async ({page}) => {
    await page.goto('./#/projects');

    // Switch to Student Portfolio tab if available
    const portfolioTab = page.getByRole('tab', {name: /Portfolio/i});
    if (await portfolioTab.isVisible()) {
      await portfolioTab.click();
      const bridgeCard = page.locator('.ds-lab-bridge-card');
      await expect(bridgeCard).toBeVisible();
      const bridgeLink = bridgeCard.getByRole('link', {name: /Explore DS LAB/i});
      await expect(bridgeLink).toHaveAttribute('href', 'https://shadabur-rahaman.github.io/ds-lab/#/projects');
    }
  });
});

