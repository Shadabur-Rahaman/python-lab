import {test, expect} from '@playwright/test';
import {syntaxCheck} from '../../src/data/syntax/checks';
import {syntaxTopics, categories} from '../../src/data/syntax';

test('syntax search, category filtering and detail deep links', async ({page}) => {
  await page.goto('./#/syntax');
  await expect(page.getByRole('heading', {name:'Python Syntax Academy'})).toBeVisible();
  await page.getByLabel('Search syntax').fill('identifier');
  await page.getByLabel('Category').selectOption('fundamentals');
  await page.getByRole('link', {name:/Variables, identifiers and assignment/}).click();
  await expect(page).toHaveURL(/#\/syntax\/fundamentals\/assignment$/);
  await page.reload();
  await expect(page.getByRole('heading', {name:'Variables, identifiers and assignment'})).toBeVisible();
  await expect(page.getByRole('link', {name:'Variables and Values',exact:true})).toHaveAttribute('href','#/chapter/2');
  await page.goto('./#/syntax/fundamentals/missing');
  await expect(page.getByText('That syntax topic could not be found.')).toBeVisible();
});

test('all syntax examples and repairs run in the published Python runtime', async ({page}) => {
  test.setTimeout(150_000);
  expect(new Set(syntaxTopics.map(topic => topic.id)).size).toBe(syntaxTopics.length);
  expect(new Set(syntaxTopics.map(topic => topic.category))).toEqual(new Set(Object.keys(categories)));
  for (const topic of syntaxTopics) {
    const check = syntaxCheck(topic.id);
    expect(check.options[check.answer]).toBeTruthy();
    expect(new Set(check.options).size).toBe(3);
  }
  expect(syntaxTopics.every(topic => topic.lesson >= 0 && topic.lesson <= 15)).toBe(true);
  await page.goto('./');
  const results = await page.evaluate(async topics => {
    const worker = new Worker(new URL('python-worker.js', location.href));
    const output: {id:string; actual:string; error?:string; repairError?:string}[] = [];
    function run(code:string, input?:string): Promise<{actual:string;error?:string}> {
      return new Promise(resolve => {
        let actual = '';
        worker.onmessage = ({data}) => {
          if (data.kind === 'stdout') actual += data.text;
          if (data.kind === 'done') resolve({actual});
          if (data.kind === 'error') resolve({actual,error:data.text});
        };
        worker.onerror = error => resolve({actual,error:error.message});
        worker.postMessage({code,input});
      });
    }
    try {
      for (const topic of topics) {
        const result = await run(topic.code, topic.input);
        const repair = await run(topic.correction);
        output.push({id:topic.id,...result,repairError:repair.error});
      }
      return output;
    } finally { worker.terminate(); }
  }, syntaxTopics);
  expect(results).toHaveLength(syntaxTopics.length);
  for (const result of results) {
    expect(result.error, result.id).toBeUndefined();
    expect(result.repairError, result.id).toBeUndefined();
    expect(result.actual.trim(), result.id).toBe(syntaxTopics.find(topic => topic.id === result.id)!.output);
  }
});

test('syntax landing experiment and symbol explorer respond to learner choices', async ({page})=>{
  await page.goto('./#/syntax');
  const model=page.locator('.syntax-launch .concept-model');
  await model.getByRole('combobox',{name:/^(?!Memory hint language)/}).selectOption('1');
  await expect(model.locator('.model-flow')).toContainText('True');
  await page.getByRole('link',{name:'Try conditions'}).click();
  const symbols=page.getByRole('group',{name:'Explore syntax symbols'});
  const initial=await page.locator('.syntax-symbol-note').innerText();
  await symbols.getByRole('button').nth(1).click();
  await expect(page.locator('.syntax-symbol-note')).not.toHaveText(initial);
});

test('Syntax Academy 2.0 beginner search, query chips and clear action', async ({page}) => {
  await page.goto('./#/syntax');

  // Test popular query chip click: "repeat code"
  const repeatChip = page.locator('.syntax-query-chip', {hasText: 'repeat code'});
  await expect(repeatChip).toBeVisible();
  await repeatChip.click();
  await expect(page.getByLabel('Search syntax')).toHaveValue('repeat code');
  // Check that loops card is shown
  await expect(page.getByRole('heading', {name: /for, while, range and loop control/i})).toBeVisible();

  // Test clear search button
  const clearBtn = page.getByRole('button', {name: 'Clear search'});
  await expect(clearBtn).toBeVisible();
  await clearBtn.click();
  await expect(page.getByLabel('Search syntax')).toHaveValue('');

  // Test direct query "remove spaces"
  await page.getByLabel('Search syntax').fill('remove spaces');
  await expect(page.getByRole('heading', {name: /Strings, bytes, prefixes and slicing/i})).toBeVisible();

  // Test direct query "check condition"
  await page.getByLabel('Search syntax').fill('check condition');
  await expect(page.getByRole('heading', {name: /if, elif, else and conditional/i})).toBeVisible();
});

test('Syntax Card progressive disclosure, Hinglish hints and copy action', async ({page, context}) => {
  await context.grantPermissions(['clipboard-write', 'clipboard-read']);
  await page.goto('./#/syntax');

  const card = page.locator('.syntax-flash').first();
  await expect(card).toBeVisible();

  // Check code box and copy button
  const copyBtn = card.getByRole('button', {name: /Copy/});
  await expect(copyBtn).toBeVisible();
  await copyBtn.click();
  await expect(copyBtn).toContainText(/Copied!/);

  // Progressive disclosure: details, context, memory hint & common mistakes
  const details = card.locator('.syntax-card-details');
  await expect(details).toBeVisible();
  await details.locator('summary').first().click();
  await expect(card.locator('.syntax-details-content')).toBeVisible();
  await expect(card.locator('.syntax-realworld-note')).toBeVisible();
  await expect(card.locator('.syntax-memory-pill')).toBeVisible();
  await expect(card.locator('.syntax-mistake-snippet')).toBeVisible();
});

test('Category pills filtering and mobile viewport adaptability', async ({page}) => {
  // Mobile viewport: 375x667
  await page.setViewportSize({width: 375, height: 667});
  await page.goto('./#/syntax');

  // Check header visible
  await expect(page.getByRole('heading', {name: 'Python Syntax Academy'})).toBeVisible();

  // Search input visible and fits mobile width
  const searchInput = page.getByLabel('Search syntax');
  await expect(searchInput).toBeVisible();

  // Filter with category pill
  const controlPill = page.locator('.syntax-category-pills button', {hasText: 'Control flow'});
  await expect(controlPill).toBeVisible();
  await controlPill.click();

  // Results should only show Control flow
  await expect(page.getByRole('heading', {name: 'Control flow'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Fundamentals'})).not.toBeVisible();
});
