import ConceptModel from './ConceptModel';
import {storage} from '../lib/storage';
import {useState,useEffect} from 'react';
import {categories, syntaxTopics, type Topic} from '../data/syntax';
import CodeLab from './CodeLab';
import Quiz from './Quiz';
import {syntaxCheck} from '../data/syntax/checks';
import {terms, glossaryLink} from '../data/glossary';

const categoryIcons:Record<keyof typeof categories,string> = {
  fundamentals:'💡',literals:'🔢',operators:'➗',control:'🔀',collections:'📦',functions:'🧩',
  objects:'🏗️',errors:'🐛',modules:'📁',iteration:'🔁',advanced:'⚡',builtins:'🛠️',standard:'📚',
};

export const syntaxLink = (topic: Topic) => `#/syntax/${topic.category}/${topic.id}`;

const topicModels:Record<string,number> = {
  assignment:2,numbers:3,'input-output':1,arithmetic:5,conditions:6,loops:7,
  strings:8,parameters:11,comprehensions:13,classes:15,
};

function TopicView({topic, lessonTitle}: {topic: Topic; lessonTitle: string}) {
  const [reference,setReference]=useState(false);
  const [symbol,setSymbol]=useState(0);
  const chapterModel=topicModels[topic.id];
  useEffect(()=>{try {storage.setItem('python-lab.last-syntax',topic.id);} catch {}},[topic.id]);
  return <article className="syntax-topic">
    <a className="text-link" href="#/syntax">← All syntax topics</a>
    <p>{categories[topic.category]} · {topic.difficulty} · Python {topic.since}+ for this example</p>
    <h2>{topic.title}</h2><p>{topic.definition}</p>
    <div className="utility-actions" role="group" aria-label="Topic view">
      <button className="button small" aria-pressed={!reference} onClick={()=>setReference(false)}>Learn</button>
      <button className="button small" aria-pressed={reference} onClick={()=>setReference(true)}>Reference</button>
    </div>
    {!reference && chapterModel!==undefined && <ConceptModel chapter={chapterModel}/>}
    <div className="syntax-workspace"><div><p>{topic.use}</p>
    <div className="card"><h3>Syntax and symbols</h3><pre>{topic.format}</pre>
      {reference ? <dl className="syntax-annotations">{topic.symbols.map(([name,detail])=><div key={name}><dt><code>{name}</code></dt><dd>{detail}</dd></div>)}</dl> :
      <div className="syntax-explorer"><p>Select a piece of syntax to see its role.</p>
        <div className="utility-actions" role="group" aria-label="Explore syntax symbols">
          {topic.symbols.map(([name],index)=><button className="button small" type="button" key={name}
            aria-pressed={symbol===index} onClick={()=>setSymbol(index)}><code>{name}</code></button>)}
        </div>
        {topic.symbols[symbol] && <p role="status" className="syntax-symbol-note">{topic.symbols[symbol][1]}</p>}
      </div>}
    </div>
    </div><div hidden={reference}><h3>Try it in Python</h3>
    <CodeLab key={topic.id} draftId={'syntax-'+topic.id} initial={topic.code} input={topic.input} expected={topic.output} label={`${topic.id}.py`}/>
    </div></div>
    <details className="card" open={reference || undefined}><summary>Expected output and explanation</summary><pre>{topic.output}</pre><p>{topic.trace}</p></details>
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
  const [difficulty,setDifficulty]=useState('');
  const last=syntaxTopics.find(topic=>topic.id===storage.getItem('python-lab.last-syntax'));
  const selected = syntaxTopics.find(topic => topic.category === category && topic.id === id);
  if (category || id) return selected
    ? <TopicView key={selected.id} topic={selected} lessonTitle={lessons.find(lesson => lesson.id === selected.lesson)?.title ?? 'Chapter'}/>
    : <div className="card"><p>That syntax topic could not be found.</p><a className="inline-link" href="#/syntax">Browse syntax topics</a></div>;
  const results = syntaxTopics.filter(topic => (!filter || topic.category === filter) && (!difficulty || topic.difficulty === difficulty) &&
    [topic.title, topic.id, topic.definition, topic.format, ...topic.symbols.flat()].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <section className="syntax-launch" aria-label="Start with a Python experiment">
      <div>
        <h2>Start with a small experiment</h2>
        <p>Change a score, follow the branch Python would select, then open the topic to run editable code.</p>
        <div className="utility-actions">
          <a className="button primary" href="#/syntax/control/conditions"><span aria-hidden="true">🔀</span> Try conditions</a>
          <a className="button small" href="#/syntax/control/loops"><span aria-hidden="true">🔁</span> Trace a loop</a>
        </div>
      </div>
      <ConceptModel chapter={6}/>
    </section>
    <div className="utility-actions">
      <a className="button small" href="#/syntax/fundamentals/assignment">Start with assignment</a>
      {last && <a className="button small" href={syntaxLink(last)}>Resume {last.title}</a>}
    </div>
    <div className="catalog-filters">
      <label>Search syntax<input value={query} onChange={event => setQuery(event.target.value)}/></label>
      <label>Difficulty<select value={difficulty} onChange={event=>setDifficulty(event.target.value)}>
        <option value="">All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
      </select></label>
      <label>Category<select value={filter} onChange={event => setFilter(event.target.value)}>
        <option value="">All categories</option>
        {Object.entries(categories).map(([key, title]) => <option key={key} value={key}>{title}</option>)}
      </select></label>
    </div>
    <p role="status">{results.length} topics</p>
    {Object.entries(categories).map(([key, title]) => {
      const entries = results.filter(topic => topic.category === key);
      return entries.length > 0 && <section className="catalog-level" key={key}><h2>{title}</h2>
        <div className="syntax-flash-grid">{entries.map(topic => {
          const lines=topic.code.trim().split('\n');
          const excerpt=lines.slice(0,4).join('\n');
          const summary=topic.definition.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? topic.definition;
          return <article key={topic.id} className="card syntax-flash">
            <h3><span aria-hidden="true">{categoryIcons[topic.category]}</span> {topic.title}</h3>
            <p>{summary}</p>
            <pre aria-label={lines.length>4?'Opening lines of the Python example':'Python example'} tabIndex={0}><code>{excerpt}</code></pre>
            {lines.length<=4 && !topic.input && topic.output.trim().length<=65 && topic.output.trim() &&
              <p className="syntax-output"><strong>Output</strong> <code>{topic.output.trim()}</code></p>}
            <div className="syntax-card-footer"><small>{topic.difficulty}</small>
              <a className="button small" aria-label={'Try it: '+topic.title} href={syntaxLink(topic)}>Try it →</a>
            </div>
          </article>;
        })}</div></section>;
    })}
  </>;
}
