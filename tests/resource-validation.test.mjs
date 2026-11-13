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
test('default PDF form metadata survives the prepare request JSON round trip', () => {
  const form = {
    title:'Lesson notes',description:'',category_id:null,chapter_id:null,lesson_id:null,tags:[],
    glossary_ids:[],language:'en',difficulty:'all',display_order:0,status:'draft',
  };
  assert.deepEqual(metadata(JSON.parse(JSON.stringify({action:'prepare',metadata:form})).metadata),form);
  assert.deepEqual(metadata({title:'Lesson notes',chapter_id:'',lesson_id:''}),form);
});

test('learning metadata retains valid selections and supports all language and difficulty values', () => {
  for (const language of ['en','hi','both']) {
    for (const difficulty of ['all','beginner','intermediate','advanced']) {
      for (const lesson_id of ['assignment','bits-and-walrus','input-output','object-protocols']) {
        for (const glossary_ids of [['variable'],['identifier','local-scope','loop-body']]) {
          const selected = {title:'Notes',chapter_id:0,language,difficulty,lesson_id,glossary_ids};
          const validated = metadata(selected);
          for (const [field,value] of Object.entries(selected)) assert.deepEqual(validated[field],value,field);
        }
      }
    }
  }
});

test('metadata validation reports the invalid field and enforces the glossary limit', () => {
  const ids = ['argument','assignment','boolean','bug','dictionary','expression','function',
    'identifier','immutable','indentation','index','interpreter','iterable'];
  assert.deepEqual(metadata({title:'Notes',glossary_ids:ids.slice(0,12)}).glossary_ids,ids.slice(0,12));
  for (const [field,value,message] of [
    ['glossary_ids',ids,'Too many glossary terms (maximum 12).'],
    ['glossary_ids','variable','Invalid glossary term ID.'],
    ['glossary_ids',['variable','../bad'],'Invalid glossary term ID.'],
    ['glossary_ids',['a'.repeat(121)],'Invalid glossary term ID.'],
    ['lesson_id','fundamentals/assignment','Invalid syntax-topic ID.'],
    ['lesson_id',false,'Invalid syntax-topic ID.'],
    ['language','English','Invalid language selection.'],
    ['language','','Invalid language selection.'],
    ['difficulty','Beginner','Invalid difficulty.'],
    ['difficulty',false,'Invalid difficulty.'],
  ]) {
    assert.throws(() => metadata({title:'Notes',[field]:value}),{message});
  }
});
