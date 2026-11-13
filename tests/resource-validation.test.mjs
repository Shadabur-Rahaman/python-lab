import test from 'node:test';
import assert from 'node:assert/strict';
import {fileInfo, metadata, validateBytes, sha256, MiB} from '../supabase/functions/_shared/validation.mjs';

const bytes = value => new TextEncoder().encode(value);

test('upload metadata enforces file formats, sizes and safe filenames', () => {
  assert.equal(fileInfo('lesson.py',10,'text/plain').mime,'text/x-python');
  for (const name of ['../../notes.pdf','bad\\notes.pdf','test.html','test.exe','file.constructor','test.svg']) {
    assert.throws(() => fileInfo(name,8), name);
  }
  assert.throws(() => fileInfo('lesson.py',0));
  assert.throws(() => fileInfo('lesson.py',26 * MiB));
  assert.throws(() => fileInfo('lesson.pdf',8,'image/png'));
});

test('server byte checks validate content without executing uploads', async () => {
  validateBytes(bytes('print("hello")'),'py');
  validateBytes(bytes('{"count":3}'),'json');
  validateBytes(bytes('{"cells":[],"nbformat":4}'),'ipynb');
  for (const [sample,extension] of [['<html>','pdf'],['not json','json'],['{}','ipynb'],['x\0y','py']]) {
    assert.throws(() => validateBytes(bytes(sample),extension));
  }
  assert.equal(await sha256(bytes('abc')),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});

test('learning metadata accepts chapter zero and validates structured links', () => {
  const row = metadata({title:' Intro ',chapter_id:0,lesson_id:'assignment',glossary_ids:['variable','variable'],language:'both'});
  assert.equal(row.chapter_id,0);
  assert.equal(row.title,'Intro');
  assert.deepEqual(row.glossary_ids,['variable']);
  assert.equal(row.status,'draft');
  assert.throws(() => metadata({title:'X',chapter_id:-1}));
  assert.throws(() => metadata({title:'X',lesson_id:'../../other'}));
  assert.throws(() => metadata({title:'X',glossary_ids:['Variable Name']}));
  assert.throws(() => metadata({title:'X',language:'unknown'}));
});
