import {useState} from 'react';

export default function AliasModel() {
  const [step, setStep] = useState(0);
  const [copy, setCopy] = useState(false);
  const [item, setItem] = useState('tea');
  const lines = ['cart = []', copy ? 'other = cart.copy()' : 'other = cart', `other.append(${JSON.stringify(item)})`];
  const original = step === 3 && !copy ? [item] : [];
  const duplicate = step === 3 && copy ? [item] : [];
  return <div className="card alias-model">
    <h3>Trace two names and their lists</h3>
    <p>Illustrative model for this three-line program.</p>
    <label>Item to append<input value={item} maxLength={80} onChange={event => setItem(event.target.value)}/></label>
    <label className="project-check"><input type="checkbox" checked={copy} onChange={event => {
      setCopy(event.target.checked);
      setStep(0);
    }}/> Make a shallow copy on line 2</label>
    <ol>{lines.map((line, index) => <li key={index} aria-current={step === index + 1 ? 'step' : undefined}>
      <code>{line}</code>{step === index + 1 && ' ← Current line'}
    </li>)}</ol>
    <dl aria-live="polite">
      <dt>cart</dt><dd>{step > 0 ? `List A ${JSON.stringify(original)}` : 'Unassigned'}</dd>
      <dt>other</dt><dd>{step < 2 ? 'Unassigned' : copy ? `List B ${JSON.stringify(duplicate)}` : `List A ${JSON.stringify(original)}`}</dd>
    </dl>
    <div className="utility-actions">
      <button className="button small" disabled={step === 0} onClick={() => setStep(step - 1)}>Step back</button>
      <button className="button small" disabled={step === 3} onClick={() => setStep(step + 1)}>Step forward</button>
      <button className="button small" onClick={() => {setStep(0); setCopy(false); setItem('tea');}}>Reset model</button>
    </div>
  </div>;
}
