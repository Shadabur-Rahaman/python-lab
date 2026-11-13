import {useState} from 'react';
import CodeLab from './CodeLab';
import {storage} from '../lib/storage';

const starter = 'product = "Notebook"\nprice = 80\nquantity = 3\n\ntotal = price * quantity\nprint("Total:", total)';
const stages = ['Learn','Run','Practice','Quiz'] as const;
const stepKey = 'python-lab.receipt.stage';

export function ReceiptEditor({onRun, full = false}: {onRun:()=>void;full?:boolean}) {
  return <CodeLab initial={starter} label="receipt.py" draftId="receipt-workspace" onRun={onRun} persist={full} workspace/>;
}

export function ReceiptLesson({onRun}: {onRun:()=>void}) {
  const [step,setStep] = useState(()=>{
    const saved = Number(storage.getItem(stepKey));
    return Number.isInteger(saved) && saved>=0 && saved<stages.length ? saved : 0;
  });
  const [quantity,setQuantity] = useState(3);
  const [prediction,setPrediction] = useState('');
  const [result,setResult] = useState('');
  function choose(index:number) {
    setStep(index);
    setResult('');
    try { storage.setItem(stepKey,String(index)); } catch {}
  }
  return <section aria-labelledby="receipt-title" className="receipt-workspace">
    <div className="card receipt-guide">
      <h2 id="receipt-title">Calculate a shop receipt</h2>
      <div className="utility-actions" role="group" aria-label="Receipt learning stages">
        {stages.map((stage,index)=><button key={stage} className="button small" aria-pressed={step===index} onClick={()=>choose(index)}>{stage}</button>)}
      </div>
      <h3>Step {step+1} of 4 · {stages[step]}</h3>
      {step===0 && <><p>Change quantity from 3 to 5, predict the total, and run the receipt.</p><p>A variable is a name that refers to a value. In <code>price = 80</code>, Python gives the name <code>price</code> to the integer 80.</p>
        <p><code>product</code> refers to a string. <code>quantity</code> and <code>price</code> refer to integers. Multiply with <code>*</code> and display the result with <code>print()</code>.</p>
        <label>Quantity in the model <input type="range" min="1" max="10" value={quantity} onChange={event=>setQuantity(Number(event.target.value))}/></label>
        <p className="receipt-model"><code>price: int = 80</code><code>quantity: int = {quantity}</code><strong>Total {80*quantity}</strong></p>
        <p>This model illustrates reassignment. Run the editor to see what your Python code actually does.</p></>}
      {step===1 && <><p>Predict the total if you set the price to 100 and keep the quantity at 3. Then try those values in the editor.</p>
        <form onSubmit={event=>{event.preventDefault();setResult(Number(prediction)===300?'Correct. Python multiplies 100 by 3.':'Multiply the new price by the unchanged quantity.');}}>
          <label>Predicted total<input required type="number" value={prediction} onChange={event=>setPrediction(event.target.value)}/></label>
          <button className="button small">Check prediction</button>
        </form></>}
      {step===2 && <><p>Try moving <code>total = price * quantity</code> above both assignments and run the code. Python raises a <code>NameError</code> because the names do not exist yet.</p>
        <p>Move it back, then add a delivery fee of 20. Calculate the final total and print it.</p></>}
      {step===3 && <><p>If you change <code>quantity</code> after calculating <code>total</code>, does the old total change on its own?</p>
        <div className="utility-actions"><button className="button small" onClick={()=>setResult('Try it. Assignment calculates a value once.')}>Yes</button>
          <button className="button small" onClick={()=>setResult('Correct. Calculate total again with the new quantity.')}>No</button></div></>}
      {result && <p role="status">{result}</p>}
      <div className="utility-actions">
        <button className="button small" disabled={step===0} onClick={()=>choose(step-1)}>Back</button>
        <button className="button primary small" disabled={step===3} onClick={()=>choose(step+1)}>Next step</button>
        <a className="inline-link" href="#/playground">Open in Playground</a>
      </div>
      <p><a className="inline-link" href="#/glossary/assignment">Assignment glossary</a> · <a className="inline-link" href="#/syntax/fundamentals/assignment">Assignment syntax</a></p>
    </div>
    <ReceiptEditor onRun={onRun}/>
  </section>;
}
