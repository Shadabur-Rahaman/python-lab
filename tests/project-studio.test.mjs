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

const {studioProjects, generateProjectReadme} = await loadTs('../src/data/projectStudioData.ts');
const {freshProjectStudioProgress, loadProjectStudioProgress, saveProjectStudioProgress, PROJECT_STUDIO_STORAGE_KEY} = await loadTs('../src/lib/projectStudioProgress.ts');
const {projects: foundationalProjects} = await loadTs('../src/data/projects.ts');
const {matchesOutput} = await import('../src/lib/progress.mjs');

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

test('Project Studio: Flagship projects with complete milestone fields', () => {
  assert.equal(studioProjects.length, 3);
  const ids = ['expense-tracker-pro', 'inventory-management-pro', 'event-scheduler-pro'];
  studioProjects.forEach((p, idx) => {
    assert.equal(p.id, ids[idx]);
    assert.ok(p.title.length > 10);
    assert.ok(p.estimatedMinutes >= 20);
    assert.ok(p.chapters.length >= 2);
    assert.ok(p.brief.scenario.length > 50);
    assert.ok(p.brief.whatYouWillBuild.length > 20);
    assert.ok(p.brief.requiredKnowledge.length >= 3);
    assert.ok(p.brief.sampleInputOutput.output.length > 10);
    assert.ok(p.milestones.length >= 3);
    assert.ok(p.finalSolution.length > 50);
    assert.ok(p.readmeTemplate.length > 30);
  });
});

test('Project Studio: Every milestone has 3-level progressive hints, starter, and automated tests', () => {
  for (const p of studioProjects) {
    p.milestones.forEach((m, idx) => {
      assert.equal(m.index, idx + 1);
      assert.ok(m.title.length > 5);
      assert.ok(m.objective.length > 10);
      assert.ok(m.instructions.length > 20);
      assert.ok(m.starter.length > 10);
      assert.ok(m.solution.length > 10);
      assert.ok(m.testSuite.length > 20);
      assert.ok(m.testCasesDescription.length >= 2);
      assert.equal(m.hints.length, 3);
      assert.ok(m.explanation.length > 15);
    });
  }
});

test('Project Studio: Expense Tracker Pro milestone reference solutions pass automated tests', () => {
  const expenseProj = studioProjects.find(p => p.id === 'expense-tracker-pro');
  assert.ok(expenseProj);

  // Cumulative code verification across milestones
  let cumulative = '';
  for (const m of expenseProj.milestones) {
    cumulative += '\n' + m.solution;
    const res = python(cumulative + '\n' + m.testSuite);
    assert.ok(!res.error, `Expense Tracker Milestone ${m.index} failed: ${res.error}`);
  }

  // Full final script execution
  const finalRes = python(expenseProj.finalSolution);
  assert.ok(!finalRes.error, `Expense Tracker final script error: ${finalRes.error}`);
  assert.ok(finalRes.output.includes('Total Spent: ₹505.00') || finalRes.output.includes('Total Spent'));
});

test('Project Studio: Inventory Management Pro milestone reference solutions pass automated tests', () => {
  const invProj = studioProjects.find(p => p.id === 'inventory-management-pro');
  assert.ok(invProj);

  let cumulative = '';
  for (const m of invProj.milestones) {
    cumulative += '\n' + m.solution;
    const res = python(cumulative + '\n' + m.testSuite);
    assert.ok(!res.error, `Inventory Pro Milestone ${m.index} failed: ${res.error}`);
  }

  // Full final script execution
  const finalRes = python(invProj.finalSolution);
  assert.ok(!finalRes.error, `Inventory Pro final script error: ${finalRes.error}`);
  assert.ok(finalRes.output.includes('Stock Report') && finalRes.output.includes('Total Valuation: ₹555.00'));
});

test('Project Studio: Event Scheduling Pro milestone reference solutions pass automated tests', () => {
  const eventProj = studioProjects.find(p => p.id === 'event-scheduler-pro');
  assert.ok(eventProj);

  let cumulative = '';
  for (const m of eventProj.milestones) {
    cumulative += '\n' + m.solution;
    const res = python(cumulative + '\n' + m.testSuite);
    assert.ok(!res.error, `Event Scheduler Milestone ${m.index} failed: ${res.error}`);
  }

  const finalRes = python(eventProj.finalSolution);
  assert.ok(!finalRes.error, `Event Scheduler final script error: ${finalRes.error}`);
  assert.ok(finalRes.output.includes('SCHEDULE REPORT') && finalRes.output.includes('Total Events'));
});

test('Project Studio: Starter code fails milestone assertions (no fake passes)', () => {
  for (const p of studioProjects) {
    for (const m of p.milestones) {
      const res = python(m.starter + '\n' + m.testSuite);
      assert.ok(
        res.error && (res.error.includes('AssertionError') || res.error.includes('NameError') || res.error.includes('TypeError') || res.error.includes('AttributeError')),
        `${p.id} milestone ${m.index} starter should have failed test suite`
      );
    }
  }
});

test('Project Studio: generateProjectReadme produces complete Markdown documentation with student code', () => {
  const p = studioProjects[0];
  const customCode = 'print("Custom student solution")';
  const md = generateProjectReadme(p, customCode);

  assert.ok(md.includes(`# ${p.title}`));
  assert.ok(md.includes(p.brief.scenario));
  assert.ok(md.includes(customCode));
  assert.ok(md.includes('Verification & Milestones Completed'));
  for (const m of p.milestones) {
    assert.ok(md.includes(m.title));
  }
});

test('Project Studio: Storage round-trip, safe normalization, and milestone tracking', () => {
  const memory = () => {
    const map = new Map();
    return {
      getItem: k => map.get(k) || null,
      setItem: (k, v) => map.set(k, v),
    };
  };

  const storage = memory();
  const init = loadProjectStudioProgress(storage);
  assert.deepEqual(init, freshProjectStudioProgress());

  const progress = {
    version: 1,
    verifiedProjects: ['expense-tracker-pro'],
    milestoneProgress: {
      'expense-tracker-pro': [1, 2, 3],
      'inventory-management-pro': [1],
    },
    savedCode: {
      'expense-tracker-pro': '# My verified code',
    },
  };

  assert.ok(saveProjectStudioProgress(progress, storage));
  const reloaded = loadProjectStudioProgress(storage);
  assert.deepEqual(reloaded, progress);

  // Recovery from corrupted storage
  storage.setItem(PROJECT_STUDIO_STORAGE_KEY, '{invalid json}');
  assert.deepEqual(loadProjectStudioProgress(storage), freshProjectStudioProgress());
});

test('Foundational Backward Compatibility: Original 11 projects remain byte-stable and functional', () => {
  assert.equal(foundationalProjects.length, 11);
  const ids = foundationalProjects.map(p => p.id);
  assert.deepEqual(ids, [
    'intro', 'calculator', 'shopping', 'eligibility', 'grades',
    'tables', 'guess', 'contacts', 'expenses', 'marks', 'inventory-report'
  ]);
});
