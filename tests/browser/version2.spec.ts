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
 await page.goto('./#/chapter/1');
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

test('set and function challenges validate new inputs and preserve separate drafts',async ({page})=>{
 const activity=page.locator('.pilot-activity');
 await page.goto('./#/chapter/10');
 await activity.getByRole('button',{name:'Practice',exact:true}).click();
 const editor=activity.getByLabel('Python code: challenge.py',{exact:true});
 await editor.fill('# my dictionary draft');
 const choice=activity.getByRole('combobox',{name:/^Challenge/});
 await choice.selectOption('sets');
 await editor.fill('def count_categories(items):\n    return len(set(items))\nprint(count_categories(["Books", "Books", "Pens"]))');
 await activity.getByRole('button',{name:'Check Answer'}).click();
 await expect(activity.getByText('✓ Activity solved')).toBeVisible({timeout:60000});
 await page.reload();
 await expect(activity.getByText('✓ Activity solved')).toBeVisible();
 await choice.selectOption('dictionary');
 await expect(editor).toHaveValue('# my dictionary draft');
 await expect(activity.getByText('✓ Activity solved')).toHaveCount(0);
 await page.goto('./#/chapter/11');
 await activity.getByRole('button',{name:'Practice',exact:true}).click();
 await editor.fill('def order_total(price, quantity, delivery):\n    return 70\nprint(order_total(20, 3, 10))');
 const check=activity.getByRole('button',{name:'Check Answer'});
 await check.click();
 await expect(activity.getByText(/0 passed/)).toBeVisible({timeout:60000});
 await editor.fill('def order_total(price, quantity, delivery):\n    return price * quantity + delivery\nprint(order_total(20, 3, 10))');
 await check.click();
 await expect(activity.getByText('✓ Activity solved')).toBeVisible({timeout:60000});
});

test('expense tracker teaches the boundary and checks a reusable solution',async ({page})=>{
 await page.goto('./#/chapter/12');
 const activity=page.locator('.pilot-activity');
 const slider=activity.getByRole('slider');
 await slider.press('ArrowLeft');
 await slider.press('ArrowLeft');
 await expect(activity.locator('.model-flow li').last()).toContainText('Within budget');
 await slider.press('ArrowLeft');
 await expect(activity.locator('.model-flow li').last()).toContainText('Over budget');
 await activity.getByRole('button',{name:'Practice',exact:true}).click();
 const editor=activity.getByLabel('Python code: challenge.py',{exact:true});
 const check=activity.getByRole('button',{name:'Check Answer'});
 await editor.fill('def summarize_expenses(expenses, budget):\n    return 140, True\nprint(summarize_expenses([40, 75, 25], 100))');
 await check.click();
 await expect(activity.getByText(/0 passed/)).toBeVisible({timeout:60000});
 const code='def summarize_expenses(expenses, budget):\n    total = sum(expenses)\n    return total, total > budget\nprint(summarize_expenses([40, 75, 25], 100))';
 await editor.fill(code);
 await check.click();
 await expect(activity.getByText('✓ Activity solved')).toBeVisible({timeout:60000});
 await page.reload();
 await expect(editor).toHaveValue(code);
 await expect(activity.getByText('✓ Activity solved')).toBeVisible();
});

test('expense report filters, sorts and checks a reusable Python solution',async ({page})=>{
 await page.goto('./#/chapter/13');
 const activity=page.locator('.pilot-activity');
 const report=activity.locator('.expense-report-model');
 await expect(report.locator('ol li')).toHaveText(['Food · ₹75','Travel · ₹40']);
 await activity.getByRole('slider').press('End');
 await expect(report.getByText('No matching expenses.')).toBeVisible();
 await expect(report.locator('ul li')).toHaveCount(3);
 await activity.getByRole('button',{name:'Practice',exact:true}).click();
 const editor=activity.getByLabel('Python code: challenge.py',{exact:true});
 const check=activity.getByRole('button',{name:'Check Answer'});
 await editor.fill('def expense_report(expenses, minimum):\n    return [("Food", 75), ("Travel", 40)]\nprint(expense_report([], 40))');
 await check.click();
 await expect(activity.getByText(/0 passed/)).toBeVisible({timeout:60000});
 const code='def expense_report(expenses, minimum):\n    return sorted((row for row in expenses if row[1] >= minimum), key=lambda row: row[1], reverse=True)\nprint(expense_report([("Travel", 40), ("Food", 75), ("Supplies", 25)], 40))';
 await editor.fill(code);
 await check.click();
 await expect(activity.getByText('✓ Activity solved')).toBeVisible({timeout:60000});
 await page.reload();
 await expect(editor).toHaveValue(code);
 await expect(activity.getByText('✓ Activity solved')).toBeVisible();
});

test('JSON expense reader handles missing and malformed files and restores verified work',async ({page})=>{
 await page.goto('./#/chapter/14');
 const activity=page.locator('.pilot-activity');
 const model=activity.locator('.concept-model');
 await model.getByRole('combobox',{name:/File state/}).selectOption('2');
 await expect(model.locator('.model-flow')).toContainText('JSONDecodeError');
 await activity.getByRole('button',{name:'Practice',exact:true}).click();
 const editor=activity.getByLabel('Python code: challenge.py',{exact:true});
 const check=activity.getByRole('button',{name:'Check Answer'});
 await editor.fill('def read_expenses(path):\n    return [40, 75, 25]\nprint(read_expenses("expenses_sample.json"))');
 await check.click();
 await expect(activity.getByText(/0 passed/)).toBeVisible({timeout:60000});
 const code='import json\nfrom pathlib import Path\ndef read_expenses(path):\n    try:\n        with open(path, encoding="utf-8") as file:\n            return json.load(file)\n    except (FileNotFoundError, json.JSONDecodeError):\n        return []\nPath("expenses_sample.json").write_text("[40, 75, 25]", encoding="utf-8")\nprint(read_expenses("expenses_sample.json"))';
 await editor.fill(code);
 await check.click();
 await expect(activity.getByText('✓ Activity solved')).toBeVisible({timeout:60000});
 await page.reload();
 await expect(editor).toHaveValue(code);
 await expect(activity.getByText('✓ Activity solved')).toBeVisible();
});

test('object-state challenge catches shared state and restores a verified solution',async ({page})=>{
 await page.goto('./#/chapter/15');
 const activity=page.locator('.pilot-activity');
 await activity.getByRole('button',{name:'Run Code',exact:true}).click();
 await expect(activity.locator('.console pre').first()).toHaveText('40 0',{timeout:60000});
 await activity.getByRole('button',{name:'Practice',exact:true}).click();
 const editor=activity.getByLabel('Python code: challenge.py',{exact:true});
 const check=activity.getByRole('button',{name:'Check Answer'});
 const methods='\n    def add(self, amount):\n        self.amounts.append(amount)\n    def total(self):\n        return sum(self.amounts)';
 const sample='\nt = ExpenseTracker()\nt.add(40)\nt.add(75)\nprint(t.total())';
 await editor.fill('class ExpenseTracker:\n    amounts = []'+methods+sample);
 await check.click();
 await expect(activity.getByText(/0 passed/)).toBeVisible({timeout:60000});
 const code='class ExpenseTracker:\n    def __init__(self):\n        self.amounts = []'+methods+sample;
 await editor.fill(code);
 await check.click();
 await expect(activity.getByText('✓ Activity solved')).toBeVisible({timeout:60000});
 await page.reload();
 await expect(editor).toHaveValue(code);
 await expect(activity.getByText('✓ Activity solved')).toBeVisible();
});
