import ConceptModel from './ConceptModel';
import {lazy, Suspense, useState, type ReactNode} from 'react';
import {ArrowRight, Bookmark, BookOpen, Check, ChevronLeft, Sparkles, Target} from 'lucide-react';
import type {Chapter, Project} from '../data/types';
import {lessonNeighbors, levels, type buildCatalog} from '../data/catalog.mjs';
import CodeLab from './CodeLab';
import Quiz from './Quiz';
import TaskCard from './TaskCard';
import {checkpoints} from '../data/checkpoints';
import AliasModel from './AliasModel';
import PilotLesson from './PilotLesson';
import {isGuidedChapter} from '../data/pilotActivities';
import {ReceiptLesson} from './ReceiptWorkspace';
import {storage} from '../lib/storage';

const RelatedKnowledge = lazy(() => import('./RelatedKnowledge'));

const sectionIds: Record<string, string> = {
  'How it works': 'chapter-concepts',
  'Predict, run and change': 'chapter-examples',
  'Practice': 'chapter-practice',
  'Chapter quiz': 'chapter-quiz',
};

function Section({title, children}: {title: string; children: ReactNode}) {
  return (
    <section className="lesson-section" id={sectionIds[title]} tabIndex={sectionIds[title] ? -1 : undefined}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function TeaOrder() {
  const [order, setOrder] = useState(['Serve the chai', 'Boil water', 'Add tea leaves']);
  const [message, setMessage] = useState('');
  return (
    <div className="card">
      <h3>Arrange the recipe</h3>
      <p>Move each step up until the instructions make sense.</p>
      {order.map((step, index) => (
        <div className="order-step" key={step}>
          <span>{index + 1}. {step}</span>
          <button
            className="button small"
            disabled={index === 0}
            aria-label={`Move ${step} up`}
            onClick={() => {
              const next = [...order];
              [next[index - 1], next[index]] = [next[index], next[index - 1]];
              setOrder(next);
              setMessage('');
            }}
          >
            Move up ↑
          </button>
        </div>
      ))}
      <button
        className="button primary small"
        onClick={() => setMessage(
          order[0] === 'Boil water' && order[1] === 'Add tea leaves'
            ? 'Correct! Order matters in an algorithm.'
            : 'Try again. Heat the water before adding tea and serve last.'
        )}
      >
        Check order
      </button>
      <p role="status">{message}</p>
    </div>
  );
}

function Prediction({expected}: {expected: string}) {
  const [prediction, setPrediction] = useState('');
  const [result, setResult] = useState('');
  const normalize = (value: string) => value.replace(/\r\n/g, '\n').trim();
  return (
    <div className="card">
      <label>
        Your prediction
        <textarea
          rows={2}
          value={prediction}
          onChange={(event) => {
            setPrediction(event.target.value);
            setResult('');
          }}
        />
      </label>
      <button
        className="button small"
        disabled={!prediction.trim()}
        onClick={() => setResult(
          normalize(prediction) === normalize(expected)
            ? 'Your prediction matches the starter output.'
            : 'Compare your prediction with the starter output below.'
        )}
      >
        Check predicted output
      </button>
      {result && <p role="status">{result}</p>}
      <details>
        <summary>Reveal expected output</summary>
        <pre>{expected}</pre>
        <p>Compare this with your prediction. Run the example, then open the explanation to trace the result.</p>
      </details>
    </div>
  );
}

type Catalog = ReturnType<typeof buildCatalog>;
type Props = {
  lesson: Chapter;
  catalog: Catalog;
  projects: Project[];
  completed: number[];
  solved: string[];
  bookmarked: boolean;
  onBookmark: () => void;
  onComplete: () => void;
  onSolve: (id: string) => void;
  onQuiz: (score: number) => void;
  onRun: () => void;
};

export default function LessonView({
  lesson, catalog, projects, completed, solved, bookmarked, onBookmark, onComplete, onSolve, onQuiz, onRun,
}: Props) {
  const [showSidebar, setShowSidebar] = useState(true);
  const metadata = catalog.lessons.find((item) => item.id === lesson.id)!;
  const {previous, next} = lessonNeighbors(catalog, lesson.id);
  const checkpoint = checkpoints[lesson.id];
  const [step, setStep] = useState(0);
  const related = projects.filter((project) => project.chapters.includes(lesson.id));
  const isGuided = isGuidedChapter(lesson.id);

  // Progressive learning mode tabs for guided chapters
  const tabStorageKey = `python-lab.chapter-tab:${lesson.id}`;
  const [activeTab, setActiveTab] = useState<'guided' | 'reference' | 'practice'>(() => {
    if (!isGuided) return 'guided';
    const saved = storage.getItem(tabStorageKey);
    if (saved === 'reference' || saved === 'practice' || saved === 'guided') return saved;
    return 'guided';
  });

  const handleTabChange = (tab: 'guided' | 'reference' | 'practice') => {
    setActiveTab(tab);
    try { storage.setItem(tabStorageKey, tab); } catch {}
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, currentTab: 'guided' | 'reference' | 'practice') => {
    const tabs: ('guided' | 'reference' | 'practice')[] = ['guided', 'reference', 'practice'];
    const idx = tabs.indexOf(currentTab);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextTab = tabs[(idx + 1) % tabs.length];
      handleTabChange(nextTab);
      document.getElementById(`tab-${nextTab}`)?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevTab = tabs[(idx - 1 + tabs.length) % tabs.length];
      handleTabChange(prevTab);
      document.getElementById(`tab-${prevTab}`)?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleTabChange(tabs[0]);
      document.getElementById(`tab-${tabs[0]}`)?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      handleTabChange(tabs[tabs.length - 1]);
      document.getElementById(`tab-${tabs[tabs.length - 1]}`)?.focus();
    }
  };

  const jumpTo = (sectionId: string, targetTab: 'guided' | 'reference' | 'practice') => {
    if (isGuided && activeTab !== targetTab) {
      handleTabChange(targetTab);
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      el?.focus({preventScroll: true});
      el?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }, 20);
  };

  return (
    <>
      <div className="utility-actions">
        <span className="pill">{levels.find((level) => level.id === metadata.level)?.title}</span>
        <button
          className="button small"
          onClick={() => setShowSidebar(!showSidebar)}
          aria-expanded={showSidebar}
        >
          {showSidebar ? 'Hide' : 'Show'} chapter sidebar
        </button>
        <button className="button small" aria-pressed={bookmarked} onClick={onBookmark}>
          <Bookmark size={16}/>{bookmarked ? 'Bookmarked' : 'Bookmark lesson'}
        </button>
      </div>

      <div className={`lesson-layout ${showSidebar ? '' : 'no-aside'}`}>
        {showSidebar && (
          <aside className="lesson-aside" aria-label="Chapter sidebar">
            <b>Curriculum</b>
            {catalog.lessons.map((item) => (
              <a
                key={item.id}
                aria-current={item.id === lesson.id ? 'page' : undefined}
                className={item.id === lesson.id ? 'active' : undefined}
                href={`#/chapter/${item.id}`}
              >
                {item.title} {completed.includes(item.id) && <Check size={14} aria-label="Completed"/>}
              </a>
            ))}
          </aside>
        )}

        <div className="lesson-content">
          {/* Chapter Orientation Header & Learning Mode Switcher */}
          <div className="chapter-header-card">
            <div className="chapter-header-content">
              <span className="eyebrow">CHAPTER {lesson.id} ORIENTATION</span>
              <p className="chapter-intro-text">
                {lesson.story.split('. ')[0]}. {lesson.objectives[0]}
              </p>
            </div>

            {isGuided && (
              <div className="chapter-mode-tabs" role="tablist" aria-label="Chapter learning modes">
                <button
                  type="button"
                  role="tab"
                  id="tab-guided"
                  aria-selected={activeTab === 'guided'}
                  aria-controls="panel-guided"
                  className={`chapter-mode-tab ${activeTab === 'guided' ? 'active' : ''}`}
                  onClick={() => handleTabChange('guided')}
                  onKeyDown={(e) => handleTabKeyDown(e, 'guided')}
                >
                  <Sparkles size={16}/> Guided Learning
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-reference"
                  aria-selected={activeTab === 'reference'}
                  aria-controls="panel-reference"
                  className={`chapter-mode-tab ${activeTab === 'reference' ? 'active' : ''}`}
                  onClick={() => handleTabChange('reference')}
                  onKeyDown={(e) => handleTabKeyDown(e, 'reference')}
                >
                  <BookOpen size={16}/> Detailed Reference
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-practice"
                  aria-selected={activeTab === 'practice'}
                  aria-controls="panel-practice"
                  className={`chapter-mode-tab ${activeTab === 'practice' ? 'active' : ''}`}
                  onClick={() => handleTabChange('practice')}
                  onKeyDown={(e) => handleTabKeyDown(e, 'practice')}
                >
                  <Target size={16}/> Practice & Quiz
                </button>
              </div>
            )}
          </div>

          {/* Quick jumps for direct keyboard & shortcut access */}
          <nav className="chapter-jumps" aria-label="In this chapter">
            {[
              ['concepts', 'Concepts', 'reference'],
              ['examples', 'Run code', isGuided ? 'guided' : 'reference'],
              ['practice', 'Practice', 'practice'],
              ['quiz', 'Quiz', 'practice'],
            ].map(([id, label, tab]) => (
              <button
                key={id}
                className="button small"
                onClick={() => jumpTo('chapter-' + id, tab as any)}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* MODE 1: Guided Learning (Active by default for chapters 2-15) */}
          {isGuided && activeTab === 'guided' && (
            <div id="panel-guided" role="tabpanel" aria-labelledby="tab-guided">
              <div className="card chapter-checkpoint">
                <h2>Try a real task</h2>
                <p>{checkpoint.task}</p>
                <ol className="chapter-trace">
                  {checkpoint.steps.map((line, index) => (
                    <li key={line}>
                      <button
                        className="button small"
                        aria-current={step === index ? 'step' : undefined}
                        onClick={() => setStep(index)}
                      >
                        Step {index + 1}
                      </button>
                    </li>
                  ))}
                </ol>
                <p role="status" className="trace-current">{checkpoint.steps[step]}</p>
              </div>

              {/* Related terms for quick bilingual glossary lookup in guided mode */}
              <Suspense fallback={null}>
                <RelatedKnowledge lessonId={lesson.id}/>
              </Suspense>

              {/* ConceptModel for chapters where PilotLesson doesn't embed it */}
              {(lesson.id === 2 || lesson.id === 6 || lesson.id === 7 || lesson.id === 12 || lesson.id === 13) && (
                <ConceptModel chapter={lesson.id}/>
              )}

              {/* 5-Stage Guided Activity */}
              <PilotLesson
                key={'pilot-' + lesson.id}
                id={lesson.id as any}
                onRun={onRun}
                onTakeQuiz={() => jumpTo('chapter-quiz', 'practice')}
                onReadReference={() => jumpTo('chapter-concepts', 'reference')}
              />

              {lesson.id === 15 && <AliasModel/>}

              <Section title="Predict, run and change">
                <p>Read the first example and predict its output before running it.</p>
                <Prediction expected={lesson.examples[0].output}/>
                {lesson.examples.map((example, index) => (
                  <article className="example" key={example.title}>
                    <h3>{example.title}</h3>
                    <CodeLab
                      draftId={'chapter-' + lesson.id + '-example-' + index}
                      initial={example.code}
                      input={example.input}
                      expected={example.output}
                      onRun={onRun}
                      label={`example_${index + 1}.py`}
                    />
                    {example.annotations && (
                      <details>
                        <summary>Read the syntax</summary>
                        <dl>
                          {example.annotations.map(([syntax, explanation]) => (
                            <div key={syntax}>
                              <dt><code>{syntax}</code></dt>
                              <dd>{explanation}</dd>
                            </div>
                          ))}
                        </dl>
                      </details>
                    )}
                    <details>
                      <summary>Trace the expected output</summary>
                      <pre>{example.output}</pre>
                      <p>{example.why}</p>
                    </details>
                  </article>
                ))}
              </Section>

              {/* Next Steps after Guided Activity */}
              <div className="guided-mode-footer">
                <div className="guided-footer-card">
                  <h4>Ready to test your knowledge or go deeper?</h4>
                  <p>Apply what you learned in hands-on coding challenges or explore the full chapter reference notes.</p>
                  <div className="utility-actions">
                    <button
                      type="button"
                      className="button primary small"
                      onClick={() => handleTabChange('practice')}
                    >
                      Go to Practice & Quiz <ArrowRight size={14}/>
                    </button>
                    <button
                      type="button"
                      className="button small"
                      onClick={() => handleTabChange('reference')}
                    >
                      Read Detailed Reference
                    </button>
                    <a className="button small" href={`#/resources?chapter=${lesson.id}`}>
                      Browse materials for this chapter
                    </a>
                  </div>
                </div>

                <div className="lesson-nav">
                  {previous && (
                    <a className="button" href={`#/chapter/${previous.id}`}>
                      <ChevronLeft size={15}/>{previous.title}
                    </a>
                  )}
                  {next && (
                    <a className="button primary" href={`#/chapter/${next.id}`}>
                      {next.title}<ArrowRight size={15}/>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: Detailed Reference Notes */}
          {isGuided && activeTab === 'reference' && (
            <div id="panel-reference" role="tabpanel" aria-labelledby="tab-reference">
              <div className="card reference-intro-banner">
                <span className="eyebrow">IN-DEPTH REFERENCE</span>
                <h3>Comprehensive Chapter Notes & Concepts</h3>
                <p>Study the theory, syntax structures, edge cases, and memory models at your own pace.</p>
              </div>

              <Section title="What you’ll learn">
                <ul>
                  {lesson.objectives.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
                {metadata.prerequisites.length > 0 && (
                  <>
                    <h3>Suggested prerequisites</h3>
                    <ul>
                      {metadata.prerequisites.map((id) => (
                        <li key={id}>
                          <a className="inline-link" href={`#/chapter/${id}`}>
                            {catalog.lessons.find((item) => item.id === id)?.title}
                          </a>{' '}
                          {completed.includes(id) && '✓ Completed'}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Section>

              <Section title="A familiar problem">
                <p className="story">{lesson.story}</p>
              </Section>

              <Section title="How it works">
                {lesson.concepts.map(([title, text], index) => (
                  <details className="concept" key={title} open={index === 0}>
                    <summary>{title}</summary>
                    <p>{text}</p>
                  </details>
                ))}
                {lesson.nameExamples && (
                  <div className="card">
                    <h3>Valid and invalid variable names</h3>
                    <ul>
                      {lesson.nameExamples.map(({name, valid, reason}) => (
                        <li key={name}>
                          <code>{name}</code> <strong>· {valid ? 'Valid' : 'Invalid'}</strong> — {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Section>

              <Section title="Follow the idea">
                <ol className="concept-flow">
                  {lesson.visual.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                {lesson.id === 0 ? (
                  <p className="story">Follow the recipe sequence practiced in the algorithm experiment above: boil water first, infuse tea leaves, then serve.</p>
                ) : (
                  <a className="text-link" href="#/lab">
                    Explore interactive visual models <ArrowRight size={15}/>
                  </a>
                )}
                {lesson.id === 15 && <AliasModel/>}
              </Section>

              <Suspense fallback={null}>
                <RelatedKnowledge lessonId={lesson.id}/>
              </Suspense>

              <Section title="Predict, run and change">
                <p>Read the first example and predict its output before running it.</p>
                <Prediction expected={lesson.examples[0].output}/>
                {lesson.examples.map((example, index) => (
                  <article className="example" key={example.title}>
                    <h3>{example.title}</h3>
                    <CodeLab
                      draftId={'chapter-' + lesson.id + '-example-' + index}
                      initial={example.code}
                      input={example.input}
                      expected={example.output}
                      onRun={onRun}
                      label={`example_${index + 1}.py`}
                    />
                    {example.annotations && (
                      <details>
                        <summary>Read the syntax</summary>
                        <dl>
                          {example.annotations.map(([syntax, explanation]) => (
                            <div key={syntax}>
                              <dt><code>{syntax}</code></dt>
                              <dd>{explanation}</dd>
                            </div>
                          ))}
                        </dl>
                      </details>
                    )}
                    <details>
                      <summary>Trace the expected output</summary>
                      <pre>{example.output}</pre>
                      <p>{example.why}</p>
                    </details>
                  </article>
                ))}
              </Section>

              <Section title="Break it & fix it">
                <p>Run this example, identify the mistake and try a fix.</p>
                <CodeLab
                  draftId={'chapter-' + lesson.id + '-repair'}
                  initial={lesson.mistake.code}
                  input={lesson.examples[0].input}
                  label="fix_me.py"
                />
                <details>
                  <summary>Show the fix & explanation</summary>
                  <pre>{lesson.mistake.fix}</pre>
                  <p>{lesson.mistake.why}</p>
                </details>
                {lesson.misconceptions && (
                  <ul>
                    {lesson.misconceptions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section title="Additional Study Materials">
                <a className="inline-link" href={`#/resources?chapter=${lesson.id}`}>
                  Browse materials for this chapter
                </a>
              </Section>

              <Section title="Put it to work">
                <p>{lesson.application}</p>
                {related.length > 0 ? (
                  <ul>
                    {related.map((project) => (
                      <li key={project.id}>
                        <a className="inline-link" href={`#/projects/${project.id}`}>{project.title}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <a className="text-link" href="#/projects">
                    Explore projects <ArrowRight size={14}/>
                  </a>
                )}
              </Section>

              <Section title="Quick revision">
                <div className="card revision">
                  {lesson.cheatSheet ? (
                    <ul>
                      {lesson.cheatSheet.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    lesson.concepts.map(([title, text]) => (
                      <p key={title}>
                        <b>{title}</b> {text.split('. ')[0]}.
                      </p>
                    ))
                  )}
                </div>
                {lesson.interview?.map(([question, answer]) => (
                  <details key={question}>
                    <summary>Interview practice · {question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </Section>

              <div className="guided-mode-footer">
                <div className="utility-actions">
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => handleTabChange('practice')}
                  >
                    Continue to Practice & Quiz <ArrowRight size={15}/>
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => handleTabChange('guided')}
                  >
                    Return to Guided Learning
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: Practice & Quiz */}
          {isGuided && activeTab === 'practice' && (
            <div id="panel-practice" role="tabpanel" aria-labelledby="tab-practice">
              <div className="card chapter-checkpoint">
                <h2>Try a real task</h2>
                <p>{checkpoint.task}</p>
                <ol className="chapter-trace">
                  {checkpoint.steps.map((line, index) => (
                    <li key={line}>
                      <button
                        className="button small"
                        aria-current={step === index ? 'step' : undefined}
                        onClick={() => setStep(index)}
                      >
                        Step {index + 1}
                      </button>
                    </li>
                  ))}
                </ol>
                <p role="status" className="trace-current">{checkpoint.steps[step]}</p>
              </div>

              <Section title="Practice">
                {lesson.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    solved={solved.includes(task.id)}
                    onPass={() => onSolve(task.id)}
                  />
                ))}
              </Section>

              <Section title="Chapter quiz">
                <Quiz questions={[...lesson.quiz, checkpoint.question]} onComplete={onQuiz}/>
              </Section>

              <Section title="Quick revision">
                <div className="card revision">
                  {lesson.cheatSheet ? (
                    <ul>
                      {lesson.cheatSheet.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    lesson.concepts.map(([title, text]) => (
                      <p key={title}>
                        <b>{title}</b> {text.split('. ')[0]}.
                      </p>
                    ))
                  )}
                </div>
                {lesson.interview?.map(([question, answer]) => (
                  <details key={question}>
                    <summary>Interview practice · {question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
                <button className="button primary" onClick={onComplete}>
                  {completed.includes(lesson.id) ? '✓ Chapter completed' : 'Mark chapter as completed'}
                </button>
                <p className="runtime-note">
                  Chapter completion is self-reported. Exercise and quiz results are recorded separately.
                </p>
              </Section>

              <div className="lesson-nav">
                {previous && (
                  <a className="button" href={`#/chapter/${previous.id}`}>
                    <ChevronLeft size={15}/>{previous.title}
                  </a>
                )}
                {next && (
                  <a className="button primary" href={`#/chapter/${next.id}`}>
                    {next.title}<ArrowRight size={15}/>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Chapters 0 and 1: Continuous Introductory Beginner Flow */}
          {!isGuided && (
            <>
              {/* V19: The Perfect First 10 Minutes - Chapter 0 Intro Flow */}
              {lesson.id === 0 && (
                <div className="first-10-flow first-10-ch0">
                  <div className="card first-10-hero">
                    <div className="first-10-badge-row">
                      <span className="first-10-badge">THE FIRST 10 MINUTES · STEP 1</span>
                      <span className="time-badge">⏱ ~3 min</span>
                    </div>
                    <h2>What is Programming?</h2>
                    <p className="scenario-text">
                      Imagine asking a friend to <em>“make chai”</em>. Without clear details, they won't know how much water, milk, or tea leaves to use. 
                      A computer is just like that friend, but with <strong>zero common sense</strong>: it needs exact, numbered instructions in the right order.
                    </p>

                    <div className="ipo-workflow" aria-label="Input Process Output Workflow">
                      <div className="ipo-step">
                        <div className="ipo-step-header">
                          <span className="ipo-icon" aria-hidden="true">📥</span>
                          <span className="ipo-name">1. Input</span>
                        </div>
                        <p className="ipo-desc">Raw ingredients or user requests</p>
                        <div className="ipo-pill">e.g. 2 cups requested</div>
                      </div>

                      <span className="ipo-arrow" aria-hidden="true">➔</span>

                      <div className="ipo-step active">
                        <div className="ipo-step-header">
                          <span className="ipo-icon" aria-hidden="true">⚙️</span>
                          <span className="ipo-name">2. Process</span>
                        </div>
                        <p className="ipo-desc">Step-by-step recipe executed strictly top to bottom</p>
                        <div className="ipo-pill">e.g. Boil water → Add tea → Pour milk</div>
                      </div>

                      <span className="ipo-arrow" aria-hidden="true">➔</span>

                      <div className="ipo-step">
                        <div className="ipo-step-header">
                          <span className="ipo-icon" aria-hidden="true">📤</span>
                          <span className="ipo-name">3. Output</span>
                        </div>
                        <p className="ipo-desc">The completed result displayed to the user</p>
                        <div className="ipo-pill">e.g. 400 mL fresh chai served</div>
                      </div>
                    </div>
                  </div>

                  <div className="first-10-experiment-section">
                    <div className="experiment-heading">
                      <span className="eyebrow">INTERACTIVE ALGORITHM EXPERIMENT</span>
                      <h3>Watch the Recipe Algorithm Scale</h3>
                      <p>Change the number of cups below. Notice how the computer recalculates each ingredient based on the input.</p>
                    </div>
                    <ConceptModel chapter={0}/>
                  </div>

                  <div className="first-10-experiment-section">
                    <div className="experiment-heading">
                      <span className="eyebrow">HANDS-ON LOGIC</span>
                      <h3>Order Matters in Every Program</h3>
                      <p>A computer executes statements strictly from top to bottom. Move each step up until the recipe is in logical order.</p>
                    </div>
                    <TeaOrder/>
                  </div>

                  <div className="card first-10-milestone-card">
                    <div className="milestone-badge-row">
                      <span className="milestone-pill"><Sparkles size={14}/> STEP 1 MASTERED</span>
                      <span className="milestone-sub">Ready for real Python</span>
                    </div>
                    <h3>You understand how algorithms and instructions work!</h3>
                    <p>Now let's write your first line of Python and make the computer speak to you.</p>
                    <div className="milestone-actions">
                      <a href="#/chapter/1" className="button primary large first-10-cta">
                        Continue to Chapter 1: Your First Python Program <ArrowRight size={18}/>
                      </a>
                    </div>
                  </div>

                  <div className="first-10-details-toggle">
                    <h4>Looking for deeper theory, quizzes, or extra practice?</h4>
                    <p>All reference notes, quizzes, and tasks for Chapter 0 are available below.</p>
                  </div>
                </div>
              )}

              {/* V19: The Perfect First 10 Minutes - Chapter 1 Intro Flow */}
              {lesson.id === 1 && (
                <div className="first-10-flow first-10-ch1">
                  <div className="card first-10-hero ch1-studio">
                    <div className="first-10-badge-row">
                      <span className="first-10-badge">THE FIRST 10 MINUTES · STEP 2</span>
                      <span className="time-badge">⏱ ~5 min</span>
                    </div>
                    <h2>Your Very First Python Program</h2>
                    <p className="scenario-text">
                      In Python, <code>print()</code> is your digital voice. Whatever message you put inside quotation marks <code>("...")</code> is sent straight to your screen.
                    </p>

                    <div className="first-run-workspace">
                      <div className="first-run-steps-bar">
                        <span className="run-step-badge">1. Run Code</span>
                        <p>Click the <strong>Run Code</strong> button below. Pyodide executes Python inside your browser and prints the message to the console!</p>
                      </div>

                      <CodeLab
                        draftId="chapter-1-first-run"
                        initial='print("Hello, World!")'
                        expected="Hello, World!"
                        onRun={onRun}
                        label="first_program.py"
                      />

                      <div className="first-run-prompt-box">
                        <span className="run-step-badge">2. Change the greeting</span>
                        <p>
                          Now edit the text inside the quotes to your name or custom greeting (e.g. <code>print("Hello, Python Lab!")</code>) and click <strong>Run Code</strong> again.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="first-10-experiment-section">
                    <div className="experiment-heading">
                      <span className="eyebrow">CORE SYNTAX DISCOVERY</span>
                      <h3>How Python Reads Code vs Text</h3>
                      <p>Inspect the difference between text in quotes (strings) and unquoted numbers.</p>
                    </div>
                    <ConceptModel chapter={1}/>

                    <div className="syntax-quick-cards">
                      <div className="syntax-card">
                        <div className="syntax-card-title"><code>print(...)</code></div>
                        <p>Python's built-in tool for speaking. Parentheses <code>()</code> hold what to display.</p>
                      </div>
                      <div className="syntax-card">
                        <div className="syntax-card-title"><code>"Strings"</code></div>
                        <p>Text wrapped in quotes. Python strips the quotes when printing to screen.</p>
                      </div>
                      <div className="syntax-card">
                        <div className="syntax-card-title"><code>10 + 20</code> (Numbers)</div>
                        <p>Numbers written without quotes. Python evaluates math first (10 + 20 = 30).</p>
                      </div>
                      <div className="syntax-card">
                        <div className="syntax-card-title"><code># Comments</code></div>
                        <p>Notes starting with <code>#</code>. Python skips them completely; they are for humans.</p>
                      </div>
                    </div>
                  </div>

                  <div className="card typo-recovery-card">
                    <div className="first-10-badge-row">
                      <span className="eyebrow">CONFIDENCE BUILDER</span>
                      <span className="time-badge">Fix a mistake</span>
                    </div>
                    <h3>Errors are clues, not failures</h3>
                    <p className="scenario-text">
                      Python is strictly case-sensitive. If you write <code>Print</code> with a capital <code>P</code>, Python raises a <code>NameError</code> because it only recognizes lowercase <code>print</code>.
                    </p>

                    <div className="typo-experiment-box">
                      <CodeLab
                        draftId="chapter-1-typo-experiment"
                        initial='Print("Hello, World!")'
                        expected="Hello, World!"
                        onRun={onRun}
                        label="fix_typo.py"
                      />
                      <div className="typo-tip-box">
                        <strong>Tip:</strong> Change <code>Print</code> to lowercase <code>print</code> and click <strong>Run Code</strong>. Watch the error vanish!
                      </div>
                    </div>
                  </div>

                  <div className="card first-10-milestone-card">
                    <div className="milestone-badge-row">
                      <span className="milestone-pill"><Sparkles size={14}/> CHAPTER 1 COMPLETE</span>
                      <span className="milestone-sub">Next: Variables</span>
                    </div>
                    <h3>You've run Python, edited code, and fixed a syntax typo!</h3>
                    <p>Now you're ready to store numbers and text in memory so your programs can remember values.</p>
                    <div className="milestone-actions">
                      <a href="#/chapter/2" className="button primary large first-10-cta">
                        Continue to Chapter 2: Variables & Values <ArrowRight size={18}/>
                      </a>
                    </div>
                  </div>

                  <div className="first-10-details-toggle">
                    <h4>Looking for more practice tasks, quizzes, or detailed notes?</h4>
                    <p>All reference notes, quizzes, and tasks for Chapter 1 are available below.</p>
                  </div>
                </div>
              )}

              <div className="card chapter-checkpoint">
                <h2>Try a real task</h2>
                <p>{checkpoint.task}</p>
                <ol className="chapter-trace">
                  {checkpoint.steps.map((line, index) => (
                    <li key={line}>
                      <button
                        className="button small"
                        aria-current={step === index ? 'step' : undefined}
                        onClick={() => setStep(index)}
                      >
                        Step {index + 1}
                      </button>
                    </li>
                  ))}
                </ol>
                <p role="status" className="trace-current">{checkpoint.steps[step]}</p>
              </div>

              <button
                className="button small"
                onClick={() => {
                  const example = document.getElementById('chapter-examples');
                  example?.focus({preventScroll: true});
                  example?.scrollIntoView({block: 'start'});
                }}
              >
                Try this chapter in Python
              </button>

              <Section title="What you’ll learn">
                <ul>
                  {lesson.objectives.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
                {metadata.prerequisites.length > 0 && (
                  <>
                    <h3>Suggested prerequisites</h3>
                    <ul>
                      {metadata.prerequisites.map((id) => (
                        <li key={id}>
                          <a className="inline-link" href={`#/chapter/${id}`}>
                            {catalog.lessons.find((item) => item.id === id)?.title}
                          </a>{' '}
                          {completed.includes(id) && '✓ Completed'}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Section>

              <Section title="A familiar problem">
                <p className="story">{lesson.story}</p>
              </Section>

              <Section title="How it works">
                {lesson.concepts.map(([title, text], index) => (
                  <details className="concept" key={title} open={index === 0}>
                    <summary>{title}</summary>
                    <p>{text}</p>
                  </details>
                ))}
                {lesson.nameExamples && (
                  <div className="card">
                    <h3>Valid and invalid variable names</h3>
                    <ul>
                      {lesson.nameExamples.map(({name, valid, reason}) => (
                        <li key={name}>
                          <code>{name}</code> <strong>· {valid ? 'Valid' : 'Invalid'}</strong> — {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Section>

              <Section title="Follow the idea">
                <ol className="concept-flow">
                  {lesson.visual.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                {lesson.id === 0 ? (
                  <p className="story">Follow the recipe sequence practiced in the algorithm experiment above: boil water first, infuse tea leaves, then serve.</p>
                ) : (
                  <a className="text-link" href="#/lab">
                    Explore interactive visual models <ArrowRight size={15}/>
                  </a>
                )}
                {lesson.id === 15 && <AliasModel/>}
              </Section>

              <Suspense fallback={null}>
                <RelatedKnowledge lessonId={lesson.id}/>
              </Suspense>

              <Section title="Predict, run and change">
                <p>Read the first example and predict its output before running it.</p>
                <Prediction expected={lesson.examples[0].output}/>
                {lesson.examples.map((example, index) => (
                  <article className="example" key={example.title}>
                    <h3>{example.title}</h3>
                    <CodeLab
                      draftId={'chapter-' + lesson.id + '-example-' + index}
                      initial={example.code}
                      input={example.input}
                      expected={example.output}
                      onRun={onRun}
                      label={`example_${index + 1}.py`}
                    />
                    {example.annotations && (
                      <details>
                        <summary>Read the syntax</summary>
                        <dl>
                          {example.annotations.map(([syntax, explanation]) => (
                            <div key={syntax}>
                              <dt><code>{syntax}</code></dt>
                              <dd>{explanation}</dd>
                            </div>
                          ))}
                        </dl>
                      </details>
                    )}
                    <details>
                      <summary>Trace the expected output</summary>
                      <pre>{example.output}</pre>
                      <p>{example.why}</p>
                    </details>
                  </article>
                ))}
              </Section>

              <Section title="Break it & fix it">
                <p>Run this example, identify the mistake and try a fix.</p>
                <CodeLab
                  draftId={'chapter-' + lesson.id + '-repair'}
                  initial={lesson.mistake.code}
                  input={lesson.examples[0].input}
                  label="fix_me.py"
                />
                <details>
                  <summary>Show the fix & explanation</summary>
                  <pre>{lesson.mistake.fix}</pre>
                  <p>{lesson.mistake.why}</p>
                </details>
                {lesson.misconceptions && (
                  <ul>
                    {lesson.misconceptions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section title="Additional Study Materials">
                <a className="inline-link" href={`#/resources?chapter=${lesson.id}`}>
                  Browse materials for this chapter
                </a>
              </Section>

              <Section title="Put it to work">
                <p>{lesson.application}</p>
                {related.length > 0 ? (
                  <ul>
                    {related.map((project) => (
                      <li key={project.id}>
                        <a className="inline-link" href={`#/projects/${project.id}`}>{project.title}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <a className="text-link" href="#/projects">
                    Explore projects <ArrowRight size={14}/>
                  </a>
                )}
              </Section>

              <Section title="Practice">
                {lesson.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    solved={solved.includes(task.id)}
                    onPass={() => onSolve(task.id)}
                  />
                ))}
              </Section>

              <Section title="Chapter quiz">
                <Quiz questions={[...lesson.quiz, checkpoint.question]} onComplete={onQuiz}/>
              </Section>

              <Section title="Quick revision">
                <div className="card revision">
                  {lesson.cheatSheet ? (
                    <ul>
                      {lesson.cheatSheet.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    lesson.concepts.map(([title, text]) => (
                      <p key={title}>
                        <b>{title}</b> {text.split('. ')[0]}.
                      </p>
                    ))
                  )}
                </div>
                {lesson.interview?.map(([question, answer]) => (
                  <details key={question}>
                    <summary>Interview practice · {question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
                <button className="button primary" onClick={onComplete}>
                  {completed.includes(lesson.id) ? '✓ Chapter completed' : 'Mark chapter as completed'}
                </button>
                <p className="runtime-note">
                  Chapter completion is self-reported. Exercise and quiz results are recorded separately.
                </p>
              </Section>

              <div className="lesson-nav">
                {previous && (
                  <a className="button" href={`#/chapter/${previous.id}`}>
                    <ChevronLeft size={15}/>{previous.title}
                  </a>
                )}
                {next && (
                  <a className="button primary" href={`#/chapter/${next.id}`}>
                    {next.title}<ArrowRight size={15}/>
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
