// Pinned runtime. A classic worker is supported by this specific Pyodide release.
let runtime;
let count=0;
self.onmessage=async({data})=>{
  const send=(kind,text)=>self.postMessage({kind,text});
  try{
    if(!runtime){send('status','Loading Python — the first download may take a moment…');importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');runtime=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});}
    send('status','Running Python…');count=0;
    const emit=(kind,text)=>{count+=text.length;if(count>60000)throw new Error('Output limit reached. Try fewer repetitions.');send(kind,text+'\n');};
    runtime.setStdout({batched:text=>emit('stdout',text)});runtime.setStderr({batched:text=>emit('stderr',text)});
    const inputs=data.input ? data.input.replace(/\r/g,'').split('\n') : [];
    runtime.setStdin({stdin:()=>inputs.length?inputs.shift():null});
    const globals=runtime.toPy({});
    try{await runtime.runPythonAsync(data.code,{globals});send('done','');}finally{globals.destroy();}
  }catch(error){send('error',String(error.message||error));}
};
