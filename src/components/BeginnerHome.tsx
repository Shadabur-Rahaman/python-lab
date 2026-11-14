import {ArrowRight, BookOpen, Code2, Terminal, Trophy} from 'lucide-react';
import CodeLab from './CodeLab';

type Props = {
  next: {id:number;title:string};
  completed: number;
  total: number;
  percent: number;
  returning: boolean;
  onRun: () => void;
};

export default function BeginnerHome({next,completed,total,percent,returning,onRun}:Props) {
  return <div className="beginner-home">
    <section className="beginner-hero" aria-labelledby="first-program">
      <div className="beginner-intro">
        <h1 id="first-program">Your first Python program starts here.</h1>
        <p>Learn Python step by step with real code, visual explanations, and hands-on practice. No experience or installation needed.</p>
        <div className="utility-actions">
          <a className="button primary" href={'#/chapter/'+next.id}>{returning?'Continue learning':'Start Learning Python'} <ArrowRight size={17}/></a>
          <button className="button" onClick={()=>{
            const demo=document.getElementById('first-code');
            demo?.querySelector('textarea')?.focus({preventScroll:true});
            demo?.scrollIntoView({block:'nearest'});
          }}>Try Python Now</button>
        </div>
        {returning && <div className="beginner-resume">
          <strong>Next up · {next.title}</strong>
          <p>{completed} of {total} chapters completed</p>
          <progress aria-label="Course progress" value={percent} max={100}/>
        </div>}
      </div>
      <section id="first-code" className="beginner-demo" aria-labelledby="demo-title">
        <h2 id="demo-title">Try your first line</h2>
        <p>Change the message inside the quotes, then select Run Code.</p>
        <CodeLab initial={'print("Hello, World!")'} label="hello.py" draftId="home-first-code" onRun={onRun} workspace/>
        <a className="inline-link" href="#/chapter/1">See how print() works <ArrowRight size={14}/></a>
      </section>
    </section>
    <section className="beginner-paths" aria-labelledby="paths-title">
      <h2 id="paths-title">Choose where to go next</h2>
      <div className="beginner-path-grid">
        <a className="card beginner-path recommended" href="#/chapter/0"><BookOpen size={20}/><strong>I’m completely new to coding</strong><span>Start with what a program does.</span></a>
        <a className="card beginner-path" href={returning?'#/chapter/'+next.id:'#/chapters'}><Trophy size={20}/><strong>{returning?'Continue learning':'Explore the roadmap'}</strong><span>{returning?next.title:'See the topics in learning order.'}</span></a>
        <a className="card beginner-path" href="#/practice"><Terminal size={20}/><strong>Practice Python</strong><span>Try a short coding challenge.</span></a>
        <a className="card beginner-path" href="#/syntax"><Code2 size={20}/><strong>Find Python syntax</strong><span>Look up a pattern and run an example.</span></a>
      </div>
      <div className="utility-actions beginner-tools">
        <a className="inline-link" href="#/playground">Open Python Playground</a>
        <a className="inline-link" href="#/projects">Browse projects</a>
        <a className="inline-link" href="#/resources">Study Materials</a>
      </div>
    </section>
  </div>;
}
