import {useEffect, useState} from 'react';
import {categories, cloud, published, request, type Category, type Resource} from './client';

export function ResourceCard({resource}: {resource:Resource}) {
  const [preview,setPreview] = useState('');
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const image = ['image/png','image/jpeg','image/webp','image/gif'].includes(resource.mime_type);
  const pdf = resource.mime_type === 'application/pdf';
  async function open(inline:boolean) {
    setError(''); setBusy(true);
    try {
      const result = await request<{url:string}>('link',{id:resource.id,preview:inline});
      const signed = new URL(result.url);
      if (!['http:','https:'].includes(signed.protocol)) throw Error('The download URL is unavailable.');
      if (inline) setPreview(signed.href);
      else location.assign(signed.href);
    } catch (failure) { setError((failure as Error).message); }
    finally { setBusy(false); }
  }
  return <article className="card">
    <h3>{resource.title}</h3><p>{resource.description}</p>
    <p>{resource.original_filename} · {(resource.file_size/1024).toFixed(1)} KiB{resource.published_at && ` · ${resource.published_at.slice(0,10)}`}</p>
    {resource.chapter_id !== null && <p><a className="inline-link" href={`#/chapter/${resource.chapter_id}`}>Related chapter {resource.chapter_id}</a></p>}
    <div className="utility-actions">
      <button className="button small" disabled={busy} onClick={() => void open(false)}>Download</button>
      {(pdf || image) && <button className="button small" disabled={busy} onClick={() => void open(true)}>Preview</button>}
    </div>
    {preview && (image ? <img src={preview} alt={resource.title} style={{maxWidth:'100%'}} onError={() => setError('Preview unavailable. Request a fresh link.')}/>
      : <iframe src={preview} title={`Preview of ${resource.title}`} sandbox="" referrerPolicy="no-referrer" style={{width:'100%',minHeight:360}}/>)}
    {error && <p role="alert">{error}</p>}
  </article>;
}

export default function ResourceLibrary({lessons}: {lessons:{id:number;title:string}[]}) {
  const [rows,setRows] = useState<Resource[]>([]);
  const [groups,setGroups] = useState<Category[]>([]);
  const [query,setQuery] = useState('');
  const [chapter,setChapter] = useState(() => new URLSearchParams(location.hash.split('?')[1]).get('chapter') ?? '');
  const [topic,setTopic] = useState(() => new URLSearchParams(location.hash.split('?')[1]).get('topic') ?? '');
  const [term,setTerm] = useState(() => new URLSearchParams(location.hash.split('?')[1]).get('term') ?? '');
  const [type,setType] = useState('');
  const [group,setGroup] = useState('');
  const [attempt,setAttempt] = useState(0);
  const [status,setStatus] = useState<'loading'|'ready'|'error'>('loading');
  useEffect(() => {
    if (!cloud) return;
    let active = true;
    setStatus('loading');
    Promise.all([published(),categories()]).then(([items,categoryList]) => {
      if (!active) return;
      setRows(items); setGroups(categoryList); setStatus('ready');
    }).catch(() => { if(active) setStatus('error'); });
    return () => { active=false; };
  },[attempt]);
  if (!cloud) return <p className="card">Study materials are unavailable until a teacher configures the library. Lessons and practice are available.</p>;
  const extension = (item:Resource) => item.original_filename.split('.').at(-1)?.toLowerCase() ?? '';
  const item = new URLSearchParams(location.hash.split('?')[1]).get('item');
  const results = rows.filter(row => (!item || row.id === item) && (!chapter || String(row.chapter_id) === chapter)
    && (!topic || row.lesson_id === topic) && (!term || row.glossary_ids.includes(term))
    && (!type || extension(row) === type) && (!group || row.category_id === group)
    && [row.title,row.description,...row.tags].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    {item && <p><a href="#/resources" className="inline-link">Show all study materials</a></p>}
    <div className="catalog-filters">
      <label>Search materials<input value={query} onChange={event => setQuery(event.target.value)}/></label>
      <label>Chapter<select value={chapter} onChange={event => setChapter(event.target.value)}>
        <option value="">All chapters</option>{lessons.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select></label>
      <label>Topic<select value={topic} onChange={event => setTopic(event.target.value)}>
        <option value="">All topics</option>{[...new Set(rows.map(row => row.lesson_id).filter(Boolean).concat(topic || null))].map(id => <option key={id} value={id!}>{id}</option>)}</select></label>
      <label>Glossary term<select value={term} onChange={event => setTerm(event.target.value)}>
        <option value="">All terms</option>{[...new Set(rows.flatMap(row => row.glossary_ids).concat(term || []))].map(id => <option key={id}>{id}</option>)}</select></label>
      <label>Type<select value={type} onChange={event => setType(event.target.value)}>
        <option value="">All types</option>{[...new Set(rows.map(extension))].map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Category<select value={group} onChange={event => setGroup(event.target.value)}>
        <option value="">All categories</option>{groups.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    </div>
    <button className="button small" onClick={() => setAttempt(attempt+1)}>Refresh materials</button>
    {status === 'loading' && <p role="status">Loading study materials…</p>}
    {status === 'error' && <p role="alert">Study materials could not load. Refresh to retry.</p>}
    {status === 'ready' && <><p role="status">{results.length ? `${results.length} materials` : 'No published materials match these filters.'}</p>
      <div className="chapter-grid">{results.map(resource => <ResourceCard key={resource.id} resource={resource}/>)}</div></>}
  </>;
}
