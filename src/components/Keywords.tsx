import {useState} from 'react';

const groups = [
  ['Values', {False:'Boolean false.', True:'Boolean true.', None:'Represents the absence of a value.'}],
  ['Conditions and logic', {if:'Run a block when a condition is true.', elif:'Test another condition.', else:'Provide an alternative branch. In loops and try statements it has a different role.', and:'Return the first falsy operand, or the last operand.', or:'Return the first truthy operand, or the last operand.', not:'Invert the truth value.', is:'Test whether two references refer to the same object.', in:'Test membership, or introduce the iterable in a for loop.'}],
  ['Loops and generators', {for:'Iterate over values.', while:'Repeat while a condition is true.', break:'Exit the nearest loop.', continue:'Skip to the next iteration.', yield:'Produce a value and suspend a generator.', pass:'Leave a syntactically required block empty.'}],
  ['Functions and objects', {def:'Define a function.', return:'Exit a function and optionally give back a value.', lambda:'Create a function from a single expression.', class:'Define a class.', global:'Bind a name in the module scope.', nonlocal:'Bind a name from an enclosing function.', del:'Remove a binding, item or attribute.'}],
  ['Imports and resources', {import:'Load a module or bind imported names.', from:'Specify the source in an import, delegate with yield from, or chain an exception with raise from.', as:'Bind an alias or a value in a with or except clause.', with:'Enter and exit a context manager.'}],
  ['Exceptions', {try:'Start a block with exception handling or cleanup.', except:'Handle a matching exception.', finally:'Run cleanup as control leaves a try statement.', raise:'Raise an exception.', assert:'Check a debugging assumption. Optimization can disable this check.'}],
  ['Async code', {async:'Declare an asynchronous function or use async for or async with.', await:'Wait for an awaitable inside asynchronous code.'}],
  ['Soft keywords', {match:'Start pattern matching (Python 3.10+).', case:'Introduce a pattern in a match block (Python 3.10+).', '_':'Match anything without binding a name inside a pattern (Python 3.10+).', type:'Introduce a type alias statement (Python 3.12+).'}],
] as const;

export default function Keywords() {
  const [query,setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const results = groups.map(([title,words]) => ({
    title, words:Object.entries(words).filter(([word,meaning]) => (word+' '+meaning).toLowerCase().includes(normalized)),
  })).filter(group => group.words.length);
  return <>
    <div className="card"><label>Search Python keywords<input type="search" value={query} onChange={event=>setQuery(event.target.value)}/></label>
      <p>Reserved words cannot be used as variable names. Soft keywords have special meaning only in specific syntax.</p>
      <a className="inline-link" href="https://docs.python.org/3/reference/lexical_analysis.html#keywords">Python language reference</a>
    </div>
    {results.length === 0 && <p role="status">No keywords match that search.</p>}
    {results.map(({title,words}) => <section className="lesson-section" key={title}><h2>{title}</h2>
      <dl className="keyword-grid">{words.map(([word,meaning]) => <div className="card" key={word}><dt><code>{word}</code></dt><dd>{meaning}</dd></div>)}</dl>
    </section>)}
  </>;
}
