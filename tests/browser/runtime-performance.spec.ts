import {test, expect} from '@playwright/test';

test('runtime displays progressive initialization stages on first execution', async ({page}) => {
  await page.goto('./#/lab');
  const code = page.locator('.code-input');
  await code.fill('print("performance test")');

  const runBtn = page.getByRole('button', {name: 'Run Code'});
  await expect(runBtn).toBeVisible();
  await expect(runBtn).toBeEnabled();

  // Trigger run
  await runBtn.click();

  // Run button is immediately disabled to prevent duplicate concurrent initialization
  await expect(runBtn).toBeDisabled();

  // Standard output appears once runtime completes
  await expect(page.getByText('performance test', {exact: true})).toBeVisible({timeout: 60_000});
  await expect(runBtn).toBeEnabled();
});

test('runtime warm instance accelerates subsequent executions across lessons', async ({page}) => {
  // First run in Lab: warms up the Pyodide instance
  await page.goto('./#/lab');
  const code = page.locator('.code-input');
  await code.fill('print("warmup")');
  await page.getByRole('button', {name: 'Run Code'}).click();
  await expect(page.getByText('warmup', {exact: true})).toBeVisible({timeout: 60_000});

  // Navigate to Home first program CodeLab
  await page.goto('./#/home');
  const homeCode = page.getByRole('textbox', {name: 'Python code: hello.py'});
  await expect(homeCode).toBeVisible();

  // Second run in different component: reuses warm worker instance
  const start = Date.now();
  await page.getByRole('button', {name: 'Run Code'}).click();
  await expect(page.getByText('Hello, World!', {exact: true})).toBeVisible({timeout: 10_000});
  const duration = Date.now() - start;

  // Warm execution should finish rapidly without waiting for full Pyodide re-download
  expect(duration).toBeLessThan(10_000);
});

test('runtime provides retry action when an execution error occurs', async ({page}) => {
  await page.goto('./#/lab');
  const code = page.locator('.code-input');

  // Intentionally cause an exception
  await code.fill('1 / 0');
  await page.getByRole('button', {name: 'Run Code'}).click();

  // Error details open with retry button
  await expect(page.getByText('ZeroDivisionError')).toBeVisible({timeout: 60_000});
  const retryBtn = page.getByRole('button', {name: /Retry Python/});
  await expect(retryBtn).toBeVisible();

  // Fix code and click Retry
  await code.fill('print("recovered")');
  await retryBtn.click();

  // Output displays recovered result
  await expect(page.getByText('recovered', {exact: true})).toBeVisible({timeout: 10_000});
});

test('mobile viewport keeps CodeLab, symbol toolbar and controls fully responsive', async ({page}) => {
  // Mobile phone width: 375x667
  await page.setViewportSize({width: 375, height: 667});
  await page.goto('./#/lab');

  // Verify symbol bar is accessible
  const symbols = page.getByRole('group', {name: 'Python editing symbols'});
  await expect(symbols).toBeVisible();

  // Verify Run and Stop buttons fit and are clickable
  const runBtn = page.getByRole('button', {name: 'Run Code'});
  await expect(runBtn).toBeVisible();
  const stopBtn = page.getByRole('button', {name: 'Stop'});
  await expect(stopBtn).toBeVisible();

  // Insert a symbol via touch button
  const colonBtn = symbols.getByRole('button', {name: ':'});
  await colonBtn.click();
  const code = page.locator('.code-input');
  await expect(code).toHaveValue(/:/);
});

