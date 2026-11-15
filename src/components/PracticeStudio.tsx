import {useState} from 'react';
import {Lightbulb, CheckCircle2, Play, Wrench, FileCode, CheckSquare, Sparkles, BookOpen} from 'lucide-react';
import type {Task, Question} from '../data/types';
import {pilotActivities} from '../data/pilotActivities';
import TaskCard from './TaskCard';
import CodeLab from './CodeLab';
import {storage} from '../lib/storage';
import {matchesOutput} from '../lib/progress.mjs';

type Props = {
  chapterId: number;
  chapterTitle: string;
  tasks: Task[];
  checkpoint?: {task: string; steps: string[]; question: Question};
  solved: string[];
  attempted?: string[];
  onSolve: (id: string) => void;
  onAttempt?: (id: string) => void;
  onRun?: () => void;
  onTakeQuiz?: () => void;
  onReadReference?: () => void;
};

export default function PracticeStudio({
  chapterId,
  chapterTitle,
  tasks,
  checkpoint,
  solved,
  attempted = [],
  onSolve,
  onAttempt,
  onRun,
  onTakeQuiz,
  onReadReference,
}: Props) {
  const [activeFormat, setActiveFormat] = useState<'all' | 'predict' | 'debug' | 'code'>('all');
  const activity = (pilotActivities as Record<number, any>)[chapterId];

  // Predict the output state
  const [prediction, setPrediction] = useState('');
  const [predictionStatus, setPredictionStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  // Bug fixing state
  const [bugHintLevel, setBugHintLevel] = useState(0);
  const [bugSolved, setBugSolved] = useState(() => {
    return storage.getItem(`python-lab.practice.debug-solved:${chapterId}`) === 'true';
  });
  const [bugCheckFeedback, setBugCheckFeedback] = useState('');

  const chapterTasks = tasks.filter(t => t.chapter === chapterId);
  const chapterSolvedCount = chapterTasks.filter(t => solved.includes(t.id)).length;
  const chapterAttemptedCount = chapterTasks.filter(t => attempted.includes(t.id) && !solved.includes(t.id)).length;

  function handlePredictionCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!activity) return;
    const cleanPred = prediction.trim().toLowerCase();
    const cleanAns = String(activity.answer).trim().toLowerCase();
    if (cleanPred === cleanAns || cleanPred.includes(cleanAns)) {
      setPredictionStatus('correct');
    } else {
      setPredictionStatus('incorrect');
    }
  }

  function handleBugPass() {
    setBugSolved(true);
    setBugCheckFeedback('✓ Excellent! You fixed the bug and Python produced the expected output.');
    try {
      storage.setItem(`python-lab.practice.debug-solved:${chapterId}`, 'true');
    } catch {}
  }

  return (
    <div className="practice-mastery-studio" id="practice-studio">
      <div className="studio-header card">
        <div className="studio-header-top">
          <div>
            <span className="eyebrow">PRACTICE & MASTERY STUDIO</span>
            <h2>Chapter {chapterId}: {chapterTitle}</h2>
          </div>
          <div className="studio-stats">
            <span className="stat-pill solved"><CheckCircle2 size={14}/> {chapterSolvedCount} of {chapterTasks.length} Solved</span>
            {chapterAttemptedCount > 0 && (
              <span className="stat-pill in-progress">● {chapterAttemptedCount} in progress</span>
            )}
          </div>
        </div>
        <p className="studio-lead">
          Strengthen your problem-solving muscle. Practice predicting what code will output, diagnosing real bugs, and writing your own verified solutions.
        </p>

        <div className="studio-format-nav" role="tablist" aria-label="Practice formats">
          <button
            type="button"
            className={`studio-nav-btn ${activeFormat === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFormat('all')}
            role="tab"
            aria-selected={activeFormat === 'all'}
          >
            All Practice ({chapterTasks.length + (activity ? 2 : 0)})
          </button>
          {activity && (
            <>
              <button
                type="button"
                className={`studio-nav-btn ${activeFormat === 'predict' ? 'active' : ''}`}
                onClick={() => setActiveFormat('predict')}
                role="tab"
                aria-selected={activeFormat === 'predict'}
              >
                <Sparkles size={14}/> 1. Predict Output
              </button>
              <button
                type="button"
                className={`studio-nav-btn ${activeFormat === 'debug' ? 'active' : ''}`}
                onClick={() => setActiveFormat('debug')}
                role="tab"
                aria-selected={activeFormat === 'debug'}
              >
                <Wrench size={14}/> 2. Find & Fix Bug {bugSolved && '✓'}
              </button>
            </>
          )}
          <button
            type="button"
            className={`studio-nav-btn ${activeFormat === 'code' ? 'active' : ''}`}
            onClick={() => setActiveFormat('code')}
            role="tab"
            aria-selected={activeFormat === 'code'}
          >
            <FileCode size={14}/> 3. Write Code ({chapterSolvedCount}/{chapterTasks.length})
          </button>
        </div>
      </div>

      {/* FORMAT A: PREDICT THE OUTPUT */}
      {activity && (activeFormat === 'all' || activeFormat === 'predict') && (
        <section className="card studio-section predict-section" id="practice-predict" aria-labelledby="heading-predict">
          <div className="section-heading">
            <span className="format-tag predict-tag"><Sparkles size={13}/> FORMAT A · PREDICT THE OUTPUT</span>
            <span className="text-muted">Mental Model</span>
          </div>
          <h3 id="heading-predict">Predict Before You Run</h3>
          <p>
            Professional programmers read code and simulate it mentally. Look at this snippet: what will Python output when it executes?
          </p>

          <div className="two-columns">
            <div className="predict-left">
              <label>Python Snippet</label>
              <pre className="code-display"><code>{activity.code}</code></pre>

              <form onSubmit={handlePredictionCheck} className="predict-form">
                <label htmlFor={`predict-input-${chapterId}`}>
                  <strong>Question:</strong> {activity.prediction}
                </label>
                <div className="predict-input-row">
                  <input
                    id={`predict-input-${chapterId}`}
                    type="text"
                    value={prediction}
                    onChange={e => { setPrediction(e.target.value); setPredictionStatus('idle'); }}
                    placeholder="Type your predicted output…"
                    required
                  />
                  <button type="submit" className="button primary small">Check Prediction</button>
                </div>
              </form>

              {predictionStatus === 'correct' && (
                <div className="feedback-banner success" role="status">
                  <strong>✓ Correct prediction!</strong> You understood what Python will do. Run the code on the right to see the real runtime output.
                </div>
              )}
              {predictionStatus === 'incorrect' && (
                <div className="feedback-banner warning" role="status">
                  <strong>Not quite.</strong> Trace through the code step-by-step. Remember how Python evaluates expressions and order of execution.
                </div>
              )}

              <details className="concept-explanation" open={predictionStatus === 'correct' || undefined}>
                <summary>Why does this happen? Concept explanation</summary>
                <p>{activity.reason || activity.intro}</p>
                {activity.remember && (
                  <p className="hinglish-note" lang="hi-Latn">
                    💡 <strong>Memory Hint:</strong> {activity.remember}
                  </p>
                )}
              </details>
            </div>

            <div className="predict-right">
              <label>Run the real code in Python</label>
              <CodeLab
                initial={activity.code}
                draftId={`practice-predict-ch${chapterId}`}
                label="predict_preview.py"
                onRun={onRun}
              />
            </div>
          </div>
        </section>
      )}

      {/* FORMAT B: FIND AND FIX THE BUG */}
      {activity && (activeFormat === 'all' || activeFormat === 'debug') && (
        <section className="card studio-section debug-section" id="practice-debug" aria-labelledby="heading-debug">
          <div className="section-heading">
            <span className="format-tag debug-tag"><Wrench size={13}/> FORMAT B · FIND AND FIX THE BUG</span>
            <span className="text-muted">{bugSolved ? '✓ Fixed & Verified' : 'Debugging Challenge'}</span>
          </div>
          <h3 id="heading-debug">Diagnose & Correct the Error</h3>
          <p>
            The code below contains a realistic beginner bug. Run the code to observe the error message, identify the root cause, edit the code to fix it, and verify with <strong>Check Answer</strong>.
          </p>

          <div className="debug-hints-ladder">
            <button
              type="button"
              className="button small"
              disabled={bugHintLevel >= 3}
              onClick={() => setBugHintLevel(prev => prev + 1)}
            >
              <Lightbulb size={14}/> {bugHintLevel >= 3 ? 'All 3 hints revealed' : `Reveal Hint ${bugHintLevel + 1} of 3`}
            </button>
            {bugHintLevel >= 1 && (
              <div className="progressive-hint-bubble">
                <strong>Hint 1 — Direction:</strong> {activity.hint}
              </div>
            )}
            {bugHintLevel >= 2 && (
              <div className="progressive-hint-bubble">
                <strong>Hint 2 — Specific Guidance:</strong> {activity.reason}
              </div>
            )}
            {bugHintLevel >= 3 && (
              <div className="progressive-hint-bubble">
                <strong>Hint 3 — Strong Hint (Target Fix):</strong>
                <pre><code>{activity.repair}</code></pre>
              </div>
            )}
          </div>

          <div className="debug-editor-wrapper">
            <CodeLab
              initial={activity.broken}
              draftId={`practice-repair-ch${chapterId}`}
              label="fix_the_bug.py"
              expected={activity.expected || (activity.answer ? String(activity.answer) : undefined)}
              onPass={handleBugPass}
              onRun={onRun}
            />
            {bugCheckFeedback && <p className="feedback" role="status">{bugCheckFeedback}</p>}
          </div>
        </section>
      )}

      {/* FORMAT C: WRITE THE CODE YOURSELF */}
      {(activeFormat === 'all' || activeFormat === 'code') && (
        <section className="studio-section code-section" id="practice-code" aria-labelledby="heading-code">
          <div className="section-heading card">
            <span className="format-tag code-tag"><FileCode size={13}/> FORMAT C · WRITE THE CODE YOURSELF</span>
            <span>{chapterSolvedCount} of {chapterTasks.length} Completed</span>
          </div>

          <div className="tasks-grid">
            {chapterTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                solved={solved.includes(task.id)}
                attempted={attempted.includes(task.id)}
                onPass={() => onSolve(task.id)}
                onAttempt={() => onAttempt?.(task.id)}
              />
            ))}
          </div>
        </section>
      )}

      <div className="studio-footer card">
        <h4>Ready for the next step?</h4>
        <p>Take the chapter quiz to test your conceptual knowledge or review the in-depth reference notes.</p>
        <div className="utility-actions">
          {onTakeQuiz && (
            <button type="button" className="button primary" onClick={onTakeQuiz}>
              <CheckSquare size={16}/> Take Chapter Quiz
            </button>
          )}
          {onReadReference && (
            <button type="button" className="button" onClick={onReadReference}>
              <BookOpen size={16}/> Read In-Depth Reference
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
