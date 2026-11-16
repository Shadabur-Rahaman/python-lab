import {useState, useEffect, useMemo} from 'react';
import {
  Code2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  BookOpen,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
  Lightbulb,
  Cpu,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import {
  DSA_TOPICS,
  DSA_MODULES,
  DSA_PROBLEMS,
  type DsaTopicId,
  type DsaDifficulty,
  type DsaProblem,
  type DsaModule,
} from '../data/dsaArenaData';
import {
  loadDsaProgress,
  markProblemSolved,
  markProblemAttempted,
  saveProblemDraft,
  type DsaArenaProgress,
} from '../lib/dsaArenaProgress';
import DsaVisualizer from './DsaVisualizer';
import CodeLab from './CodeLab';

type TabMode = 'arena' | 'visualizers' | 'modules';

type Props = {
  initialProblemId?: string;
  onNavigate?: (route: string) => void;
};

export default function DsaArenaView({initialProblemId, onNavigate}: Props) {
  const [progress, setProgress] = useState<DsaArenaProgress>(() => loadDsaProgress());
  const [activeTab, setActiveTab] = useState<TabMode>('arena');

  // Filters
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unsolved' | 'solved'>('all');

  // Active problem selection
  const [selectedProblemId, setSelectedProblemId] = useState<string>(() => {
    if (initialProblemId && DSA_PROBLEMS.some(p => p.id === initialProblemId)) {
      return initialProblemId;
    }
    return DSA_PROBLEMS[0].id;
  });

  // Hints and Solution reveal
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Sync if initialProblemId changes from URL hash
  useEffect(() => {
    if (initialProblemId && DSA_PROBLEMS.some(p => p.id === initialProblemId)) {
      setSelectedProblemId(initialProblemId);
      setActiveTab('arena');
    }
  }, [initialProblemId]);

  // Reset hints when switching problem
  useEffect(() => {
    setRevealedHints(0);
    setShowSolution(false);
  }, [selectedProblemId]);

  const activeProblem = useMemo(() => {
    return DSA_PROBLEMS.find(p => p.id === selectedProblemId) || DSA_PROBLEMS[0];
  }, [selectedProblemId]);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return DSA_PROBLEMS.filter(p => {
      if (selectedTopic !== 'all' && p.topic !== selectedTopic) return false;
      if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) return false;
      if (statusFilter === 'solved' && !progress.solvedProblems.includes(p.id)) return false;
      if (statusFilter === 'unsolved' && progress.solvedProblems.includes(p.id)) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesPrompt = p.prompt.toLowerCase().includes(query);
        if (!matchesTitle && !matchesPrompt) return false;
      }
      return true;
    });
  }, [selectedTopic, selectedDifficulty, statusFilter, searchQuery, progress.solvedProblems]);

  const solvedCount = progress.solvedProblems.length;
  const attemptedCount = progress.attemptedProblems.length;
  const totalProblems = DSA_PROBLEMS.length;

  const solvedTopicCount = useMemo(() => {
    const solvedSet = new Set(progress.solvedProblems);
    return DSA_TOPICS.filter(topic => {
      const topicProblems = DSA_PROBLEMS.filter(p => p.topic === topic.id);
      return topicProblems.some(p => solvedSet.has(p.id));
    }).length;
  }, [progress.solvedProblems]);

  function handlePassProblem(id: string) {
    const updated = markProblemSolved(id);
    setProgress(updated);
  }

  function handleAttemptProblem(id: string) {
    const updated = markProblemAttempted(id);
    setProgress(updated);
  }

  function handleCodeChange(id: string, code: string) {
    saveProblemDraft(id, code);
  }

  return (
    <div className="dsa-arena-view">
      {/* 5-Stage Learning Continuum Banner */}
      <nav className="card intermediate-journey-banner" aria-label="Curriculum Continuum">
        <div className="journey-nodes">
          <a href="#/chapters" className="journey-node completed-node">
            <span className="node-icon">✓</span>
            <div className="node-text">
              <small>STAGE 1</small>
              <strong>Foundations</strong>
              <span>16 Chapters</span>
            </div>
          </a>
          <div className="journey-arrow">→</div>
          <a href="#/intermediate" className="journey-node completed-node">
            <span className="node-icon">✓</span>
            <div className="node-text">
              <small>STAGE 2</small>
              <strong>Intermediate</strong>
              <span>5 Modules</span>
            </div>
          </a>
          <div className="journey-arrow">→</div>
          <a href="#/advanced" className="journey-node completed-node">
            <span className="node-icon">✓</span>
            <div className="node-text">
              <small>STAGE 3</small>
              <strong>Advanced Studio</strong>
              <span>5 Modules</span>
            </div>
          </a>
          <div className="journey-arrow">→</div>
          <div className="journey-node active-node" aria-current="step">
            <span className="node-icon active-pulse">
              <Code2 size={16} />
            </span>
            <div className="node-text">
              <small>STAGE 4 · YOU ARE HERE</small>
              <strong>DSA Arena</strong>
              <span>24 Challenges</span>
            </div>
          </div>
          <div className="journey-arrow">→</div>
          <a href="#/projects" className="journey-node future-node">
            <span className="node-icon">★</span>
            <div className="node-text">
              <small>STAGE 5</small>
              <strong>Project Studio</strong>
              <span>4 Real Projects</span>
            </div>
          </a>
        </div>
      </nav>

      {/* Hero Header Card */}
      <div className="card dsa-hero-card">
        <div className="hero-content">
          <span className="eyebrow">
            <Sparkles size={15} /> DATA STRUCTURES, ALGORITHMS & PROBLEM-SOLVING ARENA
          </span>
          <h2>Master Algorithmic Thinking in Python</h2>
          <p className="hero-lead">
            Bridge the gap between language syntax and algorithmic mastery. Learn high-yield
            problem-solving patterns, explore step-by-step interactive visualizers, and solve 24
            defensively tested challenges evaluated by real Python in your browser.
          </p>

          <div className="dsa-stats-row">
            <div className="stat-pill solved">
              <CheckCircle2 size={14} />
              <span>
                <strong>{solvedCount}</strong> of {totalProblems} Solved
              </span>
            </div>
            {attemptedCount > solvedCount && (
              <div className="stat-pill in-progress">
                <span>
                  <strong>{attemptedCount - solvedCount}</strong> In Progress
                </span>
              </div>
            )}
            <div className="stat-pill topics-pill">
              <Layers size={14} />
              <span>
                <strong>{solvedTopicCount}</strong> of {DSA_TOPICS.length} Topics Mastered
              </span>
            </div>
          </div>
        </div>

        {/* Studio Primary Tabs Navigation */}
        <div className="dsa-main-tabs" role="tablist">
          <button
            type="button"
            className={`dsa-tab-btn ${activeTab === 'arena' ? 'active' : ''}`}
            onClick={() => setActiveTab('arena')}
            role="tab"
            aria-selected={activeTab === 'arena'}
          >
            <Code2 size={15} />
            <span>Problem-Solving Arena (24)</span>
          </button>
          <button
            type="button"
            className={`dsa-tab-btn ${activeTab === 'visualizers' ? 'active' : ''}`}
            onClick={() => setActiveTab('visualizers')}
            role="tab"
            aria-selected={activeTab === 'visualizers'}
          >
            <Sparkles size={15} />
            <span>Algorithm Visualizers (6)</span>
          </button>
          <button
            type="button"
            className={`dsa-tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
            onClick={() => setActiveTab('modules')}
            role="tab"
            aria-selected={activeTab === 'modules'}
          >
            <BookOpen size={15} />
            <span>Structured Concept Guides (5)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PROBLEM SOLVING ARENA */}
      {activeTab === 'arena' && (
        <div className="dsa-arena-workspace">
          {/* Left Column: Filter Sidebar & Problems List */}
          <div className="dsa-sidebar-panel">
            <div className="card dsa-filter-box">
              <div className="filter-search-row">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search problems or patterns..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-input"
                  aria-label="Search problems"
                />
              </div>

              {/* Topic Filter */}
              <div className="filter-group">
                <label className="filter-label">Topic Filter</label>
                <select
                  value={selectedTopic}
                  onChange={e => setSelectedTopic(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Topics (6)</option>
                  {DSA_TOPICS.map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty & Status Filter */}
              <div className="filter-group filter-row-dual">
                <div>
                  <label className="filter-label">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={e => setSelectedDifficulty(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="filter-label">Status</label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="unsolved">Unsolved</option>
                    <option value="solved">Solved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Problem List Cards */}
            <div className="dsa-problems-list" role="list" aria-label="DSA Problems List">
              <div className="list-count-badge">
                Showing {filteredProblems.length} of {totalProblems} problems
              </div>
              {filteredProblems.map(problem => {
                const isSelected = problem.id === activeProblem.id;
                const isSolved = progress.solvedProblems.includes(problem.id);
                const isAttempted = progress.attemptedProblems.includes(problem.id);

                return (
                  <div
                    key={problem.id}
                    className={`problem-item-card ${isSelected ? 'selected' : ''} ${
                      isSolved ? 'item-solved' : ''
                    }`}
                    onClick={() => setSelectedProblemId(problem.id)}
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedProblemId(problem.id);
                      }
                    }}
                  >
                    <div className="item-status-col">
                      {isSolved ? (
                        <CheckCircle2 size={16} className="text-success" />
                      ) : isAttempted ? (
                        <span className="dot-attempted" title="Attempted" />
                      ) : (
                        <span className="dot-unsolved" title="Unsolved" />
                      )}
                    </div>
                    <div className="item-meta-col">
                      <strong className="item-title">{problem.title}</strong>
                      <div className="item-tags">
                        <span className={`difficulty-badge badge-${problem.difficulty.toLowerCase()}`}>
                          {problem.difficulty}
                        </span>
                        <span className="time-badge">
                          <Clock size={11} /> {problem.estimatedMinutes}m
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="item-arrow" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Problem Detail & Live CodeLab */}
          <div className="dsa-detail-panel">
            <div className="card problem-active-header">
              <div className="problem-title-row">
                <div>
                  <span className="eyebrow">
                    {DSA_TOPICS.find(t => t.id === activeProblem.topic)?.name}
                  </span>
                  <h2>{activeProblem.title}</h2>
                </div>
                <div className="problem-badges">
                  <span
                    className={`difficulty-pill pill-${activeProblem.difficulty.toLowerCase()}`}
                  >
                    {activeProblem.difficulty}
                  </span>
                  {progress.solvedProblems.includes(activeProblem.id) && (
                    <span className="verified-badge">
                      <CheckCircle2 size={13} /> Verified Solved
                    </span>
                  )}
                </div>
              </div>

              {/* Problem Prompt */}
              <div className="problem-prompt-text">
                <p>{activeProblem.prompt}</p>
              </div>

              {/* Examples */}
              <div className="problem-examples-list">
                <h4>Examples & Walkthrough:</h4>
                {activeProblem.examples.map((ex, idx) => (
                  <div key={idx} className="example-block">
                    <div className="example-io">
                      <div>
                        <strong>Input:</strong> <code>{ex.input}</code>
                      </div>
                      <div>
                        <strong>Output:</strong> <code>{ex.output}</code>
                      </div>
                    </div>
                    {ex.explanation && (
                      <p className="example-explanation">
                        <strong>Explanation:</strong> {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="problem-constraints-box">
                <h4>Constraints:</h4>
                <ul>
                  {activeProblem.constraints.map((c, idx) => (
                    <li key={idx}>
                      <code>{c}</code>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progressive Hints Ladder */}
              <div className="hints-ladder-box">
                <div className="hints-header">
                  <span className="hints-title">
                    <Lightbulb size={14} /> Progressive Hint Ladder
                  </span>
                  {revealedHints < activeProblem.hints.length && (
                    <button
                      type="button"
                      className="button small"
                      onClick={() => setRevealedHints(h => Math.min(activeProblem.hints.length, h + 1))}
                    >
                      Reveal Hint {revealedHints + 1} of {activeProblem.hints.length}
                    </button>
                  )}
                </div>
                {revealedHints === 0 ? (
                  <p className="hint-placeholder">
                    Try solving the problem independently first. If you get stuck, reveal hints one at a time.
                  </p>
                ) : (
                  <div className="revealed-hints-stack">
                    {activeProblem.hints.slice(0, revealedHints).map((hint, idx) => (
                      <div key={idx} className="revealed-hint-card">
                        <strong>Hint {idx + 1}:</strong> {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Complexity Approaches Comparison */}
              <div className="complexity-approaches-box">
                <h4>Algorithmic Approaches & Complexity:</h4>
                <div className="approaches-grid">
                  {activeProblem.approaches.map((app, idx) => (
                    <div key={idx} className="approach-card">
                      <div className="approach-header">
                        <strong>{app.name}</strong>
                        <div className="complexity-badges">
                          <span className="badge-time">Time: {app.time}</span>
                          <span className="badge-space">Space: {app.space}</span>
                        </div>
                      </div>
                      <p>{app.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Python Interactive Editor & Test Runner */}
            <div className="card dsa-editor-card">
              <div className="editor-card-header">
                <span className="editor-file-label">
                  <code>{activeProblem.id}.py</code>
                </span>
                <span className="editor-tip">
                  Press <strong>Run & Check</strong> to evaluate against boundary cases and test suites.
                </span>
              </div>

              <CodeLab
                initial={progress.savedDrafts[activeProblem.id] || activeProblem.starterCode}
                draftId={`dsa-problem-${activeProblem.id}`}
                persist={true}
                cases={activeProblem.cases}
                label={`Solution for ${activeProblem.title}`}
                onPass={() => handlePassProblem(activeProblem.id)}
                onAttempt={() => handleAttemptProblem(activeProblem.id)}
                onCodeChange={code => handleCodeChange(activeProblem.id, code)}
              />

              {/* Reference Solution & Explanation Accordion */}
              <div className="solution-reveal-container">
                <div className="solution-reveal-header">
                  <span>Need to compare your approach with the verified optimal solution?</span>
                  <button
                    type="button"
                    className="button small"
                    onClick={() => setShowSolution(!showSolution)}
                  >
                    {showSolution ? 'Hide Reference Solution' : 'View Reference Solution'}
                  </button>
                </div>
                {showSolution && (
                  <div className="solution-reveal-content">
                    <pre>
                      <code>{activeProblem.solutionCode}</code>
                    </pre>
                    <div className="solution-explanation-text">
                      <strong>Why this works:</strong>
                      <p>{activeProblem.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALGORITHM VISUALIZERS */}
      {activeTab === 'visualizers' && (
        <div className="dsa-visualizers-tab">
          <DsaVisualizer initialType="binary-search" />
        </div>
      )}

      {/* TAB 3: STRUCTURED CONCEPT GUIDES */}
      {activeTab === 'modules' && (
        <div className="dsa-modules-grid">
          {DSA_MODULES.map(module => (
            <div key={module.id} className="card dsa-module-card">
              <div className="module-card-header">
                <span className="eyebrow">MODULE {module.moduleIndex}</span>
                <h3>{module.title}</h3>
                <p className="module-lead">{module.subtitle}</p>
              </div>

              <div className="module-story-quote">
                <strong>Real-World Engineering Context:</strong>
                <p>"{module.story}"</p>
              </div>

              <div className="module-objectives-list">
                <h4>What You Learn:</h4>
                <ul>
                  {module.objectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div className="module-concepts-stack">
                <h4>Core Concepts & Invariants:</h4>
                {module.concepts.map(([name, desc], idx) => (
                  <div key={idx} className="concept-row">
                    <strong>{name}:</strong> <span>{desc}</span>
                  </div>
                ))}
              </div>

              <div className="module-code-walkthrough">
                <h4>{module.codeWalkthrough.title}</h4>
                <pre>
                  <code>{module.codeWalkthrough.code}</code>
                </pre>
                <div className="code-output-callout">
                  <strong>Expected Output:</strong>
                  <pre>
                    <code>{module.codeWalkthrough.output}</code>
                  </pre>
                </div>
                <p className="explanation-callout">{module.codeWalkthrough.explanation}</p>
              </div>

              <div className="module-mistake-box">
                <h4>
                  <ShieldAlert size={14} /> Classic Algorithmic Mistake & Fix:
                </h4>
                <div className="mistake-comparison">
                  <div className="broken-code">
                    <span className="code-tag-bad">Buggy Approach</span>
                    <pre>
                      <code>{module.mistake.code}</code>
                    </pre>
                  </div>
                  <div className="fixed-code">
                    <span className="code-tag-good">Optimal Fix</span>
                    <pre>
                      <code>{module.mistake.fix}</code>
                    </pre>
                  </div>
                </div>
                <p className="mistake-why">{module.mistake.why}</p>
              </div>

              <div className="module-cheatsheet-box">
                <h4>
                  <Zap size={14} /> Quick Invariants Cheat Sheet:
                </h4>
                <ul>
                  {module.cheatSheet.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
