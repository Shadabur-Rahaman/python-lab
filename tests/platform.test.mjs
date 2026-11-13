import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import ts from 'typescript';
import {buildCatalog,expandedLessons,lessonNeighbors,levels,tracks} from '../src/data/catalog.mjs';
import {freshProgress,loadProgress,saveProgress,KEY,LEGACY_KEY,importProgress,mergeProgress,matchesOutput,scoreQuiz,percentage} from '../src/lib/progress.mjs';
async function loadTs(path){const result=ts.transpileModule(fs.readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});return import('data:text/javascript;base64,'+Buffer.from(result.outputText).toString('base64'));}
const {chapters,allTasks,revisionQuiz}=await loadTs('../src/data/curriculum.ts');
const {projects}=await loadTs('../src/data/projects.ts');
const {intermediate}=await loadTs('../src/data/intermediate.ts');
const catalog=buildCatalog(chapters,projects);
const allLessons=[...chapters,...intermediate];
const expandedTasks=intermediate.flatMap(lesson=>lesson.tasks);
test('13 ordered chapters have complete instructional data',()=>{assert.equal(chapters.length,13);for(const [i,c] of chapters.entries()){assert.equal(c.id,i);assert.ok(c.story.length>100);assert.ok(c.objectives.length>=3);assert.ok(c.concepts.length>=4);assert.ok(c.examples.length>=2);assert.ok(c.visual.length>=3);assert.ok(c.mistake.code&&c.mistake.fix&&c.mistake.why);assert.ok(c.application.length>30);assert.equal(c.tasks.length,3);assert.ok(c.quiz.length>=7);}});
test('All 91 question keys are valid, varied and have explanations',()=>{const questions=chapters.flatMap(c=>c.quiz);assert.equal(questions.length,91);assert.equal(new Set(questions.map(q=>q.prompt)).size,91);for(const q of questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.explanation.length>25);}assert.ok(new Set(questions.map(q=>q.answer)).size>1);assert.equal(revisionQuiz.length,26);assert.ok(new Set(revisionQuiz).size===26);});
test('Quiz grading accepts correct keys and rejects incorrect keys',()=>{for(const c of chapters){assert.equal(scoreQuiz(c.quiz,c.quiz.map(q=>q.answer)),100);assert.equal(scoreQuiz(c.quiz,c.quiz.map(q=>(q.answer+1)%4)),0);}const question=chapters[5].quiz.find(q=>q.prompt.includes('17 %'));assert.equal(question.options[question.answer],'2');const index=chapters[8].quiz.find(q=>q.prompt.includes('len('));assert.equal(index.options[index.answer],'8');});
test('39 original graded tasks and 11 fully guided projects',()=>{assert.equal(allTasks.length,39);assert.equal(new Set(allTasks.map(t=>t.id)).size,39);for(const t of allTasks){assert.ok(t.expected||t.tests);assert.ok(t.solution&&t.starter&&t.prompt);assert.equal(t.hints.length,2);}assert.equal(projects.length,11);for(const p of projects){for(const k of ['requirements','steps','tests','improvements'])assert.ok(p[k].length>=2);assert.ok(p.solution&&p.output&&p.starter&&p.mistake&&p.use);}});
test('Output comparison normalizes line endings and surrounding whitespace but rejects wrong answers',()=>{assert.ok(matchesOutput('  hello\r\n','hello'));assert.ok(matchesOutput('a  \nb\n','a\nb'));assert.ok(!matchesOutput('30','1020'));assert.ok(!matchesOutput('Hello world','Hello World'));assert.ok(!matchesOutput('a b','ab'));});
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};};
test('Versioned progress survives a storage round trip',()=>{const storage=memory(),p=freshProgress();p.completed=[0,2];p.solved=['0-0'];p.projects=['intro'];p.scores={'2':86};p.last=2;p.firstProgram=true;assert.ok(saveProgress(storage,p));assert.deepEqual(loadProgress(storage,catalog),p);assert.equal(percentage(p,catalog),Math.round(500/(2*catalog.lessonIds.size+catalog.taskIds.size+catalog.projectIds.size)));});
test('Missing, corrupt, wrong-version and malformed progress recover safely',()=>{const storage=memory();assert.deepEqual(loadProgress(storage,catalog),freshProgress());for(const text of ['oops','null','{"version":2}','{"version":1,"scores":{"0":900},"last":99}']){storage.setItem(KEY,text);assert.deepEqual(loadProgress(storage,catalog),freshProgress());}storage.setItem(KEY,JSON.stringify({version:2,completed:[1,1],scores:{'1':71}}));assert.deepEqual(loadProgress(storage,catalog).completed,[1]);});
test('Full valid completion is 100 percent and unavailable storage is reported',()=>{const p={...freshProgress(),completed:allLessons.map(c=>c.id),solved:[...allTasks,...expandedTasks].map(t=>t.id),projects:projects.map(p=>p.id),scores:Object.fromEntries(allLessons.map(c=>[c.id,100]))};assert.equal(percentage(p,catalog),100);assert.equal(saveProgress({setItem(){throw Error('blocked');}},p),false);});
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

test('V1 migration preserves every existing progress category and quiz key', () => {
  const storage=memory();
  const original={version:1,visited:[0,2],completed:[0],solved:['0-0'],
    projects:['intro'],scores:{'0':86,revision:75},last:2,firstProgram:true};
  storage.setItem(LEGACY_KEY,JSON.stringify(original));
  const migrated=loadProgress(storage,catalog);
  assert.deepEqual(migrated,{...original,version:2,bookmarks:[],recent:[2,0]});
  storage.setItem(KEY,'corrupted');
  assert.deepEqual(loadProgress(storage,catalog),migrated);
  saveProgress(storage,freshProgress());
  assert.deepEqual(loadProgress(storage,catalog),freshProgress());
  assert.equal(JSON.parse(storage.getItem(LEGACY_KEY)).version,1);
});

test('Backups merge without erasing completion or reducing best scores', () => {
  const current={...freshProgress(),visited:[3],recent:[3],last:3,scores:{'3':100}};
  const incoming={...freshProgress(),visited:[13],recent:[13],last:13,completed:[13],
    solved:['trim-labels'],projects:['inventory-report'],bookmarks:[13],scores:{'3':30,'13':67}};
  const merged=mergeProgress(current,importProgress(JSON.stringify(incoming),catalog));
  assert.deepEqual(merged.scores,{'3':100,'13':67});
  assert.deepEqual(merged.completed,[13]);
  assert.deepEqual(merged.recent,[3,13]);
  assert.equal(merged.last,3);
  assert.deepEqual(loadProgress({getItem:()=>JSON.stringify(merged)},catalog),merged);
  for(const invalid of ['invalid','{}','{"version":2}','{"version":99}','[]']){
    assert.throws(()=>importProgress(invalid,catalog));
  }
});

test('Catalog IDs are unique, prerequisite references precede lessons, and metadata matches loaded modules', () => {
  assert.equal(catalog.lessonIds.size,allLessons.length);
  assert.equal(catalog.taskIds.size,allTasks.length+expandedTasks.length);
  assert.equal(catalog.projectIds.size,projects.length);
  const seen=new Set();
  for(const lesson of catalog.lessons){
    assert.ok(levels.some(level=>level.id===lesson.level));
    for(const id of lesson.prerequisites)assert.ok(seen.has(id));
    seen.add(lesson.id);
  }
  for(const track of tracks)for(const id of track.foundation)assert.ok(catalog.lessonIds.has(id));
  for(const project of projects)for(const id of project.chapters)assert.ok(catalog.lessonIds.has(id));
  for(const metadata of expandedLessons){
    const lesson=intermediate.find(item=>item.id===metadata.id);
    assert.ok(lesson?.story && lesson.application && lesson.mistake.fix);
    assert.equal(lesson.title,metadata.title);
    assert.equal(lesson.subtitle,metadata.subtitle);
    assert.deepEqual(lesson.tasks.map(task=>task.id),metadata.taskIds);
    assert.ok(lesson.tasks.every(task=>task.chapter===lesson.id && task.cases.length>=3));
    assert.ok(lesson.examples.every(example=>example.annotations.length>0));
    assert.ok(lesson.cheatSheet.length && lesson.interview.length && lesson.misconceptions.length);
    assert.ok(lesson.quiz.every(question=>question.answer>=0 && question.answer<question.options.length
      && question.options.length===new Set(question.options).size && question.explanation.length>20));
  }
  assert.equal(lessonNeighbors(catalog,12).next.id,13);
  assert.equal(lessonNeighbors(catalog,13).previous.id,12);
  assert.equal(lessonNeighbors(catalog,15).next,undefined);
  assert.deepEqual(lessonNeighbors(catalog,999),{});
});

test('New Python examples and repairs execute with verified results', () => {
  for(const lesson of intermediate){
    for(const example of lesson.examples){
      const result=python(example.code,example.input);
      assert.ok(!result.error,result.error);
      assert.ok(matchesOutput(result.output,example.output),example.title);
    }
    const repaired=python(lesson.mistake.fix);
    assert.ok(!repaired.error,repaired.error);
  }
});

test('Structured grading accepts reference and alternate implementations and rejects hardcoded output', () => {
  for(const task of expandedTasks){
    const asserts=task.cases.map(({name,check})=>`assert (${check}), ${JSON.stringify(name)}`).join('\n');
    const good=python(task.solution+'\n'+asserts);
    assert.ok(!good.error,good.error);
    const bad=python(task.starter+'\nprint("__PYTHON_LAB_PASS__")\n'+asserts);
    assert.ok(bad.error,task.id);
  }
  const alternative='def trim_labels(labels):\n    result = []\n    for label in labels:\n        result.append(label.strip())\n    return result';
  const checks=expandedTasks.find(task=>task.id==='trim-labels').cases.map(({check})=>`assert (${check})`).join('\n');
  assert.ok(!python(alternative+'\n'+checks).error);
});

test('Inventory report handles empty, malformed, negative and boolean data', () => {
  const report=projects.find(project=>project.id==='inventory-report');
  for(const [input,expected] of [['{}','Total: 0'],['[]','Invalid inventory'],['{broken}','Invalid inventory'],
    ['{"tea": -1}','Invalid inventory'],['{"tea": true}','Invalid inventory'],['{"z": 2, "a": 1}','a: 1\nz: 2\nTotal: 3']]){
    const result=python(report.solution,input);
    assert.ok(!result.error,result.error);
    assert.ok(matchesOutput(result.output,expected),input);
  }
});
