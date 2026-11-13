import {useState} from 'react';
import type {Task} from '../data/types';
import {levels, type buildCatalog} from '../data/catalog.mjs';
import TaskCard from './TaskCard';

export default function PracticeView({tasks, catalog, solved, onSolve}: {
  tasks: Task[]; catalog: ReturnType<typeof buildCatalog>; solved: string[]; onSolve: (id: string) => void;
}) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [level, setLevel] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('course');
  const [open, setOpen] = useState<string>();
  const query = search.trim().toLowerCase();
  const filtered = tasks.filter(task =>
    (!topic || Number(topic) === task.chapter) && (!difficulty || difficulty === task.difficulty)
    && (!level || catalog.lessons.some(lesson => lesson.id === task.chapter && lesson.level === Number(level)))
    && `${task.title} ${task.prompt}`.toLowerCase().includes(query));
  if (sort === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title));
  return <>
    <p>{solved.length} of {catalog.taskIds.size} exercises solved. Checks run in your browser for practice.</p>
    <div className="catalog-filters">
      <label>Search challenges<input value={search} onChange={event => setSearch(event.target.value)}/></label>
      <label>Topic<select value={topic} onChange={event => setTopic(event.target.value)}>
        <option value="">All chapters</option>
        {catalog.lessons.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
      </select></label>
      <label>Difficulty<select value={difficulty} onChange={event => setDifficulty(event.target.value)}>
        <option value="">All difficulties</option>
        {['Easy', 'Medium', 'Challenge'].map(value => <option key={value}>{value}</option>)}
      </select></label>
      <label>Level<select value={level} onChange={event => setLevel(event.target.value)}>
        <option value="">All levels</option>
        {levels.filter(item => catalog.lessons.some(lesson => lesson.level === item.id))
          .map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
      </select></label>
      <label>Sort by<select value={sort} onChange={event => setSort(event.target.value)}>
        <option value="course">Course order</option><option value="name">Title</option>
      </select></label>
    </div>
    {!filtered.length && <p role="status">No challenges match your filters.</p>}
    {filtered.map(task => <section className="practice-item" key={task.id}>
      <button className="practice-toggle" aria-expanded={open === task.id} onClick={() => setOpen(open === task.id ? undefined : task.id)}>
        <strong>{task.title}</strong><span>{task.difficulty}{solved.includes(task.id) && ' · Solved'}</span>
      </button>
      {open === task.id && <>
        <a className="inline-link" href={`#/chapter/${task.chapter}`}>Review the lesson</a>
        <TaskCard task={task} solved={solved.includes(task.id)} onPass={() => onSolve(task.id)}/>
      </>}
    </section>)}
  </>;
}
