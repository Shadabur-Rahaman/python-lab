import {useState} from 'react';
import {downloadJson} from '../lib/download';

type Snippet = {name: string; code: string; input: string};
const key = 'python-lab.snippets.v1';
const maximum = 30;

function isSnippet(value: unknown): value is Snippet {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<Snippet>;
  return typeof item.name === 'string' && item.name.trim().length > 0
    && typeof item.code === 'string' && typeof item.input === 'string';
}

function readSnippets(): Snippet[] {
  try {
    const items: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(items) ? items.filter(isSnippet) : [];
  } catch {
    return [];
  }
}

export default function Snippets({code, input, onLoad}: {
  code: string; input: string; onLoad: (snippet: Snippet) => void;
}) {
  const [items, setItems] = useState(readSnippets);
  const [selected, setSelected] = useState('');
  const [name, setName] = useState('My Python experiment');
  const [message, setMessage] = useState('');

  function write(next: Snippet[], message: string) {
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setItems(next);
      setSelected('');
      setMessage(message);
    } catch {
      setMessage('Browser storage is unavailable. Export your snippets to keep a copy.');
    }
  }

  function save() {
    if (!name.trim()) return setMessage('Give your snippet a name first.');
    const current = readSnippets();
    if (current.length >= maximum) return setMessage('You have 30 saved snippets. Export your current code to keep a copy.');
    write([...current, {name: name.trim(), code, input}], 'Snippet saved.');
  }

  function rename() {
    if (!name.trim()) return setMessage('Enter the new name.');
    const current = readSnippets();
    const index = Number(selected);
    if (JSON.stringify(current[index]) !== JSON.stringify(items[index])) {
      setItems(current);
      setSelected('');
      return setMessage('Your snippets changed in another editor. Select the snippet again.');
    }
    current[index] = {...current[index], name: name.trim()};
    write(current, 'Snippet renamed.');
  }

  async function importSnippets(file: File) {
    try {
      if (file.size > 1_000_000) throw new Error('Choose a snippet backup smaller than 1 MB.');
      const backup = JSON.parse(await file.text());
      if (backup?.version !== 1 || !Array.isArray(backup.snippets)
        || !backup.snippets.length || !backup.snippets.every(isSnippet)) {
        throw new Error('Choose a valid Python Lab snippet backup.');
      }
      const unique = new Map<string, Snippet>();
      for (const item of [...readSnippets(), ...backup.snippets]) {
        const snippet = {name: item.name.trim(), code: item.code, input: item.input};
        unique.set(JSON.stringify(snippet), snippet);
      }
      if (unique.size > maximum) throw new Error('This backup would exceed the 30-snippet limit.');
      write([...unique.values()], 'Snippets imported.');
    } catch (error) {
      setMessage(error instanceof SyntaxError ? 'This file is not valid JSON.' : (error as Error).message);
    }
  }

  return <details className="snippet-select">
    <summary>Saved snippets</summary>
    <label>Snippet name<input value={name} maxLength={120} onChange={event => setName(event.target.value)}/></label>
    <label>Saved snippet<select value={selected} onChange={event => {
      const value = event.target.value;
      setSelected(value);
      if (value) setName(items[Number(value)].name);
    }}>
      <option value="">Choose a snippet…</option>
      {items.map((item, index) => <option key={index} value={String(index)}>{item.name}</option>)}
    </select></label>
    <div className="utility-actions">
      <button className="button small" onClick={save}>Save current code</button>
      <button className="button small" disabled={!selected} onClick={() => onLoad(items[Number(selected)])}>Load</button>
      <button className="button small" disabled={!selected} onClick={rename}>Rename</button>
      <button className="button small" onClick={() => downloadJson('python-lab-snippets.json', {
        version: 1, snippets: items.length ? items : [{name: name.trim() || 'Python snippet', code, input}],
      })}>Export snippets</button>
    </div>
    <label>Import snippets<input type="file" accept=".json,application/json" onChange={event => {
      const file = event.currentTarget.files?.[0];
      event.currentTarget.value = '';
      if (file) void importSnippets(file);
    }}/></label>
    <p role="status">{message}</p>
  </details>;
}
