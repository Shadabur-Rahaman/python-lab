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

const {advancedModules} = await loadTs('../src/data/advancedPath.ts');
const {
  freshAdvancedProgress,
  loadAdvancedProgress,
  saveAdvancedProgress,
  ADVANCED_STORAGE_KEY,
} = await loadTs('../src/lib/advancedProgress.ts');
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

test('Advanced Path: Exactly 5 ordered modules with complete curriculum fields', () => {
  assert.equal(advancedModules.length, 5);
  const expectedIds = [
    'advanced-oop',
    'decorators-and-closures',
    'robust-python-exceptions',
    'data-structures-algorithms',
    'maintainable-code-testing',
  ];

  advancedModules.forEach((m, idx) => {
    assert.equal(m.id, expectedIds[idx]);
    assert.equal(m.moduleIndex, idx + 1);
    assert.ok(m.title.length > 5);
    assert.ok(m.subtitle.length > 10);
    assert.ok(m.estimatedMinutes >= 20);
    assert.ok(m.story.length > 50);
    assert.ok(m.objectives.length >= 4);
    assert.ok(m.concepts.length >= 4);
    assert.ok(m.visualExplanation.steps.length >= 3);
    assert.ok(m.visualizer && m.visualizer.type);
    assert.ok(m.mistake.code && m.mistake.fix && m.mistake.why);
    assert.ok(m.examples.length >= 1);
    assert.ok(m.cheatSheet.length >= 4);
    assert.ok(m.quiz.length >= 3);
  });
});

test('Advanced Path: Quizzes have valid options, single answer, and detailed explanations', () => {
  for (const m of advancedModules) {
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

test('Advanced Path: Three Core Practice Formats (Predict, Debug, Challenge) in every module', () => {
  for (const m of advancedModules) {
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
    assert.ok(m.task.id.startsWith('adv-'));
    assert.ok(m.task.starter.length > 10);
    assert.ok(m.task.solution.length > 10);
    assert.ok(m.task.tests && m.task.tests.length > 20);
    assert.equal(m.task.hints.length, 3);
  }
});

test('Advanced Path: Format A output predictions match real Python execution', () => {
  for (const m of advancedModules) {
    const res = python(m.activity.code);
    assert.ok(!res.error, `${m.id} Format A code error: ${res.error}`);
    assert.ok(
      matchesOutput(res.output, m.activity.answer),
      `${m.id} Format A output mismatch: ${JSON.stringify(res.output)} != ${JSON.stringify(m.activity.answer)}`
    );
  }
});

test('Advanced Path: Every module example executes and matches documented output in Python 3', () => {
  for (const m of advancedModules) {
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

test('Advanced Path: All 5 coding challenge reference solutions pass automated assertions', () => {
  for (const m of advancedModules) {
    const combined = `${m.task.solution}\n${m.task.tests}`;
    const res = python(combined, m.task.input || '');
    assert.ok(!res.error, `${m.task.id} solution failed assertion checks: ${res.error}`);
  }
});

test('Advanced Path: Starter code for challenges fails assertions (no hardcoded passes)', () => {
  for (const m of advancedModules) {
    const combined = `${m.task.starter}\n${m.task.tests}`;
    const res = python(combined, m.task.input || '');
    assert.ok(
      res.error && (
        res.error.includes('AssertionError') ||
        res.error.includes('NameError') ||
        res.error.includes('TypeError') ||
        res.error.includes('AttributeError') ||
        res.error.includes('NotImplementedError')
      ),
      `${m.task.id} starter should have failed tests but passed`
    );
  }
});

test('Advanced Path: Debugging activity repair scripts fix the broken behavior and broken scripts fail or differ', () => {
  for (const m of advancedModules) {
    const brokenRes = python(m.activity.broken);
    const repairRes = python(m.activity.repair);
    assert.ok(!repairRes.error, `${m.id} repair code threw error: ${repairRes.error}`);
    assert.ok(brokenRes.error || brokenRes.output !== repairRes.output, `${m.id} broken should differ from repair`);
  }
});

test('Advanced Progress: Storage round-trip, safe normalization, and separation from foundational data', () => {
  const memory = () => {
    const map = new Map();
    return {
      getItem: k => map.get(k) || null,
      setItem: (k, v) => map.set(k, v),
    };
  };

  const storage = memory();
  const init = loadAdvancedProgress(storage);
  assert.deepEqual(init, freshAdvancedProgress());

  const progress = {
    version: 1,
    completedModules: ['advanced-oop', 'decorators-and-closures'],
    solvedChallenges: ['adv-bank-account'],
    attemptedChallenges: ['adv-bank-account', 'adv-memoize-decorator'],
    quizScores: {'advanced-oop': 100, 'decorators-and-closures': 90},
    savedDrafts: {'adv-bank-account': '# draft code'},
    predictions: {'advanced-oop': '464'},
    debugSolved: ['advanced-oop'],
  };

  assert.ok(saveAdvancedProgress(progress, storage));
  const reloaded = loadAdvancedProgress(storage);
  assert.deepEqual(reloaded, progress);

  // Recovery from malformed storage
  storage.setItem(ADVANCED_STORAGE_KEY, 'invalid json');
  assert.deepEqual(loadAdvancedProgress(storage), freshAdvancedProgress());

  storage.setItem(ADVANCED_STORAGE_KEY, JSON.stringify({version: 99, completedModules: ['foo']}));
  assert.deepEqual(loadAdvancedProgress(storage), freshAdvancedProgress());
});
