import MemoryHint from './MemoryHint';
import {romanHints} from '../data/romanHints';
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

    {/* Chapter 0: Recipe Algorithm Steps */}
    {chapter===0 && <ol className="model-recipe-steps" aria-label="Recipe algorithm steps">
      {[
        {step:1, name:'Boil water', amount:(index+1)*100+' mL', note:'Heat first'},
        {step:2, name:'Add tea leaves', amount:(index+1)+' tsp', note:'Infuse flavour'},
        {step:3, name:'Pour milk', amount:(index+1)*100+' mL', note:'Blend gently'},
        {step:4, name:'Serve hot', amount:(index+1)+' cup'+(index>0?'s':''), note:'Total '+(index+1)*200+' mL'}
      ].map(item => <li key={item.step} className="recipe-step-card">
        <span className="step-num">Step {item.step}</span>
        <strong>{item.name}</strong>
        <small className="step-amount">{item.amount}</small>
        <span className="step-note">{item.note}</span>
      </li>)}
    </ol>}

    {/* Chapter 1: Statement to Output & Token Contrast */}
    {chapter===1 && <div className="model-statement-map" aria-label="Code statement to screen output">
      <div className="statement-row">
        <div className="code-badge">
          <span className="code-label">Python statement</span>
          <code>print(<span className="quote-badge">"{model.values[index]}"</span>)</code>
        </div>
        <span className="arrow-divider" aria-hidden="true">➔</span>
        <div className="output-badge">
          <span className="output-label">Screen output</span>
          <samp className="terminal-samp">{model.values[index]}</samp>
          <small className="output-note">(Quotes removed in terminal output)</small>
        </div>
      </div>
      <div className="token-contrast-row">
        <div className="token-box string-box">
          <span className="type-pill pill-str">str (Text)</span>
          <code>"10" + "20"</code>
          <span className="contrast-arrow">➔</span>
          <samp>"1020"</samp>
        </div>
        <div className="token-box number-box">
          <span className="type-pill pill-int">int (Number)</span>
          <code>10 + 20</code>
          <span className="contrast-arrow">➔</span>
          <samp>30</samp>
        </div>
      </div>
    </div>}

    {/* Chapter 2: Labeled Memory Boxes */}
    {chapter===2 && <div className="model-memory-boxes" aria-label="Variables in memory">
      <div className="memory-box">
        <span className="box-label">price</span>
        <span className="box-val chip-price">₹{80 + 20*index}</span>
        <small className="box-meta">Reassigned</small>
      </div>
      <span className="memory-op" aria-hidden="true">×</span>
      <div className="memory-box">
        <span className="box-label">quantity</span>
        <span className="box-val chip-qty">3</span>
        <small className="box-meta">Constant</small>
      </div>
      <span className="memory-op" aria-hidden="true">=</span>
      <div className="memory-box total-box">
        <span className="box-label">total_price</span>
        <span className="box-val chip-total">₹{(80 + 20*index) * 3}</span>
        <small className="box-meta">Calculated</small>
      </div>
    </div>}

    {/* Chapter 3: Type Conversion Funnel */}
    {chapter===3 && <div className="model-conversion-funnel" aria-label="Type conversion flow">
      <div className="funnel-stage source-val">
        <small>Raw value in CSV</small>
        <code>{['"42"', '"12.5"', '"Books"', '"" (empty)'][index]}</code>
        <span className="type-pill pill-str">str</span>
      </div>
      <div className="funnel-stage converter-fn">
        <small>Conversion</small>
        <strong>{['int(text)', 'float(text)', 'keep str', 'handle explicit'][index]}</strong>
      </div>
      <div className={`funnel-stage result-val ${index===2?'stage-text':index===3?'stage-missing':'stage-num'}`}>
        <small>Resulting value & type</small>
        <strong>{['42', '12.5', 'Books', 'None'][index]}</strong>
        <span className={`type-pill ${index===0?'pill-int':index===1?'pill-float':index===2?'pill-str':'pill-none'}`}>
          {['int', 'float', 'str', 'NoneType'][index]}
        </span>
      </div>
    </div>}

    {/* Chapter 4: User Input Queue Pipeline */}
    {chapter===4 && <div className="model-input-pipeline" aria-label="User input pipeline">
      <div className="pipeline-step">
        <small>1. User types in queue</small>
        <code>{['"3"', '"0"', '"three"'][index]}</code>
        <span className="type-pill pill-str">str</span>
      </div>
      <span className="pipeline-arrow" aria-hidden="true">➔</span>
      <div className="pipeline-step">
        <small>2. input() returns</small>
        <samp>{['"3"', '"0"', '"three"'][index]}</samp>
        <span className="step-note">Always text string</span>
      </div>
      <span className="pipeline-arrow" aria-hidden="true">➔</span>
      <div className={`pipeline-step ${index===2?'pipeline-error':'pipeline-ok'}`}>
        <small>3. int(input())</small>
        <strong>{index===2 ? 'ValueError!' : ['3', '0'][index]}</strong>
        <span className={`type-pill ${index===2?'pill-err':'pill-int'}`}>{index===2 ? 'Error' : 'int'}</span>
      </div>
      <span className="pipeline-arrow" aria-hidden="true">➔</span>
      <div className="pipeline-step">
        <small>4. tickets × ₹40</small>
        <strong>{index===2 ? 'Crashes without try' : '₹' + ([3, 0][index] * 40)}</strong>
      </div>
    </div>}

    {/* Chapter 5: Packaging Full Boxes (//) & Leftovers (%) */}
    {chapter===5 && (() => {
      const total = [12, 17, 20][index];
      const fullBoxes = Math.floor(total / 5);
      const leftovers = total % 5;
      return <div className="model-packaging" aria-label="Packaging into boxes of 5">
        <div className="pack-summary">
          <span>Total items: <strong>{total} sweets</strong></span>
          <span>Box capacity: <strong>5 per box</strong></span>
        </div>
        <div className="pack-containers">
          <div className="pack-boxes">
            <div className="pack-header">
              <span className="pack-title">Full Boxes (// 5)</span>
              <strong className="pack-count">{fullBoxes} box{fullBoxes > 1 ? 'es' : ''}</strong>
            </div>
            <div className="boxes-grid">
              {Array.from({length: fullBoxes}).map((_, bi) => <div key={bi} className="sweet-box" aria-label={`Box ${bi+1} with 5 sweets`}>
                <small>Box {bi+1}</small>
                <div className="sweets-dots">
                  {[1,2,3,4,5].map(d => <span key={d} className="sweet-dot" aria-hidden="true">🍬</span>)}
                </div>
              </div>)}
            </div>
          </div>
          <div className="pack-leftovers">
            <div className="pack-header">
              <span className="pack-title">Leftover Loose (% 5)</span>
              <strong className="pack-count">{leftovers} loose</strong>
            </div>
            <div className="leftovers-tray" aria-label={`${leftovers} leftover sweets`}>
              {leftovers > 0 ? (
                <div className="sweets-dots loose">
                  {Array.from({length: leftovers}).map((_, li) => <span key={li} className="sweet-dot loose-dot" aria-hidden="true">🍬</span>)}
                </div>
              ) : (
                <small className="no-leftovers">0 loose (Divided evenly!)</small>
              )}
            </div>
          </div>
        </div>
      </div>;
    })()}

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
    <MemoryHint english={model.remember} roman={romanHints[chapter]}/>
    <p><strong><span aria-hidden="true">📊 </span>{chapter===15?'Useful later':chapter===0?'Where you’ll use this':'Data and everyday applications'}</strong> {model.application}</p>
    <small>Teaching model. Use the Python editor to run and change code.</small>
  </div>;
}
