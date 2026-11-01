import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import ts from 'typescript';
import {freshProgress,loadProgress,saveProgress,KEY,matchesOutput,scoreQuiz,percentage} from '../src/lib/progress.mjs';
async function loadTs(path){const result=ts.transpileModule(fs.readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});return import('data:text/javascript;base64,'+Buffer.from(result.outputText).toString('base64'));}
const {chapters,allTasks,revisionQuiz}=await loadTs('../src/data/curriculum.ts');
const {projects}=await loadTs('../src/data/projects.ts');
test('13 ordered chapters have complete instructional data',()=>{assert.equal(chapters.length,13);for(const [i,c] of chapters.entries()){assert.equal(c.id,i);assert.ok(c.story.length>100);assert.ok(c.objectives.length>=3);assert.ok(c.concepts.length>=4);assert.ok(c.examples.length>=2);assert.ok(c.visual.length>=3);assert.ok(c.mistake.code&&c.mistake.fix&&c.mistake.why);assert.ok(c.application.length>30);assert.equal(c.tasks.length,3);assert.ok(c.quiz.length>=7);}});
test('All 91 question keys are valid, varied and have explanations',()=>{const questions=chapters.flatMap(c=>c.quiz);assert.equal(questions.length,91);assert.equal(new Set(questions.map(q=>q.prompt)).size,91);for(const q of questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.explanation.length>25);}assert.ok(new Set(questions.map(q=>q.answer)).size>1);assert.equal(revisionQuiz.length,26);assert.ok(new Set(revisionQuiz).size===26);});
test('Quiz grading accepts correct keys and rejects incorrect keys',()=>{for(const c of chapters){assert.equal(scoreQuiz(c.quiz,c.quiz.map(q=>q.answer)),100);assert.equal(scoreQuiz(c.quiz,c.quiz.map(q=>(q.answer+1)%4)),0);}const question=chapters[5].quiz.find(q=>q.prompt.includes('17 %'));assert.equal(question.options[question.answer],'2');const index=chapters[8].quiz.find(q=>q.prompt.includes('len('));assert.equal(index.options[index.answer],'8');});
test('39 unique graded tasks and 10 fully guided projects',()=>{assert.equal(allTasks.length,39);assert.equal(new Set(allTasks.map(t=>t.id)).size,39);for(const t of allTasks){assert.ok(t.expected||t.tests);assert.ok(t.solution&&t.starter&&t.prompt);assert.equal(t.hints.length,2);}assert.equal(projects.length,10);for(const p of projects){for(const k of ['requirements','steps','tests','improvements'])assert.ok(p[k].length>=2);assert.ok(p.solution&&p.output&&p.starter&&p.mistake&&p.use);}});
test('Output comparison normalizes line endings and surrounding whitespace but rejects wrong answers',()=>{assert.ok(matchesOutput('  hello\r\n','hello'));assert.ok(matchesOutput('a  \nb\n','a\nb'));assert.ok(!matchesOutput('30','1020'));assert.ok(!matchesOutput('Hello world','Hello World'));assert.ok(!matchesOutput('a b','ab'));});
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};};
test('Versioned progress survives a storage round trip',()=>{const storage=memory(),p=freshProgress();p.completed=[0,2];p.solved=['0-0'];p.projects=['intro'];p.scores={'2':86};p.last=2;p.firstProgram=true;assert.ok(saveProgress(storage,p));assert.deepEqual(loadProgress(storage),p);assert.equal(percentage(p),7);});
test('Missing, corrupt, wrong-version and malformed progress recover safely',()=>{const storage=memory();assert.deepEqual(loadProgress(storage),freshProgress());for(const text of ['oops','null','{"version":2}','{"version":1,"scores":{"0":900},"last":99}']){storage.setItem(KEY,text);assert.deepEqual(loadProgress(storage),freshProgress());}storage.setItem(KEY,JSON.stringify({version:1,completed:[1,1],scores:{'1':71}}));assert.deepEqual(loadProgress(storage).completed,[1]);});
test('Full valid completion is 100 percent and unavailable storage is reported',()=>{const p={...freshProgress(),completed:chapters.map(c=>c.id),solved:allTasks.map(t=>t.id),projects:projects.map(p=>p.id),scores:Object.fromEntries(chapters.map(c=>[c.id,100]))};assert.equal(percentage(p),100);assert.equal(saveProgress({setItem(){throw Error('blocked');}},p),false);});
const harness=`import json, sys, io, contextlib, builtins, traceback
payload=json.loads(sys.stdin.read())
answers=iter(payload.get('input','').splitlines())
def queued_input(prompt=''):
    print(prompt,end='')
    try: return next(answers)
    except StopIteration: raise EOFError('Input queue is empty')
builtins.input=queued_input
out=io.StringIO()
try:
    with contextlib.redirect_stdout(out): exec(payload['code'],{})
    print(json.dumps({'output':out.getvalue()}))
except Exception:
    print(json.dumps({'error':traceback.format_exc(),'output':out.getvalue()}))
`;
function python(code,input=''){const result=spawnSync('python',['-X','utf8','-c',harness],{input:JSON.stringify({code,input}),encoding:'utf8',timeout:10000,windowsHide:true});assert.equal(result.status,0,result.stderr||String(result.error));return JSON.parse(result.stdout);}
test('Every chapter example executes with the documented output in Python 3',()=>{for(const c of chapters)for(const e of c.examples){const result=python(e.code,e.input);assert.ok(!result.error,`${c.id}: ${e.title}: ${result.error}`);assert.ok(matchesOutput(result.output,e.output),`${c.id} ${e.title}: ${JSON.stringify(result.output)} != ${JSON.stringify(e.output)}`);}});
test('Every practice solution passes its output or function tests',()=>{for(const t of allTasks){const result=python(t.solution+(t.tests?'\n'+t.tests:''),t.input);assert.ok(!result.error,`${t.id}: ${result.error}`);if(!t.tests)assert.ok(matchesOutput(result.output,t.expected),t.id);}});
test('Incorrect function implementations fail checks',()=>{for(const t of allTasks.filter(t=>t.tests)){const result=python(t.starter+'\n'+t.tests,t.input);assert.ok(result.error?.includes('AssertionError'),t.id);}});
test('Every project reference solution executes, including deterministic game feedback',()=>{for(const p of projects){const code=p.id==='guess'?p.solution.replace('target = random.randint(1, 10)','target = 7'):p.solution;const result=python(code,p.input);assert.ok(!result.error,`${p.id}: ${result.error}`);assert.ok(matchesOutput(result.output,p.id==='guess'?'Too low\nCorrect!':p.output),`${p.id}: ${result.output}`);}});
