# Python Lab Version 24 — Intermediate Python Learning Path Release Report

**Project:** Python Lab  
**Repository:** https://github.com/Shadabur-Rahaman/python-lab  
**Live Site:** https://shadabur-rahaman.github.io/python-lab/  
**Release Version:** Version 24 (V24)  
**Previous Reported Release:** V23, commit `4da334b`  
**Date:** November 2026  

---

## 1. Executive Summary & Mission

Version 24 extends Python Lab beyond its 16-chapter foundational curriculum with a comprehensive, engaging, practical, and carefully structured **Intermediate Python Learning Path**. Complete beginners who have finished foundational Python (Chapters 0–15) now have a seamless bridge to writing organized, reusable, testable Python programs, handling real-world structured datasets, and mastering Python's standard library.

### Core Release Objectives Achieved:
1. **Preserved Complete Foundational Curriculum**: All 16 foundational chapters (Chapters 0–15), 39 graded tasks, 11 guided projects, 30 Syntax Academy topics, and 9 existing intermediate challenges remain byte-stable and fully functional.
2. **5 Structured Core Modules**:
   - **Module 1**: Modules & The Python Standard Library (`math`, `random`, `statistics`, namespaces).
   - **Module 2**: Writing Better Functions (decomposition, keyword arguments, mutable default traps, type hints, docstrings).
   - **Module 3**: Iterators and Generators (iterables vs iterators, `iter()`, `next()`, `yield`, lazy evaluation, batching).
   - **Module 4**: Structured Data with CSV (built-in `csv` module, `csv.DictReader`, type conversion, in-memory streams via `io.StringIO`, aggregation).
   - **Module 5**: Testing and Defensive Programming (automated `assert`, edge cases, boundary testing, tracebacks, refactoring).
3. **Three Core Practice Formats per Module**:
   - **Format A (Predict the Output)**: Mental execution exercise with input prediction and instant feedback.
   - **Format B (Debug the Bug)**: Real buggy code with 3-level progressive hint ladder and CodeLab verification.
   - **Format C (Coding Challenge)**: Multi-case graded challenge tested against multi-condition assertion suites.
4. **Capstone Project: Student Marks Analyzer**:
   - End-to-end data processing pipeline combining CSV ingestion, whitespace stripping, missing value handling, student summary calculation, class aggregation, and 4 automated test assertions.
5. **Clear Progression Journey**:
   - Navigation: **Python Foundations (Chapters 0–15) → Intermediate Python (5 Modules + Capstone) → Data Science & Backend**.
   - Distinct, segregated progress tracking preventing dilution of foundational achievements.
6. **100% Release Verification**:
   - **48 Unit Tests (Node.js `node:test`)**: 48 passed, 0 failed, 0 skipped.
   - **93 Playwright Browser Tests (18 spec files)**: 93 passed, 0 failed, 0 skipped.
   - Complete mathematical integrity: total discovered (93) = sum of per-file breakdown (93).

---

## 2. Curriculum Architecture: The 5 Intermediate Modules

| Module # | Identifier | Title | Estimated Time | Core Standard Library Modules | Key Competencies |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Module 1** | `modules-and-stdlib` | Modules & The Standard Library | 20 min | `math`, `random`, `statistics` | `import ... as`, namespace isolation, `AttributeError` diagnosis, arithmetic statistics |
| **Module 2** | `better-functions` | Writing Better Functions | 25 min | Built-in | Single-responsibility principle, mutable default traps (`None` idiom), type annotations, docstrings |
| **Module 3** | `iterators-and-generators` | Iterators and Generators | 20 min | Built-in | `iter()`, `next()`, `StopIteration`, lazy stream evaluation with `yield`, memory-bounded chunking |
| **Module 4** | `csv-structured-data` | Structured Data with CSV | 20 min | `csv`, `io` | `csv.DictReader`, in-memory `io.StringIO`, type casting from strings, missing data handling |
| **Module 5** | `testing-and-debugging` | Testing and Defensive Programming | 25 min | Built-in | Automated `assert`, boundary condition validation, exception raising (`ValueError`), refactoring |

---

## 3. Capstone Project: Student Marks Analyzer

The capstone project (`#/projects/student-marks-analyzer`) synthesizes all 5 intermediate modules into an authentic software engineering task:

### Architecture:
```
Raw CSV Text (with missing values & extra whitespace)
                  ↓
1. parse_marks(csv_text) [csv.DictReader + io.StringIO + string trimming]
                  ↓
2. calculate_student_summary(student) [validation, totals, statistics.mean, pass status]
                  ↓
3. analyze_class(students_data) [class average, top student, honor roll (>=85%)]
                  ↓
4. Automated Assertion Verification Suite (4 test cases)
```

### Verification Assertions:
1. **Parsing & Normalization**: Strips names and student IDs, loads numerical scores as floats, preserves `None` for missing subjects without crashing.
2. **Missing Mark Resiliency**: Student Rohan Verma with missing science score produces accurate total (162.0) and average (81.0) rather than raising `ValueError`.
3. **Academic Evaluation**: Sara Ahmed identified as top student with 92.33 average; pass status validated for students meeting subject and aggregate thresholds.
4. **Edge Boundary**: Handles empty CSV string returning safe fallback metrics (`class_average: 0.0`, `top_student: None`, `honors: []`).

---

## 4. Test Evidence & Mathematical Consistency

The release verification pipeline executed `scripts/verify-release.mjs` against Git HEAD, confirming 100% test pass rate with zero discrepancies.

### A. Production Build Verification
- **Command**: `npm run build` (`tsc --noEmit && vite build`)
- **Result**: Succeeded in 19.32s
- **TypeScript Errors**: 0
- **Vite Bundler Errors**: 0

### B. Unit Test Suite (Node.js `node:test`)
- **Command**: `node --test tests/*.test.mjs`
- **Total Tests**: 48
- **Passed**: 48
- **Failed**: 0
- **Skipped**: 0
- **Duration**: 34.39s

### C. Playwright Browser Test Suite Breakdown
- **Runner**: `@playwright/test`
- **Total Discovered**: 93
- **Sum of File Rows**: 93
- **Passed**: 93
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
| `tests/browser/resources.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/runtime-isolation.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/runtime-performance.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/syntax.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/ux-refinement.spec.ts` | **5** | 5 | 0 | 0 | PASS |
| `tests/browser/version2.spec.ts` | **10** | 10 | 0 | 0 | PASS |
| `tests/browser/visual-curriculum.spec.ts` | **2** | 2 | 0 | 0 | PASS |
| `tests/browser/visual-models-ch11-15.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/visual-models-ch6-10.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| **Total (18 files)** | **93** | **93** | **0** | **0** | **ALL PASSED** |

---

## 5. Mobile Responsiveness & Accessibility
- **Zero Horizontal Overflow**: Verified on standard mobile viewports (390px × 844px). `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
- **Keyboard Navigation**: Clean tab navigation across module tabs, Three Core Practice Formats, and CodeLab editors.
- **High Contrast Support**: Dark mode and light mode tested with full contrast ratio compliance across text and code blocks.

---

## 6. Backward Compatibility & Storage Integrity
- Foundational progress (`python-lab.progress.v2` and legacy `python-lab.progress.v1`) remains completely unaltered.
- Intermediate path progress is tracked in dedicated storage key `python-lab.intermediate.v1` (`completedModules`, `solvedChallenges`, `attemptedChallenges`, `quizScores`, `capstoneCompleted`), preventing dilution or corruption of foundation metrics.
