import {storage} from '../lib/storage';
import {Component, useEffect, useId, useRef, useState, type ComponentRef, type KeyboardEvent, type ReactNode} from 'react';
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
type Message = {kind: 'status' | 'stdout' | 'stderr' | 'error' | 'done'; text: string; stage?: number; cases?: Result[]; canRetry?: boolean};
type Props = {
  initial: string; input?: string; expected?: string; tests?: string; cases?: TestCase[];
  onPass?: () => void; onRun?: () => void; label?: string; persist?: boolean; draftId?: string; workspace?: boolean; verifyOutput?: boolean; onCodeChange?: (code: string) => void;
};

// Module-level warm worker pool across CodeLab instances
let warmWorker: Worker | null = null;
let warmWorkerInUse = false;

export function resetWarmWorker() {
  if (warmWorker) {
    try { warmWorker.terminate(); } catch {}
    warmWorker = null;
    warmWorkerInUse = false;
  }
}

function explainError(error: string) {
  if (/IndentationError|TabError/.test(error)) return 'Check the leading spaces on the indicated line and the lines around it.';
  if (error.includes("SyntaxError: expected ':'")) return 'Python expects a colon at the end of this header. Check the indicated if, elif, else, for, or while line.';
  if (error.includes('SyntaxError')) return 'Look at the indicated line and the line above it. Check for missing punctuation, brackets or quotes.';
  if (error.includes('NameError')) return 'Check that the name is spelled correctly and has been defined before this line runs.';
  if (error.includes('EOFError')) return 'Add one queued response for each input() call, then run again.';
  if (error.includes('TypeError')) return 'Check the types of the values supplied to the operation or function.';
  return '';
}

export default function CodeLab({
  initial, input = '', expected, tests, cases, onPass, onRun, label = 'Python editor', persist = false, draftId, workspace = false, verifyOutput = false, onCodeChange,
}: Props) {
  const editorId = useId();
  const editorRef = useRef<ComponentRef<typeof Editor>>(null);

  function insertSymbol(symbol:string) {
    const field=document.getElementById(editorId);
    if (!(field instanceof HTMLTextAreaElement)) return;
    const {selectionStart:start,selectionEnd:end}=field;
    field.focus({preventScroll:true});
    if (start===end && [')',']','}'].includes(symbol) && code[start]===symbol) {
      field.setSelectionRange(start+1,start+1);
      return;
    }
    const value=code.slice(0,start)+symbol+code.slice(end);
    const cursor=start+symbol.length;
    const editor=editorRef.current;
    if (editor) {
      const {stack,offset}=editor.session.history;
      editor.session={history:{offset:offset+2,stack:[
        ...stack.slice(0,offset+1),
        {value:code,selectionStart:start,selectionEnd:end,timestamp:Date.now()},
        {value,selectionStart:cursor,selectionEnd:cursor,timestamp:Date.now()},
      ]}};
    }
    field.setRangeText(symbol,start,end,'end');
    update(value);
  }

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
  const [stage, setStage] = useState<number | null>(null);
  const [lastCheck, setLastCheck] = useState(false);

  function finish() {
    if (timer.current) clearTimeout(timer.current);
    active.current = false;
    setBusy(false);
    setStage(null);
    warmWorkerInUse = false;
  }

  function stop(message = 'Stopped. Python will restart on the next run.') {
    if (worker.current) {
      try { worker.current.terminate(); } catch {}
      if (warmWorker === worker.current) {
        warmWorker = null;
      }
      worker.current = null;
    }
    finish();
    setStatus(message);
  }

  useEffect(() => () => {
    if (active.current) {
      stop();
    } else {
      worker.current = null;
    }
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
    setLastCheck(check);
    setBusy(true);
    setStage(1);
    setStatus('Preparing Python…');
    clearOutput();
    let actual = '';
    try {
      let current: Worker;
      if (worker.current) {
        current = worker.current;
      } else if (warmWorker && !warmWorkerInUse) {
        current = warmWorker;
        warmWorkerInUse = true;
        worker.current = current;
      } else {
        current = new Worker(`${import.meta.env.BASE_URL}python-worker.js`);
        warmWorker = current;
        warmWorkerInUse = true;
        worker.current = current;
      }
      current.onerror = () => {
        stop('Python could not start. Check your connection and try again.');
        setException('Network or WebAssembly loading failed while starting the Python runtime.');
      };
      current.onmessage = ({data}: MessageEvent<Message>) => {
        switch (data.kind) {
          case 'status':
            setStatus(data.text);
            if (typeof data.stage === 'number') {
              setStage(data.stage);
            }
            if (data.text === 'Running Python…') {
              setStage(null);
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
              ? checks.length === (tests ? 1 : 0) + (cases?.length ?? 0) && passedCount === checks.length && (!verifyOutput || matchesOutput(actual, expected ?? ''))
              : matchesOutput(actual, expected ?? '');
            setResults(checks);
            if (passed) {
              setFeedback('All checks passed.');
              onPass?.();
            } else if (verifyOutput && passedCount === checks.length) {
              setFeedback('Output differs. Compare your output with the expected result.');
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
    <div className="python-symbols" role="group" aria-label="Python editing symbols">
      {['(',')',':','"',"'","[","]","{","}","=","_","#","    "].map(symbol=>
        <button type="button" key={symbol} className="button small" onPointerDown={event=>event.preventDefault()}
          onClick={()=>insertSymbol(symbol)}>{symbol==='    '?'Indent':symbol}</button>)}
    </div>
    <div className="editor-body">
      <label className="sr-only" htmlFor={editorId}>Python code: {label}</label>
      <div className="editor-grid">
        <pre className="editor-gutter" aria-hidden="true">{code.split('\n').map((_, index) => index + 1).join('\n')}</pre>
        <EditorFallback code={code} setCode={update}>
          <Editor ref={editorRef} value={code} onValueChange={update} onKeyDown={editorKeys}
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
      {busy && stage !== null && (
        <div className="runtime-stage-bar" role="status" aria-label="Python initialization stage">
          <span className={`stage-step ${stage >= 1 ? 'active' : ''}`}>1. Preparing</span>
          <span className="stage-sep">→</span>
          <span className={`stage-step ${stage >= 2 ? 'active' : ''}`}>2. Loading files</span>
          <span className="stage-sep">→</span>
          <span className={`stage-step ${stage >= 3 ? 'active' : ''}`}>3. Starting engine</span>
          <span className="stage-sep">→</span>
          <span className={`stage-step ${stage >= 4 ? 'active' : ''}`}>4. Ready</span>
        </div>
      )}
      <pre>{stdout || (status === 'Finished' ? 'No standard output.' : 'Your output will appear here.')}</pre>
      {stderr && <details open><summary>Standard error</summary><pre>{stderr}</pre></details>}
      {exception && (
        <details open>
          <summary>Python or runtime error</summary>
          <pre>{exception}</pre>
          <p>{explainError(exception)}</p>
          <div className="runtime-retry-row">
            <button
              type="button"
              className="button small primary"
              onClick={() => {
                stop('Retrying Python…');
                setTimeout(() => run(lastCheck), 50);
              }}
            >
              <RotateCcw size={14}/> Retry Python
            </button>
          </div>
        </details>
      )}
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
