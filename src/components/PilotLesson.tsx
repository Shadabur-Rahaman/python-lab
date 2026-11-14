import ConceptModel from './ConceptModel';
import {useState} from 'react';
import CodeLab from './CodeLab';
import {pilotActivities,setChallenge} from '../data/pilotActivities';
import {storage} from '../lib/storage';

const whileCode='i = 0\nwhile i < 3:\n    print("Welcome")\n    i += 1';
const practiceChecks = {
  2: 'assert travel == 40 and food == 60, "Store the two expenses in travel and food."',
  3: 'assert type(amount) is float and amount == 12.5',
  4: 'assert type(tickets) is int and tickets == 3',
  5: 'assert leftover == 3 and items == 23',
  6: 'assert order == 500, "Check the discount at the boundary of 500."',
  7: 'assert total == 6, "Store the sum in total before printing it."',
  8: 'assert clean_name("  Noor Khan  ") == "Noor Khan", "Keep interior spaces and remove surrounding whitespace."\nassert clean_name("   ") == "", "An all-space name becomes empty."',
  9: 'assert first_score([19, 44]) == 19, "Read the first item in a list."\nassert first_score((82,)) == 82, "Read the first item in a tuple too."',
  10: 'assert price_or_zero({"price": 125}) == 125, "Read the actual price."\nassert price_or_zero({"name": "Pen"}) == 0, "Return zero when the key is missing."',
  11: 'assert order_total(15, 2, 7) == 37, "Return the total using the arguments."\nassert order_total(10, 0, 5) == 5, "Include delivery even when quantity is zero."',
  12: 'assert summarize_expenses([15, 25], 40) == (40, False), "A total equal to the budget is within budget."\nassert summarize_expenses([30, 45], 60) == (75, True), "Check another set of expenses over budget."\nassert summarize_expenses([], 50) == (0, False), "An empty list has a total of zero."',

  13: 'records = [("A", 50), ("B", 10), ("C", 50), ("D", 70)]\noriginal = records.copy()\nresult = expense_report(records, 50)\nassert result == [("D", 70), ("A", 50), ("C", 50)], "Include the boundary and preserve the order of ties."\nassert records == original and result is not records, "Return a new list and leave the input intact."\nassert expense_report(records, 100) == [], "Handle a threshold with no matches."\nassert expense_report([], 0) == [], "Handle an empty list."',
  14: 'from tempfile import TemporaryDirectory\nfrom pathlib import Path\nwith TemporaryDirectory() as folder:\n    path = Path(folder) / "report.json"\n    assert read_expenses(str(path)) == [], "Handle a missing file."\n    path.write_text("[19, 22]", encoding="utf-8")\n    assert read_expenses(str(path)) == [19, 22], "Read the contents of the supplied path."\n    path.write_text("[19,", encoding="utf-8")\n    assert read_expenses(str(path)) == [], "Handle malformed JSON."',

};
const stages=['Discover','Predict','Debug','Practice','Remember'] as const;

function ExpenseReportModel({minimum,onChange}: {minimum:number;onChange:(value:number)=>void}) {
  const rows = [{category:'Travel',amount:40},{category:'Food',amount:75},{category:'Supplies',amount:25}];
  const report = rows.filter(row=>row.amount>=minimum).sort((a,b)=>b.amount-a.amount);
  return <>
    <label>Minimum expense ₹{minimum}<input type="range" min={0} max={100} step={5} value={minimum}
      onChange={event=>onChange(Number(event.target.value))}/></label>
    <div className="expense-report-model">
      <div><strong>Original expenses</strong><ul>{rows.map(row=><li key={row.category}>{row.category} · ₹{row.amount}</li>)}</ul></div>
      <div aria-live="polite"><strong>Filtered and sorted</strong>
        {report.length ? <ol>{report.map(row=><li key={row.category}>{row.category} · ₹{row.amount}</li>)}</ol> : <p>No matching expenses.</p>}
      </div>
    </div>
    <small>Teaching model. Edit the minimum in the editor to verify the result with Python.</small>
  </>;
}

export default function PilotLesson({id,onRun}: {id:keyof typeof pilotActivities;onRun:()=>void}) {
  const activity=pilotActivities[id];
  const key='python-lab.activity.v2:'+id;
  const [stage,setStage]=useState(()=>{
    const saved=Number(storage.getItem(key+'-stage'));
    return Number.isInteger(saved) && saved>=0 && saved<stages.length ? saved : 0;
  });
  const [value,setValue]=useState(id===2?3:id===6?75:id===12?150:id===13?40:0);
  const [whileLoop,setWhileLoop]=useState(false);
  const [prediction,setPrediction]=useState('');
  const [feedback,setFeedback]=useState('');
  const [hint,setHint]=useState(0);
  const [recall,setRecall]=useState(false);
  const [solved,setSolved]=useState(()=>storage.getItem(key)==='solved');
  const [setMode,setSetMode]=useState(()=>id===10 && storage.getItem(key+'-practice')==='sets');
  const [setsSolved,setSetSolved]=useState(()=>id===10 && storage.getItem(key+'-sets')==='solved');
  const challenge=setMode?setChallenge:activity;
  function chooseStage(index:number) {
    setStage(index);
    setFeedback('');
    try {storage.setItem(key+'-stage',String(index));} catch {}
  }
  function complete() {
    if(setMode) setSetSolved(true);
    else setSolved(true);
    try { storage.setItem(setMode?key+'-sets':key,'solved'); } catch { setFeedback('Solved for this visit. Browser storage is unavailable.'); }
  }
  return <section className="pilot-activity" aria-labelledby="pilot-heading">
    <h2 id="pilot-heading">{activity.title}</h2>
    <div className="utility-actions" role="group" aria-label="Activity stages">
      {stages.map((name,index)=><button type="button" className="button small" key={name} aria-pressed={stage===index}
        onClick={()=>chooseStage(index)}>{name}</button>)}
    </div>
    <p className="pilot-position">Step {stage+1} of {stages.length}</p>
    <div className="pilot-columns">
      <div className="card pilot-guide">
        {stage===0 && <>
          <p>{activity.intro}</p>
          {id===13 ? <ExpenseReportModel minimum={value} onChange={setValue}/> : id===12 ? <>
            <label>Budget in the model<input type="range" min={0} max={200} step={5} value={value} onChange={event=>setValue(Number(event.target.value))}/></label>
            <ol className="model-flow" aria-live="polite">
              <li><small>Expenses</small><strong>₹40 + ₹75 + ₹25</strong></li>
              <li><small>Total and budget</small><strong>₹140 vs ₹{value}</strong></li>
              <li><small>Status</small><strong>{140>value?'Over budget':'Within budget'}</strong></li>
            </ol>
            <small>Teaching model. Change the budget in the editor and run Python to compare.</small>
          </> : id===3||id===4||id===5||id>=8 ? <ConceptModel chapter={id}/> : id===7 ? <>
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
        {stage===3 && <>
          {id===10 && <label>Challenge<select value={setMode?'sets':'dictionary'} onChange={event=>{
            const selection=event.target.value;
            setSetMode(selection==='sets');
            setFeedback('');
            try {storage.setItem(key+'-practice',selection);} catch {}
          }}><option value="dictionary">Dictionary lookup</option><option value="sets">Count distinct categories</option></select></label>}
          <p>{challenge.task}</p><p>Expected output <code>{challenge.expected}</code>. Use Check Answer when your program is ready.</p>
          {(setMode?setsSolved:solved) && <p role="status">✓ Activity solved</p>}
          <details><summary>See a worked solution</summary><pre><code>{challenge.solution}</code></pre></details></>}
        {stage===4 && <><p>{activity.application}</p>
          {'recap' in activity && <><p>{activity.recap}</p>
            <button className="button small" aria-expanded={recall} onClick={()=>setRecall(!recall)}>{recall?'Hide answer':'Check your recall'}</button>
            {recall && <p role="status">{activity.recall}</p>}</>}<details><summary>Hinglish memory hint</summary><p lang="hi-Latn">{activity.remember}</p></details>
          {id===7 && <p>A while loop can run indefinitely if its condition stays true. Change the counter inside the loop and check when the condition becomes false.</p>}</>}
        {stage<stages.length-1 && <div className="pilot-next"><button className="button small" onClick={()=>chooseStage(stage+1)}>Continue to {stages[stage+1]}</button></div>}
        {feedback && <p role="status">{feedback}</p>}
      </div>
      {stage<=1 && <CodeLab key={whileLoop?'while':'experiment'} initial={whileLoop?whileCode:activity.code} draftId={key+(whileLoop?'-while':'-experiment')} input={id===4?'3':undefined} label="experiment.py" onRun={onRun} workspace/>}
      {stage===2 && <CodeLab key="repair" initial={activity.broken} draftId={key+'-repair'} input={id===4?'3':undefined} label="repair.py" onRun={onRun} workspace/>}
      {stage===3 && <CodeLab key={setMode?'sets':'challenge'} initial={challenge.starter} draftId={key+(setMode?'-set-challenge':'-challenge')} input={id===4?'3':undefined} label="challenge.py" expected={challenge.expected} tests={setMode?setChallenge.tests:practiceChecks[id]} verifyOutput
        onRun={onRun} onPass={complete} workspace/>}
    </div>
  </section>;
}
