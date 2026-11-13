import {useState} from 'react';
import {models} from '../data/visualModels';

export default function ConceptModel({chapter}: {chapter:number}) {
  const model = models[chapter];
  const [index,setIndex] = useState(0);
  const stages = model.stages(index);
  return <div className="card concept-model">
    <h3>{model.title}</h3>
    <label>{model.control}<select value={index} onChange={event=>setIndex(Number(event.target.value))}>
      {model.values.map((value,i)=><option key={value} value={i}>{value}</option>)}
    </select></label>
    {chapter===7 && <ol className="model-cells" aria-label="Transaction rows">
      {[120,80,50].map((sale,i)=><li key={sale} data-selected={i<index} aria-current={i===index-1?'step':undefined}>
        <small>Row {i+1}</small><strong>₹{sale}</strong><small>{i<index?'Counted':'Waiting'}</small>
      </li>)}
    </ol>}
    {(chapter===8 || chapter===9) && <ol className="model-cells" aria-label={chapter===8?'String positions':'List positions'}>
      {(chapter===8?[...'PYTHON']:[72,84,91]).map((value,i)=><li key={i} data-selected={i===index}>
        <small>Index {i}</small><strong>{value}</strong>{i===index && <small>Selected</small>}
      </li>)}
    </ol>}
    <ol className="model-flow" aria-live="polite">
      {stages.map((stage,i)=><li key={i}><small>{['Start','Operation','Result'][i]}</small><strong>{stage}</strong></li>)}
    </ol>
    <p><strong>Remember</strong> {model.remember}</p>
    <p><strong>{chapter===15?'Useful later':'Where you’ll use this'}</strong> {model.application}</p>
    <small>Teaching model. Use the Python editor to run and change code.</small>
  </div>;
}
