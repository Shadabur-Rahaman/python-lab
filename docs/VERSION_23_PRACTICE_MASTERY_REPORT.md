# Python Lab Version 23 — Interactive Practice & Mastery Studio Release Report

**Release:** Version 23  
**Date:** November 15, 2026  
**Repository:** [https://github.com/Shadabur-Rahaman/python-lab](https://github.com/Shadabur-Rahaman/python-lab)  
**Live Site:** [https://shadabur-Rahaman.github.io/python-lab/](https://shadabur-Rahaman.github.io/python-lab/)  
**Previous Reported Release:** Version 22 (`215e035197b27d679b533a138df2962b29ed2f32`)  
**Pipeline Verification Artifact:** [`docs/v23-test-evidence.json`](file:///D:/Learn%20JS/python-lab/docs/v23-test-evidence.json)  
**Curriculum Audit Artifact:** [`docs/V23_PRACTICE_COVERAGE_AUDIT.md`](file:///D:/Learn%20JS/python-lab/docs/V23_PRACTICE_COVERAGE_AUDIT.md)

---

## 1. Executive Summary & Mission

The mission of **Python Lab Version 23** is to transform the practice experience into an effective, beginner-friendly problem-solving and mastery studio.

Rather than presenting isolated coding cards or decorative buttons, Version 23 systematically trains complete beginners to develop genuine programming fluency:
1. **Read Python code** and mentally simulate its control flow.
2. **Predict outputs** accurately before hitting run.
3. **Diagnose and fix real bugs** using structured progressive hints.
4. **Write clean, independent solutions** to practical problems.
5. **Receive intelligent, actionable diagnostics** on syntax errors, runtime exceptions, and subtle output mismatches (casing, whitespace, numeric formats).
6. **Track authentic mastery** across differentiated progress states (⚪ Not attempted, 🟡 Attempted, 🟢 Verified solved).

All 16 chapters now support the **Three Core Practice Formats** through a dedicated `PracticeStudio` component, accompanied by a modernized Practice Studio directory (`#/practice`) with metrics, filters, search, and progress-tracking.

---

## 2. Complete Curriculum & Practice Coverage Audit

Prior to implementation, a full inventory was conducted across the Python Lab platform (detailed in [`docs/V23_PRACTICE_COVERAGE_AUDIT.md`](file:///D:/Learn%20JS/python-lab/docs/V23_PRACTICE_COVERAGE_AUDIT.md)):

| Curriculum Domain | Scope / Count | Coverage Status in V23 |
| :--- | :---: | :--- |
| **Foundational Chapters** | Chapters 0–15 (16 chapters) | 100% equipped with Three Core Practice Formats |
| **Beginner Graded Challenges** | 39 tasks (Chapters 0–12) | 100% equipped with 3-level progressive hints & tests |
| **Intermediate Graded Challenges** | 9 tasks (Chapters 13–15) | 100% equipped with 3-level progressive hints & tests |
| **Total Graded Challenges** | **48 tasks** | **100% verified with live Python execution** |
| **Guided Capstone Projects** | 11 projects | Verified deterministic execution & reference solutions |
| **Chapter Checkpoints** | 16 checkpoints | Verified interactive trace stepper & concept questions |
| **Syntax Academy Topics** | 30 topics across 13 categories | Complete Hinglish hints, real-world links & verified examples |

---

## 3. The Three Core Practice Formats

Every chapter now guides the student through three complementary modalities in `PracticeStudio.tsx`:

### Format A: Predict the Output
- **Objective:** Trains mental model simulation. Beginners read a realistic Python snippet and forecast its exact output before running it.
- **Feedback & Execution:** Real-time verification compares user predictions against real output. Students can run the snippet directly in Pyodide to observe live execution.
- **Bilingual Reinforcement:** Every chapter includes a bilingual (Hinglish/English) memory hint (`remember`) and real-world application context (`application`).

### Format B: Find and Fix the Bug
- **Objective:** Demystifies errors by presenting broken code with intentional, high-frequency beginner mistakes (e.g. `totel` typo in variable name, capitalized `Print()`, misplaced indentations, unquoted strings).
- **Progressive Hint Ladder:** Step-by-step guidance without giving away the answer immediately:
  - *Hint 1 (Direction):* Conceptual nudge pointing to the problem area.
  - *Hint 2 (Specific Guidance):* Identifies the exact rule or variable.
  - *Hint 3 (Target Fix):* Shows the corrected line or replacement construct.
- **Error Diagnosis:** CodeLab displays beginner-friendly explanations of why the bug occurred and what Python was trying to do.

### Format C: Write the Code Yourself
- **Objective:** Encourages independent code authoring from an actionable prompt and starter skeleton.
- **Grading & Verification:** Graded against strict test suites and boundary assertion cases in real Python (Pyodide).
- **Interactive Scaffold:** Three progressive hint levels and expandable reference solutions with line-by-line pedagogical explanations.

---

## 4. Intelligent Error & Output Mismatch Diagnosis Engine

Beginners frequently get stuck when their code runs without throwing a runtime crash, but fails automated checks due to small discrepancies. In Version 23, `src/components/CodeLab.tsx` introduces two specialized diagnostic engines:

### `diagnoseMismatch(actual, expected)`
1. **Empty Output Check:** `"Your code ran without error, but produced no output. Did you forget to call print() to display the result?"`
2. **Letter Casing Diagnosis:** `"Output text matches except for letter casing. Python is case-sensitive: check your uppercase and lowercase letters."`
3. **Whitespace & Spacing Differences:** `"The text and values match, but spacing or line breaks differ. Check for extra or missing spaces and newlines."`
4. **Numeric Format Discrepancies:** Detects when the computed value matches mathematically but differs in formatting (e.g. integer `400` vs float `400.0`).
5. **Exact Fallback:** `"Output differs. Compare your output with the expected result."`

### `diagnoseError(errText)`
Categorizes Python exceptions into plain-language beginner feedback:
- **SyntaxError:** Guides punctuation, colons (`:`), unmatched quotes, and parentheses.
- **NameError:** Explains case sensitivity, misspellings, and unassigned variables.
- **TypeError:** Explains incompatible data type concatenation (e.g. text + number).
- **IndexError:** Highlights that zero-indexed sequences were accessed beyond length.
- **KeyError:** Explains missing dictionary keys and suggests `.get()`.
- **ValueError:** Explains invalid type conversion arguments.
- **IndentationError:** Guides 4-space indentation consistency.

---

## 5. Differentiated Progress States & Storage Architecture

Version 23 replaces binary solved/unsolved tracking with transparent three-tier state tracking:
- ⚪ **Not attempted:** The student has not run code or interacted with the exercise.
- 🟡 **Attempted:** The student ran code in the editor or engaged with hints, persisted in `progress.attempted`.
- 🟢 **Verified solved:** The solution passed 100% of test cases and behavioral checks in real Python, persisted in `progress.solved`.

### Backward Compatibility & Storage Migration
In `src/lib/progress.mjs`:
- `freshProgress()` initializes `attempted: []`.
- `normalizeProgress()` automatically migrates existing v1 or v2 storage objects: if `attempted` is missing, it safely seeds `attempted = [...progress.solved]`.
- `mergeProgress()` merges `attempted` sets across backup imports and local sessions without data loss or score regression.

---

## 6. Comprehensive Test & Release Evidence

Release verification was executed via `npm run verify:release`. All suites passed with 100% success rate and zero test skips or failures.

### Build Verification
- **Command:** `npm run build` (`tsc --noEmit && vite build`)
- **Result:** Success (0 TypeScript errors, 0 Vite bundling errors).
- **Duration:** 24.75s.

### Unit Test Suite
- **Runner:** Node.js built-in `node:test` runner (`node --test tests/*.test.mjs`)
- **Total Tests:** 38
- **Passed:** 38 (100%)
- **Failed:** 0
- **Skipped:** 0
- **Duration:** 36.35s

### Browser Test Suite (Playwright)
- **Runner:** `@playwright/test`
- **Total Discovered:** 87
- **Sum of File Rows:** 87
- **Passed:** 87 (100%)
- **Failed:** 0
- **Skipped:** 0
- **Total Duration:** 382.74s (~6.3m)

### Complete 17-File Browser Test Evidence Table

| Spec File | Discovered | Passed | Failed | Skipped | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| [`tests/browser/beginner-visuals.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/beginner-visuals.spec.ts) | **6** | 6 | 0 | 0 | PASS |
| [`tests/browser/course.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/course.spec.ts) | **8** | 8 | 0 | 0 | PASS |
| [`tests/browser/first-10-minutes.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/first-10-minutes.spec.ts) | **4** | 4 | 0 | 0 | PASS |
| [`tests/browser/focused-learning.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/focused-learning.spec.ts) | **6** | 6 | 0 | 0 | PASS |
| [`tests/browser/glossary.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/glossary.spec.ts) | **4** | 4 | 0 | 0 | PASS |
| [`tests/browser/learning.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/learning.spec.ts) | **3** | 3 | 0 | 0 | PASS |
| [`tests/browser/pilot.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/pilot.spec.ts) | **3** | 3 | 0 | 0 | PASS |
| [`tests/browser/practice-mastery.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/practice-mastery.spec.ts) | **6** | 6 | 0 | 0 | PASS |
| [`tests/browser/resources.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/resources.spec.ts) | **4** | 4 | 0 | 0 | PASS |
| [`tests/browser/runtime-isolation.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/runtime-isolation.spec.ts) | **4** | 4 | 0 | 0 | PASS |
| [`tests/browser/runtime-performance.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/runtime-performance.spec.ts) | **4** | 4 | 0 | 0 | PASS |
| [`tests/browser/syntax.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/syntax.spec.ts) | **6** | 6 | 0 | 0 | PASS |
| [`tests/browser/ux-refinement.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/ux-refinement.spec.ts) | **5** | 5 | 0 | 0 | PASS |
| [`tests/browser/version2.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/version2.spec.ts) | **10** | 10 | 0 | 0 | PASS |
| [`tests/browser/visual-curriculum.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/visual-curriculum.spec.ts) | **2** | 2 | 0 | 0 | PASS |
| [`tests/browser/visual-models-ch11-15.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/visual-models-ch11-15.spec.ts) | **6** | 6 | 0 | 0 | PASS |
| [`tests/browser/visual-models-ch6-10.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/visual-models-ch6-10.spec.ts) | **6** | 6 | 0 | 0 | PASS |
| **Total (17 files)** | **87** | **87** | **0** | **0** | **ALL PASSED** |

---

## 7. Mathematical & Release Evidence Verification

- **Total Unit Tests Executed:** 38 (38 passed, 0 failed, 0 skipped)
- **Total Browser Tests Executed:** 87 (87 passed, 0 failed, 0 skipped)
- **Sum of Individual Browser Spec Rows:** $6+8+4+6+4+3+3+6+4+4+4+6+5+10+2+6+6 = 87$
- **Total Discovered Browser Tests Reported by Playwright:** 87
- **Mathematical Discrepancy:** Exactly 0.
- **Machine-readable audit trail:** Stored in [`docs/v23-test-evidence.json`](file:///D:/Learn%20JS/python-lab/docs/v23-test-evidence.json) with exact timestamps, Git HEAD, and execution duration.

---

## 8. Summary of Files Changed

1. **New Core Components & Audit Documentation:**
   - [`src/components/PracticeStudio.tsx`](file:///D:/Learn%20JS/python-lab/src/components/PracticeStudio.tsx): Unified Practice Studio hosting Predict Output, Find & Fix Bug, and Write Code Yourself.
   - [`docs/V23_PRACTICE_COVERAGE_AUDIT.md`](file:///D:/Learn%20JS/python-lab/docs/V23_PRACTICE_COVERAGE_AUDIT.md): Comprehensive inventory and gap analysis across all 16 chapters.
   - [`tests/browser/practice-mastery.spec.ts`](file:///D:/Learn%20JS/python-lab/tests/browser/practice-mastery.spec.ts): 6 Playwright browser tests verifying formats, hint ladders, diagnostics, and responsiveness.
   - [`docs/v23-test-evidence.json`](file:///D:/Learn%20JS/python-lab/docs/v23-test-evidence.json): Automated release verification evidence.
   - [`docs/VERSION_23_PRACTICE_MASTERY_REPORT.md`](file:///D:/Learn%20JS/python-lab/docs/VERSION_23_PRACTICE_MASTERY_REPORT.md): This release report.
2. **Platform Enhancements & Diagnostics:**
   - [`src/components/CodeLab.tsx`](file:///D:/Learn%20JS/python-lab/src/components/CodeLab.tsx): Integrated `diagnoseMismatch()` and `diagnoseError()`, added `onAttempt` callback.
   - [`src/components/TaskCard.tsx`](file:///D:/Learn%20JS/python-lab/src/components/TaskCard.tsx): 3-level progressive hint ladder and status pills (`Not attempted`, `Attempted`, `✓ Solved`).
   - [`src/components/PracticeView.tsx`](file:///D:/Learn%20JS/python-lab/src/components/PracticeView.tsx): Studio directory with metrics, filters, search, and progress cards.
   - [`src/components/LessonView.tsx`](file:///D:/Learn%20JS/python-lab/src/components/LessonView.tsx): Embedded `PracticeStudio` into Practice & Quiz tab and non-guided flow.
   - [`src/data/curriculum.ts`](file:///D:/Learn%20JS/python-lab/src/data/curriculum.ts): 3-level progressive hints across all 39 beginner tasks.
   - [`src/data/intermediate.ts`](file:///D:/Learn%20JS/python-lab/src/data/intermediate.ts): 3-level progressive hints across all 9 intermediate tasks.
   - [`src/data/pilotActivities.ts`](file:///D:/Learn%20JS/python-lab/src/data/pilotActivities.ts): Full pilot activities for Chapter 0 and 1, completing all 16 chapters.
   - [`src/lib/progress.mjs`](file:///D:/Learn%20JS/python-lab/src/lib/progress.mjs): Added `attempted` state tracking with backward-compatible normalization.
   - [`src/v4.css`](file:///D:/Learn%20JS/python-lab/src/v4.css): Responsive studio layout with 0px mobile overflow.
   - [`scripts/verify-release.mjs`](file:///D:/Learn%20JS/python-lab/scripts/verify-release.mjs): Updated release verification pipeline.
