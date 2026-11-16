import {useState} from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Clock,
  ShieldCheck,
  FileCode,
  Cpu
} from 'lucide-react';
import type {AdvancedVisualizerConfig} from '../data/advancedPath';

type Props = {
  config: AdvancedVisualizerConfig;
};

export default function AdvancedVisualizer({config}: Props) {
  const {type, title, subtitle, data} = config;

  if (type === 'composition') {
    return <CompositionVisualizer title={title} subtitle={subtitle} data={data} />;
  }

  if (type === 'decorator-flow') {
    return <DecoratorFlowVisualizer title={title} subtitle={subtitle} data={data} />;
  }

  if (type === 'exception-lifecycle') {
    return <ExceptionLifecycleVisualizer title={title} subtitle={subtitle} data={data} />;
  }

  if (type === 'complexity-matrix') {
    return <ComplexityMatrixVisualizer title={title} subtitle={subtitle} data={data} />;
  }

  if (type === 'refactor-pipeline') {
    return <RefactorPipelineVisualizer title={title} subtitle={subtitle} data={data} />;
  }

  return null;
}

function CompositionVisualizer({title, subtitle, data}: {title: string; subtitle: string; data: any}) {
  const [items, setItems] = useState([
    {id: 1, name: 'Mechanical Keyboard', price: 89.99, qty: 1},
    {id: 2, name: 'USB-C Cable', price: 12.50, qty: 2},
    {id: 3, name: 'Desk Mat', price: 24.00, qty: 1},
  ]);

  const totalItems = items.reduce((sum, it) => sum + it.qty, 0);
  const totalPrice = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  function adjustQty(id: number, delta: number) {
    setItems(prev =>
      prev.map(it => {
        if (it.id === id) {
          const next = Math.max(1, it.qty + delta);
          return {...it, qty: next};
        }
        return it;
      })
    );
  }

  return (
    <div className="card advanced-visualizer" data-testid="visualizer-composition">
      <div className="visualizer-header">
        <div className="visualizer-badge">
          <Layers size={16} /> Interactive Architecture Model
        </div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="composition-demo-container">
        <div className="composition-container-box">
          <div className="box-title">
            <strong>class ShoppingCart</strong>
            <span className="pill small purple">Container Object</span>
          </div>
          <p className="box-caption">
            Stores a list of <code>Item</code> objects. Implements <code>__len__</code>, <code>__repr__</code>, and <code>@property total</code>.
          </p>

          <div className="composed-items-grid">
            {items.map(item => (
              <div key={item.id} className="composed-item-card">
                <div className="item-meta">
                  <strong>{item.name}</strong>
                  <span className="pill small">\${item.price.toFixed(2)}</span>
                </div>
                <div className="item-controls">
                  <span className="qty-label">Qty:</span>
                  <button
                    className="button small icon-btn"
                    onClick={() => adjustQty(item.id, -1)}
                    disabled={item.qty <= 1}
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    -
                  </button>
                  <span className="qty-val">{item.qty}</span>
                  <button
                    className="button small icon-btn"
                    onClick={() => adjustQty(item.id, 1)}
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    +
                  </button>
                </div>
                <div className="item-subtotal">
                  Subtotal: <strong>\${(item.price * item.qty).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="dunder-evaluation-panel">
            <div className="dunder-row">
              <span className="dunder-sig">len(cart)</span>
              <span className="dunder-op">calls <code>__len__()</code></span>
              <strong className="dunder-res">{totalItems} total items</strong>
            </div>
            <div className="dunder-row">
              <span className="dunder-sig">cart.total</span>
              <span className="dunder-op">calls <code>@property total</code></span>
              <strong className="dunder-res">\${totalPrice.toFixed(2)}</strong>
            </div>
            <div className="dunder-row">
              <span className="dunder-sig">repr(cart)</span>
              <span className="dunder-op">calls <code>__repr__()</code></span>
              <strong className="dunder-res">ShoppingCart(items={items.length})</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DecoratorFlowVisualizer({title, subtitle, data}: {title: string; subtitle: string; data: any}) {
  const steps = [
    {stage: 'ENTRY', label: '1. Interception', desc: 'Caller invokes compute_analytics(id=42). Control transfers to wrapper(*args, **kwargs).', state: 'active'},
    {stage: 'PRE-HOOK', label: '2. Pre-Execution Hook', desc: 'Wrapper records start timestamp t0 = 10:00:00.000 and logs argument payload.', state: 'pre'},
    {stage: 'TARGET', label: '3. Underlying Function', desc: 'Wrapper executes original compute_analytics body: queries database and computes statistics.', state: 'target'},
    {stage: 'POST-HOOK', label: '4. Post-Execution Hook', desc: 'Wrapper computes elapsed time (142ms) and caches output in memory.', state: 'post'},
    {stage: 'EXIT', label: '5. Return Result', desc: 'Wrapper returns the computed payload back to the original caller with full transparency.', state: 'exit'},
  ];

  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="card advanced-visualizer" data-testid="visualizer-decorator-flow">
      <div className="visualizer-header">
        <div className="visualizer-badge">
          <Sparkles size={16} /> Call Stack Execution Trace
        </div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="decorator-trace-stepper">
        <div className="stepper-controls">
          <button
            className="button small"
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
          >
            <ArrowLeft size={14} /> Previous Stage
          </button>
          <span className="step-indicator">
            Stage {activeStep + 1} of {steps.length}
          </span>
          <button
            className="button small primary"
            onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={activeStep === steps.length - 1}
          >
            Next Stage <ArrowRight size={14} />
          </button>
          <button
            className="button small text-btn"
            onClick={() => setActiveStep(0)}
            title="Reset to Stage 1"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        <div className="trace-stages-list">
          {steps.map((st, idx) => {
            const isCurrent = idx === activeStep;
            const isDone = idx < activeStep;
            return (
              <div
                key={st.stage}
                className={`trace-stage-card ${isCurrent ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                onClick={() => setActiveStep(idx)}
              >
                <div className="stage-top">
                  <span className="stage-badge">{st.stage}</span>
                  <strong>{st.label}</strong>
                  {isDone && <CheckCircle2 size={16} className="text-success" />}
                </div>
                <p className="stage-desc">{st.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ExceptionLifecycleVisualizer({title, subtitle}: {title: string; subtitle: string; data: any}) {
  const [scenario, setScenario] = useState<'success' | 'error'>('success');

  return (
    <div className="card advanced-visualizer" data-testid="visualizer-exception-lifecycle">
      <div className="visualizer-header">
        <div className="visualizer-badge">
          <ShieldCheck size={16} /> Error Flow State Machine
        </div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="scenario-selector-tabs">
        <button
          className={`button ${scenario === 'success' ? 'primary' : ''}`}
          onClick={() => setScenario('success')}
        >
          Scenario A: Clean Run (Zero Errors)
        </button>
        <button
          className={`button ${scenario === 'error' ? 'primary' : ''}`}
          onClick={() => setScenario('error')}
        >
          Scenario B: Exception Raised (Handled)
        </button>
      </div>

      <div className="exception-flow-diagram">
        <div className="flow-step try-step active">
          <div className="flow-header">
            <code>try:</code>
            <span className="pill small easy">Step 1</span>
          </div>
          <p>Execute protected operations (e.g. <code>db.query()</code>)</p>
        </div>

        <div className="flow-branch-indicator">
          {scenario === 'success' ? (
            <span className="branch-tag success">✓ No Exceptions Raised</span>
          ) : (
            <span className="branch-tag danger">✕ TimeoutError Raised!</span>
          )}
        </div>

        <div className="flow-branches-container">
          <div className={`flow-step except-step ${scenario === 'error' ? 'active alert' : 'dimmed'}`}>
            <div className="flow-header">
              <code>except TimeoutError:</code>
              <span className="pill small">{scenario === 'error' ? 'Runs Now' : 'Skipped'}</span>
            </div>
            <p>Rolls back transaction and logs diagnostic alert.</p>
          </div>

          <div className={`flow-step else-step ${scenario === 'success' ? 'active success' : 'dimmed'}`}>
            <div className="flow-header">
              <code>else:</code>
              <span className="pill small">{scenario === 'success' ? 'Runs Now' : 'Skipped'}</span>
            </div>
            <p>Commits changes. Runs ONLY when try had zero errors.</p>
          </div>
        </div>

        <div className="flow-step finally-step active permanent">
          <div className="flow-header">
            <code>finally:</code>
            <span className="pill small purple">Unconditional Final Step</span>
          </div>
          <p>
            Always executes in both scenarios! Closes socket connection and releases mutex locks.
          </p>
        </div>
      </div>
    </div>
  );
}

function ComplexityMatrixVisualizer({title, subtitle}: {title: string; subtitle: string; data: any}) {
  const [n, setN] = useState<number>(1000);

  const calculateSteps = (type: string, val: number): string => {
    switch (type) {
      case 'O(1)':
        return '1 op';
      case 'O(log n)':
        return `${Math.ceil(Math.log2(val))} ops`;
      case 'O(n)':
        return `${val.toLocaleString()} ops`;
      case 'O(n log n)':
        return `${Math.ceil(val * Math.log2(val)).toLocaleString()} ops`;
      case 'O(n^2)':
        return (val * val).toLocaleString() + (val >= 10000 ? ' (CRASH!)' : ' ops');
      default:
        return '-';
    }
  };

  return (
    <div className="card advanced-visualizer" data-testid="visualizer-complexity-matrix">
      <div className="visualizer-header">
        <div className="visualizer-badge">
          <Cpu size={16} /> Big-O Computational Matrix
        </div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="complexity-slider-panel">
        <label htmlFor="n-slider" className="slider-label-row">
          <span>Input Data Size (n): <strong>{n.toLocaleString()} items</strong></span>
          <span className="hint-sub">Slide to inspect operation count explosion</span>
        </label>
        <input
          id="n-slider"
          type="range"
          min="10"
          max="10000"
          step="50"
          value={n}
          onChange={e => setN(Number(e.target.value))}
          className="complexity-range"
        />
        <div className="preset-buttons">
          {[10, 100, 1000, 5000, 10000].map(val => (
            <button
              key={val}
              className={`button small ${n === val ? 'primary' : ''}`}
              onClick={() => setN(val)}
            >
              n = {val.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="complexity-grid">
        {[
          {notation: 'O(1)', name: 'Constant Time', desc: 'Hash set lookup, dict[key]', severity: 'easy'},
          {notation: 'O(log n)', name: 'Logarithmic Time', desc: 'Binary search', severity: 'easy'},
          {notation: 'O(n)', name: 'Linear Time', desc: 'List in check, min/max', severity: 'medium'},
          {notation: 'O(n log n)', name: 'Linearithmic Time', desc: 'TimSort sorted()', severity: 'medium'},
          {notation: 'O(n^2)', name: 'Quadratic Time', desc: 'Nested loops, list.pop(0) loop', severity: 'hard'},
        ].map(item => (
          <div key={item.notation} className={`complexity-card ${item.severity}`}>
            <span className="notation-badge">{item.notation}</span>
            <strong>{item.name}</strong>
            <small>{item.desc}</small>
            <div className="operation-count">
              <span>Steps for n={n.toLocaleString()}:</span>
              <strong>{calculateSteps(item.notation, n)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RefactorPipelineVisualizer({title, subtitle}: {title: string; subtitle: string; data: any}) {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      name: 'Monolithic Code',
      badge: 'Anti-Pattern',
      color: 'danger',
      code: `def process_orders(filename):\n    # 150 lines: reads file, parses csv, validates,\n    # applies discounts, prints console, writes db.\n    # Impossible to unit test individual rules!`,
      takeaway: 'Tightly coupled; one bug crashes everything; zero test isolation.',
    },
    {
      name: 'Stage 1: Pure Parsing',
      badge: 'Single Responsibility',
      color: 'purple',
      code: `def parse_orders(raw: str) -> list[dict]:\n    # Only converts raw text into structured dictionaries.\n    # Pure function: zero side effects, easy to test!`,
      takeaway: 'Receives string, outputs dicts. Tested with empty strings, bad delimiters.',
    },
    {
      name: 'Stage 2: Defensive Validation',
      badge: 'Invariant Guard',
      color: 'purple',
      code: `def validate_order(r: dict) -> Order:\n    # Verifies price > 0, non-empty SKU.\n    # Raises InvalidOrderError on bad data.`,
      takeaway: 'Guarantees downstream calculations only ever touch valid domain objects.',
    },
    {
      name: 'Stage 3: Automated Test Suite',
      badge: 'unittest Harness',
      color: 'easy',
      code: `class TestOrderPipeline(unittest.TestCase):\n    def test_valid_order(self):\n        self.assertEqual(validate_order(good).price, 25.0)\n    def test_negative_price(self):\n        with self.assertRaises(InvalidOrderError):\n            validate_order(bad)`,
      takeaway: 'Provides regression protection across all edge cases and future refactors.',
    },
  ];

  return (
    <div className="card advanced-visualizer" data-testid="visualizer-refactor-pipeline">
      <div className="visualizer-header">
        <div className="visualizer-badge">
          <FileCode size={16} /> Architectural Refactoring Pipeline
        </div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="refactor-tabs">
        {stages.map((st, idx) => (
          <button
            key={st.name}
            className={`button ${idx === activeStage ? 'primary' : ''}`}
            onClick={() => setActiveStage(idx)}
          >
            {st.name}
          </button>
        ))}
      </div>

      <div className="refactor-content-box">
        <div className="refactor-stage-header">
          <strong>{stages[activeStage].name}</strong>
          <span className={`pill small ${stages[activeStage].color}`}>{stages[activeStage].badge}</span>
        </div>
        <pre className="code-block-display">
          <code>{stages[activeStage].code}</code>
        </pre>
        <div className="takeaway-callout">
          <strong>Key Takeaway:</strong> {stages[activeStage].takeaway}
        </div>
      </div>
    </div>
  );
}
