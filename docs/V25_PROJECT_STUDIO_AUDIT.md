# Python Lab V25 — Project Studio & Student Portfolio Audit

**Date:** November 2026  
**Auditor:** Principal React/TypeScript Engineer, Python Educator & QA Architect  
**Project:** Python Lab (`D:\Learn JS\python-lab`)  
**Previous Baseline:** V24, commit `10b6d09`  

---

## 1. Executive Summary

Python Lab has established strong foundational learning (16 visual chapters, 39 graded practice challenges, 30 Syntax Academy topics) and a 5-module Intermediate Python Learning Path with the Student Marks Analyzer capstone.

However, the existing **Projects** experience (`#/projects`) remains a collection of static recipe-style cards with a single code editor, manual self-reported checkboxes, and no automated behavioral verification or export options.

### Current Limitations Identified:
1. **Self-Reported Completion**: The 11 foundational projects rely entirely on `<input type="checkbox" />` labeled `"I built this project and tried the testing instructions."` with the disclaimer `"Project completion is self-reported."` No automated checks verify learner code.
2. **Monolithic Coding Surface**: Rather than guiding students through incremental milestones, projects present a single full-solution template or starter, leading complete beginners to be overwhelmed or simply reveal the final solution.
3. **No Project Portfolio**: Students cannot view their accumulated portfolio of completed applications, review their own saved code across projects, or see the practical competencies they have demonstrated.
4. **No Code Export**: There is no mechanism to export student work as `.py` script files or project `README.md` files for use on their local computer or in an external portfolio.
5. **V24 Capstone Opportunity**: While `student-marks-analyzer` has an automated assertion suite, its pipeline steps (ingestion, student summary, class analytics) are presented all at once rather than as guided milestone steps.

---

## 2. Detailed Inventory of Existing Projects

| Project ID | Title | Chapters | Complexity Level | Current State | Deficiencies / Overlaps | Proposed V25 Evolution |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| `intro` | Personal Introduction Generator | 1, 4, 8 | Beginner | 3-line print script with `.strip().title()` | Trivial; self-reported | Streamlined introductory project with automated output check & export |
| `calculator` | Simple Calculator | 4, 5, 6, 11 | Beginner-Intermediate | Arithmetic functions + operator dispatch | Self-reported; doesn't test edge cases like division by zero automatically | Upgrade to 3 milestones: Operations, Dispatcher, Error Guarding |
| `shopping` | Shopping Bill Calculator | 2, 4, 5, 6 | Beginner | 10% discount threshold calculation | Overlaps heavily with `eligibility` and `grades` on simple branching | Retain for foundational catalog; add automated verification check |
| `eligibility` | Age Eligibility Checker | 4, 5, 6 | Beginner | Single `if/elif/else` threshold | Trivial 5-line script; self-reported | Retain for foundational catalog; add automated verification check |
| `grades` | Student Grade Calculator | 4, 5, 6, 12 | Beginner | Descending scale range check | Single CodeLab; self-reported | Retain for foundational catalog; add automated verification check |
| `tables` | Multiplication Table Generator | 4, 7 | Beginner | Simple `for n in range(1, 11)` print | Self-reported; trivial loop | Retain for foundational catalog; add automated verification check |
| `guess` | Number Guessing Game | 4, 6, 7, 12 | Beginner | Bounded 3-attempt loop with random target | Output varies randomly; self-reported | Deterministic test harness + milestone structure |
| `contacts` | Contact Book | 8, 10 | Beginner | Hardcoded dictionary with `.get()` lookup | Single query; self-reported | Upgrade with CRUD dictionary operations & search normalization |
| `expenses` | Personal Expense Tracker | 7, 9, 10, 12 | Beginner | Hardcoded 2-item list accumulation | Merely sums 2 hardcoded dicts; no category grouping or reporting | **Prime Candidate for Studio Upgrade**: Full multi-category budget analyzer |
| `marks` | Student Marks Manager | 6, 7, 9, 11 | Beginner | 3-item list average & max calculation | Self-reported; overlaps with V24 capstone | Retain for foundational catalog; add automated verification check |
| `inventory-report` | Inventory Report from JSON | 13, 14 | Intermediate | JSON decoding, boolean/negative validation, sorted print | Good contract; self-reported in UI (though tested in test suite) | Upgrade to 3 milestones: Parsing, Validation, Reporting |
| `student-marks-analyzer` | Student Marks Analyzer | Modules 1–5 | Intermediate Capstone | Full CSV pipeline with 4 assertion suites | Monolithic single-editor view | Upgrade to 4 guided milestones: Ingestion, Validation, Analytics, Export |

---

## 3. Key Findings on Project Workflow & Storage

1. **Catalog Integrity Constraint**:
   - `tests/platform.test.mjs` strictly verifies:
     - Line 18: `assert.equal(projects.length, 11);`
     - Line 77: `assert.equal(catalog.projectIds.size, projects.length);`
   - Therefore, `src/data/projects.ts` MUST export an array `projects` of exactly 11 items to ensure 100% backward compatibility with platform test suites.
   - Studio project upgrades, milestone definitions, and advanced projects can be cleanly managed with extended metadata and a dedicated studio registry (`src/data/studioProjects.ts`).
2. **Draft Code Persistence**:
   - `CodeLab` components save drafts to LocalStorage under `python-lab.draft.codelab-<label>` when `persist={true}` or `draftId` is provided.
   - For V25 Project Studio, milestone drafts and project source code must persist reliably under structured keys: `python-lab.project.draft:<projectId>:<milestoneIndex>`.
3. **Project Completion Model**:
   - Foundational progress tracks `progress.projects: string[]` in `python-lab.progress.v2`.
   - V24 capstone tracks `capstoneCompleted: boolean` in `python-lab.intermediate.v1`.
   - V25 Project Studio will support:
     - `verifiedProjects: string[]` (projects where all automated milestones have passed).
     - `milestonesCompleted: Record<string, number[]>` (maps project ID to array of completed milestone indices).
     - Storage under `python-lab.project-studio.v1`, with full backward-compatibility and safe fallback to existing `progress.projects`.

---

## 4. V25 Project Studio Architecture Plan

### Consistent 7-Step Workflow for Each Project:
```
1. BRIEF   → Scenario, real-world context, learning objectives, expected output
2. PLAN    → Milestone roadmap with clear checkpoints
3. BUILD   → Interactive CodeLab editor running real Pyodide Python
4. TEST    → Multi-case automated assertion suite (preventing hardcoded string cheats)
5. DEBUG   → Actionable error diagnosis and 3-level progressive hint ladder
6. FINISH  → Real-time milestone verification tracking
7. EXPORT  → One-click download of student's verified `.py` script and `README.md`
```

### Student Portfolio Area (`#/portfolio` or embedded in Studio):
- Filter by: **All Projects**, **In Progress**, **Verified Completed**.
- Card displays: Title, difficulty, applied Python concepts, milestones passed (e.g. `3 / 3`).
- Code viewer modal / drawer to review their written solution.
- Download buttons:
  - Download Python Code (`<projectId>.py`)
  - Download Portfolio Documentation (`README.md` with project brief, requirements, and usage)

### Two Advanced Real-World Projects:
1. **Personal Expense & Budget Tracker (`expense-tracker-pro`)**:
   - Milestone 1: Expense record validation & type parsing (dates, amounts, categories).
   - Milestone 2: Category grouping and budget threshold checking.
   - Milestone 3: Analytical summary generation (total spend, top category, percentage breakdown).
2. **Smart Inventory & Stock Analyzer (`inventory-management-pro`)**:
   - Milestone 1: Stock record ingestion & schema validation.
   - Milestone 2: Quantity updates and reorder threshold alerting.
   - Milestone 3: Inventory valuation and alphabetical stock status reporting.

---

## 5. Audit Conclusion

The Project Studio represents a natural and necessary pedagogical evolution for Python Lab. By replacing passive checkboxes with milestone-driven automated verification, actionable hints, and clean client-side file downloads, students graduate from passive syntax learners to self-reliant Python creators.
