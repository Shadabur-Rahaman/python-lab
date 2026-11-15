import {useState} from 'react';
import type {Task} from '../data/types';
import {levels, type buildCatalog} from '../data/catalog.mjs';
import {pilotActivities} from '../data/pilotActivities';
import TaskCard from './TaskCard';
import CodeLab from './CodeLab';
import {CheckCircle2, Clock, Circle, ArrowRight, Sparkles, Wrench, FileCode} from 'lucide-react';

export default function PracticeView({
  tasks, catalog, solved, attempted = [], onSolve, onAttempt, selectedTask,
}: {
  selectedTask?: string;
  tasks: Task[];
  catalog: ReturnType<typeof buildCatalog>;
  solved: string[];
  attempted?: string[];
  onSolve: (id: string) => void;
  onAttempt?: (id: string) => void;
}) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');
  const [level, setLevel] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('course');
  const [open, setOpen] = useState<string | undefined>(selectedTask);

  const totalTasks = catalog.taskIds.size;
  const solvedCount = tasks.filter(t => solved.includes(t.id)).length;
  const inProgressCount = tasks.filter(t => attempted.includes(t.id) && !solved.includes(t.id)).length;
  const percent = totalTasks > 0 ? Math.round((solvedCount / totalTasks) * 100) : 0;

  // Find next unfinished task
  const nextUnsolved = tasks.find(t => !solved.includes(t.id));

  const query = search.trim().toLowerCase();
  const filtered = tasks.filter(task => {
    if (topic && Number(topic) !== task.chapter) return false;
    if (difficulty && difficulty !== task.difficulty) return false;
    if (level && !catalog.lessons.some(lesson => lesson.id === task.chapter && lesson.level === Number(level))) return false;
    if (statusFilter === 'solved' && !solved.includes(task.id)) return false;
    if (statusFilter === 'attempted' && (!attempted.includes(task.id) || solved.includes(task.id))) return false;
    if (statusFilter === 'not-attempted' && (attempted.includes(task.id) || solved.includes(task.id))) return false;
    if (query && !`${task.title} ${task.prompt}`.toLowerCase().includes(query)) return false;
    return true;
  });

  if (sort === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title));

  return <>
    <div className="card practice-stats-hero">
      <div className="practice-stats-main">
        <div>
          <h2>Practice & Problem-Solving Studio</h2>
          <p>
            Build real programming confidence. Predict outcomes, fix authentic bugs, and write clean, working Python solutions.
          </p>
        </div>
        <div className="practice-hero-metrics">
          <div className="hero-metric-item">
            <strong>{solvedCount}</strong>
            <span>Verified Solved</span>
          </div>
          <div className="hero-metric-item">
            <strong>{inProgressCount}</strong>
            <span>In Progress</span>
          </div>
          <div className="hero-metric-item">
            <strong>{totalTasks - solvedCount - inProgressCount}</strong>
            <span>Remaining</span>
          </div>
        </div>
      </div>
      <div className="progress-bar-container" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-bar-fill" style={{width: `${percent}%`}}/>
      </div>
      <div className="practice-hero-actions">
        <span>{solvedCount} of {totalTasks} coding challenges verified ({percent}% complete)</span>
        {nextUnsolved && (
          <button
            type="button"
            className="button small primary"
            onClick={() => setOpen(nextUnsolved.id)}
          >
            Continue with: {nextUnsolved.title} <ArrowRight size={13}/>
          </button>
        )}
      </div>
    </div>

    <div className="catalog-filters">
      <label>Search challenges
        <input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Filter by title or prompt keyword…"
        />
      </label>
      <label>Topic
        <select value={topic} onChange={event => setTopic(event.target.value)}>
          <option value="">All chapters</option>
          {catalog.lessons.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.id}. {lesson.title}</option>)}
        </select>
      </label>
      <label>Status
        <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
          <option value="">All statuses</option>
          <option value="solved">Verified solved</option>
          <option value="attempted">Attempted (in progress)</option>
          <option value="not-attempted">Not attempted</option>
        </select>
      </label>
      <label>Difficulty
        <select value={difficulty} onChange={event => setDifficulty(event.target.value)}>
          <option value="">All difficulties</option>
          {['Easy', 'Medium', 'Challenge'].map(value => <option key={value}>{value}</option>)}
        </select>
      </label>
      <label>Level
        <select value={level} onChange={event => setLevel(event.target.value)}>
          <option value="">All levels</option>
          {levels.filter(item => catalog.lessons.some(lesson => lesson.level === item.id))
            .map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label>
      <label>Sort by
        <select value={sort} onChange={event => setSort(event.target.value)}>
          <option value="course">Course order</option>
          <option value="name">Title</option>
        </select>
      </label>
    </div>

    {!filtered.length && <p role="status" className="card">No challenges match your filters.</p>}

    <div className="practice-challenges-list">
      {filtered.map(task => {
        const isSolved = solved.includes(task.id);
        const isAttempted = attempted.includes(task.id);
        return (
          <section className="practice-item" key={task.id}>
            <button
              className="practice-toggle"
              aria-expanded={open === task.id}
              onClick={() => setOpen(open === task.id ? undefined : task.id)}
            >
              <div className="practice-toggle-left">
                <strong>{task.title}</strong>
                <small>Chapter {task.chapter} · {task.difficulty}</small>
              </div>
              <div className="practice-toggle-right">
                {isSolved ? (
                  <span className="task-status-tag solved"><CheckCircle2 size={13}/> Solved</span>
                ) : isAttempted ? (
                  <span className="task-status-tag attempted"><Clock size={13}/> Attempted</span>
                ) : (
                  <span className="task-status-tag not-attempted"><Circle size={13}/> Not attempted</span>
                )}
              </div>
            </button>
            {open === task.id && (
              <div className="practice-item-content">
                <div className="practice-item-topbar">
                  <a className="inline-link" href={`#/chapter/${task.chapter}`}>← Review Chapter {task.chapter} lesson</a>
                </div>
                <TaskCard
                  task={task}
                  solved={isSolved}
                  attempted={isAttempted}
                  onPass={() => onSolve(task.id)}
                  onAttempt={() => onAttempt?.(task.id)}
                />
              </div>
            )}
          </section>
        );
      })}
    </div>
  </>;
}
