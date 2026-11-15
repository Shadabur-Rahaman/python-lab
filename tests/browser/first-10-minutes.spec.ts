import { test, expect } from '@playwright/test';

test.describe('Python Lab V19 — The Perfect First 10 Minutes', () => {
  test('chapter 0 guides beginner through relatable scenario, algorithm sequencing, and clear continuation', async ({ page }) => {
    await page.goto('./#/chapter/0');

    // 1. Relatable scenario and Input -> Process -> Output
    const hero = page.locator('.first-10-ch0 .first-10-hero');
    await expect(hero).toBeVisible();
    await expect(hero.getByRole('heading', { name: 'What is Programming?' })).toBeVisible();
    await expect(hero.locator('.scenario-text')).toContainText('make chai');
    await expect(hero.locator('.ipo-workflow')).toBeVisible();
    await expect(hero.locator('.ipo-step')).toHaveCount(3);
    await expect(hero.getByText('1. Input')).toBeVisible();
    await expect(hero.getByText('2. Process')).toBeVisible();
    await expect(hero.getByText('3. Output')).toBeVisible();

    // 2. Interactive recipe algorithm experiment
    const model = page.locator('.first-10-ch0 .concept-model');
    await expect(model.locator('.model-recipe-steps')).toBeVisible();
    await expect(model.locator('.recipe-step-card')).toHaveCount(4);
    await expect(model.getByText('1 tsp')).toBeVisible();

    // Scale to 2 cups
    await model.getByRole('combobox', { name: /Cups requested/ }).selectOption({ index: 1 });
    await expect(model.getByText('2 tsp')).toBeVisible();
    await expect(model.getByText('Total 400 mL')).toBeVisible();

    // 3. Arrange everyday instructions (TeaOrder)
    const teaOrder = page.locator('.first-10-ch0 .card').filter({ hasText: 'Arrange the recipe' });
    await expect(teaOrder).toBeVisible();
    await expect(teaOrder.locator('.order-step')).toHaveCount(3);

    // Initial check order fails
    await teaOrder.getByRole('button', { name: 'Check order' }).click();
    await expect(teaOrder.getByRole('status')).toContainText('Try again');

    // Move "Boil water" up, then "Add tea leaves" up to achieve correct order:
    // 1. Boil water, 2. Add tea leaves, 3. Serve the chai
    await teaOrder.getByRole('button', { name: 'Move Boil water up' }).click();
    await teaOrder.getByRole('button', { name: 'Move Add tea leaves up' }).click();
    await teaOrder.getByRole('button', { name: 'Check order' }).click();
    await expect(teaOrder.getByRole('status')).toContainText('Correct! Order matters in an algorithm.');

    // 4. Clear primary milestone continuation to Chapter 1
    const milestone = page.locator('.first-10-ch0 .first-10-milestone-card');
    await expect(milestone).toBeVisible();
    await expect(milestone.getByText('STEP 1 MASTERED')).toBeVisible();
    const cta = milestone.getByRole('link', { name: /Continue to Chapter 1/ });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/.*#\/chapter\/1/);
  });

  test('chapter 1 provides immediate coding studio, Pyodide execution, code editing, and typo recovery', async ({ page }) => {
    await page.goto('./#/chapter/1');

    // 1. Studio layout with minimal distance to code
    const studio = page.locator('.first-10-ch1 .ch1-studio');
    await expect(studio).toBeVisible();
    await expect(studio.getByRole('heading', { name: 'Your Very First Python Program' })).toBeVisible();

    // 2. Initial code is print("Hello, World!") and runs in Pyodide
    const lab = studio.locator('.code-lab');
    await expect(lab).toBeVisible();
    const editor = lab.getByLabel('Python code: first_program.py');
    await expect(editor).toHaveValue('print("Hello, World!")');

    const runBtn = lab.getByRole('button', { name: 'Run Code' });
    await runBtn.click();

    // Terminal output in .console > pre displays Hello, World!
    const consolePre = lab.locator('.console > pre');
    await expect(consolePre).toContainText('Hello, World!', { timeout: 35000 });

    // 3. Modify greeting and re-run
    await editor.fill('print("Hello, Python Lab!")');
    await runBtn.click();
    await expect(consolePre).toContainText('Hello, Python Lab!', { timeout: 20000 });

    // 4. Token contrast & visual model
    const model = page.locator('.first-10-ch1 .concept-model');
    await expect(model.locator('.model-statement-map')).toBeVisible();
    await expect(model.locator('.token-contrast-row')).toBeVisible();
    await expect(model.getByText('"10" + "20"')).toBeVisible();
    await expect(model.getByText('10 + 20')).toBeVisible();

    // 4 syntax quick cards
    await expect(page.locator('.syntax-quick-cards .syntax-card')).toHaveCount(4);

    // 5. Typo recovery card
    const typoCard = page.locator('.typo-recovery-card');
    await expect(typoCard).toBeVisible();
    await expect(typoCard.getByRole('heading', { name: 'Errors are clues, not failures' })).toBeVisible();
    const typoLab = typoCard.locator('.code-lab');
    const typoEditor = typoLab.getByLabel('Python code: fix_typo.py');
    await expect(typoEditor).toHaveValue('Print("Hello, World!")');

    // Run typo with uppercase Print -> produces NameError in exception details
    await typoLab.getByRole('button', { name: 'Run Code' }).click();
    await expect(typoLab.locator('details pre, details p').first()).toContainText(/NameError|Print/i, { timeout: 25000 });

    // Fix typo to lowercase print -> executes successfully
    await typoEditor.fill('print("Hello, World!")');
    await typoLab.getByRole('button', { name: 'Run Code' }).click();
    await expect(typoLab.locator('.console > pre')).toContainText('Hello, World!', { timeout: 20000 });

    // 6. Primary milestone continuation to Chapter 2
    const milestone = page.locator('.first-10-ch1 .first-10-milestone-card');
    await expect(milestone).toBeVisible();
    await expect(milestone.getByText('CHAPTER 1 COMPLETE')).toBeVisible();
    const cta = milestone.getByRole('link', { name: /Continue to Chapter 2/ });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/.*#\/chapter\/2/);
  });

  test('seamless progression from Chapter 0 to 1 to 2 with single primary CTA', async ({ page }) => {
    // Start at Chapter 0
    await page.goto('./#/chapter/0');
    const cta0 = page.locator('.first-10-ch0 .first-10-cta');
    await expect(cta0).toBeVisible();
    await cta0.click();

    // Transitioned to Chapter 1
    await expect(page).toHaveURL(/.*#\/chapter\/1/);
    const cta1 = page.locator('.first-10-ch1 .first-10-cta');
    await expect(cta1).toBeVisible();
    await cta1.click();

    // Transitioned to Chapter 2
    await expect(page).toHaveURL(/.*#\/chapter\/2/);
    await expect(page.locator('#panel-guided')).toBeVisible();
    await expect(page.locator('.chapter-mode-tabs')).toBeVisible();
    await expect(page.locator('.model-memory-boxes')).toBeVisible();
  });

  test('chapters 0 and 1 have zero horizontal overflow across 360px, 390px, 768px, and desktop', async ({ page }) => {
    const viewports = [
      { width: 360, height: 800 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1366, height: 800 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const ch of [0, 1]) {
        await page.goto(`./#/chapter/${ch}`);
        await expect(page.locator(`.first-10-ch${ch}`)).toBeVisible();

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        expect(overflow, `Horizontal overflow on ch${ch} at ${vp.width}px`).toBeLessThanOrEqual(1);

        // Ensure key elements are visible and bounded within viewport
        const cta = page.locator(`.first-10-ch${ch} .first-10-cta`);
        await expect(cta).toBeVisible();
        const ctaBox = await cta.boundingBox();
        expect(ctaBox).not.toBeNull();
        if (ctaBox) {
          expect(ctaBox.x).toBeGreaterThanOrEqual(0);
          expect(ctaBox.x + ctaBox.width).toBeLessThanOrEqual(vp.width + 2);
        }
      }
    }
  });
});
