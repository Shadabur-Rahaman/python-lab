import {test,expect} from '@playwright/test';

test('variables predict, debug, solve and keep the verified result',async ({page})=>{
 await page.goto('./#/chapter/2');
 const activity=page.locator('.pilot-activity');
 await activity.getByRole('button',{name:'Predict',exact:true}).click();
 await activity.getByLabel(/What total/).fill('100');
 await activity.getByRole('button',{name:'Check prediction'}).click();
 await expect(activity.getByText(/Correct prediction/)).toBeVisible();
 await activity.getByRole('button',{name:'Debug',exact:true}).click();
 const hint=activity.getByRole('button',{name:'Reveal next hint'});
 await hint.click();
 await expect(activity.getByText(/Compare the name/)).toBeVisible();
 await expect(activity.getByText(/Calculate total before printing/)).toHaveCount(0);
 await hint.click();
 await hint.click();
 await expect(activity.getByText('total = price * cups',{exact:false}).last()).toBeVisible();
 await activity.getByRole('button',{name:'Practice',exact:true}).click();
 await activity.getByLabel('Python code: challenge.py',{exact:true}).fill('travel = 40\nfood = 60\nprint(travel + food)');
 await activity.getByRole('button',{name:'Check Answer'}).click();
 await expect(activity.getByText(/Activity solved/)).toBeVisible({timeout:60000});
 await page.reload();
 await activity.getByRole('button',{name:'Practice',exact:true}).click();
 await expect(activity.getByText(/Activity solved/)).toBeVisible();
 await expect(activity.getByLabel('Python code: challenge.py',{exact:true})).toHaveValue(/print\(travel \+ food\)/);
 await page.goto('./#/chapter/11');
 await expect(page.locator('.pilot-activity')).toHaveCount(0);
});

test('condition boundary and both loop traces match the teaching examples',async ({page})=>{
 await page.setViewportSize({width:768,height:900});
 await page.goto('./#/chapter/6');
 await page.getByRole('button',{name:'Switch to dark mode'}).click();
 const activity=page.locator('.pilot-activity');
 const marks=activity.getByRole('slider');
 await marks.focus();
 await marks.press('Home');
 await expect(activity.locator('.model-flow li').last()).toHaveText('Fail');
 await marks.press('End');
 await expect(activity.locator('.model-flow li').last()).toHaveText('Pass');
 await page.goto('./#/chapter/7');
 for(const type of ['for','while']){
  await activity.getByRole('combobox',{name:/Loop type/}).selectOption(type);
  for(let i=0;i<3;i++){
   await activity.getByRole('button',{name:'Next step'}).click();
   await expect(activity.getByText('Iteration '+(i+1)+' · i = '+i+' → Welcome',{exact:true})).toBeVisible();
  }
  await activity.getByRole('button',{name:'Next step'}).click();
  await expect(activity.getByRole('button',{name:'Next step'})).toBeDisabled();
 }
});

test('mobile toolbar inserts at the cursor, replaces selection and supports undo',async ({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('./#/chapter/2');
 const activity=page.locator('.pilot-activity');
 const editor=activity.getByLabel('Python code: experiment.py',{exact:true});
 await editor.fill('print()');
 await editor.evaluate((el:HTMLTextAreaElement)=>el.setSelectionRange(6,6));
 const symbols=activity.getByRole('group',{name:'Python editing symbols'});
 await symbols.getByRole('button',{name:')',exact:true}).click();
 await expect(editor).toHaveValue('print()');
 await editor.evaluate((el:HTMLTextAreaElement)=>el.setSelectionRange(0,5));
 await symbols.getByRole('button',{name:'#',exact:true}).click();
 await expect(editor).toHaveValue('#()');
 await expect(editor).toBeFocused();
 await editor.press('Control+z');
 await expect(editor).toHaveValue('print()');
 await editor.press('Control+y');
 await expect(editor).toHaveValue('#()');
});

test('new activities run Python and restore challenge stage and code',async ({page})=>{
 for(const [id,code,output] of [
   [3,'raw = "12.50"\namount = float(raw)\nprint(amount + 2.5)','15.0'],
   [4,'tickets = int(input())\nprint(tickets * 30)','90'],
   [5,'items = 23\nleftover = items % 5\nprint(leftover)','3'],
 ] as const){
   await page.goto('./#/chapter/'+id);
   const activity=page.locator('.pilot-activity');
   await activity.getByRole('button',{name:'Practice',exact:true}).click();
   const editor=activity.getByLabel('Python code: challenge.py',{exact:true});
   await editor.fill(code);
   await activity.getByRole('button',{name:'Check Answer'}).click();
   await expect(activity.locator('.console pre').first()).toHaveText(output,{timeout:30000});
   await expect(activity.getByText('✓ Activity solved')).toBeVisible();
   await page.reload();
   await expect(editor).toHaveValue(code);
   await expect(activity.getByText('✓ Activity solved')).toBeVisible();
 }
});

test('chapter 8–10 challenges reject hardcoded output and accept working functions',async ({page})=>{
 for(const [id,code,output] of [
  [8,'def clean_name(text):\n    return text.strip()\nprint(clean_name("  Mina  "))','Mina'],
  [9,'def first_score(scores):\n    return next(iter(scores))\nprint(first_score([72, 84, 91]))','72'],
  [10,'def price_or_zero(product):\n    return product["price"] if "price" in product else 0\nprint(price_or_zero({"price": 80}))','80'],
 ] as const){
  await page.goto('./#/chapter/'+id);
  const activity=page.locator('.pilot-activity');
  await activity.getByRole('button',{name:'Continue to Predict'}).press('Enter');
  await expect(activity.getByText('Step 2 of 5')).toBeVisible();
  await activity.getByRole('button',{name:'Practice',exact:true}).click();
  const editor=activity.getByLabel('Python code: challenge.py',{exact:true});
  await editor.fill('print('+JSON.stringify(output)+')');
  const check=activity.getByRole('button',{name:'Check Answer'});
  await check.click();
  await expect(activity.getByText(/0 passed/)).toBeVisible({timeout:60000});
  await editor.fill(code);
  await check.click();
  await expect(activity.getByText('✓ Activity solved')).toBeVisible({timeout:60000});
  await page.reload();
  await expect(editor).toHaveValue(code);
  await expect(activity.getByText('✓ Activity solved')).toBeVisible();
 }
});
