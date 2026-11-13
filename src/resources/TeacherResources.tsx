import {useEffect, useState, type FormEvent} from 'react';
import {cloud, request, categories, type Category, type Metadata, type Resource} from './client';
import {ResourceCard} from './ResourceLibrary';
import {syntaxTopics} from '../data/syntax';
import {terms} from '../data/glossary';
import {accept, fileInfo, MAX_GLOSSARY_TERMS, metadata as validateMetadata, sha256} from '../../supabase/functions/_shared/validation.mjs';

type Lesson = {id:number;title:string};
type Profile = {id:string;role:'admin'|'teacher';email?:string};
type Reservation = {id:string;storage_path:string;object_exists:boolean};
type FileVersion = {id:string;original_filename:string;retired_at:string};
type Draft = {file:File; title:string};
const bucket = 'python-learning-resources';
const initial:Metadata = {title:'',description:'',category_id:null,chapter_id:null,lesson_id:null,tags:[],
  glossary_ids:[],language:'en',difficulty:'all',display_order:0,status:'draft'};

export default function TeacherResources({lessons}: {lessons:Lesson[]}) {
  const [profile,setProfile] = useState<Profile|null>(null);
  const [rows,setRows] = useState<Resource[]>([]);
  const [groups,setGroups] = useState<Category[]>([]);
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const [busy,setBusy] = useState(false);
  const [checking,setChecking] = useState(Boolean(cloud));
  const [drafts,setDrafts] = useState<Draft[]>([]);
  const [metadata,setMetadata] = useState(initial);
  const [editing,setEditing] = useState<Resource|null>(null);
  const [versions,setVersions] = useState<FileVersion[]>([]);
  const [reservation,setReservation] = useState<(Reservation & {file:File;mime:string})|null>(null);
  const [query,setQuery] = useState('');
  const [status,setStatus] = useState('');
  const [showPassword,setShowPassword] = useState(false);
  const [recover,setRecover] = useState(false);
  const [resetPassword,setResetPassword] = useState(() => new URLSearchParams(location.search).get('teacher-recovery')==='1');
  const [limit,setLimit] = useState(25*1024*1024);
  const message = (reason:unknown) => setError(reason instanceof Error ? reason.message : 'Request failed. Please retry.');

  async function refresh() {
    const items:Resource[] = [];
    for (let page = 0; ; page++) {
      const batch = await request<Resource[]>('list',{page},true);
      items.push(...batch);
      if (batch.length < 100) break;
    }
    setRows(items);
  }
  async function identify() {
    const person = await request<Profile>('profile',{},true);
    const [categoryList, setting] = await Promise.all([
      categories(),cloud!.from('resource_settings').select('max_file_size').single()
    ]);
    if (setting.error) throw Error('Library settings could not load.');
    await refresh();
    setGroups(categoryList); setLimit(setting.data.max_file_size); setProfile(person);
  }
  useEffect(() => {
    if (!cloud) return;
    cloud.auth.getSession().then(({data}) => data.session ? identify() : undefined)
      .catch(message).finally(() => setChecking(false));
    const {data} = cloud.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null); setRows([]); setGroups([]); setReservation(null); reset();
      }
      if (event === 'PASSWORD_RECOVERY') setResetPassword(true);
    });
    return () => data.subscription.unsubscribe();
  },[]);

  useEffect(() => {
    if (!profile) return;
    let active = true;
    const verify = () => void request<Profile>('profile',{},true).catch(() => {
      if (!active) return;
      setProfile(null); setRows([]); setGroups([]); setReservation(null); reset();
      setError('Teacher access could not be verified. Please sign in again.');
    });
    window.addEventListener('focus',verify);
    return () => { active = false; window.removeEventListener('focus',verify); };
  },[profile]);

  async function signIn(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true); setError('');
    try {
      const result = await cloud!.auth.signInWithPassword({
        email:String(values.get('email')),password:String(values.get('password')),
      });
      form.reset();
      if (result.error) throw Error('Sign-in failed. Check your email and password.');
      try { await identify(); }
      catch {
        await cloud!.auth.signOut();
        throw Error('Teacher access could not be verified for this account.');
      }
    } catch (reason) { message(reason); }
    finally { setBusy(false); }
  }
  const field = <K extends keyof Metadata>(key:K,value:Metadata[K]) => setMetadata(previous => ({...previous,[key]:value}));
  function edit(resource:Resource) {
    setEditing(resource); setDrafts([]); setVersions([]);
    const {title,description,category_id,chapter_id,lesson_id,tags,glossary_ids,language,difficulty,display_order,status} = resource;
    setMetadata({title,description,category_id,chapter_id,lesson_id,tags,glossary_ids,language,difficulty,display_order,status:status ?? 'draft'});
  }
  function reset() { setEditing(null); setMetadata(initial); setDrafts([]); setVersions([]); }
  function files(items:FileList|null) {
    if (!items) return;
    setDrafts(Array.from(items).slice(0,editing ? 1 : 10).map(file => ({
      file,title:editing ? metadata.title : file.name.replace(/\.[^.]+$/,''),
    })));
  }
  async function work(action:() => Promise<void>) {
    setBusy(true); setError(''); setNotice('');
    try { await action(); } catch (reason) { message(reason); }
    finally { setBusy(false); }
  }
  async function upload(event:FormEvent) {
    event.preventDefault();
    if (reservation) return;
    await work(async () => {
      if (!drafts.length && editing) {
        await request('edit',{id:editing.id,version:editing.version,metadata:validateMetadata(metadata)},true);
        setNotice('Metadata saved.');
      } else {
        const pending = drafts.map(({file,title}) => ({
          file,
          info:fileInfo(file.name,file.size,file.type,limit),
          learningMetadata:validateMetadata({...metadata,title}),
        }));
        for (const {file,info,learningMetadata} of pending) {
          const checksum = await sha256(new Uint8Array(await file.arrayBuffer()));
          const prepared = await request<Reservation>('prepare',{
            request_id:crypto.randomUUID(),resource_id:editing?.id,version:editing?.version,
            original_filename:info.name,file_size:file.size,mime_type:info.mime,sha256:checksum,
            metadata:learningMetadata,
          },true);
          setReservation({...prepared,file,mime:info.mime});
          if (!prepared.object_exists) {
            const {error} = await cloud!.storage.from(bucket).upload(prepared.storage_path,file,{contentType:info.mime,upsert:false});
            if (error) throw error;
          }
          await request('finalize',{upload_id:prepared.id},true);
          setReservation(null);
          setDrafts(previous => previous.filter(item => item.file !== file));
          setNotice(`${file.name} verified and saved.`);
        }
      }
      reset();
      await refresh();
    });
  }
  async function change(resource:Resource,next:Metadata['status']) {
    await work(async () => {
      const updated = await request<Resource>('edit',{id:resource.id,version:resource.version,metadata:{...resource,status:next}},true);
      if (editing?.id === updated.id) edit(updated);
      await refresh();
      setNotice(next === 'deleted' ? 'Moved to trash.' : `Saved as ${next}.`);
    });
  }
  async function sendRecovery(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get('email'));
    await work(async () => {
      const redirect = new URL(location.pathname,location.origin);
      redirect.searchParams.set('teacher-recovery','1');
      const result = await cloud!.auth.resetPasswordForEmail(email,{redirectTo:redirect.href});
      if (result.error) throw Error('Could not request a reset link. Please try again later.');
      setNotice('If the account can receive a reset link, check your email.');
    });
  }
  function finishRecovery() {
    history.replaceState(null,'',location.pathname+'#/teacher/resources');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    setResetPassword(false); setRecover(false); setError(''); setNotice('');
  }
  async function savePassword(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get('new-password'));
    await work(async () => {
      const {error} = await cloud!.auth.updateUser({password});
      if (error) throw error;
      await cloud!.auth.signOut();
      finishRecovery();
      setNotice('Password updated. Sign in with your new password.');
    });
  }
  if (!cloud) return <p className="card">Connect a dedicated Python Lab Supabase project to enable teacher sign-in.</p>;
  if (checking) return <p role="status">Checking teacher session…</p>;
  if (resetPassword && profile) return <form className="card studio-auth" onSubmit={savePassword}>
    <h1>Set a new password</h1>
    <label>New password<input name="new-password" type={showPassword?'text':'password'} autoComplete="new-password" minLength={8} required/></label>
    <div className="utility-actions"><button className="button primary" disabled={busy}>Update password</button>
      <button className="button small" type="button" onClick={finishRecovery}>Cancel</button></div>
    {error && <p role="alert">{error}</p>}
  </form>;
  if (!profile || resetPassword) return <form className="card studio-auth" onSubmit={recover || resetPassword ? sendRecovery : signIn}>
    <h1>{recover || resetPassword ? 'Reset teacher password' : 'Teacher sign-in'}</h1>
    <p>{recover || resetPassword ? 'Enter your teacher account email to request a recovery link.' : 'Sign in with your authorized teacher account to manage study materials.'}</p>
    <label>Email<input name="email" type="email" autoComplete="username" required/></label>
    {!recover && !resetPassword && <>
      <label>Password<input name="password" type={showPassword?'text':'password'} autoComplete="current-password" required/></label>
      <button className="button small password-toggle" type="button" onClick={() => setShowPassword(!showPassword)}>
        {showPassword?'Hide password':'Show password'}
      </button>
    </>}
    <div className="utility-actions">
      <button className="button primary" disabled={busy}>{recover || resetPassword?'Send recovery link':'Sign in'}</button>
      <button className="button small" type="button" onClick={() => {
        if (resetPassword) finishRecovery();
        else {setRecover(!recover); setError(''); setNotice('');}
      }}>{recover || resetPassword?'Back to sign-in':'Forgot password?'}</button>
    </div>
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
  </form>;
  return <>
    <div className="page-heading"><h1>Teacher Studio</h1><p>Manage study materials and retained file versions.</p></div>
    <div className="utility-actions">
      <p>Signed in as {profile.email ?? profile.role}</p>
      <button className="button small" disabled={busy} onClick={() => void work(async () => {const {error} = await cloud!.auth.signOut(); if(error) throw error;})}>Sign out</button>
    </div>
    <dl className="studio-stats">
      <div><dt>Published</dt><dd>{rows.filter(row => row.status==='published').length}</dd></div>
      <div><dt>Drafts</dt><dd>{rows.filter(row => row.status==='draft').length}</dd></div>
      <div><dt>Archived or trash</dt><dd>{rows.filter(row => row.status==='archived'||row.status==='deleted').length}</dd></div>
      <div><dt>Current file storage</dt><dd>{(rows.reduce((total,row) => total + row.file_size,0)/1048576).toFixed(1)} MiB</dd></div>
    </dl>
    <p>Retained file versions use additional storage.</p>
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
    <form id="studio-editor" className="card studio-form" onSubmit={upload}>
      <fieldset disabled={busy || Boolean(reservation)}>
        <legend>{editing ? 'Edit or replace material' : 'Upload materials'}</legend>
        <label>Title<input required={Boolean(editing)} value={metadata.title} maxLength={160}
          onChange={event => {field('title',event.target.value); if(drafts.length === 1) setDrafts([{...drafts[0],title:event.target.value}]);}}/></label>
        <label>Description<textarea value={metadata.description} maxLength={4000} onChange={event => field('description',event.target.value)}/></label>
        <div className="catalog-filters">
          <label>Chapter<select value={metadata.chapter_id ?? ''} onChange={event => field('chapter_id',event.target.value === '' ? null : Number(event.target.value))}>
            <option value="">None</option>{lessons.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select></label>
          <label>Syntax topic<select value={metadata.lesson_id ?? ''} onChange={event => field('lesson_id',event.target.value || null)}>
            <option value="">None</option>{syntaxTopics.map(topic => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select></label>
          <label>Category<select value={metadata.category_id ?? ''} onChange={event => field('category_id',event.target.value || null)}>
            <option value="">None</option>{groups.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label>Language<select value={metadata.language} onChange={event => field('language',event.target.value)}>
            <option value="en">English</option><option value="hi">हिन्दी</option><option value="both">English + हिन्दी</option></select></label>
          <label>Difficulty<select value={metadata.difficulty} onChange={event => field('difficulty',event.target.value)}>
            <option value="all">All levels</option>{['beginner','intermediate','advanced'].map(value => <option key={value}>{value}</option>)}</select></label>
          <label>Display order<input type="number" min={-100000} max={100000} value={metadata.display_order}
            onChange={event => field('display_order',Number(event.target.value))}/></label>
          <label>Status<select value={metadata.status} onChange={event => field('status',event.target.value as Metadata['status'])}>
            <option value="draft">Draft</option><option value="published" disabled={editing?.status === 'deleted'}>Published</option>
            {metadata.status === 'deleted' && <option value="deleted" disabled>In trash</option>}</select></label>
        </div>
        <label>Tags, separated by commas<input value={metadata.tags.join(',')} onChange={event => field('tags',event.target.value.split(','))}/></label>
        <fieldset className="studio-glossary" aria-describedby="studio-glossary-help">
          <legend>Glossary terms</legend>
          <p id="studio-glossary-help">Select up to {MAX_GLOSSARY_TERMS} terms. Uncheck a selected term to remove it.</p>
          <p role="status">{metadata.glossary_ids.length} of {MAX_GLOSSARY_TERMS} selected</p>
          <div className="studio-glossary-options">
            {terms.map(term => {
              const selected = metadata.glossary_ids.includes(term.id);
              return <label key={term.id}>
                <input type="checkbox" value={term.id} checked={selected}
                  disabled={!selected && metadata.glossary_ids.length >= MAX_GLOSSARY_TERMS}
                  onChange={event => field('glossary_ids',event.target.checked
                    ? [...metadata.glossary_ids,term.id]
                    : metadata.glossary_ids.filter(id => id !== term.id))}/>
                {term.name}
              </label>;
            })}
          </div>
        </fieldset>
        <label className="studio-drop" onDragOver={event => event.preventDefault()} onDrop={event => {event.preventDefault(); files(event.dataTransfer.files);}}>
          Choose or drop {editing ? 'a replacement file' : 'up to ten files'} · up to {(limit/1048576).toFixed(0)} MiB each
          <input type="file" accept={accept} multiple={!editing} onChange={event => {files(event.target.files); event.target.value='';}}/>
        </label>
        {drafts.map((draft,index) => <label key={index}>Title for {draft.file.name}<input value={draft.title} required maxLength={160}
          onChange={event => setDrafts(previous => previous.map((item,i) => i === index ? {...item,title:event.target.value} : item))}/></label>)}
        <div className="utility-actions">
          <button className="button primary" disabled={!editing && !drafts.length}>Save {drafts.length ? 'files' : 'metadata'}</button>
          <button type="button" className="button small" onClick={reset}>Clear form</button>
        </div>
      </fieldset>
    </form>
    {reservation && !busy && <div className="utility-actions">
      <button className="button small" onClick={() => void work(async () => {
        try {
          await request('finalize',{upload_id:reservation.id},true);
        } catch {
          const {error} = await cloud!.storage.from(bucket).upload(reservation.storage_path,reservation.file,
            {contentType:reservation.mime,upsert:false});
          if (error) throw error;
          await request('finalize',{upload_id:reservation.id},true);
        }
        setReservation(null);
        setDrafts(previous => previous.filter(item => item.file !== reservation.file));
        await refresh(); setNotice('File verified and saved.');
      })}>Retry upload and verification</button>
      <button className="button small" onClick={() => void work(async () => {
        await request('cancel',{upload_id:reservation.id},true); setReservation(null); setNotice('Upload cancelled. Select Save to start again.');
      })}>Cancel upload</button>
    </div>}
    {busy && <p role="status">Working with the resource service…</p>}
    <div className="catalog-filters">
      <label>Search your materials<input value={query} onChange={event => setQuery(event.target.value)}/></label>
      <label>Filter by status<select value={status} onChange={event => setStatus(event.target.value)}>
        <option value="">All statuses</option>{['draft','published','archived','deleted'].map(value => <option key={value}>{value}</option>)}
      </select></label>
    </div>
    <h2>Your materials</h2>
    {rows.length===0 && <p className="card">No materials yet. Choose a file above to start a draft.</p>}
    {rows.filter(row => (!status || row.status === status) && [row.title,row.description,...row.tags].join(' ').toLowerCase().includes(query.toLowerCase()))
      .map(row => <section className="studio-row" key={row.id}>
        {row.status === 'deleted' ? <div className="card"><h3>{row.title}</h3><p>{row.original_filename} · In trash</p></div> : <ResourceCard resource={row} teacher/>}
        <p>{row.status} · revision {row.version}</p>
        <div className="utility-actions">
          <button className="button small" disabled={busy || Boolean(reservation) || row.status === 'deleted'} onClick={() => {edit(row); document.getElementById('studio-editor')?.scrollIntoView({block:'start'});}}>Edit or replace</button>
          {row.status === 'deleted' ? <button className="button small" disabled={busy} onClick={() => void change(row,'draft')}>Restore draft</button> :
          <>
            <button className="button small" disabled={busy} onClick={() => void change(row,row.status === 'published' ? 'draft' : 'published')}>{row.status === 'published' ? 'Unpublish' : 'Publish'}</button>
            <button className="button small" disabled={busy} onClick={() => {
              if (confirm(`Move "${row.title}" to trash?`)) void change(row,'deleted');
            }}>Trash</button>
            <button className="button small" disabled={busy} onClick={() => void work(async () => {
              const history = await request<FileVersion[]>('versions',{id:row.id},true);
              edit(row); setVersions(history); if (!history.length) setNotice('No retained file versions.');
            })}>File versions</button>
          </>}
        </div>
        {editing?.id === row.id && versions.map(version => <div key={version.id}>
          {version.original_filename} · {version.retired_at.slice(0,10)}{' '}
          <button className="button small" disabled={busy} onClick={() => void work(async () => {
            await request('restore_version',{id:row.id,version:row.version,file_version:version.id},true);
            reset(); await refresh(); setNotice('Previous file restored as a draft.');
          })}>Restore this file</button>
        </div>)}
      </section>)}
    {profile.role === 'admin' && <div className="card">
      <h3>Retention and backup</h3>
      <p>Expired replacements and trash can be removed permanently. Back up metadata and Storage bytes before cleanup.</p>
      <button className="button small" disabled={busy} onClick={() => void work(async () => {
        const {downloadJson} = await import('../lib/download');
        downloadJson('python-lab-resource-manifest.json',await request('manifest',{},true));
      })}>Export metadata</button>
      <button className="button small" disabled={busy} onClick={() => {
        if (confirm('Permanently remove expired files according to the retention policy?')) void work(async () => {
          const result = await request<{removed:number;failed:number}>('maintenance',{confirm:'purge-expired'},true);
          setNotice(`Removed ${result.removed} files. ${result.failed} failed.`);
        });
      }}>Run retention cleanup</button>
    </div>}
  </>;
}
