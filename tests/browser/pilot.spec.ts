import {test,expect} from '@playwright/test';

test('receipt journey runs real Python and keeps code, snippets and lesson position',async ({page})=>{
  await page.goto('./#/home');
  await expect(page.getByRole('heading',{name:/Your first Python program starts here/})).toBeVisible();
  await page.getByRole('link',{name:'Open Python Playground',exact:true}).click();
  const editor=page.getByLabel('Python code: receipt.py',{exact:true});
  const run=page.getByRole('button',{name:'Run Code',exact:true}).first();
  const source=await editor.inputValue();
  await editor.fill(source.replace('quantity = 3','quantity = 5'));
  await run.click();
  await expect(page.locator('.console pre').first()).toHaveText('Total: 400',{timeout:60000});
  await editor.fill('print(missing_price)');
  await run.click();
  await expect(page.locator('.console')).toContainText('NameError',{timeout:20000});
  await editor.fill(source.replace('price = 80','price = 100'));
  await page.getByRole('link',{name:'Return to Variables and Values'}).click();
  await page.getByText('Continue the receipt workspace',{exact:true}).click();
  await expect(editor).toHaveValue(/price = 100/);
  await page.getByRole('button',{name:'Next step'}).click();
  await page.getByLabel('Predicted total').fill('300');
  await page.getByRole('button',{name:'Check prediction'}).click();
  await expect(page.getByText('Correct. Python multiplies 100 by 3.')).toBeVisible();
  await page.locator('.receipt-workspace').getByRole('button',{name:'Run Code',exact:true}).click();
  await expect(page.locator('.receipt-workspace .console pre').first()).toHaveText('Total: 300',{timeout:60000});
  await page.getByRole('link',{name:'Open in Playground'}).click();
  await expect(editor).toHaveValue(/price = 100/);
  await page.getByText('Saved snippets',{exact:true}).click();
  await page.getByRole('button',{name:'Save current code'}).click();
  await expect(page.getByText('Snippet saved.')).toBeVisible();
  await page.getByRole('link',{name:'Return to Variables and Values'}).click();
  await page.getByText('Continue the receipt workspace',{exact:true}).click();
  await page.reload();
  await page.getByText('Continue the receipt workspace',{exact:true}).click();
  await expect(page.getByRole('heading',{name:'Step 2 of 4 · Run'})).toBeVisible();
  await expect(editor).toHaveValue(/price = 100/);
  await page.goto('./#/home');
  await expect(page.getByRole('link',{name:'Continue learning'}).first()).toHaveAttribute('href','#/chapter/2');
});

test('pilot layouts fit all requested viewport widths',async ({page})=>{
  for(const width of [360,390,768,1024,1366,1440,1920]){
    await page.setViewportSize({width,height:900});
    for(const route of ['home','chapter/2','playground']){
      await page.goto('./#/'+route);
      if(route==='home') await expect(page.getByRole('heading',{name:/Your first Python program starts here/})).toBeVisible();
      else if(route==='chapter/2') await expect(page.getByRole('heading',{name:'Chai shop bill'})).toBeVisible();
      else await expect(page.getByLabel('Python code: receipt.py',{exact:true})).toBeVisible();
      await page.evaluate(()=>document.fonts.ready.then(()=>undefined));
      await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),{message:route+' at '+width}).toBeLessThanOrEqual(1);
    }
  }
});

test('first-time visitor edits and runs the first program from Home',async ({page})=>{
  await page.goto('./#/home');
  await page.getByRole('button',{name:'Try Python Now'}).click();
  const editor=page.getByLabel('Python code: hello.py',{exact:true});
  await expect(editor).toBeFocused();
  await editor.fill('print("Hello from Python!")');
  await page.getByRole('button',{name:'Run Code',exact:true}).click();
  await expect(page.locator('.console pre').first()).toHaveText('Hello from Python!',{timeout:60000});
  await page.reload();
  await expect(editor).toHaveValue('print("Hello from Python!")');
  await page.getByRole('link',{name:'See how print() works'}).click();
  await expect(page).toHaveURL(/#\/chapter\/1$/);
});
