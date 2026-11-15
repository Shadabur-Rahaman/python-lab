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

    {/* Chapter 6: Decision Branching Visualizer */}
    {chapter===6 && (() => {
      const score = [39, 40, 72][index];
      const isPass = score >= 40;
      return <div className="model-decision-branch" aria-label="Decision branching paths">
        <div className="decision-condition-card">
          <span className="condition-label">Evaluated Condition</span>
          <code className="condition-code">marks &gt;= 40 <span className="condition-eval">({score} &gt;= 40 ➔ <strong>{isPass ? 'True' : 'False'}</strong>)</span></code>
        </div>
        <div className="decision-fork">
          <div className={`branch-card branch-true ${isPass ? 'branch-active' : 'branch-dimmed'}`} aria-label="True branch: Pass">
            <div className="branch-header">
              <span className="branch-tag tag-true">True branch (if)</span>
              {isPass && <span className="branch-status-badge">✓ Running</span>}
            </div>
            <code>print("Pass")</code>
            <small className="branch-outcome">Executed when score is 40 or higher</small>
          </div>
          <div className={`branch-card branch-false ${!isPass ? 'branch-active' : 'branch-dimmed'}`} aria-label="False branch: Review">
            <div className="branch-header">
              <span className="branch-tag tag-false">False branch (else)</span>
              {!isPass && <span className="branch-status-badge">✓ Running</span>}
            </div>
            <code>print("Review")</code>
            <small className="branch-outcome">Executed when score is under 40</small>
          </div>
        </div>
        <div className="decision-output-row">
          <span className="output-label">Terminal Output:</span>
          <samp className="terminal-samp">{isPass ? 'Pass' : 'Review'}</samp>
          <span className="decision-hint-pill"><small>Tip: <code>==</code> checks equality; <code>=</code> assigns</small></span>
        </div>
      </div>;
    })()}

    {/* Chapter 7: Loop & Iteration Step Tracer */}
    {chapter===7 && (() => {
      const sales = [120, 80, 50];
      const totals = [0, 120, 200, 250];
      const currentTotal = totals[index];
      return <div className="model-loop-tracer" aria-label="Loop step tracer">
        <div className="loop-status-header">
          <span className="loop-iteration-badge">
            {index === 0 ? 'Ready: Before entering loop' : index === 3 ? 'Completed: 3 of 3 iterations processed' : `Iteration ${index} of 3`}
          </span>
          <span className="loop-accumulator-badge">
            running_total: <strong>₹{currentTotal}</strong>
          </span>
        </div>

        <ol className="model-cells" aria-label="Transaction rows">
          {sales.map((sale, i) => {
            const isProcessed = i < index;
            const isCurrent = i === index - 1;
            return <li key={sale} data-selected={isProcessed} aria-current={isCurrent ? 'step' : undefined}>
              <small>Row {i + 1}</small>
              <strong>₹{sale}</strong>
              <small className={isCurrent ? 'chip-current' : isProcessed ? 'chip-done' : 'chip-wait'}>
                {isCurrent ? '▶ Active' : isProcessed ? '✓ Counted' : 'Waiting'}
              </small>
            </li>;
          })}
        </ol>

        <div className="loop-trace-explanation">
          {index === 0 && <small>The loop is ready. <code>total = 0</code> is initialized before the loop starts.</small>}
          {index === 1 && <small>Pass 1: row 1 value (₹120) added. <code>total = 0 + 120 = 120</code>.</small>}
          {index === 2 && <small>Pass 2: row 2 value (₹80) added. <code>total = 120 + 80 = 200</code>.</small>}
          {index === 3 && <small>Pass 3: row 3 value (₹50) added. <code>total = 200 + 50 = 250</code>. All rows done!</small>}
        </div>
      </div>;
    })()}

    {/* Chapter 8: Sequence Dual-Index & Slice Visualizer */}
    {chapter===8 && (() => {
      const chars = [...'PYTHON'];
      const negIndices = [-6, -5, -4, -3, -2, -1];
      return <div className="model-string-explorer" aria-label="String sequence and dual indexing">
        <div className="dual-index-grid">
          <div className="index-row pos-indices" aria-label="Positive indexes">
            <span className="index-row-label">Positive index:</span>
            <div className="indices-cells">
              {chars.map((_, i) => <span key={i} className={`idx-cell ${i === index ? 'idx-active' : ''}`}>+{i}</span>)}
            </div>
          </div>

          <ol className="model-cells char-cells" aria-label="String positions">
            {chars.map((value, i) => <li key={i} data-selected={i === index}>
              <small>Index {i}</small>
              <strong>{value}</strong>
              {i === index && <small>Selected</small>}
            </li>)}
          </ol>

          <div className="index-row neg-indices" aria-label="Negative indexes">
            <span className="index-row-label">Negative index:</span>
            <div className="indices-cells">
              {negIndices.map((neg, i) => <span key={neg} className={`idx-cell ${i === index ? 'idx-active' : ''}`}>{neg}</span>)}
            </div>
          </div>
        </div>

        <div className="string-slice-card">
          <div className="slice-preview">
            <span className="slice-label">Slice example:</span>
            <code>"PYTHON"[0:3] ➔ <span className="slice-result">"PYT"</span></code>
            <small className="slice-note">(Index 3 is the stop line: stop is excluded!)</small>
          </div>
          <div className="method-pill-row">
            <span className="method-pill">.strip() removes ends</span>
            <span className="method-pill">.lower() ➔ "python"</span>
            <span className="method-pill pill-immutable">🔒 Strings are immutable</span>
          </div>
        </div>
      </div>;
    })()}

    {/* Chapter 9: List Tray vs Tuple Record Visualizer */}
    {chapter===9 && (() => {
      const scores = [72, 84, 91];
      return <div className="model-sequence-tray" aria-label="List tray and tuple comparison">
        <div className="tray-section list-tray">
          <div className="tray-header">
            <span className="tray-title">Mutable List: <code>scores = [72, 84, 91]</code></span>
            <span className="tray-badge badge-mutable">Editable [ ]</span>
          </div>

          <ol className="model-cells list-cells" aria-label="List positions">
            {scores.map((value, i) => <li key={i} data-selected={i === index}>
              <small>Index {i}</small>
              <strong>{value}</strong>
              {i === index && <small>Selected</small>}
            </li>)}
          </ol>

          <div className="list-operations-preview">
            <div className="op-chip">
              <small>Read item</small>
              <code>scores[{index}] ➔ {scores[index]}</code>
            </div>
            <div className="op-chip">
              <small>Update item</small>
              <code>scores[0] = 85</code>
            </div>
            <div className="op-chip">
              <small>Add item</small>
              <code>scores.append(100)</code>
            </div>
          </div>
        </div>

        <div className="tray-section tuple-tray">
          <div className="tray-header">
            <span className="tray-title">Immutable Tuple: <code>point = (19.07, 72.87)</code></span>
            <span className="tray-badge badge-locked">🔒 Sealed ( )</span>
          </div>
          <div className="tuple-body">
            <code>point[0] = 20.0</code>
            <span className="tuple-error-note">➔ Raises <strong>TypeError</strong>: tuple does not allow item assignment</span>
          </div>
        </div>
      </div>;
    })()}

    {/* Chapter 10: Dictionary Key-Value & Set Deduplication Visualizer */}
    {chapter===10 && (() => {
      const keys = ['name', 'price', 'stock', 'category'];
      const selectedKey = keys[index];
      const dictValues: Record<string, string | number> = {name: 'Notebook', price: 80, stock: 3};
      const hasKey = selectedKey in dictValues;
      const val = dictValues[selectedKey];

      return <div className="model-dict-set" aria-label="Dictionary and set visualizer">
        <div className="dict-lookup-card">
          <div className="dict-header">
            <span className="dict-title">Dictionary: <code>product = &#123;"name": "Notebook", "price": 80, "stock": 3&#125;</code></span>
            <span className="dict-badge">Key ➔ Value</span>
          </div>
          <div className="lookup-flow">
            <div className="lookup-key-box">
              <small>Selected Key</small>
              <strong>"{selectedKey}"</strong>
            </div>
            <span className="lookup-arrow" aria-hidden="true">➔</span>
            <div className={`lookup-val-box ${hasKey ? 'val-found' : 'val-missing'}`}>
              <small>{hasKey ? 'Retrieved Value' : 'Missing Key'}</small>
              <strong>{hasKey ? String(val) : 'KeyError with [ ]'}</strong>
              {!hasKey && <span className="get-fallback-badge">.get("{selectedKey}", "Unknown") ➔ "Unknown"</span>}
            </div>
          </div>
        </div>

        <div className="set-dedup-card">
          <div className="set-header">
            <span className="set-title">Set Deduplication: <code>set([101, 102, 101, 103])</code></span>
            <span className="set-badge">Unique Items Only</span>
          </div>
          <div className="set-transform-flow">
            <div className="set-input-box">
              <small>Input list with duplicates</small>
              <code>[101, 102, <span className="dup-item">101</span>, 103]</code>
            </div>
            <span className="set-funnel-arrow" aria-hidden="true">➔</span>
            <div className="set-result-box">
              <small>Unique set (len = 3)</small>
              <strong>&#123;101, 102, 103&#125;</strong>
            </div>
          </div>
        </div>
      </div>;
    })()}

    {/* Chapter 11: Function Machine Visualizer */}
    {chapter===11 && (() => {
      const prices = [20, 50, 80];
      const price = prices[index];
      const quantity = 3;
      const subtotal = price * quantity;
      return <div className="model-function-machine" aria-label="Function execution and return flow">
        <div className="function-pipeline">
          <div className="function-stage stage-inputs">
            <span className="fn-stage-label">1. Inputs (Arguments)</span>
            <div className="fn-arg-card">
              <code>price = <strong>{price}</strong></code>
              <code>quantity = <strong>{quantity}</strong></code>
            </div>
          </div>

          <span className="fn-pipe-arrow" aria-hidden="true">➔</span>

          <div className="function-stage stage-body">
            <span className="fn-stage-label">2. Function (Local Scope)</span>
            <div className="fn-body-card">
              <span className="fn-sig">def calculate_bill(price, quantity):</span>
              <div className="fn-calc">
                <small>Local calculation:</small>
                <code>total = {price} × {quantity} = <strong>{subtotal}</strong></code>
              </div>
              <div className="fn-return-line">
                <code>return total <span className="return-badge">➔ {subtotal}</span></code>
              </div>
            </div>
          </div>

          <span className="fn-pipe-arrow" aria-hidden="true">➔</span>

          <div className="function-stage stage-output">
            <span className="fn-stage-label">3. Caller & Screen Output</span>
            <div className="fn-output-card">
              <span className="fn-caller">result = calculate_bill({price}, {quantity})</span>
              <div className="output-preview">
                <small>Terminal print:</small>
                <samp className="terminal-samp">{subtotal}</samp>
              </div>
            </div>
          </div>
        </div>

        <div className="function-distinction-banner">
          <div className="distinction-item">
            <span className="distinction-tag tag-return">return</span>
            <span>Sends data back to code so other functions or calculations can use it.</span>
          </div>
          <div className="distinction-item">
            <span className="distinction-tag tag-print">print()</span>
            <span>Only displays characters on the screen; does not give a usable value to code.</span>
          </div>
        </div>
      </div>;
    })()}

    {/* Chapter 12: Project Builder & Architecture Visualizer */}
    {chapter===12 && (() => {
      const cases = [
        {name: 'Normal division', op: '8 ÷ 2', code: '8 / 2', result: '4.0', status: 'Valid operation', type: 'success'},
        {name: 'Negative result', op: '−8 ÷ 2', code: '-8 / 2', result: '-4.0', status: 'Signed calculation', type: 'success'},
        {name: 'Zero divisor', op: '8 ÷ 0', code: '8 / 0', result: 'ZeroDivisionError handled', status: 'Handled gracefully', type: 'error'}
      ];
      const curCase = cases[index];
      return <div className="model-project-builder" aria-label="Project architecture and data flow">
        <div className="project-flow-card">
          <div className="project-flow-header">
            <span className="project-title">Mini-Project Architecture: <code>Safe Calculator</code></span>
            <span className={`project-case-badge ${curCase.type==='error'?'badge-guard':'badge-pass'}`}>
              {curCase.status}
            </span>
          </div>

          <div className="project-stages-grid">
            <div className="project-stage">
              <small>1. Raw Inputs</small>
              <code>{curCase.op}</code>
            </div>
            <span className="proj-arrow" aria-hidden="true">➔</span>
            <div className="project-stage">
              <small>2. Guard & Logic</small>
              <code>{index===2 ? 'try / except ZeroDivisionError' : curCase.code}</code>
            </div>
            <span className="proj-arrow" aria-hidden="true">➔</span>
            <div className="project-stage">
              <small>3. Verified Result</small>
              <strong className={curCase.type==='error'?'text-err':'text-ok'}>{curCase.result}</strong>
            </div>
          </div>
        </div>

        <div className="project-blueprint-card">
          <span className="blueprint-title">7-Stage Project Engineering Workflow</span>
          <div className="blueprint-steps">
            {[
              {n:1, label:'Understand'},
              {n:2, label:'Inputs'},
              {n:3, label:'Plan Logic'},
              {n:4, label:'Implement'},
              {n:5, label:'Test'},
              {n:6, label:'Fix Bugs'},
              {n:7, label:'Reflect'}
            ].map(s => <div key={s.n} className="blueprint-step-pill">
              <span className="step-badge">{s.n}</span>
              <span>{s.label}</span>
            </div>)}
          </div>
        </div>
      </div>;
    })()}

    {/* Chapter 13: Data Transformation Pipeline */}
    {chapter===13 && (() => {
      const thresholds = [50, 100, 200];
      const threshold = thresholds[index];
      const rawExpenses = [50, 100, 200];
      const filtered = rawExpenses.filter(x => x >= threshold);

      return <div className="model-data-pipeline" aria-label="Data transformation pipeline">
        <div className="pipeline-container">
          <div className="data-source-section">
            <span className="pipe-header-label">1. Source Collection: <code>expenses = [50, 100, 200]</code></span>
            <div className="data-cards-row">
              {rawExpenses.map(item => {
                const passes = item >= threshold;
                return <div key={item} className={`data-chip ${passes ? 'chip-pass' : 'chip-skip'}`}>
                  <strong>₹{item}</strong>
                  <span className="chip-eval-tag">{passes ? '✓ Keep' : '✗ Skip'}</span>
                  <small className="chip-condition">{item} &gt;= {threshold}</small>
                </div>;
              })}
            </div>
          </div>

          <div className="comprehension-anatomy-card">
            <span className="pipe-header-label">2. List Comprehension Anatomy</span>
            <div className="comprehension-code-block">
              <code>
                [<span className="comp-expr">item</span> for <span className="comp-var">item</span> in <span className="comp-source">expenses</span> if <span className="comp-cond">item &gt;= {threshold}</span>]
              </code>
            </div>
            <div className="comprehension-legend">
              <span className="legend-item"><span className="legend-dot dot-expr"></span>Output expression</span>
              <span className="legend-item"><span className="legend-dot dot-source"></span>Iteration</span>
              <span className="legend-item"><span className="legend-dot dot-cond"></span>Filter condition</span>
            </div>
          </div>

          <div className="pipeline-result-section">
            <span className="pipe-header-label">3. Transformed Result: Brand-New List</span>
            <div className="result-row">
              <code>large = [{filtered.join(', ')}]</code>
              <span className="result-meta-pill">Length: {filtered.length} items (Source list remains untouched!)</span>
            </div>
          </div>
        </div>
      </div>;
    })()}

    {/* Chapter 14: File Processing Journey */}
    {chapter===14 && (() => {
      const fileStates = [
        {name: 'Valid JSON', file: 'data.json', text: '{"units": 3}', result: "{'units': 3}", error: null, note: 'Parsed into Python dictionary successfully.'},
        {name: 'Missing file', file: 'data.json (absent)', text: 'No file at path', result: 'Handled: FileNotFoundError', error: 'FileNotFoundError', note: 'Caught by except FileNotFoundError: fallback [] returned.'},
        {name: 'Malformed JSON', file: 'data.json (corrupt)', text: '{"units": }', result: 'Handled: JSONDecodeError', error: 'JSONDecodeError', note: 'Caught by except json.JSONDecodeError: fallback [] returned.'}
      ];
      const curState = fileStates[index];
      const isOk = !curState.error;

      return <div className="model-file-journey" aria-label="File loading and exception handling flow">
        <div className="file-journey-steps">
          <div className="journey-step step-disk">
            <small>1. Virtual Storage</small>
            <div className="file-card">
              <span className="file-icon" aria-hidden="true">📄</span>
              <span className="file-name">{curState.file}</span>
              <code className="file-preview">{curState.text}</code>
            </div>
          </div>

          <span className="journey-arrow" aria-hidden="true">➔</span>

          <div className="journey-step step-operation">
            <small>2. Safe Read Operation</small>
            <div className="op-card">
              <code>try:</code>
              <code>&nbsp;&nbsp;data = json.loads(text)</code>
              <code>except (FileNotFoundError, JSONDecodeError):</code>
              <code>&nbsp;&nbsp;data = []</code>
            </div>
          </div>

          <span className="journey-arrow" aria-hidden="true">➔</span>

          <div className={`journey-step step-outcome ${isOk ? 'outcome-success' : 'outcome-handled'}`}>
            <small>3. Program State</small>
            <div className="outcome-card">
              <strong className="outcome-val">{curState.result}</strong>
              <small className="outcome-note">{curState.note}</small>
              <span className="safety-badge">🛡️ Program does not crash</span>
            </div>
          </div>
        </div>
      </div>;
    })()}

    {/* Chapter 15: Object State & Class Visualizer */}
    {chapter===15 && (() => {
      const itemsCount = index;
      const prices = [40, 40, 40];
      const cartAItems = prices.slice(0, itemsCount);
      const cartATotal = cartAItems.reduce((a, b) => a + b, 0);

      return <div className="model-object-state" aria-label="Object state and instance independence">
        <div className="instances-comparison">
          <div className="instance-card instance-a">
            <div className="instance-header">
              <span className="instance-title">Cart A <code>(Instance 1)</code></span>
              <span className="instance-badge badge-active">Modified {itemsCount}×</span>
            </div>
            <div className="instance-body">
              <div className="inst-row">
                <small>self.amounts:</small>
                <code>[{cartAItems.map(p => `₹${p}`).join(', ')}]</code>
              </div>
              <div className="inst-row">
                <small>self.total():</small>
                <strong className="inst-total">₹{cartATotal}</strong>
              </div>
            </div>
          </div>

          <div className="instance-card instance-b">
            <div className="instance-header">
              <span className="instance-title">Cart B <code>(Instance 2)</code></span>
              <span className="instance-badge badge-isolated">Independent</span>
            </div>
            <div className="instance-body">
              <div className="inst-row">
                <small>self.amounts:</small>
                <code>[]</code>
              </div>
              <div className="inst-row">
                <small>self.total():</small>
                <strong className="inst-total">₹0</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="state-independence-banner">
          <p>
            <strong>Key Insight:</strong> Cart B remains at <strong>0 items (₹0)</strong>! Changing Cart A's instance attributes does not affect Cart B.
          </p>
        </div>

        <div className="shared-state-warning-card">
          <div className="warning-header">
            <span className="warning-title">⚠️ Common Python Pitfall: Shared Mutable Class Attributes</span>
          </div>
          <div className="warning-comparison">
            <div className="code-contrast contrast-bad">
              <small>❌ Bug: Shared across all instances</small>
              <code>
                class Cart:<br/>
                &nbsp;&nbsp;amounts = [] # Shared list!
              </code>
            </div>
            <div className="code-contrast contrast-good">
              <small>✅ Correct: Private per instance</small>
              <code>
                def __init__(self):<br/>
                &nbsp;&nbsp;self.amounts = [] # New list per cart!
              </code>
            </div>
          </div>
        </div>
      </div>;
    })()}

    <ol className="model-flow" aria-live="polite">
      {stages.map((stage,i)=><li key={i}><small>{['Start','Operation','Result'][i]}</small><strong>{stage}</strong></li>)}
    </ol>
    <MemoryHint english={model.remember} roman={romanHints[chapter]}/>
    <p><strong><span aria-hidden="true">📊 </span>{chapter===15?'Useful later':chapter===0?'Where you’ll use this':'Data and everyday applications'}</strong> {model.application}</p>
    <small>Teaching model. Use the Python editor to run and change code.</small>
  </div>;
}
