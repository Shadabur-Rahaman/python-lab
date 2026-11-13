import {storage} from '../lib/storage';
import {Component, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode} from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import {Play, Square, RotateCcw, Copy, Trash2, CheckCircle2} from 'lucide-react';
import type {TestCase} from '../data/types';
import {matchesOutput} from '../lib/progress.mjs';
import Snippets from './Snippets';

class EditorFallback extends Component<{children: ReactNode; code: string; setCode: (code: string) => void}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  render() {
    return this.state.failed
      ? <textarea aria-label="Python code" className="fallback-editor" value={this.props.code}
          onChange={event => this.props.setCode(event.target.value)}/>
      : this.props.children;
  }
}

type Result = {name: string; passed: boolean; detail?: string};
type Message = {kind: 'status' | 'stdout' | 'stderr' | 'error' | 'done'; text: string; cases?: Result[]};
type Props = {
  initial: string; input?: string; expected?: string; tests?: string; cases?: TestCase[];
  onPass?: () => void; onRun?: () => void; label?: string; persist?: boolean; draftId?: string; workspace?: boolean; onCodeChange?: (code: string) => void;
};

function explainError(error: string) {
  if (/IndentationError|TabError/.test(error)) return 'Check the leading spaces on the indicated line and the lines around it.';
  if (error.includes('SyntaxError')) return 'Look at the indicated line and the line above it. Check for missing punctuation, brackets or quotes.';
  if (error.includes('NameError')) return 'Check that the name is spelled correctly and has been defined before this line runs.';
  if (error.includes('EOFError')) return 'Add one queued response for each input() call, then run again.';
  if (error.includes('TypeError')) return 'Check the types of the values supplied to the operation or function.';
  return '';
}

export default function CodeLab({
  initial, input = '', expected, tests, cases, onPass, onRun, label = 'Python editor', persist = false, draftId, workspace = false, onCodeChange,
}: Props) {
  const editorId = useId();
  const draftKey = draftId || persist ? 'python-lab.editor.v1:' + (draftId ?? label) : null;
  const [draft,setDraft] = useState(() => {
    if (draftKey) {
      try {
        const saved = JSON.parse(storage.getItem(draftKey) ?? 'null');
        if (typeof saved?.code === 'string' && typeof saved?.input === 'string') return {code:saved.code as string,input:saved.input as string,saved:true};
      } catch { /* A corrupt draft falls back to the starter. */ }
    }
    return {code:initial,input,saved:false};
  });
  const {code,input:queue} = draft;
  const [saveFailed,setSaveFailed] = useState(false);

  function saveDraft(code:string, input:string) {
    let saved = false;
    if (draftKey) {
      try { storage.setItem(draftKey,JSON.stringify({code,input})); saved = true; }
      catch { setSaveFailed(true); }
    }
    if (saved) setSaveFailed(false);
    setDraft({code,input,saved});
  }
  const [stdout, setStdout] = useState('');
  const [stderr, setStderr] = useState('');
  const [exception, setException] = useState('');
  const [status, setStatus] = useState('Ready when you are');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const worker = useRef<Worker | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = useRef(false);

  function finish() {
    if (timer.current) clearTimeout(timer.current);
    active.current = false;
    setBusy(false);
  }

  function stop(message = 'Stopped. Python will restart on the next run.') {
    worker.current?.terminate();
    worker.current = null;
    finish();
    setStatus(message);
  }

  useEffect(() => () => {
    worker.current?.terminate();
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function update(value: string) {
    saveDraft(value,queue);
    onCodeChange?.(value);
  }

  function clearOutput() {
    setStdout('');
    setStderr('');
    setException('');
    setResults([]);
    setFeedback('');
  }

  function run(check = false) {
    if (active.current) return;
    active.current = true;
    setBusy(true);
    setStatus('Starting Python…');
    clearOutput();
    let actual = '';
    try {
      const current = worker.current ?? new Worker(`${import.meta.env.BASE_URL}python-worker.js`);
      worker.current = current;
      current.onerror = () => stop('Python could not start. Check your connection and try again.');
      current.onmessage = ({data}: MessageEvent<Message>) => {
        switch (data.kind) {
          case 'status':
            setStatus(data.text);
            if (data.text === 'Running Python…') {
              if (timer.current) clearTimeout(timer.current);
              timer.current = setTimeout(() => stop('Stopped after 12 seconds. Check your loop condition, then run again.'), 12_000);
            }
            break;
          case 'stdout':
            actual += data.text;
            setStdout(actual);
            break;
          case 'stderr':
            setStderr(previous => previous + data.text);
            break;
          case 'error':
            finish();
            setStatus('Execution did not finish');
            setException(data.text);
            if (check) setFeedback('Fix the error before checking your answer again.');
            break;
          case 'done': {
            finish();
            setStatus('Finished');
            onRun?.();
            if (!check) break;
            const checks = data.cases ?? [];
            const passedCount = checks.filter(result => result.passed).length;
            const hasTests = Boolean(tests || cases?.length);
            const passed = hasTests
              ? checks.length === (tests ? 1 : 0) + (cases?.length ?? 0) && passedCount === checks.length
              : matchesOutput(actual, expected ?? '');
            setResults(checks);
            if (passed) {
              setFeedback('All checks passed.');
              onPass?.();
            } else if (hasTests) {
              setFeedback(`${passedCount} passed · ${checks.length - passedCount} failed. Review the cases below.`);
            } else {
              setFeedback('Output differs. Compare your output with the expected result.');
            }
            break;
          }
        }
      };
      timer.current = setTimeout(() => stop('Python download timed out. Check your connection and try again.'), 90_000);
      current.postMessage({code, input: queue, tests: check ? tests : undefined, cases: check ? cases : undefined});
    } catch (error) {
      stop('Unable to start Python');
      setException(String(error));
    }
  }

  function editorKeys(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Enter' || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    const editor = event.target;
    if (!(editor instanceof HTMLTextAreaElement)) return;
    const {selectionStart, selectionEnd} = editor;
    const line = code.slice(0, selectionStart).split('\n').at(-1) ?? '';
    if (!line.trimEnd().endsWith(':')) return;
    event.preventDefault();
    const indentation = /^\s*/.exec(line)?.[0] ?? '';
    // Keep the editor's normal input and undo history when inserting indentation.
    editor.setSelectionRange(selectionStart, selectionEnd);
    if (!document.execCommand('insertText', false, '\n' + indentation + '    ')) {
      update(code.slice(0, selectionStart) + '\n' + indentation + '    ' + code.slice(selectionEnd));
    }
  }

  return <div className={workspace ? "code-lab editor-workspace" : "code-lab"} onKeyDown={event => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      run();
    }
  }}>
    <div className="editor-title">
      <span><span className="file-dot"/> {label} <small>Python 3</small></span>
      <div className="editor-file-actions">
        {draftKey && <span className="draft-status" data-saved={draft.saved} role="status">
          {saveFailed ? 'Draft could not save. Copy your code before leaving.' : draft.saved ? 'Saved on this device' : 'Autosaves on this device'}
        </span>}
      <button className="icon-button" title="Copy code" aria-label="Copy code" onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setFeedback('Code copied.');
        } catch {
          setFeedback('Copy is unavailable. Select and copy the code manually.');
        }
      }}><Copy size={15}/></button>
      </div>
    </div>
    <div className="editor-body">
      <label className="sr-only" htmlFor={editorId}>Python code: {label}</label>
      <div className="editor-grid">
        <pre className="editor-gutter" aria-hidden="true">{code.split('\n').map((_, index) => index + 1).join('\n')}</pre>
        <EditorFallback code={code} setCode={update}>
          <Editor value={code} onValueChange={update} onKeyDown={editorKeys}
            highlight={text => Prism.highlight(text, Prism.languages.python, 'python')}
            padding={22} textareaId={editorId} textareaClassName="code-input" tabSize={4} insertSpaces/>
        </EditorFallback>
      </div>
    </div>
    {workspace ? <details className="workspace-input" open={Boolean(queue) || undefined}><summary>Program input</summary>
      <label className="queue-label">Program input <span>One response per line, supplied before Run</span>
      <textarea value={queue} onChange={event => saveDraft(code,event.target.value)} placeholder="For input() examples" rows={2}/>
    </label>
    </details> : <label className="queue-label">Program input <span>One response per line, supplied before Run</span>
      <textarea value={queue} onChange={event => saveDraft(code,event.target.value)} placeholder="For input() examples" rows={2}/>
    </label>}
    <div className="editor-actions">
      <button className="button primary small" disabled={busy} onClick={() => run()} title="Ctrl or Command + Enter"><Play size={15}/> Run Code</button>
      {onPass && <button className="button small" disabled={busy} onClick={() => run(true)}><CheckCircle2 size={15}/> Check Answer</button>}
      <button className="button small" disabled={!busy} onClick={() => stop()}><Square size={14}/> Stop</button>
      <button className="icon-button" title="Reset code and runtime" aria-label="Reset code and runtime" onClick={() => {
        if ((code !== initial || queue !== input) && !window.confirm("Replace your saved work with the starter code and input?")) return;
        stop('Reset. Ready to run.');
        saveDraft(initial,input);
        onCodeChange?.(initial);
        clearOutput();
      }}><RotateCcw size={16}/></button>
      <button className="icon-button" title="Clear output" aria-label="Clear output" onClick={clearOutput}><Trash2 size={16}/></button>
    </div>
    <div className="console">
      <div role="status"><span className={busy ? 'status-dot busy' : 'status-dot'}/>{status}<small>STDOUT</small></div>
      <pre>{stdout || (status === 'Finished' ? 'No standard output.' : 'Your output will appear here.')}</pre>
      {stderr && <details open><summary>Standard error</summary><pre>{stderr}</pre></details>}
      {exception && <details open><summary>Python or runtime error</summary><pre>{exception}</pre><p>{explainError(exception)}</p></details>}
      {expected !== undefined && !tests && !cases?.length && status === 'Finished' &&
        <details open={Boolean(feedback)}><summary>Expected output</summary><pre>{expected}</pre></details>}
    </div>
    {feedback && <p className="feedback" role="status">{feedback}</p>}
    {results.length > 0 && <ul className="test-results">{results.map(result => <li key={result.name}>
      {result.passed ? 'Passed' : 'Failed'} · {result.name}
      {result.detail && <pre>{result.detail}</pre>}
    </li>)}</ul>}
    {persist && <Snippets code={code} input={queue} onLoad={snippet => {
      stop('Snippet loaded. Ready to run.');
      saveDraft(snippet.code,snippet.input);
      onCodeChange?.(snippet.code);
      clearOutput();
    }}/>}
    <p className="runtime-note">Ctrl or Command + Enter runs the code. Pyodide downloads on first use. Each run has a 12-second execution limit.</p>
  </div>;
}
