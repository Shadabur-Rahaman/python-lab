import {lazy, Suspense, useEffect, useId, useRef, useState} from 'react';
import {categories, cloud, published, signedLink, type Category, type Resource} from './client';
import {FileText} from 'lucide-react';
import {syntaxTopics} from '../data/syntax';
import {terms} from '../data/glossary';

const PdfPreview = lazy(() => import('./PdfPreview'));
const images = ['image/png','image/jpeg','image/webp','image/gif'];
const textTypes = ['text/plain','text/markdown','text/csv','text/x-python','application/json','application/x-ipynb+json'];
const languageLabels:Record<string,string> = {en:'English',hi:'हिन्दी',both:'English + हिन्दी'};
const fileType = (item:Resource) => item.original_filename.split('.').pop()?.toUpperCase() ?? 'File';
const textLimit = 128 * 1024;

export function ResourceCard({resource, category, chapter, teacher = false}: {
  resource:Resource; category?:string; chapter?:string; teacher?:boolean;
}) {
  const [opened,setOpened] = useState(false);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const canPreview = images.includes(resource.mime_type) || textTypes.includes(resource.mime_type) || resource.mime_type === 'application/pdf';
  async function download() {
    setError(''); setBusy(true);
    try { location.assign(await signedLink(resource.id,false,teacher)); }
    catch { setError('Could not download this material. Try again.'); }
    finally { setBusy(false); }
  }
  return <article className="card resource-card">
    <div className="resource-meta"><span className="resource-chip"><FileText size={13} aria-hidden="true"/>{fileType(resource)}</span>
      {category && <span className="resource-chip">{category}</span>}
      {resource.difficulty !== 'all' && <span className="resource-chip">{resource.difficulty}</span>}
    </div>
    <h3>{resource.title}</h3>{resource.description && <p>{resource.description}</p>}
    {resource.chapter_id !== null && !teacher && <p><a className="inline-link" href={'#/chapter/'+resource.chapter_id}>{chapter ?? 'Related chapter '+resource.chapter_id}</a></p>}
    <details className="resource-file-details"><summary>File details</summary>
      <p>{resource.original_filename} · {(resource.file_size/1024).toFixed(1)} KiB
        {resource.published_at && ' · '+resource.published_at.slice(0,10)}
        {' · '}{languageLabels[resource.language] ?? resource.language}</p>
      {!!resource.tags.length && <p>{resource.tags.join(' · ')}</p>}
    </details>
    <div className="utility-actions">
      {canPreview && <button ref={trigger} className="button small" onClick={() => setOpened(true)}>Preview</button>}
      <button className="button small" disabled={busy} onClick={() => void download()}>Download</button>
    </div>
    {opened && <ResourcePreview resource={resource} teacher={teacher} download={download} busy={busy} onClose={() => {
      setOpened(false); trigger.current?.focus();
    }}/>}
    {error && <p role="alert">{error}</p>}
  </article>;
}

function ResourcePreview({resource,teacher,download,busy,onClose}:{
  resource:Resource; teacher:boolean; download:()=>Promise<void>; busy:boolean; onClose:()=>void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const [content,setContent] = useState<string|null>(null);
  const [error,setError] = useState('');
  const [attempt,setAttempt] = useState(0);
  const [zoom,setZoom] = useState(false);
  const [copy,setCopy] = useState('');
  const [fullscreen,setFullscreen] = useState(false);
  const pdf = resource.mime_type === 'application/pdf';
  const image = images.includes(resource.mime_type);
  useEffect(() => { dialog.current?.showModal(); },[]);
  useEffect(() => {
    if (pdf) return;
    const controller = new AbortController();
    let active = true;
    setContent(null); setError('');
    void (async () => {
      try {
        if (!image && resource.file_size > textLimit) throw Error('This file is too large to preview. Download it to read the full text.');
        const url = await signedLink(resource.id,image,teacher);
        if (!active) return;
        if (image) { setContent(url); return; }
        const response = await fetch(url,{signal:controller.signal,referrerPolicy:'no-referrer'});
        if (!response.ok || !response.body) throw Error('Preview could not load. Try again or download the file.');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
        let size = 0;
        for (;;) {
          const {done,value} = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > textLimit) {
            await reader.cancel();
            throw Error('This file is too large to preview. Download it to read the full text.');
          }
          result += decoder.decode(value,{stream:true});
        }
        if (active) setContent(result + decoder.decode());
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : 'Preview could not load.');
      }
    })();
    return () => { active = false; controller.abort(); };
  },[attempt,image,pdf,resource.id,resource.file_size,teacher]);
  return <dialog className={fullscreen?'resource-dialog expanded':'resource-dialog'} ref={dialog} aria-labelledby={title} onClose={onClose}>
    <header className="resource-preview-head">
      <h2 id={title}>{resource.title}</h2>
      <div className="utility-actions">
        <button className="button small" autoFocus onClick={() => dialog.current?.close()}>Close</button>
        <button className="button small" disabled={busy} onClick={() => void download()}>Download</button>
        {(image || pdf) && <button className="button small" aria-pressed={fullscreen} onClick={() => setFullscreen(!fullscreen)}>{fullscreen?'Exit fullscreen':'Fullscreen'}</button>}
        {image && content && <button className="button small" aria-pressed={zoom} onClick={() => setZoom(!zoom)}>Zoom</button>}
        {!pdf && !image && content !== null && <button className="button small" onClick={() => {
          navigator.clipboard.writeText(content).then(() => setCopy('Copied.'),() => setCopy('Could not copy the text.'));
        }}>Copy text</button>}
        {copy && <span role="status">{copy}</span>}
      </div>
    </header>
    <div className="resource-preview-body">
      {pdf ? <Suspense fallback={<p role="status">Loading PDF viewer…</p>}><PdfPreview resource={resource} teacher={teacher}/></Suspense>
      : error ? <><p role="alert">{error}</p><button className="button small" onClick={() => setAttempt(attempt+1)}>Retry preview</button></>
      : content === null ? <p role="status">Loading preview…</p>
      : image ? <img className={zoom?'zoomed':''} src={content} alt={resource.title} referrerPolicy="no-referrer"
        onError={() => setError('Image preview could not load. Try again or download the file.')}/>
      : <pre><code>{content}</code></pre>}
    </div>
  </dialog>;
}

export default function ResourceLibrary({lessons}: {lessons:{id:number;title:string}[]}) {
  const params = new URLSearchParams(location.hash.split('?')[1]);
  const item = params.get('item');
  const [rows,setRows] = useState<Resource[]>([]);
  const [groups,setGroups] = useState<Category[]>([]);
  const [filters,setFilters] = useState(() => ({
    query:'',chapter:params.get('chapter') ?? '',topic:params.get('topic') ?? '',term:params.get('term') ?? '',
    type:'',group:'',language:'',difficulty:'',date:'',sort:'',
  }));
  const [attempt,setAttempt] = useState(0);
  const [status,setStatus] = useState<'loading'|'ready'|'error'>('loading');
  useEffect(() => {
    if (!cloud) return;
    let active = true;
    setStatus('loading');
    Promise.all([published(),categories()]).then(([items,categoryList]) => {
      if (!active) return;
      setRows(items); setGroups(categoryList); setStatus('ready');
    }).catch(() => { if (active) setStatus('error'); });
    return () => { active=false; };
  },[attempt]);

  if (!cloud) return <p className="card">Study materials are unavailable until a teacher configures the library. Lessons and practice are available.</p>;
  const lessonNames = new Map(lessons.map(lesson => [lesson.id,lesson.title]));
  const topicNames = new Map(syntaxTopics.map(topic => [topic.id,topic.title]));
  const termNames = new Map(terms.map(term => [term.id,term.name]));
  const categoryNames = new Map(groups.map(group => [group.id,group.name]));
  const options = (values:(string|null)[], names?:Map<string,string>) =>
    [...new Set(values.filter((value):value is string => Boolean(value)))].sort().map(value => [value,names?.get(value) ?? value]);
  const field = (key:keyof typeof filters, value:string) => setFilters(previous => ({...previous,[key]:value}));
  const select = (key:keyof typeof filters, label:string, empty:string, values:string[][]) =>
    <label>{label}<select value={filters[key]} onChange={event => field(key,event.target.value)}>
      <option value="">{empty}</option>{values.map(([value,name]) => <option key={value} value={value}>{name}</option>)}
    </select></label>;
  const query = filters.query.trim().toLowerCase();
  const results = rows.filter(row => (!item || row.id === item)
    && (!filters.chapter || String(row.chapter_id) === filters.chapter)
    && (!filters.topic || row.lesson_id === filters.topic)
    && (!filters.term || row.glossary_ids.includes(filters.term))
    && (!filters.type || fileType(row) === filters.type)
    && (!filters.group || row.category_id === filters.group)
    && (!filters.language || row.language === filters.language)
    && (!filters.difficulty || row.difficulty === filters.difficulty)
    && (!filters.date || (row.published_at ?? '').slice(0,10) >= filters.date)
    && [row.title,row.description,row.original_filename,lessonNames.get(row.chapter_id ?? -1),topicNames.get(row.lesson_id ?? ''),...row.tags].join(' ').toLowerCase().includes(query));
  if (filters.sort === 'newest') results.sort((a,b) => (b.published_at ?? '').localeCompare(a.published_at ?? ''));
  if (filters.sort === 'oldest') results.sort((a,b) => (a.published_at ?? '').localeCompare(b.published_at ?? ''));
  if (filters.sort === 'size') results.sort((a,b) => b.file_size-a.file_size);
  if (filters.sort === 'title') results.sort((a,b) => a.title.localeCompare(b.title));
  return <>
    {item && <p><a href="#/resources" className="inline-link">Show all study materials</a></p>}
    <div className="card catalog-filters materials-filters">
      <label>Search materials<input type="search" placeholder="Title, filename or topic" value={filters.query} onChange={event => field('query',event.target.value)}/></label>
      {select('chapter','Chapter','All chapters',lessons.map(lesson => [String(lesson.id),lesson.title]))}
      {select('topic','Topic','All topics',options([...rows.map(row => row.lesson_id),filters.topic],topicNames))}
      {select('term','Glossary term','All terms',options([...rows.flatMap(row => row.glossary_ids),filters.term],termNames))}
      {select('group','Category','All categories',groups.map(group => [group.id,group.name]))}
      {select('type','File type','All file types',options(rows.map(fileType)))}
      {select('language','Language','All languages',Object.entries(languageLabels))}
      {select('difficulty','Difficulty','Any difficulty',[['all','All levels'],['beginner','Beginner'],['intermediate','Intermediate'],['advanced','Advanced']])}
      <label>Published since<input type="date" value={filters.date} onChange={event => field('date',event.target.value)}/></label>
      {select('sort','Sort by','Library order',[['newest','Newest first'],['oldest','Oldest first'],['title','Title A to Z'],['size','Largest files first']])}
    </div>
    <button className="button small" onClick={() => setAttempt(attempt+1)}>Refresh materials</button>
    {status === 'loading' && <><p role="status">Loading study materials…</p>
      <div className="materials-grid" aria-hidden="true">{[0,1,2].map(i=><div key={i} className="card resource-skeleton"><span/><span/><span/></div>)}</div></>}
    {status === 'error' && <p role="alert">Study materials could not load. Refresh to retry.</p>}
    {status === 'ready' && <><p role="status">{results.length ? results.length+' '+(results.length===1?'material':'materials') : rows.length ? 'No published materials match these filters.' : 'No study materials have been published yet.'}</p>
      <div className="materials-grid">{results.map(resource => <ResourceCard key={resource.id} resource={resource}
        category={categoryNames.get(resource.category_id ?? '')} chapter={lessonNames.get(resource.chapter_id ?? -1)}/>)}</div></>}
  </>;
}
