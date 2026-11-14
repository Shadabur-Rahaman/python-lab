import ConceptModel from './ConceptModel';
import {storage} from '../lib/storage';
import {useState, useEffect, useId} from 'react';
import {categories, syntaxTopics, type Topic, type Category} from '../data/syntax';
import CodeLab from './CodeLab';
import Quiz from './Quiz';
import {syntaxCheck} from '../data/syntax/checks';
import {terms, glossaryLink} from '../data/glossary';
import {searchSyntaxTopics, getSyntaxMeta, popularSearches} from '../data/syntax/search';
import {Copy, Check, BookOpen, Search, X, Sparkles, ArrowRight} from 'lucide-react';

const categoryIcons: Record<keyof typeof categories, string> = {
  fundamentals: '💡', literals: '🔢', operators: '➗', control: '🔀', collections: '📦', functions: '🧩',
  objects: '🏗️', errors: '🐛', modules: '📁', iteration: '🔁', advanced: '⚡', builtins: '🛠️', standard: '📚',
};

export const syntaxLink = (topic: Topic) => `#/syntax/${topic.category}/${topic.id}`;

const topicModels: Record<string, number> = {
  assignment: 2, numbers: 3, 'input-output': 1, arithmetic: 5, conditions: 6, loops: 7,
  strings: 8, parameters: 11, comprehensions: 13, classes: 15,
};

function CopyButton({code, label = 'Copy'}: {code: string; label?: string}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="icon-button syntax-copy-btn"
      title="Copy Python code"
      aria-label="Copy Python code"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* Fallback */
        }
      }}
    >
      {copied ? <Check size={14} className="success-icon"/> : <Copy size={14}/>}
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  );
}

function TopicView({topic, lessonTitle}: {topic: Topic; lessonTitle: string}) {
  const [reference, setReference] = useState(false);
  const [symbol, setSymbol] = useState(0);
  const chapterModel = topicModels[topic.id];
  const meta = getSyntaxMeta(topic.id);

  useEffect(() => {
    try {
      storage.setItem('python-lab.last-syntax', topic.id);
    } catch {}
  }, [topic.id]);

  return (
    <article className="syntax-topic">
      <div className="syntax-breadcrumb">
        <a className="text-link" href="#/syntax">← All syntax topics</a>
        <span className="syntax-crumb-sep">/</span>
        <span className="pill">{categories[topic.category]}</span>
      </div>

      <div className="syntax-topic-header">
        <div>
          <h2>{topic.title}</h2>
          <p className="syntax-definition">{topic.definition}</p>
        </div>
        <div className="syntax-topic-meta">
          <span className={`pill ${topic.difficulty.toLowerCase()}`}>{topic.difficulty}</span>
          <span className="syntax-version-tag">Python {topic.since}+</span>
          <a className="button small syntax-lesson-badge" href={`#/chapter/${topic.lesson}`}>
            <BookOpen size={14}/> Learn in Chapter {topic.lesson}: {lessonTitle}
          </a>
        </div>
      </div>

      {meta.memory && (
        <div className="syntax-memory-banner" role="note" aria-label="Memory hint">
          <span className="memory-badge">💡 Hinglish Hint</span>
          <p lang="hi-Latn">{meta.memory}</p>
        </div>
      )}

      <div className="utility-actions" role="group" aria-label="Topic view">
        <button className="button small" aria-pressed={!reference} onClick={() => setReference(false)}>Learn</button>
        <button className="button small" aria-pressed={reference} onClick={() => setReference(true)}>Reference</button>
      </div>

      {!reference && chapterModel !== undefined && <ConceptModel chapter={chapterModel}/>}

      <div className="syntax-workspace">
        <div>
          <p className="syntax-use-case"><strong>Real-world use:</strong> {topic.use}</p>
          <div className="card">
            <div className="syntax-card-bar">
              <h3>Syntax and symbols</h3>
              <CopyButton code={topic.format} label="Copy syntax"/>
            </div>
            <pre tabIndex={0}><code>{topic.format}</code></pre>
            {reference ? (
              <dl className="syntax-annotations">
                {topic.symbols.map(([name, detail]) => (
                  <div key={name}>
                    <dt><code>{name}</code></dt>
                    <dd>{detail}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="syntax-explorer">
                <p>Select a piece of syntax to see its role.</p>
                <div className="utility-actions" role="group" aria-label="Explore syntax symbols">
                  {topic.symbols.map(([name], index) => (
                    <button
                      className="button small"
                      type="button"
                      key={name}
                      aria-pressed={symbol === index}
                      onClick={() => setSymbol(index)}
                    >
                      <code>{name}</code>
                    </button>
                  ))}
                </div>
                {topic.symbols[symbol] && (
                  <p role="status" className="syntax-symbol-note">{topic.symbols[symbol][1]}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div hidden={reference}>
          <h3>Try it in Python</h3>
          <CodeLab
            key={topic.id}
            draftId={'syntax-' + topic.id}
            initial={topic.code}
            input={topic.input}
            expected={topic.output}
            label={`${topic.id}.py`}
          />
        </div>
      </div>

      <details className="card" open={reference || undefined}>
        <summary>Expected output and explanation</summary>
        <pre>{topic.output}</pre>
        <p>{topic.trace}</p>
      </details>

      <div className="card">
        <h3>Common mistake</h3>
        <p>{topic.pitfall}</p>
        <details>
          <summary>Show a working alternative</summary>
          <div className="syntax-card-bar">
            <span>Fixed Python code:</span>
            <CopyButton code={topic.correction}/>
          </div>
          <pre><code>{topic.correction}</code></pre>
        </details>
      </div>

      <div className="card">
        <h3>Practice</h3>
        <ol>
          {topic.practice.map(task => <li key={task}>{task}</li>)}
        </ol>
      </div>

      <Quiz questions={[syntaxCheck(topic.id)]} onComplete={() => {}}/>

      <div className="card">
        <h3>Revision</h3>
        <p>{topic.definition}</p>
        {terms.some(term => term.syntax === topic.id) && (
          <p>
            Glossary · {terms.filter(term => term.syntax === topic.id).map(term => (
              <a className="inline-link" key={term.id} href={glossaryLink(term.id)}>{term.name}{' '}</a>
            ))}
          </p>
        )}
        <p>Related lesson and preparation · <a className="inline-link" href={`#/chapter/${topic.lesson}`}>{lessonTitle}</a></p>
        <p><a className="inline-link" href={`#/resources?topic=${topic.id}`}>Additional Study Materials</a></p>
        <a className="inline-link" href={topic.docs}>Official Python documentation</a>
      </div>
    </article>
  );
}

function SyntaxCard({
  topic,
  lessonTitle,
}: {
  topic: Topic;
  lessonTitle: string;
}) {
  const meta = getSyntaxMeta(topic.id);
  const lines = topic.code.trim().split('\n');
  const excerpt = lines.slice(0, 4).join('\n');
  const summary = topic.definition.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? topic.definition;

  return (
    <article key={topic.id} className="card syntax-flash">
      <div className="syntax-card-top">
        <span className="syntax-category-tag">
          <span aria-hidden="true">{categoryIcons[topic.category]}</span> {categories[topic.category]}
        </span>
        <span className={`pill small-pill ${topic.difficulty.toLowerCase()}`}>{topic.difficulty}</span>
      </div>

      <h3>
        <span aria-hidden="true">{categoryIcons[topic.category]}</span> {topic.title}
      </h3>

      <p className="syntax-summary-text">{summary}</p>

      <div className="syntax-code-box">
        <div className="syntax-code-header">
          <code>{topic.format.split('\n')[0]}</code>
          <CopyButton code={topic.code} label="Copy"/>
        </div>
        <pre aria-label={lines.length > 4 ? 'Opening lines of the Python example' : 'Python example'} tabIndex={0}>
          <code>{excerpt}</code>
        </pre>
      </div>

      {topic.output.trim() && (
        <div className="syntax-output">
          <small>EXPECTED OUTPUT</small>
          <code>{topic.output.trim()}</code>
        </div>
      )}

      <details className="syntax-card-details">
        <summary>Context, mistake & hint</summary>
        <div className="syntax-details-content">
          <p className="syntax-realworld-note">
            <strong>Real-world:</strong> {meta.realWorld || topic.use}
          </p>
          {meta.memory && (
            <div className="syntax-memory-pill" lang="hi-Latn">
              <strong>💡 Memory Hint:</strong> {meta.memory}
            </div>
          )}
          <div className="syntax-mistake-snippet">
            <strong>Common mistake:</strong> {topic.pitfall}
            <details>
              <summary>Working fix</summary>
              <pre><code>{topic.correction}</code></pre>
            </details>
          </div>
        </div>
      </details>

      <div className="syntax-card-footer">
        <a className="syntax-lesson-link" href={`#/chapter/${topic.lesson}`}>
          <BookOpen size={13}/> Chapter {topic.lesson}: {lessonTitle}
        </a>
        <a className="button primary small" aria-label={'Try it: ' + topic.title} href={syntaxLink(topic)}>
          Try it →
        </a>
      </div>
    </article>
  );
}

export default function SyntaxAcademy({
  category,
  id,
  lessons,
}: {
  category?: string;
  id?: string;
  lessons: {id: number; title: string}[];
}) {
  const searchInputId = useId();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const last = syntaxTopics.find(topic => topic.id === storage.getItem('python-lab.last-syntax'));
  const selected = syntaxTopics.find(topic => topic.category === category && topic.id === id);

  if (category || id) {
    return selected ? (
      <TopicView
        key={selected.id}
        topic={selected}
        lessonTitle={lessons.find(lesson => lesson.id === selected.lesson)?.title ?? 'Chapter'}
      />
    ) : (
      <div className="card">
        <p>That syntax topic could not be found.</p>
        <a className="inline-link" href="#/syntax">Browse syntax topics</a>
      </div>
    );
  }

  const results = searchSyntaxTopics(syntaxTopics, query, filter, difficulty);

  return (
    <>
      <section className="syntax-launch" aria-label="Start with a Python experiment">
        <div>
          <h2>Start with a small experiment</h2>
          <p>Change a score, follow the branch Python would select, then open the topic to run editable code.</p>
          <div className="utility-actions">
            <a className="button primary" href="#/syntax/control/conditions">
              <span aria-hidden="true">🔀</span> Try conditions
            </a>
            <a className="button small" href="#/syntax/control/loops">
              <span aria-hidden="true">🔁</span> Trace a loop
            </a>
          </div>
        </div>
        <ConceptModel chapter={6}/>
      </section>

      <div className="utility-actions">
        <a className="button small" href="#/syntax/fundamentals/assignment">Start with assignment</a>
        {last && <a className="button small" href={syntaxLink(last)}>Resume {last.title}</a>}
      </div>

      <div className="card syntax-search-card">
        <div className="syntax-search-bar">
          <Search size={18} className="syntax-search-icon" aria-hidden="true"/>
          <label className="sr-only" htmlFor={searchInputId}>Search syntax</label>
          <input
            id={searchInputId}
            aria-label="Search syntax"
            value={query}
            placeholder="Search syntax or task (e.g. 'repeat code', 'add item to list', 'remove spaces', 'convert string to number')..."
            onChange={event => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              className="icon-button"
              title="Clear search"
              aria-label="Clear search"
              onClick={() => setQuery('')}
            >
              <X size={16}/>
            </button>
          )}
        </div>

        <div className="syntax-popular-queries" aria-label="Common searches">
          <span className="syntax-popular-label"><Sparkles size={14}/> Popular queries:</span>
          {popularSearches.map(term => (
            <button
              type="button"
              key={term}
              className={`syntax-query-chip ${query.toLowerCase() === term.toLowerCase() ? 'active' : ''}`}
              onClick={() => setQuery(term)}
            >
              {term}
            </button>
          ))}
        </div>

        <div className="catalog-filters syntax-filters-row">
          <label>Difficulty
            <select value={difficulty} onChange={event => setDifficulty(event.target.value)}>
              <option value="">All levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <label>Category
            <select value={filter} onChange={event => setFilter(event.target.value)}>
              <option value="">All categories</option>
              {Object.entries(categories).map(([key, title]) => (
                <option key={key} value={key}>{title}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="syntax-category-pills" role="group" aria-label="Topic filters">
          <button
            type="button"
            className={`button small ${!filter ? 'primary' : ''}`}
            onClick={() => setFilter('')}
          >
            All ({syntaxTopics.length})
          </button>
          {Object.entries(categories).map(([key, title]) => {
            const count = syntaxTopics.filter(t => t.category === key).length;
            const active = filter === key;
            return (
              <button
                type="button"
                key={key}
                className={`button small ${active ? 'primary' : ''}`}
                onClick={() => setFilter(active ? '' : key)}
              >
                <span aria-hidden="true">{categoryIcons[key as Category]}</span> {title} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="syntax-results-meta">
        <p role="status"><strong>{results.length} topics</strong> {query ? `matching "${query}"` : ''}</p>
        {(query || filter || difficulty) && (
          <button
            type="button"
            className="button small"
            onClick={() => {
              setQuery('');
              setFilter('');
              setDifficulty('');
            }}
          >
            Reset filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="card syntax-empty-state">
          <h3>No syntax topics found for "{query}"</h3>
          <p>Try searching with common programming actions like:</p>
          <div className="syntax-popular-queries">
            {popularSearches.map(term => (
              <button
                type="button"
                key={term}
                className="syntax-query-chip"
                onClick={() => setQuery(term)}
              >
                {term}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="button primary small"
            onClick={() => {
              setQuery('');
              setFilter('');
              setDifficulty('');
            }}
          >
            Show all {syntaxTopics.length} topics
          </button>
        </div>
      ) : (
        Object.entries(categories).map(([key, title]) => {
          const entries = results.filter(topic => topic.category === key);
          if (entries.length === 0) return null;
          return (
            <section className="catalog-level" key={key}>
              <div className="syntax-category-heading">
                <h2><span aria-hidden="true">{categoryIcons[key as Category]}</span> {title}</h2>
                <span className="pill">{entries.length} topics</span>
              </div>
              <div className="syntax-flash-grid">
                {entries.map(topic => (
                  <SyntaxCard
                    key={topic.id}
                    topic={topic}
                    lessonTitle={lessons.find(l => l.id === topic.lesson)?.title ?? `Chapter ${topic.lesson}`}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </>
  );
}
