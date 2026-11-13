import {lazy,Suspense,useEffect,useState} from 'react';
import {ArrowRight,BookOpen,Code2,FlaskConical,Home,Menu,Moon,Sun,Target,Trophy,FolderOpen,Search,Check,ChevronRight,Sparkles,Terminal,Compass} from 'lucide-react';
import {chapters as beginner,allTasks,revisionQuiz} from './data/curriculum';
import {buildCatalog,lessonNeighbors} from './data/catalog.mjs';
import {projects} from './data/projects';
import type {Chapter} from './data/types';
import {KEY,LEGACY_KEY,freshProgress,loadProgress,saveProgress,percentage,mergeProgress,type Progress} from './lib/progress.mjs';
import CodeLab from './components/CodeLab';
import {storage} from './lib/storage';
import Quiz from './components/Quiz';
import Experiments,{experimentNames} from './components/Experiments';
import LessonView from './components/LessonView';
import CourseCatalog from './components/CourseCatalog';
import PracticeView from './components/PracticeView';
import ProgressBackup from './components/ProgressBackup';
const ResourceLibrary = lazy(() => import('./resources/ResourceLibrary'));
const TeacherResources = lazy(() => import('./resources/TeacherResources'));
const GlossaryPage = lazy(() => import('./components/GlossaryPage'));
const KnowledgeSearch = lazy(() => import('./components/KnowledgeSearch'));
const SyntaxAcademy = lazy(() => import('./components/SyntaxAcademy'));
const catalog = buildCatalog(beginner, projects);
const chapters = catalog.lessons;
const nav=[['home','Home',Home],['chapters','Chapters',BookOpen],['syntax','Python Syntax Academy',Code2],['glossary','Bilingual Glossary',BookOpen],['practice','Practice',Code2],['lab','Experiment Lab',FlaskConical],['quiz','Quiz Arena',Target],['resources','Study Materials',FolderOpen],['projects','Real-World Projects',FolderOpen],['progress','My Progress',Trophy],['teacher','Teacher Dashboard',FolderOpen]] as const;
const link=(route:string)=>`#/${route}`;
export default function App(){
 const [route,setRoute]=useState(location.hash.slice(2)||'home');
 const [menu,setMenu]=useState(false);
 const [quizTopic,setQuizTopic]=useState('0');
 const [notice,setNotice]=useState('');
 const [expanded,setExpanded]=useState<Chapter[]>();
 const [loadFailed,setLoadFailed]=useState(false);
 const [progress,setProgress]=useState(()=>loadProgress(storage,catalog));
 const [dark,setDark]=useState(()=>{try{return localStorage.getItem('python-lab.theme')==='dark';}catch{return false;}});
 const [page,id,topicId]=route.split('?')[0].split('/');
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
 const selectedQuiz=quizTopic==='revision'?revisionQuiz:
   (beginner.find(item=>String(item.id)===quizTopic)??expanded?.find(item=>String(item.id)===quizTopic))?.quiz;
 const waiting=needsExpanded&&!expanded;
 const titles:Record<string,string>={home:'Your learning dashboard',chapters:'Your Python roadmap',syntax:'Python Syntax Academy',glossary:'Bilingual Glossary',search:'Search Python Lab',resources:'Study Materials',teacher:'Teacher Dashboard',chapter:metadata?.title||'Chapter',practice:'A little practice. A lot of progress.',lab:'Experiment Lab',quiz:'Quiz Arena',projects:project?.title||'Build something real.',progress:'Look how far you’ve come.'};
 return <div className="app-shell"><a className="skip-link" href="#main" onClick={e=>{e.preventDefault();document.getElementById("main")?.focus();}}>Skip to content</a><aside id="workspace-sidebar" className={`sidebar ${menu?'open':''}`}><a className="brand" href={link('home')}><span className="brand-mark"><Code2 size={24}/></span><span>Python<span className="brand-light">Lab</span><small>FROM ZERO TO “I BUILT THIS.”</small></span></a><div className="sidebar-label">YOUR WORKSPACE</div><nav aria-label="Main navigation">{nav.map(([path,name,Icon])=><a key={path} href={link(path==='teacher'?'teacher/resources':path)} className={(page===path||(path==='chapters'&&page==='chapter'))?'active':''} aria-current={page===path?'page':undefined}><Icon size={19}/>{name}{path==='lab'&&<span className="tiny-pill">TRY IT</span>}</a>)}</nav><div className="sidebar-course"><span className="small-label">PYTHON FOUNDATIONS</span><div className="section-heading"><b>Your journey</b><span>{coursePercent}%</span></div><div className="progress-track"><span style={{width:`${coursePercent}%`}}/></div><small>{progress.completed.length} of {chapters.length} chapters completed</small><a href={link(`chapter/${next.id}`)}>Keep going <ArrowRight size={15}/></a></div><div className="sidebar-footer"><span className="live-dot"/> A small step, every day.<small>Made for curious minds.</small></div></aside>
 {menu&&<button className="menu-shade" aria-label="Close navigation" onClick={()=>setMenu(false)}/>}
 <div className="main-shell"><header className="topbar"><div><button className="icon-button mobile-menu" aria-label="Toggle navigation" aria-expanded={menu} aria-controls="workspace-sidebar" onClick={()=>setMenu(!menu)}><Menu size={22}/></button><a href={link('home')}>Workspace</a><ChevronRight size={14}/><span>{nav.find(([path])=>path===page)?.[1]||(page==='chapter'?'Chapters':'Home')}</span></div><div className="topbar-actions"><span className="beginner-tag"><span/> Beginner friendly</span><a className="icon-button" href={link("search")} aria-label="Search Python Lab"><Search size={18}/></a><button className="icon-button" onClick={()=>setDark(!dark)} aria-label={dark?'Switch to light mode':'Switch to dark mode'}>{dark?<Sun size={19}/>:<Moon size={19}/>}</button><span className="avatar" title="Your local learning space">Y</span></div></header>
 <main id="main" tabIndex={-1}>{notice&&<p className="feedback" role="alert">{notice}</p>}
 {page==='home'?<><div className="welcome-heading"><div><span className="eyebrow">LET’S MAKE SOMETHING CLICK</span><h2>Hello, future Pythonista <span className="wave">✦</span></h2><p>Big things start with a simple <code>print("Hello")</code>.</p></div><span className="version-tag">PYTHON LAB <b>3.0 PREVIEW</b></span></div><section className="hero"><div className="hero-copy"><span className="hero-badge"><Sparkles size={14}/> ZERO EXPERIENCE. ENDLESS POSSIBILITIES.</span><h1>Your Python journey<br/>starts <em>here.</em></h1><p>No experience? No problem. Learn Python step by step, run your first program, experiment with code, and build real things — right in your browser.</p><div className="hero-buttons"><a className="button primary" href={link(`chapter/${next.id}`)}>Start Learning <ArrowRight size={17}/></a><a className="button white" href={link('lab')}><Terminal size={17}/> Open Python Playground</a></div><div className="hero-checks"><span><Check size={14}/> No setup needed</span><span><Check size={14}/> Learn at your pace</span><span><Check size={14}/> 100% free</span></div></div><div className="hero-art" aria-label="Python code transforms an idea into output"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><span className="floating-tag tag-one"><span>✦</span> Ideas become code</span><div className="hero-window"><div className="window-bar"><i/><i/><i/><span>hello_python.py</span><Code2 size={14}/></div><div className="hero-code"><span className="code-comment"># Every expert was once a beginner.</span><br/><span className="code-purple">name</span> = <span className="code-yellow">"Future Pythonista"</span><br/><br/><span className="code-blue">print</span>(<span className="code-yellow">"Hello,"</span>, name)<br/><span className="code-blue">print</span>(<span className="code-yellow">"Let's build something!"</span>)</div><div className="hero-output"><span>›_ OUTPUT</span><p>Hello, Future Pythonista<br/>Let's build something!</p><small><span/> Executed successfully</small></div></div><div className="python-tile"><span>Py</span><small>your first superpower</small></div><span className="floating-tag tag-two"><Check size={15}/> You can do this.</span></div></section>
 <div className="stats-grid">{[[BookOpen,chapters.length,'Guided chapters','From the very first step'],[Code2,catalog.taskIds.size,'Practice challenges','Learn by doing'],[FlaskConical,experimentNames.length,'Interactive experiments','Make concepts click'],[FolderOpen,projects.length,'Real-world projects','Build with confidence']].map(([Icon,n,label,sub]:any,i)=><div className="stat-card" key={label}><span className={`stat-icon color-${i}`}><Icon size={21}/></span><div><b>{n} <span>{label}</span></b><small>{sub}</small></div></div>)}</div>
 <div className="dashboard-columns"><section><div className="section-heading"><div><span className="eyebrow">ONE CONCEPT AT A TIME</span><h2>Your learning roadmap</h2></div><a className="text-link" href={link('chapters')}>Explore Chapters <ArrowRight size={15}/></a></div><div className="roadmap-list">{chapters.slice(0,5).map((c,i)=><a className="roadmap-row" href={link(`chapter/${c.id}`)} key={c.id}><span className={`chapter-number ${progress.completed.includes(c.id)?'complete':''}`}>{progress.completed.includes(c.id)?<Check size={18}/>:String(c.id).padStart(2,'0')}</span><div><h3>{c.title}</h3><p>{c.subtitle}</p></div><span className={`lesson-status ${c.id===next.id?'current':''}`}>{progress.completed.includes(c.id)?'Completed':c.id===next.id?'Start here':`${i<2?'45':'60'} min`}</span><ChevronRight size={17}/></a>)}</div><a className="roadmap-bottom" href={link('chapters')}>A whole world ahead. Explore all {chapters.length} chapters <ArrowRight size={15}/></a></section><aside className="dashboard-right"><div className="continue-card"><span className="eyebrow">YOUR NEXT SMALL STEP</span><span className="continue-icon"><Compass size={25}/></span><h3>{next.title}</h3><p>{next.subtitle}. A great place to {progress.visited.length?'pick up where you left off.':'begin your adventure.'}</p><a className="button primary" href={link(`chapter/${next.id}`)}>{progress.visited.length?'Continue learning':'Let’s get started'} <ArrowRight size={16}/></a><small>No rush. You’re learning, not racing.</small></div><a href={link('lab')} className="play-card"><span className="stat-icon color-2"><FlaskConical size={22}/></span><div><h3>What if you change it?</h3><p>Meet the playground. Break things.<br/>That’s how the learning happens.</p><b>Try an experiment <ArrowRight size={14}/></b></div></a></aside></div>{progress.recent.length>0&&<section className="card"><h2>Recently visited</h2><ul>{progress.recent.map(id=><li key={id}><a className="inline-link" href={link(`chapter/${id}`)}>{chapters.find(item=>item.id===id)?.title}</a></li>)}</ul></section>}<div className="philosophy"><span>LEARN IT.</span><i>→</i><span>TRY IT.</span><i>→</i><span>BREAK IT.</span><i>→</i><span>FIX IT.</span><i>→</i><b>MASTER IT.</b></div></>:
 <><div className="page-heading"><span className="eyebrow">PYTHON LAB / {page==='chapter'?`CHAPTER ${metadata?.id ?? ""}`:page.toUpperCase()}</span><h1>{titles[page]||'Find your next step'}</h1><p>{page==='chapters'?'A clear path from your first line of code to your first real project. Every chapter is open to explore.':page==='practice'?'Run to experiment. Check Answer to verify your solution. Mistakes are part of the process.':page==='lab'?'A safe place to ask “what if?”. This is real Python, right in your browser.':page==='quiz'?'Strengthen your understanding, one good question at a time.':page==='projects'?'Useful skills become useful things. Choose a guided project and make it yours.':page==='progress'?'Every experiment, every mistake, every small win counts.':metadata?.subtitle}</p></div>
 {page==='chapters'&&<CourseCatalog catalog={catalog} progress={progress}/>}
 {page==='resources'&&<Suspense fallback={<p role="status">Loading library…</p>}><ResourceLibrary key={route} lessons={chapters}/></Suspense>}
 {page==='teacher'&&<Suspense fallback={<p role="status">Loading teacher tools…</p>}><TeacherResources lessons={chapters}/></Suspense>}
 {page==='glossary'&&<Suspense fallback={<p role="status">Loading glossary…</p>}><GlossaryPage id={id}/></Suspense>}
 {page==='search'&&!waiting&&<Suspense fallback={<p role="status">Loading search…</p>}><KnowledgeSearch lessons={chapters}
   exercises={[...allTasks,...(expanded??[]).flatMap(lesson=>lesson.tasks)]}/></Suspense>}
 {page==='syntax'&&<Suspense fallback={<p role="status">Loading syntax topics…</p>}><SyntaxAcademy category={id} id={topicId} lessons={chapters}/></Suspense>}
 {page==='chapter'&&chapter&&<LessonView key={chapter.id} lesson={chapter} catalog={catalog} projects={projects}
   completed={progress.completed} solved={progress.solved} bookmarked={progress.bookmarks.includes(chapter.id)}
   onBookmark={()=>update(current=>({...current,bookmarks:current.bookmarks.includes(chapter.id)
     ?current.bookmarks.filter(id=>id!==chapter.id):[...current.bookmarks,chapter.id]}))}
   onComplete={()=>add('completed',chapter.id)} onSolve={id=>add('solved',id)}
   onQuiz={score=>saveScore(String(chapter.id),score)} onRun={firstProgram}/>}
 {page==='practice'&&!waiting&&<PracticeView key={id} selectedTask={id} tasks={[...allTasks,...(expanded??[]).flatMap(lesson=>lesson.tasks)]}
   catalog={catalog} solved={progress.solved} onSolve={id=>add('solved',id)}/>}
 {page==='lab'&&<Experiments/>}
 {page==='quiz'&&!waiting&&<><label className="quiz-select">Choose your assessment
   <select value={quizTopic} onChange={event=>setQuizTopic(event.target.value)}>
     {chapters.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}
     <option value="revision">V1 revision · {revisionQuiz.length} questions</option>
   </select></label>
   <p>Best completed score: {progress.scores[quizTopic]===undefined?'No attempt completed yet':`${progress.scores[quizTopic]}%`}</p>
   {selectedQuiz&&<Quiz key={quizTopic} questions={selectedQuiz} onComplete={score=>saveScore(quizTopic,score)}/>}</>}
 {waiting&&<div className="card" role="status">{loadFailed?<><p>Lesson content could not load.</p>
   <button className="button" onClick={()=>location.reload()}>Reload page</button></>:<p>Loading lesson content…</p>}</div>}
 {page==='projects'&&!project&&<div className="chapter-grid">{projects.map((p,i)=><a className="card project-card" key={p.id} href={link(`projects/${p.id}`)}><span className={`stat-icon color-${i%4}`}><FolderOpen size={23}/></span><span className="eyebrow">PROJECT {String(i+1).padStart(2,'0')}</span><h2>{p.title}</h2><p>{p.use}</p><small>Complete chapters {p.chapters.join(', ')} first</small><div className="card-bottom"><b>{progress.projects.includes(p.id)?'✓ Completed':'Build this project'}</b><ArrowRight size={17}/></div></a>)}</div>}
 {page==='projects'&&project&&<><a className="text-link" href={link('projects')}>← All projects</a><div className="card"><h2>What you’ll build</h2><p>{project.use}</p><p>Prerequisites: {project.chapters.map(n=><a className="inline-link" key={n} href={link(`chapter/${n}`)}>Chapter {n} </a>)}</p><h3>Functional requirements</h3><ul>{project.requirements.map(s=><li key={s}>{s}</li>)}</ul><h3>Your guided breakdown</h3><ol>{project.steps.map(s=><li key={s}>{s}</li>)}</ol></div><CodeLab key={project.id} initial={project.starter} input={project.input} label={`${project.id}.py`} persist/><div className="two-columns"><div className="card"><h3>Sample input</h3><pre>{project.input||'No input required.'}</pre><h3>Sample output</h3><pre>{project.output}</pre></div><div className="card"><h3>Test your project</h3><ul>{project.tests.map(t=><li key={t}>{t}</li>)}</ul><h3>Common mistake</h3><p>{project.mistake}</p></div></div><details className="card"><summary>Reveal final solution</summary><CodeLab key={project.id} initial={project.solution} input={project.input} label="solution.py"/></details><div className="card"><h3>Make it your own</h3><ul>{project.improvements.map(s=><li key={s}>{s}</li>)}</ul><label className="project-check"><input type="checkbox" checked={progress.projects.includes(project.id)} onChange={e=>{if(e.target.checked)add('projects',project.id);else update(p=>({...p,projects:p.projects.filter(x=>x!==project.id)}));}}/> I built this project and tried the testing instructions.</label><p className="runtime-note">Project completion is self-reported. Your practice exercises use automated checks.</p></div></>}
 {page==='progress'&&<><div className="card progress-overview"><div className="progress-ring" style={{background:`conic-gradient(var(--accent) ${coursePercent}%, var(--line) 0)`}}><span>{coursePercent}<small>% complete</small></span></div><div><h2>Your foundation is taking shape.</h2><p>Completion combines chapters, solved exercises, finished chapter quizzes, and self-reported projects. Revisit anything, anytime.</p><a href={link(`chapter/${next.id}`)} className="button primary">Continue learning <ArrowRight size={15}/></a></div></div><div className="stats-grid">{[[progress.visited.length,'Chapters visited'],[progress.completed.length,'Chapters completed'],[progress.solved.length,'Exercises solved'],[progress.projects.length,'Projects completed']].map(([n,label])=><div className="stat-card" key={label}><b>{n}</b><span>{label}</span></div>)}</div><h2>Your milestones</h2><div className="chapter-grid">{milestones.map(([name,earned,description])=><div className={`card achievement ${earned?'earned':''}`} key={name}><Trophy size={27}/><h3>{name}</h3><p>{description}</p><span className="pill">{earned?'✓ Earned':'Keep exploring'}</span></div>)}</div><div className="card"><h2>Quiz best scores</h2>{Object.keys(progress.scores).length===0?<p>Your first score will appear when you finish a quiz.</p>:Object.entries(progress.scores).map(([key,score])=><p key={key}>{key==='revision'?'V1 revision':`Chapter ${key}: ${chapters.find(item=>String(item.id)===key)?.title}`} <b>{score}%</b></p>)}</div><ProgressBackup progress={progress} catalog={catalog} onImport={incoming=>update(current=>mergeProgress(current,incoming))} onReset={()=>update(freshProgress)}/></>}
 {(!titles[page]||(page==='chapter'&&!metadata))&&<div className="card"><h2>That page isn’t in the roadmap.</h2><a className="button primary" href={link('home')}>Back to Home</a></div>}
 </>}
 <footer className="page-footer"><span><Code2 size={15}/> Python Lab <span>· Learn it. Try it. Break it. Fix it. Master it.</span></span><span>Built for your first “aha!” moment.</span></footer></main></div>

 </div>;
}
