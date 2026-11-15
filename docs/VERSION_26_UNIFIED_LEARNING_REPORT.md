# Python Lab Version 26 — Unified Python & Data Science Learning Journey Release Report

**Project:** Python Lab  
**Repository:** https://github.com/Shadabur-Rahaman/python-lab  
**Live Site:** https://shadabur-rahaman.github.io/python-lab/  
**Partner Platform:** DS LAB (https://shadabur-rahaman.github.io/ds-lab/)  
**Release Version:** Version 26 (V26)  
**Previous Reported Release:** V25, commit `648bdf05f6ab2ea71ca7b4d65c45e8823fccae52`  
**Date:** November 2026  

---

## 1. Executive Summary & Educational Mission

Version 26 establishes a seamless, unified learning journey connecting **Python Lab** and **DS LAB** into a cohesive educational ecosystem:

$$\textbf{Python Lab (Programming Foundation)} \longrightarrow \textbf{DS LAB (Data Science, SQL \& Machine Learning)}$$

### Core Guiding Principle
> **Python Lab teaches programming. DS LAB teaches Data Science.**

Rather than merging git repositories, duplicating content, or disrupting independently optimized Pyodide runtime engines, Version 26 constructs an intentional, bidirectional bridge between both platforms:
1. **Preserved Independent Architecture**: Python Lab and DS LAB maintain independent repositories, build systems (Vite + TypeScript), local storage namespaces, and GitHub Pages deployment workflows.
2. **Clear Course Prerequisites**: DS LAB positions Python Lab as its explicit "Stage 0: Programming Foundation" prerequisite across its Roadmap and foundational lessons. Python Lab positions DS LAB as the natural advanced destination following Intermediate Python and Real-World Project Studio milestones.
3. **Bidirectional Navigation Bridges**: Students can transition effortlessly across platforms from the sidebar ecosystem card, topbar pill, course catalog banner, intermediate journey track, student portfolio view, and capstone completion triggers.
4. **Zero Layout Regressions**: Mobile responsive viewports at 360px and 390px were rigorously protected with zero horizontal overflow (`scrollWidth <= clientWidth`), resolving tight topbar constraints on mobile devices.
5. **100% Verified Release Evidence**:
   - **Python Lab Unit Tests**: 58/58 passed (100%), 0 failed, 0 skipped.
   - **Python Lab Browser Tests**: 102/102 passed across 20 spec files (100%), 0 failed, 0 skipped.
   - **DS LAB E2E Tests**: 71 passed, 3 skipped, 0 failed.
   - **Mathematical Consistency**: 102 discovered = 102 sum of per-file rows = 102 passed.

---

## 2. Cross-Platform Architectural Bridge

### Curriculum Progression Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PYTHON LAB ECOSYSTEM                            │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Foundations (Chapters 0-15)                                         │
│    Syntax, control flow, functions, data structures, files, OOP       │
│                               ▼                                        │
│ 2. Intermediate Python Path (5 Modules + Capstone)                     │
│    Comprehensions, iterators, generators, decorators, dataclasses      │
│                               ▼                                        │
│ 3. Real-World Project Studio & Portfolio                               │
│    Expense Tracker Pro, Inventory Analyzer, Student Marks Analyzer     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                       Seamless Bidirectional Bridge
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                          DS LAB ECOSYSTEM                              │
├────────────────────────────────────────────────────────────────────────┤
│ Stage 0: Programming Foundation (Linked directly to Python Lab)         │
│                               ▼                                        │
│ Stage 1: Foundations (Statistics & SQL Studio)                         │
│                               ▼                                        │
│ Stage 2: Data Analysis (NumPy, Pandas, Data Visualization)             │
│                               ▼                                        │
│ Stage 3: AI & Deployment (Machine Learning Studio, MLOps)              │
│                               ▼                                        │
│ Stage 4: Guided Capstone Projects (Iris, Retail Sales, Neural Nets)    │
└────────────────────────────────────────────────────────────────────────┘
```

### Deep Link Registry

| Source Surface | Target URL | Intent & Behavior |
| :--- | :--- | :--- |
| **Python Lab Sidebar** (`.sidebar-ecosystem`) | `https://shadabur-rahaman.github.io/ds-lab/#/roadmap` | Guides learners to the advanced Data Science Roadmap |
| **Python Lab Topbar** (`.ecosystem-pill`) | `https://shadabur-rahaman.github.io/ds-lab/` | Quick one-click switch to Data Science & ML Lab |
| **Python Lab Catalog** (`.catalog-dslab-banner`) | `https://shadabur-rahaman.github.io/ds-lab/#/courses` | Contextual recommendation after viewing Python courses |
| **Intermediate Path** (`.intermediate-journey-banner`) | `https://shadabur-rahaman.github.io/ds-lab/#/roadmap` | 4th Stage in progression ("Data Science & ML") |
| **Project Studio Portfolio** (`.ds-lab-bridge-card`) | `https://shadabur-rahaman.github.io/ds-lab/#/roadmap` | Next steps card for students with completed projects |
| **Student Marks Capstone** (`.ds-lab-bridge-card`) | `https://shadabur-rahaman.github.io/ds-lab/#/courses` | Contextual prompt after passing CSV data processing |
| **DS LAB Ecosystem** (`src/data.ts`) | `https://shadabur-rahaman.github.io/python-lab/#/home` | Positions Python Lab as official "Programming Foundation" |
| **DS LAB Roadmap** (`.roadmap-prereq-banner`) | `https://shadabur-rahaman.github.io/python-lab/#/home` | Stage 0 Prerequisite Banner above Learning Path |
| **DS LAB Lesson Journey** (`LessonJourney`) | `https://shadabur-rahaman.github.io/python-lab/#/home` | Lesson 1 "Foundation: Python Lab" button |

---

## 3. Storage & State Isolation

Neither platform interferes with the other's state storage:
- **Python Lab Namespaces**:
  - `python-lab.progress.v1`: Chapter progression and exercise checks
  - `python-lab.syntax-academy.v1`: Syntax Academy drills and completions
  - `python-lab.practice.v1`: Practice Studio problem solving
  - `python-lab.intermediate.v1`: Intermediate modules and code
  - `python-lab.project-studio.v1`: Project Studio milestone code and completions
- **DS LAB Namespaces**:
  - `dslab_progress_v4`: Completed lessons, quizzes, SQL exercises, and code challenges
  - `dslab_theme`: Dark/light mode theme selection

Both applications can run concurrently in identical or separate browser tabs without key collisions, data corruption, or shared-state leaks.

---

## 4. Mobile Responsiveness & Layout Safeguards

Python Lab maintains strict browser test assertions ensuring `document.documentElement.scrollWidth <= document.documentElement.clientWidth` across all screen widths down to 360px.

During initial integration, adding `.ecosystem-pill` to `.topbar-actions` caused an 18px horizontal overflow on 360px mobile viewports. This was resolved cleanly:
```css
@media (max-width: 640px) {
  .ecosystem-pill {
    display: none;
  }
}
```
Mobile learners access DS LAB seamlessly through the sidebar ecosystem card and contextual in-page banners, maintaining full mobile usability and passing all 12 mobile layout tests.

---

## 5. Automated Verification & Test Evidence

The release verification pipeline executed `scripts/verify-release.mjs` against Git HEAD, confirming 100% test pass rate with zero discrepancies.

### A. Production Build Verification
- **Command**: `npm run build` (`tsc --noEmit && vite build`)
- **Result**: Succeeded in 28.46s
- **TypeScript Compiler Errors**: 0
- **Vite Bundler Errors**: 0

### B. Unit Test Suite (Node.js `node:test`)
- **Runner**: Node.js built-in `node:test`
- **Command**: `node --test tests/*.test.mjs`
- **Total Tests**: 58
- **Passed**: 58
- **Failed**: 0
- **Skipped**: 0
- **Duration**: 42.46s

### C. Playwright Browser Test Suite Breakdown
- **Runner**: `@playwright/test`
- **Total Discovered**: 102
- **Sum of File Rows**: 102
- **Passed**: 102
- **Failed**: 0
- **Skipped**: 0
- **Duration**: 408.83s

| Spec File | Discovered | Passed | Failed | Skipped | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `tests/browser/beginner-visuals.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/course.spec.ts` | **8** | 8 | 0 | 0 | PASS |
| `tests/browser/cross-platform-ecosystem.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/first-10-minutes.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/focused-learning.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/glossary.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/intermediate-path.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/learning.spec.ts` | **3** | 3 | 0 | 0 | PASS |
| `tests/browser/pilot.spec.ts` | **3** | 3 | 0 | 0 | PASS |
| `tests/browser/practice-mastery.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/project-studio.spec.ts` | **5** | 5 | 0 | 0 | PASS |
| `tests/browser/resources.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/runtime-isolation.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/runtime-performance.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/syntax.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/ux-refinement.spec.ts` | **5** | 5 | 0 | 0 | PASS |
| `tests/browser/version2.spec.ts` | **10** | 10 | 0 | 0 | PASS |
| `tests/browser/visual-curriculum.spec.ts` | **2** | 2 | 0 | 0 | PASS |
| `tests/browser/visual-models-ch11-15.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/visual-models-ch6-10.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| **Total (20 files)** | **102** | **102** | **0** | **0** | **ALL PASSED** |

### D. DS LAB Verification
- **Build**: `npm run build` succeeded (0 errors).
- **Playwright Suite**: `npm run test:e2e` passed (71 passed, 3 skipped, 0 failed).

---

## 6. Summary of Modified Files

### Python Lab (`D:\Learn JS\python-lab`)
- `src/App.tsx`: Added `.sidebar-ecosystem` and `.ecosystem-pill` cross-links with `ArrowUpRight` icon.
- `src/components/CourseCatalog.tsx`: Added `.catalog-dslab-banner` linking to DS LAB course catalog.
- `src/components/IntermediatePathView.tsx`: Updated `intermediate-journey-banner` to 4 stages, linking to DS LAB.
- `src/components/ProjectStudioView.tsx`: Added `.ds-lab-bridge-card` on student portfolio and updated 4-stage banner.
- `src/components/StudentMarksAnalyzerView.tsx`: Added `.ds-lab-bridge-card` on completion.
- `src/v4.css`: Added styles for ecosystem links, banners, and `@media (max-width: 640px)` overflow protection.
- `scripts/verify-release.mjs`: Added `v26-test-evidence.json` generation.
- `tests/cross-platform.test.mjs`: Added cross-platform URL resolution tests.
- `tests/browser/cross-platform-ecosystem.spec.ts`: Added 4 automated browser tests for cross-platform bridges.
- `docs/v26-test-evidence.json`: Machine-readable verification data.
- `docs/VERSION_26_UNIFIED_LEARNING_REPORT.md`: This release report.

### DS LAB (`D:\10_PROJECTS\ds-lab-publish`)
- `src/data.ts`: Updated ecosystem list to feature Python Lab as `Programming Foundation`.
- `src/App.tsx`: Added `.roadmap-prereq-banner` for Stage 0 Python Programming Foundation.
- `src/LearningStudio.tsx`: Added "Foundation: Python Lab" link on Lesson 1.
- `src/SqlStudio.tsx`: Resolved QueryExercise type definition.
- `tests/ecosystem.spec.ts`: Added 4 Playwright tests validating ecosystem and roadmap cross-links.
