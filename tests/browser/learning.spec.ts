import {test,expect} from '@playwright/test';

test('all chapters expose the trace and direct access to practice on desktop and mobile',async ({page})=>{
  for (const width of [1366,390]) {
    await page.setViewportSize({width,height:900});
    for (let id=0;id<16;id++) {
      await page.goto('./#/chapter/'+id);
      const task=page.getByRole('heading',{name:'Try a real task'});
      await expect(task).toBeVisible();
      const trace=page.locator('.trace-current');
      const first=await trace.textContent();
      await page.getByRole('button',{name:'Step 2',exact:true}).click();
      await expect(trace).not.toHaveText(first ?? '');
      await page.getByRole('navigation',{name:'In this chapter'}).getByRole('button',{name:'Practice'}).click();
      await expect(page.locator('#chapter-practice')).toBeFocused();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    }
  }
});

test('keywords are searchable and the applied quiz opens',async ({page})=>{
  await page.goto('./#/keywords');
  await expect(page.locator('.keyword-grid dt')).toHaveCount(39);
  await page.getByRole('searchbox',{name:'Search Python keywords'}).fill('nonlocal');
  await expect(page.locator('.keyword-grid dt')).toHaveText('nonlocal');
  await page.goto('./#/quiz');
  await page.getByRole('combobox',{name:/Choose your assessment/}).selectOption('applied');
  await expect(page.getByRole('heading',{name:'Which instruction is easiest to automate?'})).toBeVisible();
});
