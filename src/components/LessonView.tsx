import {useState, type ReactNode} from 'react';
import {ArrowRight, Bookmark, Check, ChevronLeft} from 'lucide-react';
import type {Chapter, Project} from '../data/types';
import {lessonNeighbors, levels, type buildCatalog} from '../data/catalog.mjs';
import CodeLab from './CodeLab';
import Quiz from './Quiz';
import TaskCard from './TaskCard';
import AliasModel from './AliasModel';

function Section({title, children}: {title: string; children: ReactNode}) {
  return <section className="lesson-section"><h2>{title}</h2>{children}</section>;
}

function TeaOrder() {
  const [order, setOrder] = useState(['Serve the chai', 'Boil water', 'Add tea leaves']);
  const [message, setMessage] = useState('');
  return <div className="card">
    <h3>Arrange the recipe</h3><p>Move each step up until the instructions make sense.</p>
    {order.map((step, index) => <div className="order-step" key={step}>
      <span>{index + 1}. {step}</span>
      <button className="button small" disabled={index === 0} aria-label={`Move ${step} up`} onClick={() => {
        const next = [...order];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        setOrder(next);
        setMessage('');
      }}>Move up ↑</button>
    </div>)}
    <button className="button primary small" onClick={() => setMessage(
      order[0] === 'Boil water' && order[1] === 'Add tea leaves'
        ? 'Correct! Order matters in an algorithm.'
        : 'Try again. Heat the water before adding tea and serve last.'
    )}>Check order</button><p role="status">{message}</p>
  </div>;
}

function Prediction({expected}: {expected: string}) {
  return <div className="card"><label>Your prediction<textarea rows={2}/></label>
    <details><summary>Reveal expected output</summary>
    <pre>{expected}</pre><p>Compare this with your prediction. Run the example, then open the explanation to trace the result.</p>
  </details></div>;
}

type Catalog = ReturnType<typeof buildCatalog>;
type Props = {
  lesson: Chapter; catalog: Catalog; projects: Project[]; completed: number[]; solved: string[];
  bookmarked: boolean; onBookmark: () => void; onComplete: () => void;
  onSolve: (id: string) => void; onQuiz: (score: number) => void; onRun: () => void;
};

export default function LessonView({
  lesson, catalog, projects, completed, solved, bookmarked, onBookmark, onComplete, onSolve, onQuiz, onRun,
}: Props) {
  const [showSidebar, setShowSidebar] = useState(true);
  const metadata = catalog.lessons.find(item => item.id === lesson.id)!;
  const {previous, next} = lessonNeighbors(catalog, lesson.id);
  const related = projects.filter(project => project.chapters.includes(lesson.id));

  return <>
    <div className="utility-actions">
      <span className="pill">{levels.find(level => level.id === metadata.level)?.title}</span>
      <button className="button small" onClick={() => setShowSidebar(!showSidebar)} aria-expanded={showSidebar}>{showSidebar ? 'Hide' : 'Show'} chapter sidebar</button>
      <button className="button small" aria-pressed={bookmarked} onClick={onBookmark}><Bookmark size={16}/>{bookmarked ? 'Bookmarked' : 'Bookmark lesson'}</button>
    </div>
    <div className={`lesson-layout ${showSidebar ? '' : 'no-aside'}`}>
      {showSidebar && <aside className="lesson-aside" aria-label="Chapter sidebar">
        <b>Curriculum</b>
        {catalog.lessons.map(item => <a key={item.id} aria-current={item.id === lesson.id ? 'page' : undefined}
          className={item.id === lesson.id ? 'active' : undefined} href={`#/chapter/${item.id}`}>
          {item.title} {completed.includes(item.id) && <Check size={14} aria-label="Completed"/>}
        </a>)}
      </aside>}
      <div className="lesson-content">
        <Section title="What you’ll learn">
          <ul>{lesson.objectives.map(outcome => <li key={outcome}>{outcome}</li>)}</ul>
          {metadata.prerequisites.length > 0 && <><h3>Suggested prerequisites</h3><ul>
            {metadata.prerequisites.map(id => <li key={id}><a className="inline-link" href={`#/chapter/${id}`}>{catalog.lessons.find(item => item.id === id)?.title}</a> {completed.includes(id) && '✓ Completed'}</li>)}
          </ul></>}
        </Section>
        <Section title="A familiar problem"><p className="story">{lesson.story}</p></Section>
        <Section title="How it works">
          {lesson.concepts.map(([title, text]) =>
            <div className="concept" key={title}><h3>{title}</h3><p>{text}</p></div>)}
          {lesson.nameExamples && <div className="card">
            <h3>Valid and invalid variable names</h3>
            <ul>{lesson.nameExamples.map(({name, valid, reason}) => <li key={name}>
              <code>{name}</code> <strong>· {valid ? 'Valid' : 'Invalid'}</strong> — {reason}
            </li>)}</ul>
          </div>}
        </Section>
        <Section title="Follow the idea">
          <ol className="concept-flow">{lesson.visual.map(step => <li key={step}>{step}</li>)}</ol>
          {lesson.id === 0 ? <TeaOrder/> : <a className="text-link" href="#/lab">Explore interactive visual models <ArrowRight size={15}/></a>}
          {lesson.id === 15 && <AliasModel/>}
        </Section>
        <Section title="Predict, run and change">
          <p>Read the first example and predict its output before running it.</p>
          <Prediction expected={lesson.examples[0].output}/>
          {lesson.examples.map((example, index) => <article className="example" key={example.title}>
            <h3>{example.title}</h3>
            <CodeLab initial={example.code} input={example.input} expected={example.output} onRun={onRun} label={`example_${index + 1}.py`}/>
            {example.annotations && <details><summary>Read the syntax</summary><dl>
              {example.annotations.map(([syntax, explanation]) => <div key={syntax}><dt><code>{syntax}</code></dt><dd>{explanation}</dd></div>)}
            </dl></details>}
            <details><summary>Trace the expected output</summary><pre>{example.output}</pre><p>{example.why}</p></details>
          </article>)}
        </Section>
        <Section title="Break it & fix it">
          <p>Run this example, identify the mistake and try a fix.</p>
          <CodeLab initial={lesson.mistake.code} input={lesson.examples[0].input} label="fix_me.py"/>
          <details><summary>Show the fix & explanation</summary><pre>{lesson.mistake.fix}</pre><p>{lesson.mistake.why}</p></details>
          {lesson.misconceptions && <ul>{lesson.misconceptions.map(item => <li key={item}>{item}</li>)}</ul>}
        </Section>
        <Section title="Put it to work">
          <p>{lesson.application}</p>
          {related.length > 0 ? <ul>{related.map(project => <li key={project.id}><a className="inline-link" href={`#/projects/${project.id}`}>{project.title}</a></li>)}</ul>
            : <a className="text-link" href="#/projects">Explore projects <ArrowRight size={14}/></a>}
        </Section>
        <Section title="Practice">{lesson.tasks.map(task =>
          <TaskCard key={task.id} task={task} solved={solved.includes(task.id)} onPass={() => onSolve(task.id)}/>)}</Section>
        <Section title="Chapter quiz"><Quiz questions={lesson.quiz} onComplete={onQuiz}/></Section>
        <Section title="Quick revision">
          <div className="card revision">{lesson.cheatSheet
            ? <ul>{lesson.cheatSheet.map(item => <li key={item}>{item}</li>)}</ul>
            : lesson.concepts.map(([title, text]) => <p key={title}><b>{title}</b> {text.split('. ')[0]}.</p>)}</div>
          {lesson.interview?.map(([question, answer]) => <details key={question}><summary>Interview practice · {question}</summary><p>{answer}</p></details>)}
          <button className="button primary" onClick={onComplete}>{completed.includes(lesson.id) ? '✓ Chapter completed' : 'Mark chapter as completed'}</button>
          <p className="runtime-note">Chapter completion is self-reported. Exercise and quiz results are recorded separately.</p>
        </Section>
        <div className="lesson-nav">
          {previous && <a className="button" href={`#/chapter/${previous.id}`}><ChevronLeft size={15}/>{previous.title}</a>}
          {next && <a className="button primary" href={`#/chapter/${next.id}`}>{next.title}<ArrowRight size={15}/></a>}
        </div>
      </div>
    </div>
  </>;
}
