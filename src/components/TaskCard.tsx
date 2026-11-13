import {useState} from 'react';
import {Lightbulb} from 'lucide-react';
import type {Task} from '../data/types';
import CodeLab from './CodeLab';

export default function TaskCard({task, solved, onPass}: {task: Task; solved: boolean; onPass: () => void}) {
  const [hintCount, setHintCount] = useState(0);
  return <article className="card task-card">
    <div className="section-heading">
      <span className={`pill ${task.difficulty.toLowerCase()}`}>{task.difficulty}</span>
      <span>{solved ? '✓ Solved' : `Chapter ${task.chapter}`}</span>
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
    <CodeLab initial={task.starter} input={task.input} expected={task.expected} tests={task.tests}
      cases={task.cases} onPass={onPass} label={`${task.id}.py`}/>
    <div className="hint-area">
      <button className="button small" disabled={hintCount >= task.hints.length} onClick={() => setHintCount(hintCount + 1)}>
        <Lightbulb size={15}/> {hintCount >= task.hints.length ? 'All hints shown' : 'Reveal next hint'}
      </button>
      {task.hints.slice(0, hintCount).map(hint => <p key={hint}>{hint}</p>)}
      <details><summary>Reveal solution & explanation</summary><pre>{task.solution}</pre><p>{task.explanation}</p></details>
    </div>
  </article>;
}
