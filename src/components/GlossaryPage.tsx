import {useEffect, useId, useRef, useState} from 'react';
import {findTerms, glossaryLink, terms, type Term} from '../data/glossary';
import {syntaxTopics} from '../data/syntax';

type Language = 'en'|'hi'|'both';
function stored<T>(key:string, fallback:T):T {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; } catch { return fallback; }
}
function storedIds(key:string) {
  const value = stored<unknown>(key, []);
  return Array.isArray(value) ? value.filter((id):id is string => typeof id === 'string' && terms.some(term => term.id === id)) : [];
}
function save(key:string, value:unknown) {
  try { localStorage.setItem(key,JSON.stringify(value)); } catch { /* optional preference */ }
}

export function TermDetails({term, language}: {term:Term; language:Language}) {
  const topic = syntaxTopics.find(item => item.id === term.syntax);
  return <>
    {language !== 'hi' && <div lang="en"><p>{term.short}</p>{term.english !== term.short && <p>{term.english}</p>}</div>}
    {language !== 'en' && <div lang="hi-Latn"><p><strong>{term.display}</strong> · {term.hindi}</p>{term.explanation!==term.hindi && <p>{term.explanation}</p>}</div>}
    {term.example && <pre><code>{term.example}</code></pre>}
    {language !== 'hi' && term.misconception && <p>{term.misconception}</p>}
    <p><a className="inline-link" href={`#/chapter/${term.lesson}`}>Chapter {term.lesson}</a>
      {topic && <> · <a className="inline-link" href={`#/syntax/${topic.category}/${topic.id}`}>{topic.title}</a>
      {' · '}<a className="inline-link" href={topic.docs}>Python reference</a></>}</p>
  </>;
}

export function GlossaryTerm({id}: {id:string}) {
  const term = terms.find(item => item.id === id)!;
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const title = useId();
  function open() {
    const panel = dialog.current;
    if (!panel || panel.open) return;
    // A second tap at the same coordinates must not activate a link underneath it.
    panel.style.pointerEvents = 'none';
    panel.showModal();
    window.setTimeout(() => { panel.style.pointerEvents = ''; }, 450);
  }
  return <>
    <button ref={trigger} className="button small term-trigger" type="button" aria-haspopup="dialog"
      onClick={open} onDoubleClick={open}>{term.name}</button>
    <dialog ref={dialog} aria-labelledby={title} onClose={() => trigger.current?.focus()}>
      <h3 id={title}>{term.name}</h3>
      <TermDetails term={term} language="both"/>
      <p><a className="inline-link" href={glossaryLink(term.id)} onClick={() => dialog.current?.close()}>Open glossary entry</a></p>
      <form method="dialog"><button className="button small" autoFocus>Close</button></form>
    </dialog>
  </>;
}

const group = (term:Term) => term.lesson < 6 ? 'Foundations' :
  term.lesson < 11 ? 'Control flow and collections' : 'Functions and objects';
const options = ['Foundations','Control flow and collections','Functions and objects'];

export default function GlossaryPage({id}: {id?:string}) {
  const [query,setQuery] = useState('');
  const [language,setLanguage] = useState<Language>(() => stored('python-lab.glossary.language','both'));
  const [category,setCategory] = useState('');
  const [letter,setLetter] = useState('');
  const [favorites,setFavorites] = useState<string[]>(() => storedIds('python-lab.glossary.favorites'));
  const [recent,setRecent] = useState<string[]>(() => storedIds('python-lab.glossary.recent'));
  const [onlyFavorites,setOnlyFavorites] = useState(false);
  const [flash,setFlash] = useState(false);
  const [index,setIndex] = useState(0);
  const [revealed,setRevealed] = useState(false);
  const [guess,setGuess] = useState('');
  const selected = terms.find(term => term.id === id);
  useEffect(() => {
    if (!selected) return;
    setRecent(previous => {
      const next = [selected.id,...previous.filter(item => item !== selected.id)].slice(0,5);
      save('python-lab.glossary.recent',next);
      return next;
    });
  },[selected]);
  const list = findTerms(query).filter(term => (!category || group(term) === category)
    && (!letter || term.name.startsWith(letter)) && (!onlyFavorites || favorites.includes(term.id)));
  const current = list.length ? list[index % list.length] : undefined;
  function resetCard() { setIndex(0); setRevealed(false); }
  function favorite(term:Term) {
    const next = favorites.includes(term.id) ? favorites.filter(id => id !== term.id) : [...favorites,term.id];
    setFavorites(next);
    save('python-lab.glossary.favorites',next);
  }
  const selector = <label>Language<select value={language} onChange={event => {
    const value = event.target.value as Language;
    setLanguage(value); save('python-lab.glossary.language',value);
  }}><option value="en">English</option><option value="hi">Hinglish</option><option value="both">English + Hinglish</option></select></label>;
  if (id) return <div className="card">
    <a className="inline-link" href="#/glossary">All glossary terms</a>
    {selected ? <><h2>{selected.name}</h2>{selector}
      <button className="button small" aria-pressed={favorites.includes(selected.id)} onClick={() => favorite(selected)}>Favorite</button>
      <TermDetails term={selected} language={language}/>
      <p><a className="inline-link" href={`#/resources?term=${selected.id}`}>Additional Study Materials</a></p>
      <h3>Related concepts</h3><ul>{terms.filter(term => term.id !== selected.id && term.syntax === selected.syntax).map(term =>
        <li key={term.id}><a className="inline-link" href={glossaryLink(term.id)}>{term.name}</a></li>)}</ul></> : <p>Term not found.</p>}
  </div>;
  return <>
    <div className="catalog-filters">
      <label>Search glossary<input value={query} onChange={event => {setQuery(event.target.value); resetCard();}}/></label>
      {selector}
      <label>Topic group<select value={category} onChange={event => {setCategory(event.target.value); resetCard();}}>
        <option value="">All groups</option>{options.map(option => <option key={option}>{option}</option>)}</select></label>
      <label>First letter<select value={letter} onChange={event => {setLetter(event.target.value); resetCard();}}>
        <option value="">All letters</option>{[...new Set(terms.map(term => term.name[0]))].map(value => <option key={value}>{value}</option>)}</select></label>
    </div>
    <div className="utility-actions">
      <button className="button small" aria-pressed={onlyFavorites} onClick={() => {setOnlyFavorites(!onlyFavorites); resetCard();}}>Favorites</button>
      <button className="button small" aria-pressed={flash} onClick={() => {setFlash(!flash); resetCard();}}>Flashcards</button>
    </div>
    {recent.length > 0 && <p>Recently viewed · {recent.map(id => <span key={id}><a className="inline-link" href={glossaryLink(id)}>{terms.find(term => term.id === id)?.name}</a>{' '}</span>)}</p>}
    <p role="status">{list.length} terms</p>
    {flash && current ? <div className="card">
      <h2>{current.name}</h2>
      <label>Your definition<textarea rows={2} value={guess} onChange={event => setGuess(event.target.value)}/></label>
      <button className="button small" onClick={() => setRevealed(!revealed)}>{revealed ? 'Hide definition' : 'Reveal definition'}</button>
      <button className="button small" onClick={() => {setIndex(index+1); setRevealed(false); setGuess('');}}>Next term</button>
      {revealed && <TermDetails term={current} language={language}/>}
    </div> : <div className="chapter-grid">{list.map(term => <article key={term.id} className="card">
      <h2><a className="inline-link" href={glossaryLink(term.id)}>{term.name}</a></h2>
      {language !== 'hi' && <p lang="en">{term.short}</p>}
      {language !== 'en' && <p lang="hi-Latn">{term.hindi}</p>}
    </article>)}</div>}
  </>;
}
