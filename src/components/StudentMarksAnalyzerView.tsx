import {useState} from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Copy,
  Database,
  FileSpreadsheet,
  Sparkles,
  Terminal,
  Trophy,
  AlertTriangle,
  Layers,
  Download,
  BookOpen,
  Code2,
  ArrowUpRight
} from 'lucide-react';
import CodeLab from './CodeLab';
import {studentMarksAnalyzerProject} from '../data/intermediatePath';
import {loadIntermediateProgress, saveIntermediateProgress} from '../lib/intermediateProgress';
import {exportFile} from '../lib/projectStudioProgress';

const SAMPLE_CSV_PREVIEW = `student_id,name,math,science,english
S01,Ayaan Khan,85,90,88
S02,Sara Ahmed,92,95,90
S03,Rohan Verma,78,,84
S04,Priya Sharma,65,70,72
S05,Kabir Sen,88,82,85`;

const CAPSTONE_TESTS_CODE = `
# Automated Project Test Suite
import io, csv, statistics

# 1. Test parse_marks
test_records = parse_marks(sample_csv)
assert len(test_records) == 5, f"Expected 5 students, got {len(test_records)}"
assert test_records[0]['name'] == 'Ayaan Khan', "First student name should be 'Ayaan Khan'"
assert test_records[2]['scores']['science'] is None, "Rohan Verma's missing science score must be None"
assert test_records[1]['scores']['math'] == 92.0, "Sara Ahmed math score should be float 92.0"

# 2. Test calculate_student_summary
rohan_summary = calculate_student_summary(test_records[2])
assert rohan_summary['total'] == 162.0, f"Rohan total expected 162.0, got {rohan_summary['total']}"
assert rohan_summary['average'] == 81.0, f"Rohan average expected 81.0, got {rohan_summary['average']}"
assert rohan_summary['passed'] is True, "Rohan should have passed"

sara_summary = calculate_student_summary(test_records[1])
assert sara_summary['average'] == 92.33, f"Sara average expected 92.33, got {sara_summary['average']}"
assert sara_summary['passed'] is True, "Sara should pass"

priya_summary = calculate_student_summary(test_records[3])
assert priya_summary['passed'] is True, "Priya should pass (all >= 40, avg >= 50)"

# 3. Test analyze_class
report = analyze_class(test_records)
assert report['class_average'] == 83.00, f"Class average expected 83.00, got {report['class_average']}"
assert report['top_student'] == 'Sara Ahmed', f"Top student expected 'Sara Ahmed', got {report['top_student']}"
assert report['honors'] == ['Ayaan Khan', 'Sara Ahmed', 'Kabir Sen'], f"Honors expected Ayaan, Sara, Kabir; got {report['honors']}"

# 4. Test empty dataset boundary
empty_report = analyze_class([])
assert empty_report['class_average'] == 0.0, "Empty dataset should return 0.0 class average"
assert empty_report['top_student'] is None, "Empty dataset top student should be None"
assert empty_report['honors'] == [], "Empty dataset honors should be empty list"

print("All capstone assertion suites passed successfully!")
`;

const MILESTONES_DATA = [
  {
    step: 1,
    title: 'Milestone 1: Robust CSV Ingestion',
    target: 'parse_marks(csv_text)',
    desc: 'Parse tabular lines into structured dictionaries with cleaned whitespace and typed float scores.',
  },
  {
    step: 2,
    title: 'Milestone 2: Missing Value Handling & Summaries',
    target: 'calculate_student_summary(student)',
    desc: 'Compute totals and averages safely when subjects are absent without raising ValueError.',
  },
  {
    step: 3,
    title: 'Milestone 3: Class Aggregation & Honors',
    target: 'analyze_class(students_data)',
    desc: 'Aggregate whole-class mean, find top student with max(), and filter students with >= 85% average.',
  },
  {
    step: 4,
    title: 'Milestone 4: Defensive Boundary Assertions',
    target: 'Automated Test Verification',
    desc: 'Verify that empty CSV files, zero counts, and unexpected spaces produce predictable results.',
  },
];

export default function StudentMarksAnalyzerView() {
  const [progress, setProgress] = useState(() => loadIntermediateProgress());
  const [copied, setCopied] = useState(false);
  const [verifiedViaRunner, setVerifiedViaRunner] = useState(false);
  const [activeMilestoneTab, setActiveMilestoneTab] = useState(0);

  function toggleCompleted(checked: boolean) {
    const updated = {
      ...progress,
      capstoneCompleted: checked,
    };
    saveIntermediateProgress(updated);
    setProgress(updated);
  }

  function handlePass() {
    setVerifiedViaRunner(true);
    if (!progress.capstoneCompleted) {
      toggleCompleted(true);
    }
  }

  function copyCsv() {
    navigator.clipboard?.writeText(SAMPLE_CSV_PREVIEW).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadPythonScript() {
    exportFile('student_marks_analyzer.py', studentMarksAnalyzerProject.solution);
  }

  function downloadDocumentation() {
    const readmeContent = `# Student Marks Analyzer

A production-grade Python data processing pipeline parsing gradebook CSV records, computing student statistics, and building honor roll reports.

## Architecture
1. **parse_marks(csv_text)**: Ingests CSV using \`csv.DictReader\` and \`io.StringIO\`.
2. **calculate_student_summary(student)**: Computes student total, average, and pass criteria.
3. **analyze_class(students_data)**: Computes class average, top student, and honors list.

## Test Verification
Run with Python 3:
\`\`\`bash
python student_marks_analyzer.py
\`\`\`
`;
    exportFile('README.md', readmeContent, 'text/markdown');
  }

  return (
    <div className="capstone-workspace">
      {/* Navigation & Header */}
      <div className="capstone-header card">
        <a href="#/intermediate" className="text-link intermediate-back-link">
          <ArrowLeft size={16} /> Back to Intermediate Modules
        </a>
        <div className="capstone-hero">
          <span className="eyebrow"><Trophy size={15} /> CAPSTONE PROJECT · INTERMEDIATE PYTHON</span>
          <h1>{studentMarksAnalyzerProject.title}</h1>
          <p className="lead-text">
            Build a complete data analysis pipeline from scratch. Process messy CSV records, clean whitespace, validate optional scores, calculate student analytics with standard statistics, and verify results with automated Python assertions.
          </p>
        </div>

        {/* Milestone Badge & Export Actions */}
        <div className="capstone-status-bar">
          <div className="status-indicator">
            <span className={`pill large ${progress.capstoneCompleted ? 'easy' : ''}`}>
              {progress.capstoneCompleted ? '✓ Capstone Completed' : 'In Progress'}
            </span>
            {verifiedViaRunner && (
              <span className="pill small success-pill">
                <CheckCircle2 size={13} /> Automated Tests Passed
              </span>
            )}
          </div>
          <div className="capstone-export-buttons">
            <button className="button small" onClick={downloadPythonScript} title="Download verified Python script">
              <Download size={14} /> Export .py
            </button>
            <button className="button small" onClick={downloadDocumentation} title="Download project README">
              <BookOpen size={14} /> Export README
            </button>
          </div>
        </div>
      </div>

      {/* Conceptual Pipeline Architecture */}
      <div className="card pipeline-architecture-card">
        <div className="section-heading">
          <h2><Layers size={18} /> Complete Processing Pipeline</h2>
          <small>Modules 1–5 in action</small>
        </div>
        <div className="pipeline-flow">
          <div className="flow-step">
            <span className="step-num">Step 1</span>
            <strong>CSV Ingestion</strong>
            <p><code>csv.DictReader</code> with <code>io.StringIO</code> cleans raw tabular lines into dictionary records.</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-num">Step 2</span>
            <strong>Data Cleaning</strong>
            <p>Strip whitespace and convert valid marks to <code>float</code>, gracefully mapping missing entries to <code>None</code>.</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-num">Step 3</span>
            <strong>Metrics Computation</strong>
            <p>Use <code>statistics.mean</code> and list comprehensions to compute student totals, averages, and pass/fail thresholds.</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-num">Step 4</span>
            <strong>Class Analytics</strong>
            <p>Identify the top performer via <code>max()</code> and build the honor roll for students with 85%+ average.</p>
          </div>
        </div>
      </div>

      {/* Guided Milestones Navigation Tabs */}
      <div className="card milestone-roadmap-card">
        <div className="section-heading">
          <h2><Sparkles size={18} /> Guided Implementation Milestones</h2>
          <small>Break down the pipeline into 4 manageable stages</small>
        </div>
        <div className="milestones-nav-tabs" role="tablist">
          {MILESTONES_DATA.map((m, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={activeMilestoneTab === idx}
              className={`milestone-nav-tab ${activeMilestoneTab === idx ? 'active' : ''}`}
              onClick={() => setActiveMilestoneTab(idx)}
            >
              <span className="tab-step-badge">{m.step}</span>
              <div className="tab-step-text">
                <strong>{m.title}</strong>
                <code>{m.target}</code>
              </div>
            </button>
          ))}
        </div>
        <div className="milestone-tab-detail">
          <p><strong>Stage Objective:</strong> {MILESTONES_DATA[activeMilestoneTab].desc}</p>
        </div>
      </div>

      {/* Project Brief & Sample Data */}
      <div className="two-columns capstone-details-grid">
        <div className="card">
          <h2><FileSpreadsheet size={18} /> Sample Gradebook CSV</h2>
          <p>This is the test dataset your code will parse. Notice student S03 (Rohan Verma) has an empty science field:</p>
          <div className="code-header-bar">
            <span>gradebook.csv</span>
            <button className="button small text-button" onClick={copyCsv}>
              <Copy size={13} /> {copied ? 'Copied!' : 'Copy CSV'}
            </button>
          </div>
          <pre className="code-preview-block">{SAMPLE_CSV_PREVIEW}</pre>

          <h3>Expected Console Summary</h3>
          <pre className="output-preview-block">{studentMarksAnalyzerProject.output}</pre>
        </div>

        <div className="card">
          <h2><Database size={18} /> Core Functional Requirements</h2>
          <ul className="requirements-list">
            {studentMarksAnalyzerProject.requirements.map((req, idx) => (
              <li key={idx}>
                <span className="check-bullet">✓</span>
                <div>{req}</div>
              </li>
            ))}
          </ul>

          <div className="tip-box">
            <AlertTriangle size={17} className="tip-icon" />
            <div>
              <strong>Defensive Parsing Warning:</strong>
              <p>{studentMarksAnalyzerProject.mistake}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive CodeLab Workspace */}
      <div className="card capstone-editor-card">
        <div className="section-heading">
          <h2><Terminal size={18} /> Capstone Programming Workspace</h2>
          <small>Run to test your code; click Check Answer to verify with the automated assertion suite</small>
        </div>
        <p className="subtext">
          Write your solution below. When ready, click <strong>Check Answer</strong> to execute all four test suites against your functions.
        </p>

        <CodeLab
          initial={studentMarksAnalyzerProject.starter}
          tests={CAPSTONE_TESTS_CODE}
          label="student_marks_analyzer.py"
          draftId="capstone-student-marks-analyzer"
          persist
          onPass={handlePass}
        />
      </div>

      {/* Test Case Checklist */}
      <div className="card capstone-tests-card">
        <h2>Automated Test Assertions</h2>
        <p>The verification suite automatically tests edge cases to ensure your functions are resilient:</p>
        <ul className="tests-checklist">
          {studentMarksAnalyzerProject.tests.map((testDesc, idx) => (
            <li key={idx} className={verifiedViaRunner ? 'verified' : ''}>
              <CheckCircle2 size={16} />
              <span>{testDesc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Collapsible Reference Solution */}
      <details className="card solution-reveal-card">
        <summary className="solution-summary">
          <strong>Reveal Reference Solution & Architecture</strong>
          <small>Try writing the functions yourself before inspecting the reference solution.</small>
        </summary>
        <div className="solution-content">
          <p>Notice the clean separation of concerns: ingestion, single-student transformation, and whole-class aggregation.</p>
          <CodeLab
            initial={studentMarksAnalyzerProject.solution}
            label="solution.py"
            draftId="capstone-solution-reference"
          />
        </div>
      </details>

      {/* Extensions & Self-Certification */}
      <div className="card completion-card">
        <h2>Ready for the Next Level?</h2>
        <p>Try these real-world improvements on your local machine or in this editor:</p>
        <ul>
          {studentMarksAnalyzerProject.improvements.map((imp, idx) => (
            <li key={idx}>{imp}</li>
          ))}
        </ul>

        <div className="completion-checkbox-wrapper">
          <label className="project-check">
            <input
              type="checkbox"
              checked={progress.capstoneCompleted}
              onChange={e => toggleCompleted(e.target.checked)}
            />
            <span>
              <strong>I built and verified the Student Marks Analyzer capstone project.</strong>
              <small>Mark this capstone complete to record your Intermediate Python mastery.</small>
            </span>
          </label>
        </div>

        {/* Transition to Data Science Lab */}
        <div className="card ds-lab-bridge-card" style={{marginTop: '20px'}}>
          <div className="ds-bridge-badge">RECOMMENDED NEXT DESTINATION</div>
          <div className="ds-bridge-body">
            <div className="ds-bridge-icon">
              <span>DS</span>
            </div>
            <div className="ds-bridge-copy">
              <h3>Transition from CSV Ingestion to Pandas in DS LAB</h3>
              <p>You built an in-memory CSV parser and aggregator in pure Python. In <strong>DS LAB</strong>, discover how industry standard <code>pandas</code> and <code>numpy</code> clean, reshape, and analyze structured datasets with high performance.</p>
              <div className="ds-bridge-tags">
                <span>Pandas Data Cleaning</span>
                <span>Retail Sales Capstone</span>
                <span>Data Visualization Lab</span>
              </div>
            </div>
            <a href="https://shadabur-rahaman.github.io/ds-lab/#/courses" target="_blank" rel="noreferrer" className="button primary ds-bridge-action">
              Open DS LAB <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
