import {test,expect} from '@playwright/test';
import {syntaxTopics} from '../../src/data/syntax';

test('all chapter models respond and fit phone and desktop layouts',async ({page})=>{
 for (const [width,theme] of [[360,'dark'],[390,'light'],[768,'dark'],[1366,'light'],[1440,'dark']] as const) {
  await page.setViewportSize({width,height:900});
  await page.addInitScript(value=>localStorage.setItem('python-lab.theme',value),theme);
  for(let id=0;id<16;id++){
   await page.goto('./#/chapter/'+id);
   const model=page.locator('.concept-model');
   const initial=await model.locator('.model-flow li').last().innerText();
   await model.getByRole('combobox').selectOption('1');
   await expect(model.locator('.model-flow li').last()).not.toHaveText(initial);
   await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  }
 }
});

test('all syntax topics keep their routes and switch from editor to reference',async ({page})=>{
 await page.setViewportSize({width:390,height:900});
 for (const topic of syntaxTopics) {
  await page.goto('./#/syntax/'+topic.category+'/'+topic.id);
  const editor=page.getByLabel('Python code: '+topic.id+'.py',{exact:true});
  await expect(editor).toBeVisible();
  await page.getByRole('button',{name:'Reference',exact:true}).click();
  await expect(editor).toBeHidden();
  await expect(page.getByRole('heading',{name:'Syntax and symbols'})).toBeVisible();
 }
 await page.goto('./#/syntax');
 await expect(page.getByRole('link',{name:/^Resume /})).toBeVisible();
});
