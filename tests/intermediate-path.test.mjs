import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import ts from 'typescript';

async function loadTs(path) {
  const result = ts.transpileModule(fs.readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022},
  });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputText).toString('base64'));
}

const {intermediateModules, studentMarksAnalyzerProject} = await loadTs('../src/data/intermediatePath.ts');
const {freshIntermediateProgress, loadIntermediateProgress, saveIntermediateProgress, INTERMEDIATE_STORAGE_KEY} = await loadTs('../src/lib/intermediateProgress.ts');
const {scoreQuiz, matchesOutput} = await import('../src/lib/progress.mjs');

const harness = `import json, sys, io, contextlib, builtins, traceback
payload = json.loads(sys.stdin.read())
answers = iter(payload.get('input', '').splitlines())
def queued_input(prompt=''):
    print(prompt, end='')
    try: return next(answers)
    except StopIteration: raise EOFError('Input queue is empty')
builtins.input = queued_input
out = io.StringIO()
try:
    with contextlib.redirect_stdout(out): exec(payload['code'], {})
    print(json.dumps({'output': out.getvalue()}))
except Exception:
    print(json.dumps({'error': traceback.format_exc(), 'output': out.getvalue()}))
`;

function python(code, input = '') {
  const result = spawnSync('python', ['-X', 'utf8', '-c', harness], {
    input: JSON.stringify({code, input}),
    encoding: 'utf8',
    timeout: 10000,
    windowsHide: true,
  });
  assert.equal(result.status, 0, result.stderr || String(result.error));
  return JSON.parse(result.stdout);
}

test('Intermediate Path: Exactly 5 ordered modules with complete curriculum fields', () => {
  assert.equal(intermediateModules.length, 5);
  const expectedIds = [
    'modules-and-stdlib',
    'better-functions',
    'iterators-and-generators',
    'csv-structured-data',
    'testing-and-debugging',
  ];

  intermediateModules.forEach((m, idx) => {
    assert.equal(m.id, expectedIds[idx]);
    assert.equal(m.moduleIndex, idx + 1);
    assert.ok(m.title.length > 5);
    assert.ok(m.subtitle.length > 10);
    assert.ok(m.estimatedMinutes >= 15);
    assert.ok(m.story.length > 50);
    assert.ok(m.objectives.length >= 3);
    assert.ok(m.concepts.length >= 4);
    assert.ok(m.visualExplanation.steps.length >= 3);
    assert.ok(m.mistake.code && m.mistake.fix && m.mistake.why);
    assert.ok(m.examples.length >= 1);
    assert.ok(m.cheatSheet.length >= 3);
    assert.ok(m.quiz.length >= 3);
  });
});

test('Intermediate Path: Quizzes have valid options, single answer, and detailed explanations', () => {
  for (const m of intermediateModules) {
    for (const q of m.quiz) {
      assert.ok(q.prompt.length > 10);
      assert.equal(q.options.length, 4);
      assert.ok(q.answer >= 0 && q.answer < 4);
      assert.ok(q.explanation.length > 15);
    }
    // Perfect score test
    const allCorrect = m.quiz.map(q => q.answer);
    assert.equal(scoreQuiz(m.quiz, allCorrect), 100);
    // Wrong score test
    const allWrong = m.quiz.map(q => (q.answer + 1) % 4);
    assert.equal(scoreQuiz(m.quiz, allWrong), 0);
  }
});

test('Intermediate Path: Three Core Practice Formats (Predict, Debug, Challenge) in every module', () => {
  for (const m of intermediateModules) {
    // Format A: Predict
    assert.ok(m.activity.code.length > 10);
    assert.ok(m.activity.answer.length > 0);
    assert.ok(m.activity.prediction.length > 5);
    assert.ok(m.activity.reason.length > 10);

    // Format B: Debug
    assert.ok(m.activity.broken.length > 10);
    assert.ok(m.activity.repair.length > 10);
    assert.ok(m.activity.hint.length > 5);

    // Format C: Challenge
    assert.ok(m.task.id.startsWith('int-'));
    assert.ok(m.task.starter.length > 10);
    assert.ok(m.task.solution.length > 10);
    assert.ok(m.task.cases && m.task.cases.length >= 3);
    assert.equal(m.task.hints.length, 3);
  }
});

test('Intermediate Path: Format A output predictions match real Python execution', () => {
  for (const m of intermediateModules) {
    const res = python(m.activity.code);
    assert.ok(!res.error, `${m.id} Format A code error: ${res.error}`);
    assert.ok(
      matchesOutput(res.output, m.activity.answer),
      `${m.id} Format A output mismatch: ${JSON.stringify(res.output)} != ${JSON.stringify(m.activity.answer)}`
    );
  }
});

test('Intermediate Path: Every module example executes and matches documented output in Python 3', () => {
  for (const m of intermediateModules) {
    for (const ex of m.examples) {
      const res = python(ex.code, ex.input || '');
      assert.ok(!res.error, `${m.id} example failed: ${res.error}`);
      assert.ok(
        matchesOutput(res.output, ex.output),
        `${m.id} ${ex.title}: output mismatch: ${JSON.stringify(res.output)} != ${JSON.stringify(ex.output)}`
      );
    }
  }
});

test('Intermediate Path: All 5 coding challenge reference solutions pass automated assertions', () => {
  for (const m of intermediateModules) {
    const checks = m.task.cases?.map(c => `assert ${c.check}, ${JSON.stringify(c.name)}`).join('\n') || m.task.tests || '';
    const combined = `${m.task.solution}\n${checks}`;
    const res = python(combined, m.task.input || '');
    assert.ok(!res.error, `${m.task.id} solution failed assertion checks: ${res.error}`);
  }
});

test('Intermediate Path: Starter code for challenges fails assertions (no hardcoded passes)', () => {
  for (const m of intermediateModules) {
    const checks = m.task.cases?.map(c => `assert ${c.check}, ${JSON.stringify(c.name)}`).join('\n') || m.task.tests || '';
    const combined = `${m.task.starter}\n${checks}`;
    const res = python(combined, m.task.input || '');
    assert.ok(
      res.error && (res.error.includes('AssertionError') || res.error.includes('NameError') || res.error.includes('TypeError') || res.error.includes('NotImplementedError')),
      `${m.task.id} starter should have failed tests but passed`
    );
  }
});

test('Intermediate Path: Debugging activity repair scripts fix the broken behavior and broken scripts fail or differ', () => {
  for (const m of intermediateModules) {
    const brokenRes = python(m.activity.broken);
    const repairRes = python(m.activity.repair);
    assert.ok(!repairRes.error, `${m.id} repair code threw error: ${repairRes.error}`);
    assert.ok(brokenRes.error || brokenRes.output !== repairRes.output, `${m.id} broken should differ from repair`);
  }
});

test('Intermediate Path: Capstone Project "Student Marks Analyzer" reference solution passes all assertions', () => {
  assert.ok(studentMarksAnalyzerProject.title.includes('Student Marks Analyzer'));
  assert.ok(studentMarksAnalyzerProject.requirements.length >= 4);
  assert.ok(studentMarksAnalyzerProject.steps.length >= 4);
  assert.ok(studentMarksAnalyzerProject.tests.length >= 4);

  // Execute full reference script with print output
  const res = python(studentMarksAnalyzerProject.solution);
  assert.ok(!res.error, `Capstone reference solution error: ${res.error}`);
  assert.ok(
    matchesOutput(res.output, studentMarksAnalyzerProject.output),
    `Capstone output mismatch: ${res.output} != ${studentMarksAnalyzerProject.output}`
  );
});

test('Intermediate Progress: Storage round-trip, safe normalization, and separation from V2 foundation', () => {
  const memory = () => {
    const map = new Map();
    return {
      getItem: k => map.get(k) || null,
      setItem: (k, v) => map.set(k, v),
    };
  };

  const storage = memory();
  const init = loadIntermediateProgress(storage);
  assert.deepEqual(init, freshIntermediateProgress());

  const progress = {
    version: 1,
    completedModules: ['modules-and-stdlib', 'better-functions'],
    solvedChallenges: ['m1-challenge'],
    attemptedChallenges: ['m1-challenge', 'm2-challenge'],
    quizScores: {'modules-and-stdlib': 100, 'better-functions': 80},
    capstoneCompleted: true,
  };

  assert.ok(saveIntermediateProgress(progress, storage));
  const reloaded = loadIntermediateProgress(storage);
  assert.deepEqual(reloaded, progress);

  // Recovery from malformed storage
  storage.setItem(INTERMEDIATE_STORAGE_KEY, 'invalid json');
  assert.deepEqual(loadIntermediateProgress(storage), freshIntermediateProgress());

  storage.setItem(INTERMEDIATE_STORAGE_KEY, JSON.stringify({version: 99, completedModules: ['foo']}));
  assert.deepEqual(loadIntermediateProgress(storage), freshIntermediateProgress());
});
