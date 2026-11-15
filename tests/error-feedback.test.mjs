import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import esbuild from 'esbuild';

async function loadTs(relPath) {
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

const {explainError} = await loadTs('../src/lib/explainError.ts');
const {diagnoseMismatch, diagnoseError} = await loadTs('../src/components/CodeLab.tsx');

test('explainError provides beginner-friendly guidance for syntax and punctuation mistakes', () => {
  const colonErr = explainError("SyntaxError: expected ':'");
  assert.ok(colonErr.includes("expects a colon ':'"), 'Colon error tip missing');

  const unclosedQuote = explainError("SyntaxError: unterminated string literal (detected at line 1)");
  assert.ok(unclosedQuote.includes("opened quotation marks"), 'Unclosed quote tip missing');

  const unclosedBracket = explainError("SyntaxError: '(' was never closed");
  assert.ok(unclosedBracket.includes("was opened but never closed"), 'Unclosed parenthesis tip missing');

  const unmatchedParen = explainError("SyntaxError: unmatched ')'");
  assert.ok(unmatchedParen.includes("extra closing bracket"), 'Unmatched parenthesis tip missing');

  const badAssign = explainError("SyntaxError: cannot assign to expression");
  assert.ok(badAssign.includes("variable name must be on the left side"), 'Bad assignment tip missing');
});

test('explainError gives clear, actionable tips for runtime errors', () => {
  const zeroDiv = explainError("ZeroDivisionError: division by zero");
  assert.ok(zeroDiv.includes("cannot divide by zero"), 'Zero division tip missing');

  const nameErr = explainError("NameError: name 'Print' is not defined");
  assert.ok(nameErr.includes("case-sensitive") && nameErr.includes("Print"), 'NameError case-sensitivity tip missing');

  const indexErr = explainError("IndexError: list index out of range");
  assert.ok(indexErr.includes("start at 0"), 'IndexError tip missing');

  const keyErr = explainError("KeyError: 'phone'");
  assert.ok(keyErr.includes("key was not found"), 'KeyError tip missing');

  const valueErrInt = explainError("ValueError: invalid literal for int() with base 10: 'abc'");
  assert.ok(valueErrInt.includes("cannot be converted to a whole number"), 'ValueError int tip missing');

  const typeErrConcat = explainError("TypeError: can only concatenate str (not 'int') to str");
  assert.ok(typeErrConcat.includes("Cannot combine text and numbers"), 'TypeError concat tip missing');

  const notCallable = explainError("TypeError: 'str' object is not callable");
  assert.ok(notCallable.includes("used parentheses '()' on a value that is not a function"), 'Not callable tip missing');

  const indentExpected = explainError("IndentationError: expected an indented block after 'if' statement on line 1");
  assert.ok(indentExpected.includes("indented block (usually 4 spaces)"), 'Indented block expected tip missing');

  const unexpectedIndent = explainError("IndentationError: unexpected indent");
  assert.ok(unexpectedIndent.includes("extra spaces at the beginning"), 'Unexpected indent tip missing');

  const eofErr = explainError("EOFError: EOF when reading a line");
  assert.ok(eofErr.includes("Program Input"), 'EOFError tip missing');
});

test('diagnoseMismatch distinguishes empty output, casing, whitespace, and numeric formats', () => {
  const empty = diagnoseMismatch('', 'Hello');
  assert.ok(empty.includes('produced no output') && empty.includes('print()'), 'Empty output diagnostic');

  const casing = diagnoseMismatch('even\n', 'Even\n');
  assert.ok(casing.includes('letter casing') && casing.includes('case-sensitive'), 'Casing diagnostic');

  const whitespace = diagnoseMismatch('Total:150', 'Total: 150');
  assert.ok(whitespace.includes('spacing or line breaks differ'), 'Whitespace diagnostic');

  const numeric = diagnoseMismatch('400', '400.0');
  assert.ok(numeric.includes('matches the value') && numeric.includes('format'), 'Numeric float/int diagnostic');

  const mismatch = diagnoseMismatch('10', '20');
  assert.ok(mismatch.includes('Output differs'), 'General mismatch diagnostic');
});

test('diagnoseError categorizes error families with beginner-friendly feedback', () => {
  assert.ok(diagnoseError('SyntaxError: invalid syntax').includes('Syntax error detected'));
  assert.ok(diagnoseError("NameError: name 'totel' is not defined").includes('Name error detected'));
  assert.ok(diagnoseError('TypeError: unsupported operand').includes('Type error detected'));
  assert.ok(diagnoseError('IndexError: list index out of range').includes('Index error detected'));
  assert.ok(diagnoseError("KeyError: 'price'").includes('Key error detected'));
  assert.ok(diagnoseError('ValueError: invalid literal').includes('Value error detected'));
  assert.ok(diagnoseError('IndentationError: unexpected indent').includes('Indentation error detected'));
});
