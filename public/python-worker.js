const distribution = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
let runtime;

self.onmessage = async ({data}) => {
  const send = (kind, text, details = {}) => self.postMessage({kind, text, ...details});
  try {
    if (!runtime) {
      send('status', 'Loading Python — the first download may take a moment…');
      importScripts(distribution + 'pyodide.js');
      runtime = await loadPyodide({indexURL: distribution});
    }
  } catch {
    send('error', 'Python could not download. Check your network connection, then try again.');
    return;
  }

  send('status', 'Running Python…');
  let outputLength = 0;
  let limitReached = false;
  function emit(kind, text) {
    outputLength += text.length + 1;
    if (outputLength > 60_000) {
      limitReached = true;
      throw new Error('Output limit reached. Try fewer repetitions.');
    }
    send(kind, text + '\n');
  }

  try {
    runtime.setStdout({batched: text => emit('stdout', text)});
    runtime.setStderr({batched: text => emit('stderr', text)});
    const inputs = data.input ? data.input.replace(/\r/g, '').split('\n') : [];
    runtime.setStdin({stdin: () => inputs.length ? inputs.shift() : null});
    const globals = runtime.toPy({__name__: '__main__'});
    const run = async code => {
      const result = await runtime.runPythonAsync(code, {globals});
      if (limitReached) throw new Error('Output limit reached. Try fewer repetitions.');
      return result;
    };
    try {
      const result = await run(data.code);
      result?.destroy?.();
      const cases = [];
      if (data.tests) {
        try {
          const result = await run(data.tests);
          result?.destroy?.();
          cases.push({name: 'Assertion suite', passed: true});
        } catch (error) {
          cases.push({name: 'Assertion suite', passed: false, detail: String(error.message || error)});
        }
      }
      for (const {name, check} of data.cases || []) {
        try {
          const result = await run(`bool(${check})`);
          cases.push({name, passed: result === true});
          result?.destroy?.();
        } catch (error) {
          cases.push({name, passed: false, detail: String(error.message || error).trim().split('\n').at(-1)});
        }
      }
      if (limitReached) throw new Error('Output limit reached. Try fewer repetitions.');
      send('done', '', {cases});
    } finally {
      globals.destroy();
    }
  } catch (error) {
    send('error', limitReached ? 'Output limit reached. Try fewer repetitions.' : String(error.message || error));
  }
};
