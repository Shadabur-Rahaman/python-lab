import {useState, useEffect} from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Code2,
  Target,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Layers,
  Cpu,
  Trophy,
  Check,
  AlertTriangle,
  HelpCircle,
  Clock,
  Circle,
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import {advancedModules, type AdvancedModule} from '../data/advancedPath';
import {
  loadAdvancedProgress,
  saveAdvancedProgress,
  type AdvancedProgress
} from '../lib/advancedProgress';
import CodeLab from './CodeLab';
import TaskCard from './TaskCard';
import Quiz from './Quiz';
import AdvancedVisualizer from './AdvancedVisualizer';

type Props = {
  initialModuleId?: string;
  onNavigate?: (route: string) => void;
};

export default function AdvancedPathView({initialModuleId, onNavigate}: Props) {
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (initialModuleId && advancedModules.some(m => m.id === initialModuleId)) {
      return initialModuleId;
    }
    return advancedModules[0].id;
  });

  const [progress, setProgress] = useState<AdvancedProgress>(() => loadAdvancedProgress());

  // Predict state for current module
  const [userPrediction, setUserPrediction] = useState('');
  const [predictionResult, setPredictionResult] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  // Debug state for current module
  const [debugHintCount, setDebugHintCount] = useState(0);
  const [debugSolved, setDebugSolved] = useState(false);

  // Tab for active section in module
  const [activeTab, setActiveTab] = useState<'overview' | 'practice' | 'quiz'>('overview');

  useEffect(() => {
    if (initialModuleId && advancedModules.some(m => m.id === initialModuleId)) {
      setSelectedId(initialModuleId);
    }
  }, [initialModuleId]);

  useEffect(() => {
    setUserPrediction('');
    setPredictionResult('idle');
    setDebugHintCount(0);
    setDebugSolved(false);
    setActiveTab('overview');
  }, [selectedId]);

  const currentModule = advancedModules.find(m => m.id === selectedId) || advancedModules[0];
  const currentIndex = advancedModules.findIndex(m => m.id === selectedId);

  function updateProgress(updater: (prev: AdvancedProgress) => AdvancedProgress) {
    setProgress(prev => {
      const next = updater(prev);
      saveAdvancedProgress(next);
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

  function handleSaveQuiz(moduleId: string, score: number) {
    updateProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [moduleId]: Math.max(prev.quizScores[moduleId] ?? 0, score),
      },
      completedModules: score >= 65
        ? [...new Set([...prev.completedModules, moduleId])]
        : prev.completedModules,
    }));
  }

  function handleCheckPrediction() {
    const cleanUser = userPrediction.trim().toLowerCase();
    const cleanAnswer = currentModule.activity.answer.trim().toLowerCase();
    if (cleanUser === cleanAnswer || cleanUser.includes(cleanAnswer)) {
      setPredictionResult('correct');
      updateProgress(prev => ({
        ...prev,
        predictions: {...prev.predictions, [currentModule.id]: userPrediction.trim()},
      }));
    } else {
      setPredictionResult('incorrect');
    }
  }

  function handleSolveDebug() {
    setDebugSolved(true);
    updateProgress(prev => ({
      ...prev,
      debugSolved: [...new Set([...prev.debugSolved, currentModule.id])],
    }));
  }

  const completedCount = progress.completedModules.length;
  const totalCount = advancedModules.length;
  const pathPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="intermediate-path-view advanced-path-view">
      {/* Header Banner */}
      <div className="card intermediate-hero-card advanced-hero-card">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="badge-level advanced"><Sparkles size={13} /> ADVANCED PATHWAY</span>
            <span>4TH TIER IN YOUR LEARNING JOURNEY</span>
          </div>
          <h2>Advanced Python & Software Engineering Studio</h2>
          <p>
            Transition from writing individual scripts to architecting production-grade Python software.
            Master decoupled object models, functional metaprogramming, robust fault-tolerant exception hierarchies,
            high-throughput data structures, and maintainable unit-tested architectures.
          </p>

          <div className="intermediate-stats-row">
            <div className="stat-item">
              <strong>{completedCount} of {totalCount}</strong>
              <small>Modules Completed</small>
            </div>
            <div className="stat-item">
              <strong>{progress.solvedChallenges.length}</strong>
              <small>Challenges Solved</small>
            </div>
            <div className="stat-item">
              <strong>{pathPercent}%</strong>
              <small>Pathway Mastery</small>
            </div>
          </div>
        </div>

        <div className="hero-progress-sidebar">
          <div className="progress-radial-label">
            <span>Overall Progress</span>
            <strong>{pathPercent}%</strong>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={pathPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Advanced pathway completion"
          >
            <span style={{width: `${pathPercent}%`}} />
          </div>
          <small className="progress-hint">
            Recommended after Python Foundations and Intermediate Python.
          </small>
        </div>
      </div>

      {/* Module Selector Navigation Tabs */}
      <div className="intermediate-module-nav" role="tablist" aria-label="Advanced Modules">
        {advancedModules.map(m => {
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
                location.hash = `#/advanced/${m.id}`;
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
          href="#/projects/event-scheduler-pro"
          className="module-tab-pill capstone-pill"
          title="Open Flagship Project: Event Scheduling & Conflict Detection System"
        >
          <div className="tab-pill-header">
            <span className="tab-pill-index"><Trophy size={13} /></span>
          </div>
          <span className="tab-pill-title">Event Scheduler Capstone</span>
          <div className="tab-pill-footer">
            <small>40 min · Advanced Capstone</small>
          </div>
        </a>
      </div>

      {/* Main Module Content Area */}
      <div className="module-workspace">
        {/* Module Header Bar */}
        <div className="card module-view-header">
          <div className="module-title-area">
            <span className="eyebrow">
              MODULE {currentModule.moduleIndex} OF 5 · {currentModule.estimatedMinutes} MINUTES · ADVANCED SOFTWARE ENGINEERING
            </span>
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
            <Code2 size={15} /> 2. Practice Studio (Predict, Debug, Challenge)
          </button>
          <button
            className={`section-tab ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <Target size={15} /> 3. Module Assessment ({currentModule.quiz.length} Questions)
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="module-tab-pane">
            <div className="two-columns">
              <div className="card">
                <span className="eyebrow">INDUSTRIAL CONTEXT</span>
                <h3>Why this matters</h3>
                <p>{currentModule.story}</p>
                <div className="application-box">
                  <strong>Production Application:</strong>
                  <p>{currentModule.application}</p>
                </div>
              </div>

              <div className="card">
                <span className="eyebrow">CORE COMPETENCIES</span>
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

            {/* Interactive Visual Teaching Component */}
            <AdvancedVisualizer config={currentModule.visualizer} />

            {/* Core Concepts Grid */}
            <div className="card">
              <span className="eyebrow">ARCHITECTURAL FOUNDATIONS</span>
              <h3>Core Principles & Patterns</h3>
              <div className="concepts-grid">
                {currentModule.concepts.map(([name, desc], i) => (
                  <div key={i} className="concept-card">
                    <h4>{name}</h4>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Runnable Production Examples */}
            <div className="card">
              <span className="eyebrow">VERIFIED PYTHON IMPLEMENTATIONS</span>
              <h3>Runnable Examples</h3>
              <p>Execute and inspect these production patterns in your live browser runtime.</p>
              {currentModule.examples.map((ex, i) => (
                <div key={i} className="example-block">
                  <h4>{ex.title}</h4>
                  <p className="example-why">{ex.why}</p>
                  <CodeLab
                    initial={ex.code}
                    expected={ex.output}
                    label={`example-${currentModule.id}-${i + 1}.py`}
                  />
                </div>
              ))}
            </div>

            {/* Common Mistake & Anti-Pattern Analysis */}
            <div className="card mistake-card">
              <div className="mistake-header">
                <AlertTriangle size={18} className="text-warning" />
                <h3>Common Architectural Anti-Pattern</h3>
              </div>
              <p>{currentModule.mistake.why}</p>
              <div className="two-columns mistake-comparison">
                <div className="mistake-code-box">
                  <span className="code-label danger">✕ Broken Anti-Pattern</span>
                  <pre><code>{currentModule.mistake.code}</code></pre>
                </div>
                <div className="mistake-code-box">
                  <span className="code-label success">✓ Idiomatic Production Fix</span>
                  <pre><code>{currentModule.mistake.fix}</code></pre>
                </div>
              </div>
            </div>

            {/* Optional Hinglish Memory Tip */}
            {currentModule.hinglishTip && (
              <div className="card memory-hint-card">
                <span className="eyebrow">CONCEPT RECALL TIP</span>
                <p>💡 {currentModule.hinglishTip}</p>
              </div>
            )}

            {/* Cheat Sheet Reference */}
            <div className="card cheatsheet-card">
              <span className="eyebrow">QUICK REFERENCE</span>
              <h3>Module Syntax & Idioms</h3>
              <ul className="cheatsheet-list">
                {currentModule.cheatSheet.map((item, i) => (
                  <li key={i}><code>{item}</code></li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Practice Studio */}
        {activeTab === 'practice' && (
          <div className="module-tab-pane">
            <div className="practice-suite-header">
              <h3>Three-Tier Advanced Practice Studio</h3>
              <p>Progress through prediction, debugging, and independent software engineering challenges.</p>
            </div>

            {/* Format A: Predict the Output */}
            <div className="card practice-activity-card" data-testid="practice-predict">
              <div className="activity-badge">
                <Sparkles size={14} /> FORMAT A: PREDICT THE OUTPUT
              </div>
              <h4>{currentModule.activity.title}</h4>
              <p>{currentModule.activity.intro}</p>

              <pre className="code-block-display">
                <code>{currentModule.activity.code}</code>
              </pre>

              <div className="prediction-interaction">
                <label htmlFor="user-prediction-input">
                  <strong>{currentModule.activity.prediction}</strong>
                </label>
                <div className="prediction-input-row">
                  <input
                    id="user-prediction-input"
                    type="text"
                    placeholder="Enter your expected output…"
                    value={userPrediction}
                    onChange={e => setUserPrediction(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCheckPrediction()}
                  />
                  <button className="button primary" onClick={handleCheckPrediction}>
                    Check Prediction
                  </button>
                </div>

                {predictionResult === 'correct' && (
                  <div className="feedback-callout success" role="status">
                    <CheckCircle2 size={16} />
                    <div>
                      <strong>Correct!</strong> Exactly matches Python's evaluation.
                      <p>{currentModule.activity.reason}</p>
                    </div>
                  </div>
                )}

                {predictionResult === 'incorrect' && (
                  <div className="feedback-callout error" role="status">
                    <AlertTriangle size={16} />
                    <div>
                      <strong>Not quite.</strong>
                      <p>Expected: <code>{currentModule.activity.answer}</code></p>
                      <p>{currentModule.activity.reason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Format B: Debug the Bug */}
            <div className="card practice-activity-card" data-testid="practice-debug">
              <div className="activity-badge">
                <AlertTriangle size={14} /> FORMAT B: DEBUG THE BUG
              </div>
              <h4>Diagnose and Correct the Architectural Flaw</h4>
              <p>The code below contains a subtle defect. Use progressive hints if needed to isolate the issue.</p>

              <pre className="code-block-display error-border">
                <code>{currentModule.activity.broken}</code>
              </pre>

              <div className="debug-hints-section">
                <button
                  className="button small"
                  disabled={debugHintCount >= 3}
                  onClick={() => setDebugHintCount(prev => prev + 1)}
                >
                  <Lightbulb size={14} />
                  {debugHintCount === 0
                    ? 'Reveal Hint 1 (Direction)'
                    : debugHintCount === 1
                    ? 'Reveal Hint 2 (Specific Guidance)'
                    : debugHintCount === 2
                    ? 'Reveal Hint 3 (Exact Solution)'
                    : 'All 3 Hints Revealed'}
                </button>

                {debugHintCount >= 1 && (
                  <p className="hint-text"><strong>Direction:</strong> {currentModule.activity.hint}</p>
                )}
                {debugHintCount >= 2 && (
                  <p className="hint-text"><strong>Guidance:</strong> {currentModule.activity.reason}</p>
                )}
                {debugHintCount >= 3 && (
                  <div className="hint-solution-box">
                    <strong>Verified Fix:</strong>
                    <pre><code>{currentModule.activity.repair}</code></pre>
                  </div>
                )}
              </div>

              <div className="debug-resolution-actions">
                <button
                  className={`button ${debugSolved || progress.debugSolved.includes(currentModule.id) ? '' : 'primary'}`}
                  onClick={handleSolveDebug}
                >
                  {debugSolved || progress.debugSolved.includes(currentModule.id)
                    ? '✓ Defect Understood & Resolved'
                    : 'I Fixed It / Reveal Solution'}
                </button>
              </div>
            </div>

            {/* Format C: Independent Coding Challenge */}
            <div className="practice-activity-card">
              <div className="activity-badge">
                <Code2 size={14} /> FORMAT C: INDEPENDENT CODING CHALLENGE
              </div>
              <TaskCard
                task={currentModule.task}
                solved={progress.solvedChallenges.includes(currentModule.task.id)}
                attempted={progress.attemptedChallenges.includes(currentModule.task.id)}
                onPass={() => handleSolveChallenge(currentModule.task.id)}
                onAttempt={() => handleAttemptChallenge(currentModule.task.id)}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Checkpoint Assessment */}
        {activeTab === 'quiz' && (
          <div className="module-tab-pane">
            <div className="card">
              <span className="eyebrow">MODULE ASSESSMENT</span>
              <h3>Checkpoint Assessment: {currentModule.title}</h3>
              <p>Verify your understanding of these advanced concepts. Questions require analyzing real behavior.</p>

              {progress.quizScores[currentModule.id] !== undefined && (
                <div className="quiz-best-score-banner">
                  <Trophy size={16} />
                  <span>
                    Your Best Score: <strong>{progress.quizScores[currentModule.id]}%</strong>
                  </span>
                </div>
              )}

              <Quiz
                key={currentModule.id}
                questions={currentModule.quiz}
                onComplete={score => handleSaveQuiz(currentModule.id, score)}
              />
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="module-nav-footer">
          {currentIndex > 0 ? (
            <button
              className="button"
              onClick={() => {
                const prev = advancedModules[currentIndex - 1];
                setSelectedId(prev.id);
                location.hash = `#/advanced/${prev.id}`;
              }}
            >
              <ArrowLeft size={15} /> Previous: {advancedModules[currentIndex - 1].title}
            </button>
          ) : <div />}

          {currentIndex < advancedModules.length - 1 ? (
            <button
              className="button primary"
              onClick={() => {
                const next = advancedModules[currentIndex + 1];
                setSelectedId(next.id);
                location.hash = `#/advanced/${next.id}`;
              }}
            >
              Next: {advancedModules[currentIndex + 1].title} <ArrowRight size={15} />
            </button>
          ) : (
            <a href="#/projects/event-scheduler-pro" className="button primary large">
              Advance to Capstone Project <Trophy size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
