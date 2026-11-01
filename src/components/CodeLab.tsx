import {Component,useEffect,useRef,useState,useId,type ReactNode} from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import {Play,Square,RotateCcw,Copy,Trash2,Save,CheckCircle2} from 'lucide-react';
import {matchesOutput} from '../lib/progress.mjs';
class EditorFallback extends Component<{children:ReactNode;code:string;setCode:(s:string)=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<textarea aria-label="Python code" className="fallback-editor" value={this.props.code} onChange={e=>this.props.setCode(e.target.value)}/>:this.props.children;}}
type Props={initial:string;input?:string;expected?:string;tests?:string;onPass?:()=>void;onRun?:()=>void;label?:string;persist?:boolean;onCodeChange?:(s:string)=>void};
export default function CodeLab({initial,input='',expected,tests,onPass,onRun,label='Python editor',persist=false,onCodeChange}:Props){
 const editorId=useId();
 const [snippetName,setSnippetName]=useState("My Python experiment");
 const [code,setCode]=useState(initial),[queue,setQueue]=useState(input),[output,setOutput]=useState(''),[status,setStatus]=useState('Ready when you are'),[busy,setBusy]=useState(false),[feedback,setFeedback]=useState(''),[snippets,setSnippets]=useState<{name:string;code:string;input:string}[]>(()=>{try{const s=JSON.parse(localStorage.getItem('python-lab.snippets.v1')||'[]');return Array.isArray(s)?s.filter(x=>typeof x?.name==='string'&&typeof x?.code==='string'&&typeof x?.input==='string'):[];}catch{return [];}});
 const worker=useRef<Worker|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),active=useRef(false);
 const stop=(message='Stopped. Python will restart on the next run.')=>{worker.current?.terminate();worker.current=null;active.current=false;if(timer.current)clearTimeout(timer.current);setBusy(false);setStatus(message);};
 useEffect(()=>()=>{worker.current?.terminate();if(timer.current)clearTimeout(timer.current);},[]);
 const update=(value:string)=>{setCode(value);onCodeChange?.(value);};
 const run=(check=false)=>{
   if(active.current)return;active.current=true;setBusy(true);setOutput('');setFeedback('');let captured='';let loading=true;
   try{if(!worker.current)worker.current=new Worker(`${import.meta.env.BASE_URL}python-worker.js`);
   const finish=()=>{if(timer.current)clearTimeout(timer.current);active.current=false;setBusy(false);};
   worker.current.onerror=(e)=>{finish();setStatus('Python could not start');setOutput(e.message+'\nCheck your internet connection, then Reset and try again.');worker.current?.terminate();worker.current=null;};
   worker.current.onmessage=({data})=>{
     if(data.kind==='status'){setStatus(data.text);if(data.text==='Running Python…'&&loading){loading=false;if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>stop('Stopped after 12 seconds. Check your loop condition, then run again.'),12000);}return;}
     if(data.kind==='stdout'||data.kind==='stderr'){captured+=data.text;setOutput(captured);}
     if(data.kind==='error'){finish();setStatus('Let’s fix this');setOutput(captured+'\n'+data.text+'\n\nTip: check the last error line, your indentation, and the input queue.');setFeedback(check?'Not passed yet. Fix the error, then check again.':'');}
     if(data.kind==='done'){finish();setStatus('Finished');onRun?.();if(check){const passed=tests?captured.trim().endsWith('__PYTHON_LAB_PASS__'):matchesOutput(captured,expected||'');setOutput(captured.replace(/__PYTHON_LAB_PASS__\n?$/,''));setFeedback(passed?'All checks passed. Nicely done!':`Not quite yet. Expected ${JSON.stringify(expected)} but received ${JSON.stringify(captured.trim())}. Check spelling, spacing, and the calculation.`);if(passed)onPass?.();}}
   };
   timer.current=setTimeout(()=>stop('Python download timed out. Check your connection and try again.'),90000);
   worker.current.postMessage({code:check&&tests?`${code}\n\n# Automated function checks\n${tests}\nprint("__PYTHON_LAB_PASS__")`:code,input:queue});
   }catch(e){stop('Unable to start Python');setOutput(String(e));}
 };
 const save=()=>{const name=snippetName;if(!name.trim()){setFeedback('Give your snippet a name first.');return;}const next=[...snippets,{name:name.trim(),code,input:queue}].slice(-30);try{localStorage.setItem('python-lab.snippets.v1',JSON.stringify(next));setSnippets(next);setFeedback('Snippet saved on this browser.');}catch{setFeedback('Browser storage is unavailable. Copy your code to keep it.');}};
 return <div className="code-lab"><div className="editor-title"><span><span className="file-dot"/> {label} <small>Python 3</small></span><button className="icon-button" title="Copy code" aria-label="Copy code" onClick={()=>navigator.clipboard.writeText(code).then(()=>setFeedback('Code copied.')).catch(()=>setFeedback('Copy unavailable. Select the code and copy manually.'))}><Copy size={15}/></button></div>
 <div className="editor-body"><label className="sr-only" htmlFor={editorId}>Python code: {label}</label><EditorFallback code={code} setCode={update}><Editor value={code} onValueChange={update} highlight={text=>Prism.highlight(text,Prism.languages.python,'python')} padding={22} textareaId={editorId} textareaClassName="code-input" aria-label="Python code" tabSize={4} insertSpaces style={{fontFamily:'"Cascadia Code", Consolas, monospace',fontSize:14,minHeight:180}}/></EditorFallback></div>
 <label className="queue-label">Program input <span>One response per line, supplied before Run</span><textarea value={queue} onChange={e=>setQueue(e.target.value)} placeholder={'For input() examples, e.g.\nAyaan\n20'} rows={2}/></label>
 <div className="editor-actions"><button className="button primary small" disabled={busy} onClick={()=>run()}><Play size={15}/> Run Code</button>{onPass&&<button className="button small" disabled={busy} onClick={()=>run(true)}><CheckCircle2 size={15}/> Check Answer</button>}<button className="button small" disabled={!busy} onClick={()=>stop()}><Square size={14}/> Stop</button><button className="icon-button" title="Reset code and runtime" aria-label="Reset code and runtime" onClick={()=>{stop('Reset. Ready to run.');update(initial);setQueue(input);setOutput('');setFeedback('');}}><RotateCcw size={16}/></button><button className="icon-button" title="Clear output" aria-label="Clear output" onClick={()=>setOutput('')}><Trash2 size={16}/></button>{persist&&<button className="button small" onClick={save}><Save size={14}/> Save</button>}</div>
 <div className="console"><div><span className={busy?'status-dot busy':'status-dot'}/>{status}<small>OUTPUT</small></div><pre aria-live="polite">{output||'Your output will appear here.'}</pre></div>{feedback&&<p className="feedback" role="status">{feedback}</p>}
 {persist&&<label className="snippet-select">Snippet name<input value={snippetName} onChange={e=>setSnippetName(e.target.value)} placeholder="My Python experiment"/><small>Use Save above to keep this code and its input queue.</small></label>}
 {persist&&snippets.length>0&&<label className="snippet-select">Saved snippets <select aria-label="Saved snippets" value="" onChange={e=>{const s=snippets[Number(e.target.value)];if(s){update(s.code);setQueue(s.input);}}}><option value="">Choose a snippet…</option>{snippets.map((s,i)=><option value={i} key={i}>{s.name}</option>)}</select></label>}
 <p className="runtime-note">Real Python via Pyodide. First run downloads the runtime. Runs have fresh variables, a 12-second limit, and a Stop button. Python cannot access arbitrary files on your device.</p></div>;
}
