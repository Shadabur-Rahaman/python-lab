import {test, expect} from '@playwright/test';

test.describe('Runtime isolation and safety verification', () => {
  test('variables defined in one execution do not leak to subsequent executions', async ({page}) => {
    await page.goto('./#/lab');
    const code = page.locator('.code-input');

    // Run 1: Define a unique variable in globals
    await code.fill('secret_flag = "isolated_42"\nprint("flag defined")');
    const runBtn = page.getByRole('button', {name: 'Run Code'});
    await runBtn.click();
    await expect(page.getByText('flag defined', {exact: true})).toBeVisible({timeout: 60_000});

    // Run 2: Access the variable without defining it; must raise NameError
    await code.fill('try:\n    print(secret_flag)\nexcept NameError:\n    print("isolation verified")');
    await runBtn.click();

    // Verify isolation verified is printed, proving secret_flag did not leak across executions
    await expect(page.getByText('isolation verified', {exact: true})).toBeVisible({timeout: 15_000});
  });

  test('input queue resets cleanly and does not bleed into subsequent runs', async ({page}) => {
    await page.goto('./#/lab');
    const code = page.locator('.code-input');
    const inputArea = page.getByPlaceholder('For input() examples');

    // Open program input details if closed
    const inputDetails = page.locator('.workspace-input');
    if (await inputDetails.count() > 0) {
      const isOpen = await inputDetails.getAttribute('open');
      if (isOpen === null) {
        await inputDetails.locator('summary').click();
      }
    }

    // Run 1: Supply input "queued_data" and consume it
    await inputArea.fill('queued_data');
    await code.fill('x = input()\nprint(f"received: {x}")');
    const runBtn = page.getByRole('button', {name: 'Run Code'});
    await runBtn.click();
    await expect(page.getByText('received: queued_data', {exact: true})).toBeVisible({timeout: 60_000});

    // Run 2: Clear input queue; input() must raise EOFError
    await inputArea.fill('');
    await code.fill('try:\n    x = input()\n    print(f"unexpected: {x}")\nexcept EOFError:\n    print("queue reset verified")');
    await runBtn.click();
    await expect(page.getByText('queue reset verified', {exact: true})).toBeVisible({timeout: 15_000});
  });

  test('stdout buffer resets cleanly on every run without previous output bleeding', async ({page}) => {
    await page.goto('./#/lab');
    const code = page.locator('.code-input');
    const runBtn = page.getByRole('button', {name: 'Run Code'});

    // First run
    await code.fill('print("ALPHA_RUN_123")');
    await runBtn.click();
    await expect(page.getByText('ALPHA_RUN_123', {exact: true})).toBeVisible({timeout: 60_000});

    // Second run with distinct output
    await code.fill('print("BETA_RUN_456")');
    await runBtn.click();
    await expect(page.getByText('BETA_RUN_456', {exact: true})).toBeVisible({timeout: 15_000});

    // Verify ALPHA_RUN_123 is completely cleared
    const consoleOutput = page.locator('.console pre').first();
    const text = await consoleOutput.textContent();
    expect(text).not.toContain('ALPHA_RUN_123');
    expect(text).toContain('BETA_RUN_456');
  });

  test('helpful plain-language beginner feedback explains common Python errors', async ({page}) => {
    await page.goto('./#/lab');
    const code = page.locator('.code-input');
    const runBtn = page.getByRole('button', {name: 'Run Code'});

    // Trigger a ZeroDivisionError
    await code.fill('10 / 0');
    await runBtn.click();

    // Verify friendly explanation is shown
    await expect(page.getByText('You cannot divide by zero')).toBeVisible({timeout: 60_000});

    // Trigger a NameError with case-sensitivity pitfall
    await code.fill('Print("Hello")');
    await runBtn.click();
    await expect(page.getByText(/Remember: Python is case-sensitive/)).toBeVisible({timeout: 15_000});
  });
});
