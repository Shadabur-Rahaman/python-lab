import {test, expect} from '@playwright/test';

test('keeps teacher sign-in out of student navigation', async ({page}) => {
  await page.goto('./#/chapter/2');
  await page.getByRole('link',{name:'Browse materials for this chapter'}).click();
  await expect(page).toHaveURL(/#\/resources\?chapter=2$/);
  await expect(page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:/teacher/i})).toHaveCount(0);
  await page.goto('./#/teacher/resources');
  await expect(page.getByRole('navigation',{name:'Main navigation'})).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Teacher sign-in'}).or(page.getByText(/Connect a dedicated Python Lab Supabase project/))).toBeVisible();
  await page.goto('./#/syntax/control/loops');
  await expect(page.getByRole('heading',{name:'for, while, range and loop control'})).toBeVisible();
});

test('filters materials and previews uploaded text as inert content', async ({page}) => {
  await page.route('**/rest/v1/published_resources?*', route => route.fulfill({json:[{
    id:'sample',title:'Assignment notes',description:'Practice naming variables',original_filename:'variables.md',
    mime_type:'text/markdown',file_size:55,chapter_id:2,lesson_id:null,category_id:null,tags:['assignment'],
    glossary_ids:[],language:'en',difficulty:'beginner',version:1,display_order:0,published_at:'2026-11-14T00:00:00Z',
  }]}));
  await page.route('**/rest/v1/resource_categories?*', route => route.fulfill({json:[]}));
  await page.route('**/functions/v1/resource-api', route => route.fulfill({json:{url:'https://files.example.test/variables.md'}}));
  await page.route('https://files.example.test/variables.md', route => route.fulfill({
    headers:{'Access-Control-Allow-Origin':'*'},body:'<script>window.unsafePreview = true</script>',
  }));
  await page.goto('./#/resources');
  const search = page.getByRole('searchbox',{name:'Search materials'});
  await expect(search.or(page.getByText(/Study materials are unavailable until/))).toBeVisible();
  test.skip(!await search.isVisible(),'Needs a configured frontend build');
  await expect(page.getByRole('heading',{name:'Assignment notes'})).toBeVisible();
  await search.fill('missing');
  await expect(page.getByText('No published materials match these filters.')).toBeVisible();
  await search.fill('variables.md');
  const button = page.getByRole('button',{name:'Preview'});
  await button.click();
  const dialog = page.getByRole('dialog',{name:'Assignment notes'});
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('pre')).toContainText('<script>');
  await expect(dialog.locator('script')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(button).toBeFocused();
});

test('teacher sign-in handles a rejected password without opening the studio', async ({page}) => {
  await page.route('**/auth/v1/token?*', route => route.fulfill({
    status:400,json:{code:'invalid_credentials',message:'Invalid login credentials'},
  }));
  await page.goto('./#/teacher/resources');
  const password = page.getByLabel('Password',{exact:true});
  await expect(password.or(page.getByText(/Connect a dedicated Python Lab Supabase project/))).toBeVisible();
  test.skip(!await password.isVisible(),'Needs a configured frontend build');
  await page.getByRole('button',{name:'Show password'}).click();
  await expect(password).toHaveAttribute('type','text');
  await page.getByLabel('Email').fill('test@example.test');
  await password.fill('invalid password');
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await expect(page.getByRole('alert')).toHaveText('Sign-in failed. Check your email and password.');
  await expect(page.getByRole('heading',{name:'Teacher Studio'})).toHaveCount(0);
});
