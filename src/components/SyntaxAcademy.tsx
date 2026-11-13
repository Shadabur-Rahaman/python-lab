import {useState} from 'react';
import {categories, syntaxTopics, type Topic} from '../data/syntax';
import CodeLab from './CodeLab';
import Quiz from './Quiz';
import {syntaxCheck} from '../data/syntax/checks';
import {terms, glossaryLink} from '../data/glossary';

export const syntaxLink = (topic: Topic) => `#/syntax/${topic.category}/${topic.id}`;

function TopicView({topic, lessonTitle}: {topic: Topic; lessonTitle: string}) {
  return <article>
    <a className="text-link" href="#/syntax">← All syntax topics</a>
    <p>{categories[topic.category]} · {topic.difficulty} · Python {topic.since}+ for this example</p>
    <h2>{topic.title}</h2><p>{topic.definition}</p><p>{topic.use}</p>
    <div className="card"><h3>Syntax and symbols</h3><pre>{topic.format}</pre>
      <dl>{topic.symbols.map(([symbol, detail]) => <div key={symbol}><dt><code>{symbol}</code></dt><dd>{detail}</dd></div>)}</dl>
    </div>
    <h3>Try it in Python</h3>
    <CodeLab initial={topic.code} input={topic.input} expected={topic.output} label={`${topic.id}.py`}/>
    <details className="card"><summary>Expected output and execution trace</summary><pre>{topic.output}</pre><p>{topic.trace}</p></details>
    <div className="card"><h3>Common mistake</h3><p>{topic.pitfall}</p><details><summary>Show a working alternative</summary><pre>{topic.correction}</pre></details></div>
    <div className="card"><h3>Practice</h3><ol>{topic.practice.map(task => <li key={task}>{task}</li>)}</ol></div>
    <Quiz questions={[syntaxCheck(topic.id)]} onComplete={() => {}}/>
    <div className="card"><h3>Revision</h3><p>{topic.definition}</p>
      {terms.some(term => term.syntax === topic.id) && <p>Glossary · {terms.filter(term => term.syntax === topic.id).map(term =>
        <a className="inline-link" key={term.id} href={glossaryLink(term.id)}>{term.name}{' '}</a>)}</p>}
      <p>Related lesson and preparation · <a className="inline-link" href={`#/chapter/${topic.lesson}`}>{lessonTitle}</a></p>
      <p><a className="inline-link" href={`#/resources?topic=${topic.id}`}>Additional Study Materials</a></p>
      <a className="inline-link" href={topic.docs}>Official Python documentation</a>
    </div>
  </article>;
}

export default function SyntaxAcademy({category, id, lessons}: {
  category?: string; id?: string; lessons: {id: number; title: string}[];
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const selected = syntaxTopics.find(topic => topic.category === category && topic.id === id);
  if (category || id) return selected
    ? <TopicView key={selected.id} topic={selected} lessonTitle={lessons.find(lesson => lesson.id === selected.lesson)?.title ?? 'Chapter'}/>
    : <div className="card"><p>That syntax topic could not be found.</p><a className="inline-link" href="#/syntax">Browse syntax topics</a></div>;
  const results = syntaxTopics.filter(topic => (!filter || topic.category === filter) &&
    [topic.title, topic.id, topic.definition, topic.format, ...topic.symbols.flat()].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <p>Browse runnable reference examples for Python 3.12. Built-ins and standard-library tools have their own sections.</p>
    <div className="catalog-filters">
      <label>Search syntax<input value={query} onChange={event => setQuery(event.target.value)}/></label>
      <label>Category<select value={filter} onChange={event => setFilter(event.target.value)}>
        <option value="">All categories</option>
        {Object.entries(categories).map(([key, title]) => <option key={key} value={key}>{title}</option>)}
      </select></label>
    </div>
    <p role="status">{results.length} topics</p>
    {Object.entries(categories).map(([key, title]) => {
      const entries = results.filter(topic => topic.category === key);
      return entries.length > 0 && <section className="catalog-level" key={key}><h2>{title}</h2>
        <div className="chapter-grid">{entries.map(topic => <a key={topic.id} className="card chapter-card" href={syntaxLink(topic)}>
          <h3>{topic.title}</h3><p>{topic.definition}</p><p>{topic.difficulty} · Python {topic.since}+</p>
        </a>)}</div></section>;
    })}
  </>;
}
