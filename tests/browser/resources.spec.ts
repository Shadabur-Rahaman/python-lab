import {test, expect} from '@playwright/test';
import {metadata} from '../../supabase/functions/_shared/validation.mjs';

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

test('teacher PDF form sends valid default and selected metadata through prepare', async ({page}) => {
  const teacher = {id:'teacher-fixture',email:'teacher@example.test',aud:'authenticated',role:'authenticated'};
  await page.addInitScript(user => localStorage.setItem('python-lab.teacher.session',JSON.stringify({
    access_token:'fixture-token',refresh_token:'fixture-refresh',expires_at:Math.floor(Date.now()/1000)+3600,user,
  })),teacher);
  const prepareRequests:unknown[] = [];
  const steps:string[] = [];
  await page.route('**/rest/v1/resource_categories?*',route => route.fulfill({json:[]}));
  await page.route('**/rest/v1/resource_settings?*',route => route.fulfill({json:{max_file_size:26214400}}));
  await page.route('**/functions/v1/resource-api',async route => {
    const body = route.request().postDataJSON();
    if (body.action === 'profile') return route.fulfill({json:{...teacher,role:'admin'}});
    if (body.action === 'list') return route.fulfill({json:[]});
    if (body.action === 'prepare') {
      steps.push('prepare');
      prepareRequests.push(metadata(body.metadata));
      return route.fulfill({json:{id:'reservation-fixture',storage_path:'fixtures/notes.pdf',object_exists:false}});
    }
    if (body.action === 'finalize') {
      steps.push('finalize');
      return route.fulfill({json:{id:'material-fixture'}});
    }
    return route.fulfill({status:400,json:{error:'Unexpected action'}});
  });
  await page.route('**/storage/v1/object/python-learning-resources/**',route => {
    steps.push('storage');
    return route.fulfill({json:{Key:'python-learning-resources/fixtures/notes.pdf'}});
  });
  await page.goto('./#/teacher/resources');
  const studio = page.getByRole('heading',{name:'Teacher Studio'});
  await expect(studio.or(page.getByText(/Connect a dedicated Python Lab Supabase project/))).toBeVisible();
  test.skip(!await studio.isVisible(),'Needs a configured frontend build');
  const file = {name:'notes.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n%%EOF')};
  const picker = page.locator('#studio-editor input[type=file]');
  const save = page.getByRole('button',{name:'Save files'});
  await page.evaluate(() => {
    const read = File.prototype.arrayBuffer;
    File.prototype.arrayBuffer = function() {
      document.documentElement.dataset.fileRead = 'true';
      return read.call(this);
    };
  });
  const tags = page.getByLabel('Tags, separated by commas');
  await tags.fill(Array.from({length:13},(_,i) => 'tag-'+i).join(','));
  await picker.setInputFiles(file);
  await save.click();
  await expect(page.getByRole('alert')).toHaveText('Description or tags are too long.');
  await expect(page.locator('html')).not.toHaveAttribute('data-file-read');
  expect(steps).toEqual([]);
  await tags.clear();
  await save.click();
  await expect(page.getByText('notes.pdf verified and saved.')).toBeVisible();
  expect(steps).toEqual(['prepare','storage','finalize']);
  expect(prepareRequests[0]).toMatchObject({
    title:'notes',chapter_id:null,lesson_id:null,glossary_ids:[],language:'en',difficulty:'all',status:'draft',
  });

  const syntax = page.getByLabel('Syntax topic');
  for (const id of await syntax.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value))) {
    expect(metadata({title:'Notes',lesson_id:id}).lesson_id).toBe(id || null);
  }
  const glossary = page.getByRole('group',{name:'Glossary terms'});
  const checkboxes = glossary.getByRole('checkbox');
  for (let i=0;i<12;i++) await checkboxes.nth(i).check();
  await expect(glossary.getByRole('status')).toHaveText('12 of 12 selected');
  await expect(checkboxes.nth(12)).toBeDisabled();
  await checkboxes.first().uncheck();
  await expect(checkboxes.nth(12)).toBeEnabled();
  await checkboxes.nth(12).check();
  const selectedIds = await glossary.locator('input:checked').evaluateAll(inputs =>
    inputs.map(input => input.getAttribute('value')));
  await page.getByRole('combobox',{name:/^Chapter/}).selectOption('0');
  await syntax.selectOption('bits-and-walrus');
  await page.getByRole('combobox',{name:/^Language/}).selectOption('both');
  await page.getByRole('combobox',{name:/^Difficulty/}).selectOption('advanced');
  await picker.setInputFiles(file);
  await save.click();
  await expect(page.getByText('notes.pdf verified and saved.')).toBeVisible();
  expect(steps).toEqual(['prepare','storage','finalize','prepare','storage','finalize']);
  expect(prepareRequests[1]).toMatchObject({
    chapter_id:0,lesson_id:'bits-and-walrus',language:'both',difficulty:'advanced',glossary_ids:selectedIds,
  });
});
