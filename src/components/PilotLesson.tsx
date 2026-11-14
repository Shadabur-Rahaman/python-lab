import ConceptModel from './ConceptModel';
import {useState} from 'react';
import CodeLab from './CodeLab';
import {pilotActivities} from '../data/pilotActivities';
import {storage} from '../lib/storage';

const whileCode='i = 0\nwhile i < 3:\n    print("Welcome")\n    i += 1';
const practiceChecks = {
  2: 'assert travel == 40 and food == 60, "Store the two expenses in travel and food."',
  3: 'assert type(amount) is float and amount == 12.5',
  4: 'assert type(tickets) is int and tickets == 3',
  5: 'assert leftover == 3 and items == 23',
  6: 'assert order == 500, "Check the discount at the boundary of 500."',
  7: 'assert total == 6, "Store the sum in total before printing it."',
};
const stages=['Discover','Predict','Debug','Practice','Remember'] as const;

export default function PilotLesson({id,onRun}: {id:keyof typeof pilotActivities;onRun:()=>void}) {
  const activity=pilotActivities[id];
  const key='python-lab.activity.v2:'+id;
  const [stage,setStage]=useState(()=>{
    const saved=Number(storage.getItem(key+'-stage'));
    return Number.isInteger(saved) && saved>=0 && saved<stages.length ? saved : 0;
  });
  const [value,setValue]=useState(id===2?3:id===6?75:0);
  const [whileLoop,setWhileLoop]=useState(false);
  const [prediction,setPrediction]=useState('');
  const [feedback,setFeedback]=useState('');
  const [hint,setHint]=useState(0);
  const [solved,setSolved]=useState(()=>storage.getItem(key)==='solved');
  function complete() {
    setSolved(true);
    try { storage.setItem(key,'solved'); } catch { setFeedback('Solved for this visit. Browser storage is unavailable.'); }
  }
  return <section className="pilot-activity" aria-labelledby="pilot-heading">
    <h2 id="pilot-heading">{activity.title}</h2>
    <div className="utility-actions" role="group" aria-label="Activity stages">
      {stages.map((name,index)=><button type="button" className="button small" key={name} aria-pressed={stage===index}
        onClick={()=>{setStage(index);setFeedback('');try {storage.setItem(key+'-stage',String(index));} catch {}}}>{name}</button>)}
    </div>
    <div className="pilot-columns">
      <div className="card pilot-guide">
        {stage===0 && <>
          <p>{activity.intro}</p>
          {id===3||id===4||id===5 ? <ConceptModel chapter={id}/> : id===7 ? <>
            <label>Loop type<select value={whileLoop?'while':'for'} onChange={event=>{setWhileLoop(event.target.value==='while');setValue(0);}}>
              <option value="for">for</option><option value="while">while</option>
            </select></label>
            <pre><code>{whileLoop?whileCode:activity.code}</code></pre>
            <ol className="model-cells">{[0,1,2].map(i=><li key={i} data-selected={value===i+1}><code>i = {i}</code></li>)}</ol>
            <p role="status">{value===0?'Ready to enter the loop.':value===4?(whileLoop?'i = 3. The condition is false. The loop stops.':'range(3) is exhausted. The loop stops.'):'Iteration '+value+' · i = '+(value-1)+' → Welcome'}</p>
            <div className="utility-actions"><button className="button primary small" disabled={value===4} onClick={()=>setValue(value+1)}>Next step</button>
              <button className="button small" onClick={()=>setValue(0)}>Restart trace</button></div>
          </> : <>
            <label>{id===2?'Cups in the model':'Marks in the model'}
              <input type="range" min={0} max={id===2?10:100} value={value} onChange={event=>setValue(Number(event.target.value))}/>
            </label>
            <ol className="model-flow" aria-live="polite">
              {(id===2?['Price ₹20',value+' cups','Total ₹'+(20*value)]:['Marks '+value,value+' >= 40',value>=40?'Pass':'Fail'])
                .map(item=><li key={item}><strong>{item}</strong></li>)}
            </ol>
          </>}
          {id===6 && <details><summary>Compare if, elif, and else</summary>
            <pre><code>{'if marks >= 75:\n    print("Distinction")\nelif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")'}</code></pre>
            <p>Python checks the tests from top to bottom. The spaces show which print belongs to each branch.</p></details>}
          {(id===2||id===6||id===7) && <small>Teaching model. Edit and run the Python example to verify it.</small>}
        </>}
        {stage===1 && <form onSubmit={event=>{
          event.preventDefault();
          setFeedback(prediction.trim().toLowerCase()===activity.answer?'Correct prediction. Run Python and compare.':'Try again. Use the model to follow the values.');
        }}>
          <label>{activity.prediction}<input required value={prediction} onChange={event=>{setPrediction(event.target.value);setFeedback('');}}/></label>
          <button className="button small">Check prediction</button>
        </form>}
        {stage===2 && <><p>Run the broken example, read the error, and try a repair.</p>
          <button className="button small" disabled={hint>=3} onClick={()=>setHint(hint+1)}>Reveal next hint</button>
          {hint>=1 && <p>{activity.hint}</p>}{hint>=2 && <p>{activity.reason}</p>}
          {hint>=3 && <pre><code>{activity.repair}</code></pre>}</>}
        {stage===3 && <><p>{activity.task}</p><p>Expected output <code>{activity.expected}</code>. Use Check Answer when your program is ready.</p>
          {solved && <p role="status">✓ Activity solved</p>}
          <details><summary>See a worked solution</summary><pre><code>{activity.solution}</code></pre></details></>}
        {stage===4 && <><p>{activity.application}</p><details><summary>Hinglish memory hint</summary><p lang="hi-Latn">{activity.remember}</p></details>
          {id===7 && <p>A while loop can run indefinitely if its condition stays true. Change the counter inside the loop and check when the condition becomes false.</p>}</>}
        {feedback && <p role="status">{feedback}</p>}
      </div>
      {stage<=1 && <CodeLab key={whileLoop?'while':'experiment'} initial={whileLoop?whileCode:activity.code} draftId={key+(whileLoop?'-while':'-experiment')} input={id===4?'3':undefined} label="experiment.py" onRun={onRun} workspace/>}
      {stage===2 && <CodeLab key="repair" initial={activity.broken} draftId={key+'-repair'} input={id===4?'3':undefined} label="repair.py" onRun={onRun} workspace/>}
      {stage===3 && <CodeLab key="challenge" initial={activity.starter} draftId={key+'-challenge'} input={id===4?'3':undefined} label="challenge.py" expected={activity.expected} tests={practiceChecks[id]} verifyOutput
        onRun={onRun} onPass={complete} workspace/>}
    </div>
  </section>;
}
