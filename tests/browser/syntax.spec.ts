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
  await model.getByRole('combobox').selectOption('1');
  await expect(model.locator('.model-flow')).toContainText('True');
  await page.getByRole('link',{name:'Try conditions'}).click();
  const symbols=page.getByRole('group',{name:'Explore syntax symbols'});
  const initial=await page.locator('.syntax-symbol-note').innerText();
  await symbols.getByRole('button').nth(1).click();
  await expect(page.locator('.syntax-symbol-note')).not.toHaveText(initial);
});
