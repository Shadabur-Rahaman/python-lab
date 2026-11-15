import {useState} from 'react';
import {Lightbulb, CheckCircle2, Clock, Circle} from 'lucide-react';
import type {Task} from '../data/types';
import CodeLab from './CodeLab';

export default function TaskCard({
  task, solved, attempted = false, onPass, onAttempt,
}: {
  task: Task; solved: boolean; attempted?: boolean; onPass: () => void; onAttempt?: () => void;
}) {
  const [hintCount, setHintCount] = useState(0);
  const hintLabels = ['Hint 1 — Direction', 'Hint 2 — Specific Guidance', 'Hint 3 — Strong Hint'];

  return <article className="card task-card" id={`task-card-${task.id}`}>
    <div className="section-heading">
      <div className="task-header-left">
        <span className={`pill ${task.difficulty.toLowerCase()}`}>{task.difficulty}</span>
        <span className="task-chapter-tag">Chapter {task.chapter}</span>
      </div>
      <div className="task-status-indicator" role="status">
        {solved ? (
          <span className="status-badge solved"><CheckCircle2 size={13}/> ✓ Solved</span>
        ) : attempted ? (
          <span className="status-badge attempted"><Clock size={13}/> Attempted</span>
        ) : (
          <span className="status-badge not-attempted"><Circle size={13}/> Not attempted</span>
        )}
      </div>
    </div>
    <h3>{task.title}</h3>
    <p>{task.prompt}</p>
    <div className="expected">
      <b>{task.cases?.length ? 'Test cases' : 'Expected behavior'}</b>
      {task.cases?.length
        ? <details><summary>View {task.cases.length} checks</summary><ul>
            {task.cases.map(test => <li key={test.name}>{test.name}<pre>{test.check}</pre></li>)}
          </ul></details>
        : <pre>{task.tests ? 'Your function must pass the assertion suite.' : task.expected}</pre>}
      {task.tests && <details><summary>View assertions</summary><pre>{task.tests}</pre></details>}
    </div>
    <CodeLab
      key={task.id}
      draftId={'task-'+task.id}
      initial={task.starter}
      input={task.input}
      expected={task.expected}
      tests={task.tests}
      cases={task.cases}
      onPass={onPass}
      onAttempt={onAttempt}
      label={`${task.id}.py`}
    />
    <div className="hint-area">
      <button
        type="button"
        className="button small"
        disabled={hintCount >= task.hints.length}
        onClick={() => setHintCount(hintCount + 1)}
      >
        <Lightbulb size={15}/> {hintCount >= task.hints.length ? 'All 3 hints revealed' : `Reveal Hint ${hintCount + 1} of ${task.hints.length}`}
      </button>
      {task.hints.slice(0, hintCount).map((hint, idx) => (
        <div key={idx} className="progressive-hint-bubble">
          <strong>{hintLabels[idx] ?? `Hint ${idx + 1}`}:</strong> {hint}
        </div>
      ))}
      <details><summary>Reveal solution & explanation</summary><pre>{task.solution}</pre><p>{task.explanation}</p></details>
    </div>
  </article>;
}
