import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import esbuild from 'esbuild';

async function loadTsBundle(relPath) {
  const filePath = fileURLToPath(new URL(relPath, import.meta.url));
  const res = esbuild.buildSync({
    entryPoints: [filePath],
    bundle: true,
    format: 'esm',
    write: false,
    platform: 'node',
  });
  return import('data:text/javascript;base64,' + Buffer.from(res.outputFiles[0].text).toString('base64'));
}

const { categories, syntaxTopics } = await loadTsBundle('../src/data/syntax/index.ts');
const { syntaxMeta } = await loadTsBundle('../src/data/syntax/aliases.ts');
const { searchSyntaxTopics, popularSearches } = await loadTsBundle('../src/data/syntax/search.ts');

test('Syntax Academy has all 30 topics across 13 categories', () => {
  assert.equal(Object.keys(categories).length, 13);
  assert.equal(syntaxTopics.length, 30);
  assert.equal(new Set(syntaxTopics.map(t => t.id)).size, 30);
  for (const t of syntaxTopics) {
    assert.ok(t.id, 'Topic missing id');
    assert.ok(t.title, `Topic ${t.id} missing title`);
    assert.ok(t.format, `Topic ${t.id} missing format`);
    assert.ok(t.definition, `Topic ${t.id} missing definition`);
    assert.ok(t.code, `Topic ${t.id} missing code`);
    assert.ok(t.output, `Topic ${t.id} missing output`);
    assert.ok(t.pitfall, `Topic ${t.id} missing pitfall`);
    assert.ok(t.correction, `Topic ${t.id} missing correction`);
    assert.ok(typeof t.lesson === 'number' && t.lesson >= 0 && t.lesson <= 15, `Topic ${t.id} lesson invalid`);
    assert.ok(t.category in categories, `Topic ${t.id} category invalid`);
  }
});

test('Every topic has complete aliases, Hinglish memory hints, and real-world metadata', () => {
  assert.equal(Object.keys(syntaxMeta).length, 30);
  for (const t of syntaxTopics) {
    const meta = syntaxMeta[t.id];
    assert.ok(meta, `Topic ${t.id} missing from syntaxMeta`);
    assert.ok(Array.isArray(meta.aliases) && meta.aliases.length >= 2, `Topic ${t.id} aliases insufficient`);
    assert.ok(meta.memory && meta.memory.length > 5, `Topic ${t.id} memory hint missing or too short`);
    assert.ok(meta.realWorld && meta.realWorld.length > 5, `Topic ${t.id} realWorld missing`);
  }
});

test('Beginner plain-language queries match the right syntax entries', () => {
  // 1. "repeat code" -> loops
  const repeatResults = searchSyntaxTopics(syntaxTopics, 'repeat code');
  assert.ok(repeatResults.length > 0, 'No results for repeat code');
  assert.ok(repeatResults.some(t => t.id === 'loops'), 'Should find loops for repeat code');

  // 2. "add item to list" -> displays (covers lists, append, collections)
  const addListResults = searchSyntaxTopics(syntaxTopics, 'add item to list');
  assert.ok(addListResults.length > 0, 'No results for add item to list');
  assert.ok(addListResults.some(t => t.id === 'displays'), 'Should find displays for add item to list');

  // 3. "remove spaces" -> strings (covers strip, clean text)
  const removeSpacesResults = searchSyntaxTopics(syntaxTopics, 'remove spaces');
  assert.ok(removeSpacesResults.length > 0, 'No results for remove spaces');
  assert.ok(removeSpacesResults.some(t => t.id === 'strings'), 'Should find strings for remove spaces');

  // 4. "convert string to number" -> constructors / input-output
  const convertNumberResults = searchSyntaxTopics(syntaxTopics, 'convert string to number');
  assert.ok(convertNumberResults.length > 0, 'No results for convert string to number');
  assert.ok(convertNumberResults.some(t => t.id === 'constructors' || t.id === 'input-output'), 'Should find constructors/input-output for convert string to number');

  // 5. "check condition" -> conditions
  const conditionResults = searchSyntaxTopics(syntaxTopics, 'check condition');
  assert.ok(conditionResults.length > 0, 'No results for check condition');
  assert.ok(conditionResults.some(t => t.id === 'conditions'), 'Should find conditions for check condition');

  // 6. "find unique items" -> displays (sets)
  const uniqueResults = searchSyntaxTopics(syntaxTopics, 'find unique items');
  assert.ok(uniqueResults.length > 0, 'No results for find unique items');
  assert.ok(uniqueResults.some(t => t.id === 'displays'), 'Should find displays for find unique items');

  // 7. "read json file" -> data
  const jsonResults = searchSyntaxTopics(syntaxTopics, 'read json file');
  assert.ok(jsonResults.length > 0, 'No results for read json file');
  assert.ok(jsonResults.some(t => t.id === 'data'), 'Should find data for read json file');
});

test('Popular queries list is present and matches relevant topics', () => {
  assert.ok(popularSearches.length >= 6);
  for (const q of popularSearches) {
    const results = searchSyntaxTopics(syntaxTopics, q);
    assert.ok(results.length > 0, `Popular query "${q}" returned 0 results`);
  }
});

const harness = `import json, sys, io, contextlib, traceback
payload = json.loads(sys.stdin.read())
input_data = payload.get('input', '')
code = payload.get('code', '')
answers = iter(input_data.splitlines())
def queued_input(prompt=''):
    print(prompt, end='')
    try: return next(answers)
    except StopIteration: raise EOFError('Input queue is empty')
import builtins
builtins.input = queued_input
out = io.StringIO()

# Patch asyncio to avoid Windows loopback socket hangs in restricted sandbox environments
try:
    import asyncio.proactor_events
    def dummy_make_self_pipe(self):
        class DummySocket:
            def fileno(self): return -1
            def setblocking(self, b): pass
            def close(self): pass
        self._ssock = DummySocket()
        self._csock = DummySocket()
        self._internal_fds += 1
    asyncio.proactor_events.BaseProactorEventLoop._make_self_pipe = dummy_make_self_pipe
    def dummy_close_self_pipe(self):
        self._internal_fds -= 1
    asyncio.proactor_events.BaseProactorEventLoop._close_self_pipe = dummy_close_self_pipe
    asyncio.proactor_events.BaseProactorEventLoop._loop_self_reading = lambda self, f=None: None
except Exception:
    pass

try:
    with contextlib.redirect_stdout(out):
        lines = code.splitlines()
        transformed = []
        for line in lines:
            if line.startswith('await '):
                transformed.append("asyncio.run(" + line[6:].strip() + ")")
            else:
                transformed.append(line)
        exec(chr(10).join(transformed), {'__name__': '__main__'})
    print(json.dumps({'output': out.getvalue()}))
except Exception:
    print(json.dumps({'error': traceback.format_exc(), 'output': out.getvalue()}))
`;

function python(code, input = '') {
  const result = spawnSync('python', ['-X', 'utf8', '-c', harness], {
    input: JSON.stringify({ code, input }),
    encoding: 'utf8',
    timeout: 5000,
    windowsHide: true
  });
  assert.equal(result.status, 0, result.stderr || String(result.error));
  return JSON.parse(result.stdout);
}

function normalizeOutput(str) {
  return str.replace(/\r\n/g, '\n').trim();
}

test('All 30 syntax examples execute valid Python and match documented output', () => {
  for (const t of syntaxTopics) {
    const res = python(t.code, t.input || '');
    assert.ok(!res.error, `Topic ${t.id} threw error:\n${res.error}\nCode:\n${t.code}`);
    assert.equal(normalizeOutput(res.output), normalizeOutput(t.output), `Topic ${t.id} output mismatch:\nExpected: ${JSON.stringify(t.output)}\nGot: ${JSON.stringify(res.output)}`);
  }
});
