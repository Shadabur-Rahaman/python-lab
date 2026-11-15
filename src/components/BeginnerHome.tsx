import {ArrowRight, BookOpen, Code2, FolderOpen, Play, RotateCcw, Terminal, Trophy} from 'lucide-react';
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
  function scrollToDemo() {
    const demo = document.getElementById('first-code');
    demo?.querySelector('textarea')?.focus({preventScroll:true});
    demo?.scrollIntoView({block:'nearest'});
  }

  return <div className="beginner-home">
    {returning ? (
      /* Returning student continuation view */
      <section className="returning-hero" aria-labelledby="resume-heading">
        <div className="card continue-learning-hero">
          <div className="resume-header">
            <span className="eyebrow">WELCOME BACK</span>
            <h1 id="resume-heading">Ready to continue your Python journey?</h1>
            <h2 className="hero-subheading">Your first Python program starts here or pick up where you left off.</h2>
            <p>Your lessons, exercise solutions, and drafts are automatically saved on this device.</p>
          </div>

          <div className="resume-target-card">
            <div className="resume-target-info">
              <span className="target-eyebrow">NEXT RECOMMENDED LESSON</span>
              <h2>Chapter {next.id}: {next.title}</h2>
              <p>Continue your learning journey with interactive visual models and hands-on Python exercises.</p>
              <div className="progress-bar-container">
                <div className="progress-bar-labels">
                  <span><strong>{completed}</strong> of {total} chapters completed</span>
                  <span className="progress-percent-badge">{percent}% complete</span>
                </div>
                <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Course completion">
                  <span style={{width: `${percent}%`}}/>
                </div>
              </div>
            </div>

            <div className="resume-actions">
              <a className="button primary large" href={'#/chapter/' + next.id}>
                Continue learning <ArrowRight size={18}/>
              </a>
              <a className="button" href="#/practice">
                Practice Challenges
              </a>
              <a className="button" href="#/chapters">
                Explore Curriculum Roadmap
              </a>
            </div>
          </div>
        </div>

        {/* Quick access to playground & scratchpad for returning students */}
        <section className="resume-quick-tools" aria-label="Learning destinations">
          <h2 className="section-title">Jump to learning tools</h2>
          <div className="beginner-path-grid">
            <a className="card beginner-path" href="#/chapters">
              <BookOpen size={22}/>
              <strong>Curriculum Roadmap</strong>
              <span>All 16 foundational chapters and interactive visual models.</span>
            </a>
            <a className="card beginner-path" href="#/practice">
              <Terminal size={22}/>
              <strong>Practice Arena</strong>
              <span>Solve coding tasks with immediate automated feedback.</span>
            </a>
            <a className="card beginner-path" href="#/syntax">
              <Code2 size={22}/>
              <strong>Syntax Academy</strong>
              <span>30 reference topics with search, Hinglish tips, and examples.</span>
            </a>
            <a className="card beginner-path" href="#/projects">
              <FolderOpen size={22}/>
              <strong>Guided Projects</strong>
              <span>Build real-world mini-projects from scratch.</span>
            </a>
          </div>
          <div className="utility-actions beginner-tools">
            <a className="inline-link" href="#/playground">Open Python Playground</a>
            <a className="inline-link" href="#/projects">Browse Guided Projects</a>
            <a className="inline-link" href="#/resources">Study Materials</a>
          </div>
        </section>

        {/* Interactive Code Scratchpad on Home */}
        <section id="first-code" className="card beginner-demo returning-demo" aria-labelledby="scratch-title">
          <div className="demo-header">
            <div>
              <h2 id="scratch-title">Quick Python Scratchpad</h2>
              <p>Experiment with ideas or test quick code snippets in real Python 3.</p>
            </div>
            <a className="inline-link" href="#/playground">Open Full Playground <ArrowRight size={14}/></a>
          </div>
          <CodeLab initial={'# Write and run any Python code here\nprint(f"Chapter {next.id}: Ready to learn!")'} label="scratchpad.py" draftId="home-first-code" onRun={onRun} workspace/>
        </section>
      </section>
    ) : (
      /* First-time learner welcoming view */
      <>
        <section className="beginner-hero" aria-labelledby="hero-title">
          <div className="beginner-intro">
            <span className="eyebrow">ZERO EXPERIENCE NEEDED</span>
            <h1 id="hero-title">Learn Python by doing, one small step at a time.</h1>
            <h2 className="hero-subheading">Your first Python program starts here.</h2>
            <p>Start with zero experience. Learn through real code, visual examples, and guided challenges. Everything runs directly in your browser with no installation.</p>
            
            <div className="utility-actions hero-action-row">
              <a className="button primary large" href="#/chapter/0">
                Start Learning <ArrowRight size={18}/>
              </a>
              <button className="button large" type="button" onClick={scrollToDemo}>
                <Play size={16}/> Try Python Now
              </button>
            </div>

            <div className="hero-features-list">
              <div className="feature-pill">
                <span className="feature-dot"></span>
                <span>Real Python in your browser</span>
              </div>
              <div className="feature-pill">
                <span className="feature-dot"></span>
                <span>Visual interactive models</span>
              </div>
              <div className="feature-pill">
                <span className="feature-dot"></span>
                <span>Friendly error guidance</span>
              </div>
            </div>
          </div>

          <section id="first-code" className="beginner-demo" aria-labelledby="demo-title">
            <h2 id="demo-title">Try your first line</h2>
            <p>Change the message inside the quotes, then select <strong>Run Code</strong>.</p>
            <CodeLab initial={'print("Hello, World!")'} label="hello.py" draftId="home-first-code" onRun={onRun} workspace/>
            <a className="inline-link" href="#/chapter/1">See how print() works <ArrowRight size={14}/></a>
          </section>
        </section>

        <section className="beginner-paths" aria-labelledby="paths-title">
          <h2 id="paths-title">How do you want to start?</h2>
          <div className="beginner-path-grid">
            <a className="card beginner-path recommended" href="#/chapter/0">
              <BookOpen size={22}/>
              <strong>I’m completely new to coding</strong>
              <span>Start from the absolute beginning: Chapter 0 (What is a Program?).</span>
            </a>
            <a className="card beginner-path" href="#/chapters">
              <Trophy size={22}/>
              <strong>Explore the Roadmap</strong>
              <span>Browse all 16 chapters and choose where you want to begin.</span>
            </a>
            <a className="card beginner-path" href="#/practice">
              <Terminal size={22}/>
              <strong>Practice Python</strong>
              <span>Jump straight into hands-on coding challenges.</span>
            </a>
            <a className="card beginner-path" href="#/syntax">
              <Code2 size={22}/>
              <strong>Find Python Syntax</strong>
              <span>Look up keywords, operators, and common patterns with live examples.</span>
            </a>
          </div>

          <div className="utility-actions beginner-tools">
            <a className="inline-link" href="#/playground">Open Python Playground</a>
            <a className="inline-link" href="#/projects">Browse Guided Projects</a>
            <a className="inline-link" href="#/resources">Study Materials</a>
          </div>
        </section>
      </>
    )}
  </div>;
}
