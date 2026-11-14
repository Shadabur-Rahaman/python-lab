import {isGuidedChapter} from './data/pilotActivities';
import PilotLesson from './components/PilotLesson';
import BeginnerHome from './components/BeginnerHome';
import {ReceiptEditor,ReceiptLesson} from './components/ReceiptWorkspace';
import {lazy,Suspense,useEffect,useState} from 'react';
import {ArrowRight,BookOpen,Code2,FlaskConical,Home,Menu,Moon,Sun,Target,Trophy,FolderOpen,Search,Check,ChevronRight,Terminal,Compass} from 'lucide-react';
import {chapters as beginner,allTasks,revisionQuiz} from './data/curriculum';
import {buildCatalog,lessonNeighbors} from './data/catalog.mjs';
import {projects} from './data/projects';
import type {Chapter} from './data/types';
import {KEY,LEGACY_KEY,freshProgress,loadProgress,saveProgress,percentage,mergeProgress,type Progress} from './lib/progress.mjs';
import CodeLab from './components/CodeLab';
import {storage} from './lib/storage';
import {checkpoints} from './data/checkpoints';
import Quiz from './components/Quiz';
import Experiments from './components/Experiments';
import LessonView from './components/LessonView';
import CourseCatalog from './components/CourseCatalog';
import PracticeView from './components/PracticeView';
import ProgressBackup from './components/ProgressBackup';
const ResourceLibrary = lazy(() => import('./resources/ResourceLibrary'));
const TeacherResources = lazy(() => import('./resources/TeacherResources'));
const GlossaryPage = lazy(() => import('./components/GlossaryPage'));
const KnowledgeSearch = lazy(() => import('./components/KnowledgeSearch'));
const Keywords = lazy(() => import('./components/Keywords'));
const SyntaxAcademy = lazy(() => import('./components/SyntaxAcademy'));
const catalog = buildCatalog(beginner, projects);
const chapters = catalog.lessons;
const groups = [
 ['Course', [['home','Home',Home],['chapters','Learn',BookOpen],['practice','Practice',Code2],
   ['syntax','Syntax',Code2],['projects','Projects',FolderOpen],['progress','Progress',Trophy]]],
 ['Learning tools', [['playground','Python Playground',Terminal],['lab','Experiment Lab',FlaskConical],['quiz','Quiz Arena',Target],
   ['keywords','Python Keywords',Code2],['glossary','Bilingual Glossary',BookOpen],['resources','Study Materials',FolderOpen]]],
] as const;
const nav = groups.flatMap(([,items]) => [...items]);
const link=(route:string)=>`#/${route}`;
export default function App(){
 const [route,setRoute]=useState(location.hash.slice(2)||'home');
 const [menu,setMenu]=useState(false);
 const [collapsed,setCollapsed]=useState(false);
 const [quizTopic,setQuizTopic]=useState('0');
 const [notice,setNotice]=useState('');
 const [expanded,setExpanded]=useState<Chapter[]>();
 const [loadFailed,setLoadFailed]=useState(false);
 const [progress,setProgress]=useState(()=>loadProgress(storage,catalog));
 const [dark,setDark]=useState(()=>{try{return localStorage.getItem('python-lab.theme')==='dark';}catch{return false;}});
 const [page,id,topicId]=route.split('?')[0].split('/');
 const teacherRoute=route.split('?')[0]==='teacher/resources'||new URLSearchParams(location.search).get('teacher-recovery')==='1';
 const metadata=chapters.find(item=>String(item.id)===id);
 const chapter=beginner.find(item=>String(item.id)===id) ?? expanded?.find(item=>String(item.id)===id);
 const project=projects.find(item=>item.id===id);
 const needsExpanded=page==='practice'||page==='search'||page==='quiz'||(page==='chapter'&&!!metadata&&!beginner.some(item=>item.id===metadata.id));

 useEffect(()=>{
   if(!needsExpanded || expanded || loadFailed) return;
   let cancelled=false;
   import('./data/intermediate').then(module=>{
     if(!cancelled) setExpanded(module.intermediate);
   }).catch(()=>{
     if(!cancelled) setLoadFailed(true);
   });
   return ()=>{cancelled=true;};
 },[needsExpanded,expanded,loadFailed]);

 function update(change:(current:Progress)=>Progress) {
   const next=change(loadProgress(storage,catalog));
   if(!saveProgress(storage,next)) setNotice('Browser storage is unavailable. Progress will only last for this visit.');
   setProgress(next);
 }

 useEffect(()=>{
   const sync=(event:StorageEvent)=>{
     if(event.key===KEY||event.key===LEGACY_KEY||event.key===null) setProgress(loadProgress(storage,catalog));
   };
   window.addEventListener('storage',sync);
   return ()=>window.removeEventListener('storage',sync);
 },[]);

 function add(key:'completed',value:number):void;
 function add(key:'solved'|'projects',value:string):void;
 function add(key:'completed'|'solved'|'projects',value:number|string) {
   update(current=>({...current,[key]:[...new Set([...current[key],value])]}));
 }
 const saveScore=(key:string,score:number)=>update(current=>({
   ...current,scores:{...current.scores,[key]:Math.max(current.scores[key]??0,score)},
 }));
 useEffect(()=>{
   const change=()=>{
     setRoute(location.hash.slice(2)||'home');
     setMenu(false);
     window.scrollTo(0,0);
     document.getElementById('main')?.focus({preventScroll:true});
   };
   window.addEventListener('hashchange',change);
   return ()=>window.removeEventListener('hashchange',change);
 },[]);
 useEffect(()=>{
   if(page!=='chapter'||!chapter) return;
   update(current=>({...current,visited:[...new Set([...current.visited,chapter.id])],last:chapter.id,
     recent:[chapter.id,...current.recent.filter(id=>id!==chapter.id)].slice(0,10)}));
 },[page,chapter]);
 useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';try{localStorage.setItem('python-lab.theme',dark?'dark':'light');}catch{}},[dark]);

 useEffect(()=>{
   if(!menu) return;
   document.querySelector<HTMLAnchorElement>('#workspace-sidebar .brand')?.focus();
   function closeOnEscape(event:KeyboardEvent) {
     if(event.key!=='Escape') return;
     setMenu(false);
     document.querySelector<HTMLButtonElement>('.mobile-menu')?.focus();
   }
   window.addEventListener('keydown',closeOnEscape);
   return ()=>window.removeEventListener('keydown',closeOnEscape);
 },[menu]);

 useEffect(()=>{
   if(teacherRoute) return;
   function searchShortcut(event:KeyboardEvent) {
     if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k') {
       event.preventDefault();
       if(page==='search') document.querySelector<HTMLInputElement>('#main input')?.focus();
       else location.hash=link('search');
     }
   }
   window.addEventListener('keydown',searchShortcut);
   return ()=>window.removeEventListener('keydown',searchShortcut);
 },[page,teacherRoute]);

 const last=chapters.find(item=>item.id===progress.last) ?? chapters[0];
 const next=progress.completed.includes(last.id)
   ? lessonNeighbors(catalog,last.id).next ?? chapters.find(item=>!progress.completed.includes(item.id)) ?? last
   : last;
 const coursePercent=percentage(progress,catalog);
 const firstProgram=()=>update(current=>current.firstProgram?current:{...current,firstProgram:true});
 const milestones=[
   ['First Program',progress.firstProgram,'Run any lesson example'],
   ['Variable Explorer',progress.completed.includes(2),'Complete chapter 2'],
   ['Logic Builder',progress.completed.includes(6),'Complete chapter 6'],
   ['Loop Master',progress.completed.includes(7),'Complete chapter 7'],
   ['Function Creator',progress.completed.includes(11),'Complete chapter 11'],
   ['Python Beginner Graduate',beginner.every(item=>progress.completed.includes(item.id)&&item.tasks.every(task=>progress.solved.includes(task.id)))&&(progress.scores.revision??0)>=70,'Complete the original beginner chapters and exercises, then score at least 70% on V1 revision'],
 ] as const;
 const selectedQuiz=quizTopic==='applied'?checkpoints.map(item=>item.question):quizTopic==='revision'?revisionQuiz:
   (beginner.find(item=>String(item.id)===quizTopic)??expanded?.find(item=>String(item.id)===quizTopic))?.quiz;
 const waiting=needsExpanded&&!expanded;
 const titles:Record<string,string>={playground:'Python Playground',keywords:'Python Keywords',home:'Your learning dashboard',chapters:'Your Python roadmap',syntax:'Python Syntax Academy',glossary:'Bilingual Glossary',search:'Search Python Lab',resources:'Study Materials',chapter:metadata?.title||'Chapter',practice:'A little practice. A lot of progress.',lab:'Experiment Lab',quiz:'Quiz Arena',projects:project?.title||'Build something real.',progress:'Look how far you’ve come.'};
 const themeButton=<button className="icon-button" onClick={()=>setDark(!dark)} aria-label={dark?'Switch to light mode':'Switch to dark mode'}>{dark?<Sun size={19}/>:<Moon size={19}/>}</button>;
 if(teacherRoute) return <div className="studio-shell">
   <header className="studio-header"><a href={link('home')} className="studio-brand"><Code2 size={22}/> Python Lab</a>{themeButton}</header>
   <main id="main" className="studio-main" tabIndex={-1}>
     <Suspense fallback={<p role="status">Loading teacher sign-in…</p>}><TeacherResources lessons={chapters}/></Suspense>
   </main>
 </div>;
 return <div className={'app-shell'+(collapsed?' sidebar-collapsed':'')}>
   <a className="skip-link" href="#main" onClick={event=>{event.preventDefault();document.getElementById('main')?.focus();}}>Skip to content</a>
   <aside id="workspace-sidebar" className={'sidebar'+(menu?' open':'')}>
     <a className="brand" href={link('home')}><span className="brand-mark"><Code2 size={24}/></span><span>Python<span className="brand-light">Lab</span><small>STUDENT WORKSPACE</small></span></a>
     <nav aria-label="Main navigation">
       {groups.map(([label,items])=><details key={label} open className="nav-group">
         <summary>{label}<ChevronRight size={13}/></summary>
         {items.map(([path,name,Icon])=>{
           const active=page===path||(path==='chapters'&&page==='chapter');
           return <a key={path} href={link(path)} className={active?'active':''} aria-current={active?'page':undefined}><Icon size={18}/>{name}</a>;
         })}
       </details>)}
     </nav>
     <div className="sidebar-course"><div className="section-heading"><b>Course progress</b><span>{coursePercent}%</span></div>
       <div className="progress-track"><span style={{width:coursePercent+'%'}}/></div>
       <small>{progress.completed.length} of {chapters.length} chapters completed</small>
     </div>
   </aside>
   {menu&&<button className="menu-shade" aria-label="Close navigation" onClick={()=>setMenu(false)}/>}
   <div className="main-shell"><header className="topbar">
     <div>
       <button className="icon-button mobile-menu" aria-label="Toggle navigation" aria-expanded={menu} aria-controls="workspace-sidebar" onClick={()=>setMenu(!menu)}><Menu size={22}/></button>
       <button className="icon-button desktop-menu" aria-label={collapsed?'Show navigation':'Hide navigation'} aria-expanded={!collapsed} aria-controls="workspace-sidebar" onClick={()=>setCollapsed(!collapsed)}><Menu size={18}/></button>
       <a href={link('home')}>Workspace</a><ChevronRight size={14}/><span>{nav.find(([path])=>path===page)?.[1]||(page==='chapter'?'Chapters':page==='search'?'Search':'Home')}</span>
     </div>
     <div className="topbar-actions"><a className="search-shortcut" href={link('search')} aria-label="Search Python Lab"><Search size={17}/><span>Search</span><kbd>{navigator.platform.includes('Mac')?'⌘':'Ctrl'} K</kbd></a>{themeButton}</div>
   </header>
 <main id="main" tabIndex={-1}>{notice&&<p className="feedback" role="alert">{notice}</p>}
 {page==='home'?<BeginnerHome next={next} completed={progress.completed.length} total={chapters.length}
   percent={coursePercent} returning={progress.visited.length>0} onRun={firstProgram}/>:
 <><div className="page-heading"><span className="eyebrow">PYTHON LAB / {page==='chapter'?`CHAPTER ${metadata?.id ?? ""}`:page.toUpperCase()}</span><h1>{titles[page]||'Find your next step'}</h1><p>{page==='chapters'?'A clear path from your first line of code to your first real project. Every chapter is open to explore.':page==='practice'?'Run to experiment. Check Answer to verify your solution. Mistakes are part of the process.':page==='lab'?'A safe place to ask “what if?”. This is real Python, right in your browser.':page==='quiz'?'Strengthen your understanding, one good question at a time.':page==='projects'?'Useful skills become useful things. Choose a guided project and make it yours.':page==='progress'?'Track the chapters, exercises and projects you’ve completed.':page==='resources'?'Notes, presentations, exercises, reference sheets and downloadable resources for your Python course.':metadata?.subtitle}</p></div>
 {page==='chapters'&&<CourseCatalog catalog={catalog} progress={progress}/>}
 {page==='resources'&&<Suspense fallback={<p role="status">Loading library…</p>}><ResourceLibrary key={route} lessons={chapters}/></Suspense>}
 {page==='keywords'&&<Suspense fallback={<p role="status">Loading keywords…</p>}><Keywords/></Suspense>}
 {page==='glossary'&&<Suspense fallback={<p role="status">Loading glossary…</p>}><GlossaryPage id={id}/></Suspense>}
 {page==='search'&&!waiting&&<Suspense fallback={<p role="status">Loading search…</p>}><KnowledgeSearch lessons={chapters}
   exercises={[...allTasks,...(expanded??[]).flatMap(lesson=>lesson.tasks)]}/></Suspense>}
 {page==='syntax'&&<Suspense fallback={<p role="status">Loading syntax topics…</p>}><SyntaxAcademy category={id} id={topicId} lessons={chapters}/></Suspense>}
 {page==='chapter'&&chapter&&isGuidedChapter(chapter.id)&&
   <PilotLesson key={'pilot-'+chapter.id} id={chapter.id} onRun={firstProgram}/>}
 {page==='playground'&&<div className="playground-workspace"><p>Your receipt draft follows you between Variables and Values and this Playground.</p>
   <ReceiptEditor onRun={firstProgram} full/><a className="inline-link" href={link('chapter/2')}>Return to Variables and Values</a>
 </div>}
 {page==='chapter'&&chapter&&<LessonView key={chapter.id} lesson={chapter} catalog={catalog} projects={projects}
   completed={progress.completed} solved={progress.solved} bookmarked={progress.bookmarks.includes(chapter.id)}
   onBookmark={()=>update(current=>({...current,bookmarks:current.bookmarks.includes(chapter.id)
     ?current.bookmarks.filter(id=>id!==chapter.id):[...current.bookmarks,chapter.id]}))}
   onComplete={()=>add('completed',chapter.id)} onSolve={id=>add('solved',id)}
   onQuiz={score=>saveScore(String(chapter.id),score)} onRun={firstProgram}/>}
 {page==='chapter'&&id==='2'&&<details className="card"><summary>Continue the receipt workspace</summary><ReceiptLesson onRun={firstProgram}/></details>}
 {page==='practice'&&!waiting&&<PracticeView key={id} selectedTask={id} tasks={[...allTasks,...(expanded??[]).flatMap(lesson=>lesson.tasks)]}
   catalog={catalog} solved={progress.solved} onSolve={id=>add('solved',id)}/>}
 {page==='lab'&&<Experiments/>}
 {page==='quiz'&&!waiting&&<><label className="quiz-select">Choose your assessment
   <select value={quizTopic} onChange={event=>setQuizTopic(event.target.value)}>
     {chapters.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}
     <option value="applied">Applied Python · {checkpoints.length} scenarios</option>
     <option value="revision">V1 revision · {revisionQuiz.length} questions</option>
   </select></label>
   <p>Best completed score: {progress.scores[quizTopic]===undefined?'No attempt completed yet':`${progress.scores[quizTopic]}%`}</p>
   {selectedQuiz&&<Quiz key={quizTopic} questions={selectedQuiz} onComplete={score=>saveScore(quizTopic,score)}/>}</>}
 {waiting&&<div className="card" role="status">{loadFailed?<><p>Lesson content could not load.</p>
   <button className="button" onClick={()=>location.reload()}>Reload page</button></>:<p>Loading lesson content…</p>}</div>}
 {page==='projects'&&!project&&<div className="chapter-grid">{projects.map((p,i)=><a className="card project-card" key={p.id} href={link(`projects/${p.id}`)}><span className={`stat-icon color-${i%4}`}><FolderOpen size={23}/></span><span className="eyebrow">PROJECT {String(i+1).padStart(2,'0')}</span><h2>{p.title}</h2><p>{p.use}</p><small>Complete chapters {p.chapters.join(', ')} first</small><div className="card-bottom"><b>{progress.projects.includes(p.id)?'✓ Completed':'Build this project'}</b><ArrowRight size={17}/></div></a>)}</div>}
 {page==='projects'&&project&&<><a className="text-link" href={link('projects')}>← All projects</a><div className="card"><h2>What you’ll build</h2><p>{project.use}</p><p>Prerequisites: {project.chapters.map(n=><a className="inline-link" key={n} href={link(`chapter/${n}`)}>Chapter {n} </a>)}</p><h3>Functional requirements</h3><ul>{project.requirements.map(s=><li key={s}>{s}</li>)}</ul><h3>Your guided breakdown</h3><ol>{project.steps.map(s=><li key={s}>{s}</li>)}</ol></div><CodeLab key={project.id} initial={project.starter} input={project.input} label={`${project.id}.py`} persist/><div className="two-columns"><div className="card"><h3>Sample input</h3><pre>{project.input||'No input required.'}</pre><h3>Sample output</h3><pre>{project.output}</pre></div><div className="card"><h3>Test your project</h3><ul>{project.tests.map(t=><li key={t}>{t}</li>)}</ul><h3>Common mistake</h3><p>{project.mistake}</p></div></div><details className="card"><summary>Reveal final solution</summary><CodeLab key={project.id} initial={project.solution} input={project.input} draftId={'project-solution-'+project.id} label="solution.py"/></details><div className="card"><h3>Make it your own</h3><ul>{project.improvements.map(s=><li key={s}>{s}</li>)}</ul><label className="project-check"><input type="checkbox" checked={progress.projects.includes(project.id)} onChange={e=>{if(e.target.checked)add('projects',project.id);else update(p=>({...p,projects:p.projects.filter(x=>x!==project.id)}));}}/> I built this project and tried the testing instructions.</label><p className="runtime-note">Project completion is self-reported. Your practice exercises use automated checks.</p></div></>}
 {page==='progress'&&<><div className="card progress-overview"><div className="progress-ring" style={{background:`conic-gradient(var(--accent) ${coursePercent}%, var(--line) 0)`}}><span>{coursePercent}<small>% complete</small></span></div><div><h2>Your foundation is taking shape.</h2><p>Completion combines chapters, solved exercises, finished chapter quizzes, and self-reported projects. Revisit anything, anytime.</p><a href={link(`chapter/${next.id}`)} className="button primary">Continue learning <ArrowRight size={15}/></a></div></div><div className="stats-grid">{[[progress.visited.length,'Chapters visited'],[progress.completed.length,'Chapters completed'],[progress.solved.length,'Exercises solved'],[progress.projects.length,'Projects completed']].map(([n,label])=><div className="stat-card" key={label}><b>{n}</b><span>{label}</span></div>)}</div><h2>Your milestones</h2><div className="chapter-grid">{milestones.map(([name,earned,description])=><div className={`card achievement ${earned?'earned':''}`} key={name}><Trophy size={27}/><h3>{name}</h3><p>{description}</p><span className="pill">{earned?'✓ Earned':'Keep exploring'}</span></div>)}</div><div className="card"><h2>Quiz best scores</h2>{Object.keys(progress.scores).length===0?<p>Your first score will appear when you finish a quiz.</p>:Object.entries(progress.scores).map(([key,score])=><p key={key}>{key==='revision'?'V1 revision':`Chapter ${key}: ${chapters.find(item=>String(item.id)===key)?.title}`} <b>{score}%</b></p>)}</div><ProgressBackup progress={progress} catalog={catalog} onImport={incoming=>update(current=>mergeProgress(current,incoming))} onReset={()=>update(freshProgress)}/></>}
 {(!titles[page]||(page==='chapter'&&!metadata))&&<div className="card"><h2>That page isn’t in the roadmap.</h2><a className="button primary" href={link('home')}>Back to Home</a></div>}
 </>}
 <footer className="page-footer"><span><Code2 size={15}/> Python Lab <span>· Learn it. Try it. Break it. Fix it. Master it.</span></span><span>Built for your first “aha!” moment.</span></footer></main></div>

 </div>;
}
