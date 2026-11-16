import {useState, useEffect} from 'react';
import {
  Compass,
  CheckCircle2,
  BookOpen,
  Code2,
  Target,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Cpu,
  Trophy,
  Check,
  AlertTriangle,
  HelpCircle,
  Clock,
  Circle,
  ExternalLink
} from 'lucide-react';
import {intermediateModules, type IntermediateModule} from '../data/intermediatePath';
import {loadIntermediateProgress, saveIntermediateProgress, type IntermediateProgress} from '../lib/intermediateProgress';
import CodeLab from './CodeLab';
import TaskCard from './TaskCard';
import Quiz from './Quiz';

type Props = {
  initialModuleId?: string;
  onNavigate?: (route: string) => void;
};

export default function IntermediatePathView({initialModuleId, onNavigate}: Props) {
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (initialModuleId && intermediateModules.some(m => m.id === initialModuleId)) {
      return initialModuleId;
    }
    return intermediateModules[0].id;
  });

  const [progress, setProgress] = useState<IntermediateProgress>(() => loadIntermediateProgress());

  // Predict state for current module
  const [userPrediction, setUserPrediction] = useState('');
  const [predictionResult, setPredictionResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  // Debug state for current module
  const [debugHintCount, setDebugHintCount] = useState(0);
  const [debugSolved, setDebugSolved] = useState(false);

  // Tab for active section in module
  const [activeTab, setActiveTab] = useState<'overview' | 'practice' | 'quiz'>('overview');

  useEffect(() => {
    if (initialModuleId && intermediateModules.some(m => m.id === initialModuleId)) {
      setSelectedId(initialModuleId);
    }
  }, [initialModuleId]);

  // Reset tab and per-module interactive state when module changes
  useEffect(() => {
    setUserPrediction('');
    setPredictionResult('idle');
    setDebugHintCount(0);
    setDebugSolved(false);
    setActiveTab('overview');
  }, [selectedId]);

  const currentModule = intermediateModules.find(m => m.id === selectedId) || intermediateModules[0];
  const currentIndex = intermediateModules.findIndex(m => m.id === selectedId);

  function updateProgress(updater: (prev: IntermediateProgress) => IntermediateProgress) {
    setProgress(prev => {
      const next = updater(prev);
      saveIntermediateProgress(next);
      return next;
    });
  }

  function handleCompleteModule(moduleId: string) {
    updateProgress(prev => ({
      ...prev,
      completedModules: [...new Set([...prev.completedModules, moduleId])],
    }));
  }

  function handleSolveChallenge(taskId: string) {
    updateProgress(prev => ({
      ...prev,
      solvedChallenges: [...new Set([...prev.solvedChallenges, taskId])],
      attemptedChallenges: [...new Set([...prev.attemptedChallenges, taskId])],
    }));
  }

  function handleAttemptChallenge(taskId: string) {
    updateProgress(prev => ({
      ...prev,
      attemptedChallenges: [...new Set([...prev.attemptedChallenges, taskId])],
    }));
  }

  function handleQuizComplete(moduleId: string, score: number) {
    updateProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [moduleId]: Math.max(prev.quizScores[moduleId] ?? 0, score),
      },
    }));
    if (score >= 60) {
      handleCompleteModule(moduleId);
    }
  }

  function checkPrediction(e: React.FormEvent) {
    e.preventDefault();
    const cleanUser = userPrediction.trim().toLowerCase();
    const cleanExpected = currentModule.activity.answer.trim().toLowerCase();
    if (cleanUser === cleanExpected || cleanUser.includes(cleanExpected)) {
      setPredictionResult('correct');
    } else {
      setPredictionResult('incorrect');
    }
  }

  const completedModulesCount = progress.completedModules.length;
  const solvedChallengesCount = progress.solvedChallenges.length;
  const overallPercent = Math.round(
    ((completedModulesCount + solvedChallengesCount + (progress.capstoneCompleted ? 2 : 0)) / 12) * 100
  );

  return (
    <div className="intermediate-path-view">
      {/* Journey Banner: Foundations -> Intermediate -> Data Science */}
      <nav className="card intermediate-journey-banner" aria-label="Curriculum Journey">
        <div className="journey-nodes">
          <a href="#/chapters" className="journey-node completed-node">
            <span className="node-icon"><Check size={14} /></span>
            <div className="node-text">
              <small>STAGE 1</small>
              <strong>Python Foundations</strong>
              <span>16 Visual Chapters (0–15)</span>
            </div>
          </a>

          <div className="journey-arrow">→</div>

          <div className="journey-node active-node" aria-current="step">
            <span className="node-icon active-pulse"><Compass size={16} /></span>
            <div className="node-text">
              <small>STAGE 2 · YOU ARE HERE</small>
              <strong>Intermediate Python</strong>
              <span>5 Modules + Capstone</span>
            </div>
          </div>

          <div className="journey-arrow">→</div>

          <a href="https://shadabur-rahaman.github.io/ds-lab/roadmap" target="_blank" rel="noreferrer" className="journey-node future-node ecosystem-node">
            <span className="node-icon"><Cpu size={14} /></span>
            <div className="node-text">
              <small>STAGE 3 · ECOSYSTEM</small>
              <strong>Data Science & Backend</strong>
              <span>DS LAB (NumPy, Pandas & ML) ↗</span>
            </div>
          </a>
        </div>
      </nav>

      {/* Hero Header with Progress Tracker */}
      <div className="card intermediate-hero-card">
        <div className="hero-content">
          <span className="eyebrow"><Compass size={15} /> SECOND-STAGE CURRICULUM</span>
          <h2>Structured Core Modules & Mastery</h2>
          <p className="hero-lead">
            Move beyond single-file scripts. Learn standard library modules, functional decomposition, memory-efficient generators, real-world CSV handling, and defensive assertion testing.
          </p>
        </div>

        <div className="intermediate-metrics-grid">
          <div className="metric-box">
            <span className="metric-val">{completedModulesCount} / 5</span>
            <span className="metric-lbl">Modules Completed</span>
          </div>
          <div className="metric-box">
            <span className="metric-val">{solvedChallengesCount} / 5</span>
            <span className="metric-lbl">Challenges Solved</span>
          </div>
          <div className="metric-box">
            <span className="metric-val">{progress.capstoneCompleted ? '✓ Done' : 'Pending'}</span>
            <span className="metric-lbl">Capstone Project</span>
          </div>
          <div className="metric-box highlight">
            <span className="metric-val">{overallPercent}%</span>
            <span className="metric-lbl">Intermediate Mastery</span>
          </div>
        </div>
      </div>

      {/* Module Selector Navigation Tabs */}
      <div className="intermediate-module-nav" role="tablist" aria-label="Intermediate Modules">
        {intermediateModules.map(m => {
          const isSelected = m.id === selectedId;
          const isDone = progress.completedModules.includes(m.id);
          const isSolved = progress.solvedChallenges.includes(m.task.id);
          const score = progress.quizScores[m.id];

          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={isSelected}
              className={`module-tab-pill ${isSelected ? 'active' : ''} ${isDone ? 'completed' : ''}`}
              onClick={() => {
                setSelectedId(m.id);
                location.hash = `#/intermediate/${m.id}`;
              }}
            >
              <div className="tab-pill-header">
                <span className="tab-pill-index">M{m.moduleIndex}</span>
                {isDone && <CheckCircle2 size={13} className="tab-done-icon" />}
              </div>
              <span className="tab-pill-title">{m.title}</span>
              <div className="tab-pill-footer">
                <small>{m.estimatedMinutes} min</small>
                {score !== undefined && <span className="quiz-badge">{score}%</span>}
              </div>
            </button>
          );
        })}

        {/* Capstone Project Pill */}
        <a
          href="#/projects/student-marks-analyzer"
          className={`module-tab-pill capstone-pill ${progress.capstoneCompleted ? 'completed' : ''}`}
        >
          <div className="tab-pill-header">
            <span className="tab-pill-index"><Trophy size={13} /></span>
            {progress.capstoneCompleted && <CheckCircle2 size={13} className="tab-done-icon" />}
          </div>
          <span className="tab-pill-title">Capstone Analyzer</span>
          <div className="tab-pill-footer">
            <small>30 min · Capstone</small>
          </div>
        </a>
      </div>

      {/* Main Module Content Area */}
      <div className="module-workspace">
        {/* Module Header Bar */}
        <div className="card module-view-header">
          <div className="module-title-area">
            <span className="eyebrow">MODULE {currentModule.moduleIndex} OF 5 · {currentModule.estimatedMinutes} MINUTES</span>
            <h2>{currentModule.title}</h2>
            <p className="module-subtitle">{currentModule.subtitle}</p>
          </div>

          <div className="module-actions">
            <button
              className={`button ${progress.completedModules.includes(currentModule.id) ? '' : 'primary'}`}
              onClick={() => handleCompleteModule(currentModule.id)}
            >
              {progress.completedModules.includes(currentModule.id) ? '✓ Module Completed' : 'Mark as Done'}
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs within Module */}
        <div className="module-section-tabs">
          <button
            className={`section-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BookOpen size={15} /> 1. Concept & Mental Model
          </button>
          <button
            className={`section-tab ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            <Code2 size={15} /> 2. Practice Studio (Predict, Debug, Code)
          </button>
          <button
            className={`section-tab ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <Target size={15} /> 3. Checkpoint Quiz ({currentModule.quiz.length} Questions)
          </button>
        </div>

        {/* Tab 1: Overview, Objectives, Story, Visual Model, CodeLab Example, Common Mistake */}
        {activeTab === 'overview' && (
          <div className="module-tab-pane">
            {/* Real-World Context & Objectives */}
            <div className="two-columns">
              <div className="card">
                <span className="eyebrow">REAL-WORLD CONTEXT</span>
                <h3>Why this matters</h3>
                <p>{currentModule.story}</p>
                <div className="application-box">
                  <strong>Practical Application:</strong>
                  <p>{currentModule.application}</p>
                </div>
              </div>

              <div className="card">
                <span className="eyebrow">LEARNING OBJECTIVES</span>
                <h3>What you will master</h3>
                <ul className="objectives-list">
                  {currentModule.objectives.map((obj, i) => (
                    <li key={i}>
                      <CheckCircle2 size={15} />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Visual Mental Model Explanation */}
            <div className="card visual-explanation-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow"><Sparkles size={14} /> MENTAL MODEL</span>
                  <h3>{currentModule.visualExplanation.title}</h3>
                </div>
                <small>Visual intuition</small>
              </div>
              <p className="visual-desc">{currentModule.visualExplanation.description}</p>

              <div className="visual-steps-grid">
                {currentModule.visualExplanation.steps.map((st, i) => (
                  <div key={i} className="visual-step-card">
                    <span className="step-badge">{i + 1}</span>
                    <h4>{st.title}</h4>
                    <p>{st.description}</p>
                    {st.code && <pre className="step-code"><code>{st.code}</code></pre>}
                  </div>
                ))}
              </div>
            </div>

            {/* Core Concepts Grid */}
            <div className="card concepts-card">
              <h3>Core Concepts</h3>
              <div className="concepts-grid">
                {currentModule.concepts.map(([conceptTitle, conceptBody], i) => (
                  <div key={i} className="concept-pill-item">
                    <h4>{conceptTitle}</h4>
                    <p>{conceptBody}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive CodeLab Example */}
            {currentModule.examples.map((ex, i) => (
              <div key={i} className="card example-card">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">RUNNABLE PYTHON EXAMPLE</span>
                    <h3>{ex.title}</h3>
                  </div>
                  <small>Real execution</small>
                </div>
                <p>{ex.why}</p>

                <CodeLab
                  initial={ex.code}
                  label={`${currentModule.id}-example-${i + 1}.py`}
                  draftId={`${currentModule.id}-ex-${i}`}
                />

                {ex.annotations && ex.annotations.length > 0 && (
                  <div className="annotations-area">
                    <strong>Code Annotations:</strong>
                    <ul>
                      {ex.annotations.map(([snip, note], aIdx) => (
                        <li key={aIdx}>
                          <code>{snip}</code> — {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {/* Common Mistake (Break it & Fix it) */}
            <div className="card mistake-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow"><AlertTriangle size={14} /> COMMON PITFALL</span>
                  <h3>Break It & Fix It</h3>
                </div>
                <small>Learn from errors</small>
              </div>

              <div className="two-columns">
                <div className="mistake-side broken-side">
                  <h4>❌ The Buggy Code</h4>
                  <pre><code>{currentModule.mistake.code}</code></pre>
                </div>
                <div className="mistake-side fixed-side">
                  <h4>✓ The Clean Fix</h4>
                  <pre><code>{currentModule.mistake.fix}</code></pre>
                </div>
              </div>
              <p className="mistake-why"><strong>Why this happens:</strong> {currentModule.mistake.why}</p>
            </div>

            {/* Cheat Sheet & Revision */}
            <div className="card cheatsheet-card">
              <h3>Quick Reference & Cheat Sheet</h3>
              <ul className="cheatsheet-list">
                {currentModule.cheatSheet.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Bottom Pane Navigation */}
            <div className="pane-nav-bar">
              <button className="button primary large" onClick={() => setActiveTab('practice')}>
                Continue to Practice Studio <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Three Core Practice Formats (Predict, Debug, Challenge) */}
        {activeTab === 'practice' && (
          <div className="module-tab-pane practice-pane">
            {/* Format A: Predict the Output */}
            <div className="card practice-section-card" id="predict-format">
              <div className="section-heading">
                <div>
                  <span className="eyebrow"><HelpCircle size={14} /> FORMAT A: PREDICT THE OUTPUT</span>
                  <h3>Mental Execution Check</h3>
                </div>
                <span className={`pill small ${predictionResult === 'correct' ? 'easy' : ''}`}>
                  {predictionResult === 'correct' ? '✓ Correct' : 'Active'}
                </span>
              </div>
              <p>{currentModule.activity.intro}</p>

              <div className="code-read-block">
                <pre><code>{currentModule.activity.code}</code></pre>
              </div>

              <form onSubmit={checkPrediction} className="predict-form">
                <label>
                  <span>{currentModule.activity.prediction}</span>
                  <input
                    type="text"
                    value={userPrediction}
                    onChange={e => setUserPrediction(e.target.value)}
                    placeholder="Type the exact output here…"
                    aria-label="Output prediction"
                  />
                </label>
                <button type="submit" className="button primary">
                  Check Prediction
                </button>
              </form>

              {predictionResult === 'correct' && (
                <div className="feedback-banner success">
                  <CheckCircle2 size={16} />
                  <div>
                    <strong>Spot on!</strong>
                    <p>{currentModule.activity.reason}</p>
                    <small>Remember: {currentModule.activity.remember}</small>
                  </div>
                </div>
              )}

              {predictionResult === 'incorrect' && (
                <div className="feedback-banner error">
                  <AlertTriangle size={16} />
                  <div>
                    <strong>Not quite yet.</strong>
                    <p>Hint: {currentModule.activity.hint}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Format B: Debug the Bug */}
            <div className="card practice-section-card" id="debug-format">
              <div className="section-heading">
                <div>
                  <span className="eyebrow"><AlertTriangle size={14} /> FORMAT B: DEBUG THE BUG</span>
                  <h3>Find & Fix the Error</h3>
                </div>
                <span className={`pill small ${debugSolved ? 'easy' : ''}`}>
                  {debugSolved ? '✓ Fixed' : 'Interactive'}
                </span>
              </div>
              <p>The code below produces an error or incorrect behavior. Inspect it, edit it in the CodeLab editor, and run it to produce the correct result:</p>

              <CodeLab
                initial={currentModule.activity.broken}
                expected={currentModule.activity.answer}
                verifyOutput
                label={`${currentModule.id}-debug.py`}
                draftId={`${currentModule.id}-debug`}
                onPass={() => setDebugSolved(true)}
              />

              <div className="hint-area">
                <button
                  type="button"
                  className="button small"
                  disabled={debugHintCount >= 3}
                  onClick={() => setDebugHintCount(debugHintCount + 1)}
                >
                  <Lightbulb size={14} /> {debugHintCount >= 3 ? 'All hints revealed' : `Reveal Hint ${debugHintCount + 1} of 3`}
                </button>

                {debugHintCount >= 1 && (
                  <p className="hint-text"><strong>Hint 1:</strong> Look closely at how the function or syntax is defined versus called.</p>
                )}
                {debugHintCount >= 2 && (
                  <p className="hint-text"><strong>Hint 2:</strong> {currentModule.activity.hint}</p>
                )}
                {debugHintCount >= 3 && (
                  <p className="hint-text"><strong>Hint 3:</strong> Expected output should match: <code>{currentModule.activity.answer}</code></p>
                )}
              </div>
            </div>

            {/* Format C: Real Coding Challenge */}
            <div className="card practice-section-card" id="challenge-format">
              <div className="section-heading">
                <div>
                  <span className="eyebrow"><Code2 size={14} /> FORMAT C: INDEPENDENT CHALLENGE</span>
                  <h3>Module Coding Challenge</h3>
                </div>
                <span className="pill small challenge-pill">Multi-Case Graded</span>
              </div>

              <TaskCard
                task={currentModule.task}
                solved={progress.solvedChallenges.includes(currentModule.task.id)}
                attempted={progress.attemptedChallenges.includes(currentModule.task.id)}
                onPass={() => handleSolveChallenge(currentModule.task.id)}
                onAttempt={() => handleAttemptChallenge(currentModule.task.id)}
              />
            </div>

            {/* Bottom Pane Navigation */}
            <div className="pane-nav-bar">
              <button className="button" onClick={() => setActiveTab('overview')}>
                <ArrowLeft size={16} /> Back to Mental Model
              </button>
              <button className="button primary large" onClick={() => setActiveTab('quiz')}>
                Take Checkpoint Quiz <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Checkpoint Quiz */}
        {activeTab === 'quiz' && (
          <div className="module-tab-pane quiz-pane">
            <div className="card quiz-intro-card">
              <span className="eyebrow">ASSESSMENT</span>
              <h2>Module {currentModule.moduleIndex} Checkpoint Quiz</h2>
              <p>Test your conceptual understanding. Score at least 60% to automatically mark this module complete.</p>
              {progress.quizScores[currentModule.id] !== undefined && (
                <div className="saved-score-badge">
                  Best score: <strong>{progress.quizScores[currentModule.id]}%</strong>
                </div>
              )}
            </div>

            <Quiz
              key={currentModule.id}
              questions={currentModule.quiz}
              onComplete={score => handleQuizComplete(currentModule.id, score)}
            />

            {/* Module Next / Prev Buttons */}
            <div className="card module-pagination-card">
              <div className="section-heading">
                <h3>Navigation & Next Steps</h3>
                <small>Module {currentModule.moduleIndex} of 5</small>
              </div>

              <div className="pagination-buttons">
                {currentIndex > 0 ? (
                  <button
                    className="button"
                    onClick={() => {
                      const prevMod = intermediateModules[currentIndex - 1];
                      setSelectedId(prevMod.id);
                      location.hash = `#/intermediate/${prevMod.id}`;
                    }}
                  >
                    <ArrowLeft size={15} /> Previous: {intermediateModules[currentIndex - 1].title}
                  </button>
                ) : (
                  <a href="#/chapters" className="button">
                    <ArrowLeft size={15} /> All Foundations (0–15)
                  </a>
                )}

                {currentIndex < intermediateModules.length - 1 ? (
                  <button
                    className="button primary"
                    onClick={() => {
                      const nextMod = intermediateModules[currentIndex + 1];
                      setSelectedId(nextMod.id);
                      location.hash = `#/intermediate/${nextMod.id}`;
                    }}
                  >
                    Next: {intermediateModules[currentIndex + 1].title} <ArrowRight size={15} />
                  </button>
                ) : (
                  <a href="#/projects/student-marks-analyzer" className="button primary">
                    Proceed to Capstone Project <ArrowRight size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Capstone Promotion Banner Card */}
      <div className="card capstone-promo-banner">
        <div className="promo-text">
          <span className="eyebrow"><Trophy size={14} /> CAPSTONE PROJECT</span>
          <h3>Student Marks Analyzer</h3>
          <p>
            Combine everything: CSV file parsing, data cleaning, functional decomposition, statistical calculations, and automated assertions.
          </p>
        </div>
        <a href="#/projects/student-marks-analyzer" className="button primary large">
          Open Capstone Project <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}
