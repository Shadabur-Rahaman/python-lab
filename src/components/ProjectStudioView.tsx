import {useState, useEffect} from 'react';
import {
  FolderOpen,
  Trophy,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Terminal,
  Code2,
  ChevronRight,
  FileCode,
  Check,
  Compass,
  AlertTriangle,
  Play,
  ArrowUpRight,
  Cpu
} from 'lucide-react';
import {studioProjects, type StudioProject, type ProjectMilestone, generateProjectReadme} from '../data/projectStudioData';
import {projects as foundationalProjects} from '../data/projects';
import {
  loadProjectStudioProgress,
  saveProjectStudioProgress,
  exportFile,
  type ProjectStudioProgress
} from '../lib/projectStudioProgress';
import CodeLab from './CodeLab';

type Props = {
  selectedProjectId?: string;
  onSelectProject?: (projectId: string) => void;
};

export default function ProjectStudioView({selectedProjectId, onSelectProject}: Props) {
  const [activeTab, setActiveTab] = useState<'catalog' | 'portfolio'>('catalog');
  const [currentProject, setCurrentProject] = useState<StudioProject | null>(() => {
    if (selectedProjectId) {
      return studioProjects.find(p => p.id === selectedProjectId) || null;
    }
    return null;
  });

  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
  const [progress, setProgress] = useState<ProjectStudioProgress>(() => loadProjectStudioProgress());
  const [hintCount, setHintCount] = useState(0);
  const [milestoneFeedback, setMilestoneFeedback] = useState<string>('');
  const [copiedDraft, setCopiedDraft] = useState(false);

  useEffect(() => {
    if (selectedProjectId) {
      const match = studioProjects.find(p => p.id === selectedProjectId);
      if (match) {
        setCurrentProject(match);
        setActiveMilestoneIndex(0);
        setHintCount(0);
        setMilestoneFeedback('');
      }
    }
  }, [selectedProjectId]);

  function updateProgress(updater: (prev: ProjectStudioProgress) => ProjectStudioProgress) {
    setProgress(prev => {
      const next = updater(prev);
      saveProjectStudioProgress(next);
      return next;
    });
  }

  function handleMilestonePass(projectId: string, mIdx: number, codeUsed?: string) {
    setMilestoneFeedback('✓ Milestone passed! All automated assertions succeeded.');
    updateProgress(prev => {
      const currentList = prev.milestoneProgress[projectId] || [];
      const updatedList = [...new Set([...currentList, mIdx])];
      const project = studioProjects.find(p => p.id === projectId);
      const isAllDone = project && updatedList.length >= project.milestones.length;

      return {
        ...prev,
        milestoneProgress: {
          ...prev.milestoneProgress,
          [projectId]: updatedList,
        },
        verifiedProjects: isAllDone
          ? [...new Set([...prev.verifiedProjects, projectId])]
          : prev.verifiedProjects,
        savedCode: codeUsed
          ? {...prev.savedCode, [projectId]: codeUsed}
          : prev.savedCode,
      };
    });
  }

  function handleSelectProject(project: StudioProject) {
    setCurrentProject(project);
    setActiveMilestoneIndex(0);
    setHintCount(0);
    setMilestoneFeedback('');
    location.hash = `#/projects/${project.id}`;
  }

  const completedCount = progress.verifiedProjects.length;
  const inProgressCount = Object.keys(progress.milestoneProgress).filter(
    id => !progress.verifiedProjects.includes(id) && (progress.milestoneProgress[id]?.length || 0) > 0
  ).length;

  return (
    <div className="project-studio-workspace">
      {/* Journey Banner: Foundations -> Intermediate -> Real-World Projects -> Data Science */}
      <nav className="card intermediate-journey-banner" aria-label="Learning Progression">
        <div className="journey-nodes">
          <a href="#/chapters" className="journey-node completed-node">
            <span className="node-icon"><Check size={14} /></span>
            <div className="node-text">
              <small>STAGE 1</small>
              <strong>Python Foundations</strong>
              <span>16 Visual Chapters</span>
            </div>
          </a>

          <div className="journey-arrow">→</div>

          <a href="#/intermediate" className="journey-node completed-node">
            <span className="node-icon"><Compass size={14} /></span>
            <div className="node-text">
              <small>STAGE 2</small>
              <strong>Intermediate Python</strong>
              <span>5 Core Modules</span>
            </div>
          </a>

          <div className="journey-arrow">→</div>

          <div className="journey-node active-node" aria-current="step">
            <span className="node-icon active-pulse"><FolderOpen size={16} /></span>
            <div className="node-text">
              <small>STAGE 3 · YOU ARE HERE</small>
              <strong>Real-World Projects</strong>
              <span>Project Studio & Portfolio</span>
            </div>
          </div>

          <div className="journey-arrow">→</div>

          <a href="https://shadabur-rahaman.github.io/ds-lab/roadmap" target="_blank" rel="noreferrer" className="journey-node future-node ecosystem-node">
            <span className="node-icon"><Cpu size={14} /></span>
            <div className="node-text">
              <small>STAGE 4 · ECOSYSTEM</small>
              <strong>DS LAB</strong>
              <span>NumPy, Pandas & ML ↗</span>
            </div>
          </a>
        </div>
      </nav>

      {/* Main Studio Navigation Tabs */}
      <div className="studio-top-tabs">
        <button
          className={`section-tab ${activeTab === 'catalog' && !currentProject ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('catalog');
            setCurrentProject(null);
            location.hash = '#/projects';
          }}
        >
          <FolderOpen size={15} /> All Studio Projects
        </button>
        <button
          className={`section-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('portfolio');
            setCurrentProject(null);
          }}
        >
          <Trophy size={15} /> Student Project Portfolio ({completedCount} Verified)
        </button>
      </div>

      {/* VIEW 1: Individual Project Workspace */}
      {currentProject ? (
        <div className="project-detail-workspace">
          {/* Header Bar */}
          <div className="card project-view-header">
            <div>
              <button
                className="text-link intermediate-back-link"
                onClick={() => {
                  setCurrentProject(null);
                  location.hash = '#/projects';
                }}
              >
                <ArrowLeft size={15} /> Back to Studio Catalog
              </button>
              <div className="project-title-meta">
                <span className="eyebrow">
                  {currentProject.difficulty.toUpperCase()} · {currentProject.estimatedMinutes} MINUTES
                </span>
                <h2>{currentProject.title}</h2>
              </div>
            </div>

            <div className="project-header-actions">
              <button
                className="button small"
                onClick={() => {
                  const saved = progress.savedCode[currentProject.id] || currentProject.finalSolution;
                  exportFile(`${currentProject.id}.py`, saved);
                }}
                title="Download Python script"
              >
                <Download size={14} /> Export .py
              </button>
              <button
                className="button small"
                onClick={() => {
                  const saved = progress.savedCode[currentProject.id] || currentProject.finalSolution;
                  const readme = generateProjectReadme(currentProject, saved);
                  exportFile(`README-${currentProject.id}.md`, readme, 'text/markdown');
                }}
                title="Download project documentation"
              >
                <BookOpen size={14} /> Export README
              </button>
            </div>
          </div>

          {/* Project Brief Card */}
          <div className="card project-brief-card">
            <div className="section-heading">
              <h3><BookOpen size={18} /> Project Brief & Architecture</h3>
              <span className={`pill small ${progress.verifiedProjects.includes(currentProject.id) ? 'easy' : ''}`}>
                {progress.verifiedProjects.includes(currentProject.id) ? '✓ Verified Complete' : 'In Progress'}
              </span>
            </div>
            <p className="brief-scenario">{currentProject.brief.scenario}</p>

            <div className="two-columns brief-details-grid">
              <div className="brief-col">
                <strong>What you will build:</strong>
                <p>{currentProject.brief.whatYouWillBuild}</p>
                <strong>Key Competencies:</strong>
                <ul className="competency-list">
                  {currentProject.brief.requiredKnowledge.map((k, idx) => (
                    <li key={idx}><Check size={13} /> {k}</li>
                  ))}
                </ul>
              </div>

              <div className="brief-col">
                <strong>Expected Final Behavior:</strong>
                <p>{currentProject.brief.expectedOutcome}</p>
                <strong>Sample Output Preview:</strong>
                <pre className="output-preview-block">{currentProject.brief.sampleInputOutput.output}</pre>
              </div>
            </div>
          </div>

          {/* Milestone Step Selector */}
          <div className="card milestone-flow-card">
            <div className="section-heading">
              <div>
                <span className="eyebrow">STEP-BY-STEP IMPLEMENTATION ROADMAP</span>
                <h3>Project Milestones</h3>
              </div>
              <small>
                {(progress.milestoneProgress[currentProject.id] || []).length} of {currentProject.milestones.length} milestones verified
              </small>
            </div>

            <div className="milestones-selector" role="tablist">
              {currentProject.milestones.map((m, idx) => {
                const isSelected = activeMilestoneIndex === idx;
                const isVerified = (progress.milestoneProgress[currentProject.id] || []).includes(m.index);

                return (
                  <button
                    key={m.index}
                    role="tab"
                    aria-selected={isSelected}
                    className={`milestone-pill ${isSelected ? 'active' : ''} ${isVerified ? 'verified' : ''}`}
                    onClick={() => {
                      setActiveMilestoneIndex(idx);
                      setHintCount(0);
                      setMilestoneFeedback('');
                    }}
                  >
                    <span className="milestone-badge">
                      {isVerified ? <Check size={13} /> : idx + 1}
                    </span>
                    <div className="milestone-text">
                      <strong>Milestone {idx + 1}</strong>
                      <span>{m.title.replace(/^Milestone \d+:\s*/, '')}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Milestone Workspace */}
          {(() => {
            const currentM = currentProject.milestones[activeMilestoneIndex] || currentProject.milestones[0];
            const isMilestoneDone = (progress.milestoneProgress[currentProject.id] || []).includes(currentM.index);

            return (
              <div className="milestone-workspace-pane">
                {/* Milestone Objective & Instructions */}
                <div className="card milestone-details-card">
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">MILESTONE {currentM.index} OF {currentProject.milestones.length}</span>
                      <h3>{currentM.title}</h3>
                    </div>
                    <span className={`pill small ${isMilestoneDone ? 'easy' : ''}`}>
                      {isMilestoneDone ? '✓ Verified' : 'In Progress'}
                    </span>
                  </div>

                  <p className="milestone-instructions">{currentM.instructions}</p>

                  <div className="milestone-tests-list">
                    <strong>Automated Checks in this Milestone:</strong>
                    <ul>
                      {currentM.testCasesDescription.map((desc, dIdx) => (
                        <li key={dIdx} className={isMilestoneDone ? 'verified-check' : ''}>
                          <CheckCircle2 size={14} /> {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CodeLab Editor */}
                <div className="card milestone-editor-card">
                  <div className="section-heading">
                    <h4><Terminal size={16} /> Python Code Editor</h4>
                    <small>Write code and click Check Answer to verify with the automated assertion suite</small>
                  </div>

                  <CodeLab
                    key={`${currentProject.id}-m${currentM.index}`}
                    initial={currentM.starter}
                    tests={currentM.testSuite}
                    label={`${currentProject.id}_m${currentM.index}.py`}
                    draftId={`project-draft-${currentProject.id}-${currentM.index}`}
                    persist
                    onPass={() => handleMilestonePass(currentProject.id, currentM.index)}
                  />

                  {milestoneFeedback && (
                    <div className="feedback-banner success" style={{marginTop: 12}}>
                      <CheckCircle2 size={16} />
                      <div>{milestoneFeedback}</div>
                    </div>
                  )}

                  {/* Progressive Hint Ladder */}
                  <div className="hint-area" style={{marginTop: 16}}>
                    <button
                      type="button"
                      className="button small"
                      disabled={hintCount >= currentM.hints.length}
                      onClick={() => setHintCount(hintCount + 1)}
                    >
                      <Lightbulb size={14} />
                      {hintCount >= currentM.hints.length
                        ? 'All hints revealed'
                        : `Reveal Hint ${hintCount + 1} of ${currentM.hints.length}`}
                    </button>

                    {hintCount >= 1 && <p className="hint-text"><strong>Hint 1:</strong> {currentM.hints[0]}</p>}
                    {hintCount >= 2 && <p className="hint-text"><strong>Hint 2:</strong> {currentM.hints[1]}</p>}
                    {hintCount >= 3 && <p className="hint-text"><strong>Hint 3:</strong> {currentM.hints[2]}</p>}
                  </div>

                  {/* Post-Milestone Explanation */}
                  <div className="milestone-explanation-box">
                    <strong>Architectural Note:</strong>
                    <p>{currentM.explanation}</p>
                    {currentM.hinglishTip && (
                      <small className="hinglish-tip">💡 Hint: {currentM.hinglishTip}</small>
                    )}
                  </div>
                </div>

                {/* Next Milestone Navigation */}
                <div className="milestone-footer-nav">
                  {activeMilestoneIndex > 0 ? (
                    <button
                      className="button"
                      onClick={() => setActiveMilestoneIndex(activeMilestoneIndex - 1)}
                    >
                      <ArrowLeft size={15} /> Previous Milestone
                    </button>
                  ) : <div />}

                  {activeMilestoneIndex < currentProject.milestones.length - 1 ? (
                    <button
                      className="button primary"
                      onClick={() => setActiveMilestoneIndex(activeMilestoneIndex + 1)}
                    >
                      Next Milestone <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      className="button primary"
                      onClick={() => setActiveTab('portfolio')}
                    >
                      View in Project Portfolio <Trophy size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      ) : activeTab === 'portfolio' ? (
        /* VIEW 2: Student Project Portfolio */
        <div className="student-portfolio-view">
          <div className="card portfolio-hero-card">
            <div className="portfolio-hero-text">
              <span className="eyebrow"><Trophy size={15} /> STUDENT PORTFOLIO</span>
              <h2>Your Demonstrated Python Projects</h2>
              <p>
                Every milestone you complete is tracked and preserved. Export your working code to your computer, push it to your GitHub portfolio, or review your architecture anytime.
              </p>
            </div>

            <div className="portfolio-metrics-grid">
              <div className="metric-box">
                <span className="metric-val">{completedCount}</span>
                <span className="metric-lbl">Verified Completed</span>
              </div>
              <div className="metric-box">
                <span className="metric-val">{inProgressCount}</span>
                <span className="metric-lbl">In Progress</span>
              </div>
              <div className="metric-box highlight">
                <span className="metric-val">
                  {Object.values(progress.milestoneProgress).reduce((acc, m) => acc + m.length, 0)}
                </span>
                <span className="metric-lbl">Milestones Solved</span>
              </div>
            </div>
          </div>

          {/* Portfolio Projects Grid */}
          <div className="portfolio-projects-grid">
            {studioProjects.map(p => {
              const milestonesDone = progress.milestoneProgress[p.id]?.length || 0;
              const isDone = progress.verifiedProjects.includes(p.id) || milestonesDone >= p.milestones.length;
              const savedCode = progress.savedCode[p.id] || p.finalSolution;

              return (
                <div key={p.id} className={`card portfolio-project-card ${isDone ? 'verified' : ''}`}>
                  <div className="portfolio-card-header">
                    <span className="eyebrow">{p.category}</span>
                    <span className={`pill small ${isDone ? 'easy' : milestonesDone > 0 ? 'medium' : ''}`}>
                      {isDone ? '✓ Verified' : milestonesDone > 0 ? `${milestonesDone}/${p.milestones.length} Milestones` : 'Not Started'}
                    </span>
                  </div>

                  <h3>{p.title}</h3>
                  <p className="portfolio-card-desc">{p.brief.whatYouWillBuild}</p>

                  <div className="portfolio-tags">
                    {p.brief.requiredKnowledge.slice(0, 3).map((k, idx) => (
                      <span key={idx} className="concept-tag">{k}</span>
                    ))}
                  </div>

                  <div className="portfolio-card-actions">
                    <button
                      className="button primary small"
                      onClick={() => handleSelectProject(p)}
                    >
                      {isDone ? 'Review Code' : milestonesDone > 0 ? 'Continue Project' : 'Start Project'} <ArrowRight size={13} />
                    </button>

                    <button
                      className="button small"
                      onClick={() => exportFile(`${p.id}.py`, savedCode)}
                      title="Download Python source"
                    >
                      <Download size={13} /> .py
                    </button>

                    <button
                      className="button small"
                      onClick={() => exportFile(`README-${p.id}.md`, generateProjectReadme(p, savedCode), 'text/markdown')}
                      title="Download documentation"
                    >
                      <BookOpen size={13} /> README
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Student Marks Analyzer Portfolio Card */}
            <div className="card portfolio-project-card">
              <div className="portfolio-card-header">
                <span className="eyebrow">CAPSTONE · CSV & STATISTICS</span>
                <span className="pill small easy">✓ Available</span>
              </div>
              <h3>Student Marks Analyzer</h3>
              <p className="portfolio-card-desc">
                Production CSV gradebook pipeline parsing real tabular records, handling missing marks, and building honors reports.
              </p>
              <div className="portfolio-tags">
                <span className="concept-tag">csv.DictReader</span>
                <span className="concept-tag">io.StringIO</span>
                <span className="concept-tag">statistics.mean</span>
              </div>
              <div className="portfolio-card-actions">
                <a href="#/projects/student-marks-analyzer" className="button primary small">
                  Open Capstone Studio <ArrowRight size={13} />
                </a>
              </div>
            </div>

            {/* Next Destination Bridge: Continue to DS LAB */}
            <div className="card ds-lab-bridge-card" style={{gridColumn: '1 / -1'}}>
              <div className="ds-bridge-badge">CONTINUE YOUR LEARNING JOURNEY</div>
              <div className="ds-bridge-body">
                <div className="ds-bridge-icon">
                  <span>DS</span>
                </div>
                <div className="ds-bridge-copy">
                  <h3>Ready for Data Science? Continue to DS LAB</h3>
                  <p>You have mastered Python programming fundamentals and built real-world software applications. Take the next natural step into Data Science with statistics, SQL, interactive NumPy tables, Pandas DataFrames, and Machine Learning.</p>
                  <div className="ds-bridge-tags">
                    <span>NumPy Arrays</span>
                    <span>Pandas Data Cleaning</span>
                    <span>Retail Sales Analysis</span>
                    <span>Iris Classification</span>
                  </div>
                </div>
                <a href="https://shadabur-rahaman.github.io/ds-lab/roadmap" target="_blank" rel="noreferrer" className="button primary ds-bridge-action">
                  Explore DS LAB <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW 3: Studio Project Catalog */
        <div className="studio-catalog-view">
          <div className="card catalog-hero-card">
            <div className="section-heading">
              <div>
                <span className="eyebrow"><Sparkles size={14} /> REAL-WORLD SOFTWARE ENGINEERING</span>
                <h2>Guided Project Studio</h2>
              </div>
              <span className="pill highlight-pill">Milestone-Based Execution</span>
            </div>
            <p>
              Move from passive code reading to active software design. Each Studio project provides an authentic problem brief, incremental milestones with automated checks, and instant file export for your developer portfolio.
            </p>
          </div>

          <div className="studio-projects-grid">
            {/* Flagship Studio Projects */}
            {studioProjects.map(p => {
              const milestonesDone = progress.milestoneProgress[p.id]?.length || 0;
              const isDone = progress.verifiedProjects.includes(p.id);

              return (
                <div key={p.id} className="card studio-project-card">
                  <div className="project-card-top">
                    <span className="eyebrow">{p.category}</span>
                    <span className={`pill small ${isDone ? 'easy' : ''}`}>
                      {isDone ? '✓ Verified' : `${p.milestones.length} Milestones`}
                    </span>
                  </div>

                  <h3>{p.title}</h3>
                  <p>{p.brief.scenario}</p>

                  <div className="project-card-footer">
                    <small>Prerequisites: Ch {p.chapters.join(', ')}</small>
                    <button
                      className="button primary"
                      onClick={() => handleSelectProject(p)}
                    >
                      {isDone ? 'Review Project' : milestonesDone > 0 ? 'Continue' : 'Build Project'} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* V24 Capstone Project */}
            <div className="card studio-project-card capstone-highlight-card">
              <div className="project-card-top">
                <span className="eyebrow">INTERMEDIATE CAPSTONE</span>
                <span className="pill small easy">4 Milestones</span>
              </div>
              <h3>Student Marks Analyzer</h3>
              <p>
                Parse messy CSV gradebook records, clean optional scores defensively, calculate student totals and averages, and build an automated honor roll report.
              </p>
              <div className="project-card-footer">
                <small>Prerequisites: Intermediate Modules 1–5</small>
                <a href="#/projects/student-marks-analyzer" className="button primary">
                  Build Capstone <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Foundational Projects Section */}
          <div className="foundational-projects-section">
            <div className="section-heading">
              <h3>Foundational Guided Projects (Chapters 1–14)</h3>
              <small>Original 11 foundational projects</small>
            </div>

            <div className="foundational-projects-grid">
              {foundationalProjects.map((p, idx) => (
                <a key={p.id} href={`#/projects/${p.id}`} className="card foundational-project-pill">
                  <div className="pill-header">
                    <span className="pill-index">#{String(idx + 1).padStart(2, '0')}</span>
                    <small>Ch {p.chapters.join(', ')}</small>
                  </div>
                  <strong>{p.title}</strong>
                  <p>{p.use}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
