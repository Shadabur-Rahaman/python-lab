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

const {DSA_TOPICS, DSA_MODULES, DSA_PROBLEMS} = await loadTs('../src/data/dsaArenaData.ts');
const {
  defaultDsaProgress,
  loadDsaProgress,
  saveDsaProgress,
  DSA_STORAGE_KEY,
} = await loadTs('../src/lib/dsaArenaProgress.ts');

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

test('DSA Arena: Exactly 6 distinct topics with valid metadata', () => {
  assert.equal(DSA_TOPICS.length, 6);
  const topicIds = new Set(DSA_TOPICS.map(t => t.id));
  assert.equal(topicIds.size, 6);
  for (const topic of DSA_TOPICS) {
    assert.ok(topic.name.length > 0);
    assert.ok(topic.tagline.length > 0);
    assert.ok(topic.color.startsWith('#'));
    assert.ok(topic.iconName.length > 0);
  }
});

test('DSA Arena: Exactly 5 structured concept modules', () => {
  assert.equal(DSA_MODULES.length, 5);
  DSA_MODULES.forEach((mod, idx) => {
    assert.equal(mod.moduleIndex, idx + 1);
    assert.ok(mod.id.startsWith('dsa-'));
    assert.ok(mod.title.length > 0);
    assert.ok(mod.subtitle.length > 0);
    assert.ok(mod.story.length > 0);
    assert.ok(mod.objectives.length >= 3);
    assert.ok(mod.concepts.length >= 3);
    assert.ok(mod.codeWalkthrough.code.length > 0);
    assert.ok(mod.mistake.code.length > 0);
    assert.ok(mod.mistake.fix.length > 0);
    assert.ok(mod.cheatSheet.length >= 3);
  });
});

test('DSA Arena: Module walkthroughs run cleanly in Python', () => {
  for (const mod of DSA_MODULES) {
    const res = python(mod.codeWalkthrough.code);
    assert.ok(!res.error, `Module ${mod.id} walkthrough failed: ${res.error}`);
    assert.ok(res.output.length > 0, `Module ${mod.id} produced empty output`);
  }
});

test('DSA Arena: Exactly 24 curated problems covering all topics and difficulties', () => {
  assert.equal(DSA_PROBLEMS.length, 24);
  const problemIds = new Set(DSA_PROBLEMS.map(p => p.id));
  assert.equal(problemIds.size, 24, 'All problem IDs must be unique');

  const topicCount = {};
  const diffCount = {};

  for (const p of DSA_PROBLEMS) {
    assert.ok(p.title.length > 0);
    assert.ok(['Beginner', 'Intermediate', 'Advanced'].includes(p.difficulty));
    assert.ok(p.prompt.length > 0);
    assert.ok(p.examples.length >= 1);
    assert.ok(p.constraints.length >= 1);
    assert.ok(p.starterCode.length > 0);
    assert.ok(p.solutionCode.length > 0);
    assert.ok(p.cases.length >= 2, `Problem ${p.id} must have at least 2 test cases`);
    assert.ok(p.hints.length >= 3, `Problem ${p.id} must have at least 3 progressive hints`);
    assert.ok(p.approaches.length >= 1, `Problem ${p.id} must have complexity approaches`);
    assert.ok(p.explanation.length > 0);

    topicCount[p.topic] = (topicCount[p.topic] || 0) + 1;
    diffCount[p.difficulty] = (diffCount[p.difficulty] || 0) + 1;
  }

  // Exactly 4 problems per topic
  for (const topic of DSA_TOPICS) {
    assert.equal(topicCount[topic.id], 4, `Topic ${topic.id} should have exactly 4 problems`);
  }

  // Check difficulties distribution
  assert.ok(diffCount['Beginner'] >= 6, 'Should have at least 6 Beginner problems');
  assert.ok(diffCount['Intermediate'] >= 8, 'Should have at least 8 Intermediate problems');
  assert.ok(diffCount['Advanced'] >= 5, 'Should have at least 5 Advanced problems');
});

test('DSA Arena: Python reference solutions pass 100% of test cases', () => {
  for (const problem of DSA_PROBLEMS) {
    for (const testCase of problem.cases) {
      const runnerCode = `
${problem.solutionCode}

# Assertion for case: ${testCase.name}
assert bool(${testCase.check}), "Failed check: ${testCase.name}"
`;
      const res = python(runnerCode);
      assert.ok(
        !res.error,
        `Problem ${problem.id} failed case '${testCase.name}':\nCheck: ${testCase.check}\nError: ${res.error}`
      );
    }
  }
});

test('DSA Arena: Starter code parses as valid Python without SyntaxError', () => {
  for (const problem of DSA_PROBLEMS) {
    const res = python(problem.starterCode);
    assert.ok(
      !res.error || !res.error.includes('SyntaxError'),
      `Problem ${problem.id} starter code has SyntaxError: ${res.error}`
    );
  }
});

test('DSA Arena Progress: Isolated LocalStorage schema and state transitions', () => {
  assert.equal(DSA_STORAGE_KEY, 'python-lab.dsa-arena.v1');
  const initial = defaultDsaProgress();
  assert.equal(initial.version, 1);
  assert.deepEqual(initial.solvedProblems, []);
  assert.deepEqual(initial.attemptedProblems, []);
  assert.deepEqual(initial.completedModules, []);
  assert.deepEqual(initial.savedDrafts, {});
});
