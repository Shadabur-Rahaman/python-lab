import {test, expect} from '@playwright/test';
import {terms} from '../../src/data/glossary';
import {glossary as baseline} from '../../src/data/curriculum';
import {syntaxTopics} from '../../src/data/syntax';

test('registry preserves the original glossary and has valid bilingual references', () => {
  expect(new Set(terms.map(term => term.id)).size).toBe(terms.length);
  for (const [name,short] of baseline) expect(terms.find(term => term.name === name)?.short).toBe(short);
  for (const term of terms) {
    expect(term.hindi).toMatch(/[\u0900-\u097F]/);
    expect(term.explanation).toMatch(/[\u0900-\u097F]/);
    expect(syntaxTopics.some(topic => topic.id === term.syntax)).toBe(true);
  }
});

test('Hindi search, language switching, favorites and flashcards', async ({page}) => {
  await page.goto('./#/glossary');
  await page.getByLabel('Search glossary').fill('चर');
  await page.getByRole('link',{name:'Variable',exact:true}).click();
  await page.getByLabel('Language').selectOption('hi');
  await expect(page.locator('[lang="hi"]')).toContainText('वेरिएबल');
  await expect(page.locator('main [lang="en"]')).toHaveCount(0);
  await page.getByRole('button',{name:'Favorite',exact:true}).click();
  await page.getByRole('link',{name:'All glossary terms'}).click();
  await page.getByRole('button',{name:'Favorites',exact:true}).click();
  await page.getByRole('button',{name:'Flashcards'}).click();
  await page.getByRole('button',{name:'Reveal definition'}).click();
  await expect(page.locator('[lang="hi"]')).toContainText('वेरिएबल');
});

test('keyboard opens the contextual dialog and Escape restores focus', async ({page}) => {
  await page.goto('./#/chapter/2');
  const variable = page.getByRole('button',{name:'Variable',exact:true});
  await variable.focus();
  await variable.press('Space');
  await expect(page.getByRole('dialog',{name:'Variable'})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(variable).toBeFocused();
  await variable.dblclick();
  await expect(page.getByRole('dialog',{name:'Variable'})).toBeVisible();
});

test.describe('Touch glossary controls', () => {
  test.use({hasTouch:true,isMobile:true,viewport:{width:390,height:844}});
  test('a term opens with a tap', async ({page}) => {
    await page.goto('./#/chapter/2');
    await page.getByRole('button',{name:'Identifier',exact:true}).tap();
    await expect(page.getByRole('dialog',{name:'Identifier'})).toBeVisible();
  });
});
