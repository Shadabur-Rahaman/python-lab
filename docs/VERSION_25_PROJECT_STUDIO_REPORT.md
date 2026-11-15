# Python Lab Version 25 — Real-World Project Studio & Student Portfolio Release Report

**Project:** Python Lab  
**Repository:** https://github.com/Shadabur-Rahaman/python-lab  
**Live Site:** https://shadabur-rahaman.github.io/python-lab/  
**Release Version:** Version 25 (V25)  
**Previous Reported Release:** V24, commit `10b6d090a0a1d1b8aa13ed76ef9f69558eb6cfcc`  
**Date:** November 2026  

---

## 1. Executive Summary & Mission

Version 25 transforms the Python Lab projects experience into a comprehensive, practical, and beginner-empowering **Real-World Project Studio & Student Portfolio**. 

Rather than jumping from small, single-file exercises directly to blank editors or trivial toy problems, students develop complete, production-grade Python applications following an authentic software engineering cycle:

$$\text{Understand Brief} \longrightarrow \text{Plan Architecture} \longrightarrow \text{Build Milestones} \longrightarrow \text{Defensive Testing} \longrightarrow \text{Export Portfolio}$$

### Core Release Objectives Achieved:
1. **Preserved Foundational & Intermediate Curriculum**:
   - All 16 foundational chapters (Chapters 0–15), 39 beginner tasks, 11 guided projects in `projects.ts`, 30 Syntax Academy topics, and 5 intermediate modules remain completely byte-stable, intact, and functional.
2. **Flagship Real-World Studio Projects**:
   - **Personal Expense & Budget Tracker (`expense-tracker-pro`)**: Multi-category financial analyzer featuring string/float validation, category aggregation, and defensive budget alerts across 3 development milestones.
   - **Smart Inventory & Stock Analyzer (`inventory-management-pro`)**: Store replenishment and valuation engine featuring product ingestion, restock/depletion updates, reorder point alerts, and inventory valuation across 3 development milestones.
   - **Upgraded Student Marks Analyzer (`student-marks-analyzer`)**: Enhanced with 4 guided development milestone stages and export capabilities while preserving original route compatibility.
3. **Structured Milestone Development Workflow**:
   - Every studio project is partitioned into 3–4 manageable milestones.
   - Each milestone features a clear objective, input/output contract, starter template, 3-tier progressive hint ladder, and automated behavioral test suite.
4. **Behavioral Anti-Hardcoding Validation**:
   - Automated test runners execute student code against multi-case assertions, preventing hardcoded string cheats or trivial mock bypasses.
5. **Student Project Portfolio & Client-Side Exports**:
   - Dedicated portfolio dashboard aggregating verified completions, in-progress drafts, and demonstrated competencies.
   - Instant client-side download of standalone, executable `.py` script files and professional GitHub-ready `README.md` project documentation via native browser Blob APIs without external server dependencies.
6. **Unified Learning Journey Progression**:
   - **Python Foundations (Chapters 0–15)** $\rightarrow$ **Intermediate Python (5 Modules + Capstone)** $\rightarrow$ **Real-World Project Studio (Studio & Portfolio)** $\rightarrow$ **Data Science Lab**.
7. **100% Release Verification**:
   - **Unit Tests**: 56 tests in Node.js `node:test` runner, 56 passed (100%), 0 failed, 0 skipped.
   - **Browser Tests**: 98 tests across 19 Playwright spec files, 98 passed (100%), 0 failed, 0 skipped.
   - **Mathematical Integrity**: 98 total discovered = 98 sum of file rows = 98 passed.

---

## 2. Project Studio Architecture & Methodology

### 7-Stage Engineering Lifecycle
Every studio project guides learners through professional development practices:
1. **Project Brief**: Explaining the practical real-world problem and expected deliverable.
2. **Architecture Plan**: Visualizing the data flow and function relationships.
3. **Milestone Build**: Incrementally writing code for isolated system components.
4. **Automated Testing**: Running defensive multi-case tests against actual Python behavior.
5. **Error Diagnosis**: Friendly beginner tips and progressive 3-level hints.
6. **Project Integration**: Combining all milestones into a cohesive executable program.
7. **Portfolio Export**: Exporting `.py` source code and `README.md` documentation.

### Flagship Studio Projects Detail

| Project Identifier | Project Name | Milestones | Core Concepts & Standard Library | Primary Output |
| :--- | :--- | :---: | :--- | :--- |
| `expense-tracker-pro` | Personal Expense & Budget Tracker | 3 | Ingestion, Type Casting, Dictionaries, Aggregation, Threshold Alerts | Total spent, category breakdown, top spending category, budget warnings |
| `inventory-management-pro` | Smart Inventory & Stock Analyzer | 3 | Dictionaries, Tuples, Normalization, Mutation, Sorting, Valuation | Stock levels, reorder threshold alerts, valuation sum, alphabetical inventory |
| `student-marks-analyzer` | Student Marks Analyzer | 4 | CSV, `io.StringIO`, Dictionaries, Statistics, Missing Data Handling | Class average, subject averages, top student, honor roll |

---

## 3. Student Project Portfolio & Export Capabilities

The Student Project Portfolio (`#/projects` $\rightarrow$ Student Project Portfolio tab) enables students to review and export their work:

- **Metrics Dashboard**: Visual counters for *Verified Completed*, *In Progress*, and *Milestones Solved*.
- **Demonstrated Competencies**: Automatic tagging of applied skills (e.g., CSV Parsing, Defensive Programming, Type Casting, Dict Aggregation).
- **Offline Code Persistence**: Saved student code and milestone statuses stored safely under `python-lab.project-studio.v1` in LocalStorage, completely isolated from foundational progress keys.
- **Client-Side `.py` Export**: Generates a runnable, well-formatted Python source file directly in the browser.
- **Client-Side `README.md` Export**: Generates a comprehensive markdown project portfolio artifact complete with architecture diagrams, sample input/output, installation instructions, and the student's verified code.

---

## 4. Test Evidence & Mathematical Consistency

The release verification pipeline executed `scripts/verify-release.mjs` against Git HEAD, confirming 100% test pass rate with zero discrepancies.

### A. Production Build Verification
- **Command**: `npm run build` (`tsc --noEmit && vite build`)
- **Result**: Succeeded in 25.00s
- **TypeScript Compiler Errors**: 0
- **Vite Bundler Errors**: 0

### B. Unit Test Suite (Node.js `node:test`)
- **Command**: `node --test tests/*.test.mjs`
- **Total Tests**: 56
- **Passed**: 56
- **Failed**: 0
- **Skipped**: 0
- **Duration**: 38.09s

### C. Playwright Browser Test Suite Breakdown
- **Runner**: `@playwright/test`
- **Total Discovered**: 98
- **Sum of File Rows**: 98
- **Passed**: 98
- **Failed**: 0
- **Skipped**: 0
- **Status**: ALL PASSED

| Spec File | Discovered | Passed | Failed | Skipped | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `tests/browser/beginner-visuals.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/course.spec.ts` | **8** | 8 | 0 | 0 | PASS |
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
| **Total (19 files)** | **98** | **98** | **0** | **0** | **ALL PASSED** |

---

## 5. Summary of Modified and Created Files

| File | Change Type | Purpose |
| :--- | :--- | :--- |
| `docs/V25_PROJECT_STUDIO_AUDIT.md` | Created | Comprehensive audit of existing 11 projects and V24 capstone |
| `src/lib/projectStudioProgress.ts` | Created | LocalStorage persistence, milestone tracking, and native file export helper |
| `src/data/projectStudioData.ts` | Created | Flagship studio projects metadata, milestones, starters, solutions, tests & README generator |
| `src/components/ProjectStudioView.tsx` | Created | Project studio catalog, milestone development workspace, and student portfolio UI |
| `src/components/StudentMarksAnalyzerView.tsx` | Modified | Added 4-stage guided milestone roadmap and export buttons |
| `src/App.tsx` | Modified | Route routing for `#/projects`, studio project detail view, titles and breadcrumbs |
| `src/v4.css` | Modified | Responsive stylesheet for project studio, milestone pills, code previews, and mobile zero-overflow |
| `tests/project-studio.test.mjs` | Created | Unit test suite validating milestones, starters, reference solutions, and backward compatibility |
| `tests/browser/project-studio.spec.ts` | Created | Playwright browser test spec verifying studio catalog, milestones, portfolio, and mobile responsive layout |
| `scripts/verify-release.mjs` | Modified | Updated verification script to generate `docs/v25-test-evidence.json` |
| `docs/VERSION_25_PROJECT_STUDIO_REPORT.md` | Created | Canonical Version 25 release report |

---

## 6. Deployment Verification & Status

- **Build Status**: Verified clean production build (`dist/index.html` generated with 0 errors).
- **Test Integrity**: 56/56 unit tests passed, 98/98 browser tests passed.
- **Git Commit**: Ready to commit and push to `origin/main` to trigger GitHub Actions CI/CD.
