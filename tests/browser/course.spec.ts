import {test, expect} from '@playwright/test';

test('migrates V1 progress, opens a new lesson, and restores bookmarks after refresh', async ({page}) => {
  await page.addInitScript(() => {
    if (localStorage.getItem('python-lab.progress.v2')) return;
    localStorage.setItem('python-lab.progress.v1', JSON.stringify({
      version: 1, visited: [0, 12], completed: [0, 12], solved: ['0-0'], projects: ['intro'],
      scores: {revision: 81}, last: 12, firstProgram: true,
    }));
  });
  await page.goto('./#/progress');
  await expect(page.getByText('V1 revision 81%', {exact: true})).toBeVisible();
  await page.getByRole('main').getByRole('link', {name: 'Continue learning'}).click();
  await expect(page).toHaveURL(/#\/chapter\/13$/);
  await expect(page.getByRole('heading', {name: 'Transforming Collections'})).toBeVisible();
  await page.getByRole('button', {name: 'Bookmark lesson'}).click();
  await page.reload();
  await expect(page.getByRole('button', {name: 'Bookmarked', pressed: true})).toBeVisible();
  await page.goto('./#/chapters');
  await page.getByRole('button', {name: 'Bookmarked lessons'}).click();
  await expect(page.getByRole('link', {name: /Transforming Collections/})).toBeVisible();
  await expect(page.getByRole('link', {name: /Files, JSON/})).toHaveCount(0);
});

test('validates progress imports and exports merged results', async ({page}) => {
  await page.goto('./#/progress');
  const upload = page.getByLabel('Import progress');
  await upload.setInputFiles({name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{')});
  await expect(page.getByText('This file is not valid JSON.')).toBeVisible();
  await upload.setInputFiles({name: 'progress.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({
    version: 2, visited: [14], completed: [14], solved: ['read-count'], projects: [], scores: {'14': 67}, last: 14,
    recent: [14], bookmarks: [14], firstProgram: true,
  }))});
  await expect(page.getByText('Progress imported.')).toBeVisible();
  await expect(page.getByText(/Chapter 14: Files, JSON & Exceptions/)).toContainText('67%');
  const download = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Export progress'}).click();
  expect((await download).suggestedFilename()).toBe('python-lab-progress.json');
});

test('supports keyboard navigation and searching at a phone width', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name: 'Skip to content'})).toBeFocused();
  const menu = page.getByRole('button', {name: 'Toggle navigation'});
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('link', {name: 'Find a lesson'}).click();
  await page.getByRole('textbox', {name: 'Search chapters'}).fill('object state');
  await expect(page.getByRole('link', {name: /Classes & Object State/})).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflow).toBe(false);
});

test('grades multiple cases with real Python and stops an infinite loop', async ({page}) => {
  await page.goto('./#/practice');
  await page.getByRole('textbox', {name: 'Search challenges'}).fill('Trim labels');
  await page.getByRole('button', {name: /Trim labels/}).click();
  const code = page.getByRole('textbox', {name: 'Python code: trim-labels.py'});
  const check = page.getByRole('button', {name: 'Check Answer'});
  await code.fill('def trim_labels(labels):\n    return ["tea", "milk"]');
  await check.click();
  await expect(page.getByText('1 passed · 2 failed. Review the cases below.')).toBeVisible({timeout: 100_000});
  await code.fill('def trim_labels(labels):\n    return [label.strip() for label in labels]');
  await check.click();
  await expect(page.getByText('All checks passed.')).toBeVisible();
  await expect(page.getByText('✓ Solved', {exact: true})).toBeVisible();
  await code.fill('while True:\n    pass');
  await page.getByRole('button', {name: 'Run Code'}).click();
  await expect(page.getByText(/Stopped after 12 seconds/)).toBeVisible({timeout: 16_000});
});

test('separates stdout, stderr and syntax errors in the playground', async ({page}) => {
  await page.goto('./#/lab');
  const code = page.locator('.code-input');
  await code.fill('import sys\nprint("normal")\nprint("diagnostic", file=sys.stderr)');
  await code.press('Control+Enter');
  await expect(page.getByText('normal', {exact: true})).toBeVisible({timeout: 100_000});
  await expect(page.getByText('diagnostic', {exact: true})).toBeVisible();
  await code.fill('print(');
  await page.getByRole('button', {name: 'Run Code'}).click();
  await expect(page.getByText(/SyntaxError:/)).toBeVisible();
  await expect(page.getByText(/line and the line above/)).toBeVisible();
});

test('reports an unavailable runtime download', async ({page}) => {
  await page.route('https://cdn.jsdelivr.net/pyodide/**', route => route.abort());
  await page.goto('./#/lab');
  await page.getByRole('button', {name: 'Run Code'}).click();
  await expect(page.getByText(/Python could not download/)).toBeVisible();
});

test('runs the virtual-file lesson in Pyodide and steps through the aliasing model', async ({page}) => {
  await page.goto('./#/chapter/14');
  const inventory = page.locator('article.example').filter({hasText: 'Write and read a small inventory'});
  await inventory.getByRole('button', {name: 'Run Code'}).click();
  await expect(inventory.locator('.console pre').first()).toHaveText('6', {timeout: 100_000});
  await page.goto('./#/chapter/15');
  const model = page.locator('.alias-model');
  const forward = model.getByRole('button', {name: 'Step forward'});
  for (let index = 0; index < 3; index++) await forward.click();
  await expect(model.locator('dd')).toHaveText(['List A ["tea"]', 'List A ["tea"]']);
  await model.getByRole('checkbox', {name: 'Make a shallow copy on line 2'}).check();
  for (let index = 0; index < 3; index++) await forward.click();
  await expect(model.locator('dd')).toHaveText(['List A []', 'List B ["tea"]']);
  await model.getByRole('button', {name: 'Step back'}).click();
  await expect(model.locator('dd')).toHaveText(['List A []', 'List B []']);
});

test('loads, renames, exports and imports legacy snippets', async ({page}) => {
  await page.addInitScript(() => {
    if (localStorage.getItem('python-lab.snippets.v1')) return;
    localStorage.setItem('python-lab.snippets.v1', JSON.stringify([{name: 'Old snippet', code: 'print(42)', input: ''}]));
  });
  await page.goto('./#/lab');
  await page.getByText('Saved snippets', {exact: true}).click();
  const snippets = page.locator('.snippet-select').getByRole('combobox');
  await snippets.selectOption({label: 'Old snippet'});
  await page.getByRole('button', {name: 'Load', exact: true}).click();
  await expect(page.locator('.code-input')).toHaveValue('print(42)');
  await page.getByLabel('Snippet name').fill('Renamed snippet');
  await page.getByRole('button', {name: 'Rename'}).click();
  await expect(page.getByText('Snippet renamed.')).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Export snippets'}).click();
  expect((await download).suggestedFilename()).toBe('python-lab-snippets.json');
  await page.getByLabel('Import snippets').setInputFiles({
    name: 'snippets.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({version: 1, snippets: [{name: 'Imported', code: 'print(1)', input: ''}]})),
  });
  await expect(page.getByText('Snippets imported.')).toBeVisible();
  await snippets.selectOption({label: 'Imported'});
  await page.getByRole('button', {name: 'Load', exact: true}).click();
  await expect(page.locator('.code-input')).toHaveValue('print(1)');
});
