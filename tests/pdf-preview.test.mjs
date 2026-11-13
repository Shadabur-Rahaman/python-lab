import test from 'node:test';
import assert from 'node:assert/strict';
import {pdfBytes} from '../src/resources/pdf.mjs';

test('PDF fetch refreshes an expired signed URL exactly once',async ()=>{
  let count=0;
  const bytes=await pdfBytes(async()=>String(++count),8,new AbortController().signal,
    async url=>url==='1'?new Response('',{status:403}):new Response('%PDF-1.7'));
  assert.equal(count,2);
  assert.equal(new TextDecoder().decode(bytes),'%PDF-1.7');
});

test('missing or unsupported PDF response is rejected',async ()=>{
  const signal=new AbortController().signal;
  await assert.rejects(pdfBytes(async()=>'/missing',0,signal,async()=>new Response('',{status:404})),/could not be loaded/);
  await assert.rejects(pdfBytes(async()=>'/file',0,signal,async()=>new Response('not a PDF')),/could not be read as a PDF/);
});
