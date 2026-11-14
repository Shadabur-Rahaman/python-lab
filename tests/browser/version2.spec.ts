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
 await page.goto('./#/chapter/3');
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
