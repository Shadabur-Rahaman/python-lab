# Python Lab Version 21 — Release Evidence Integrity & Classroom Pilot

**Release:** Version 21  
**Audit Date:** 2026-11-15  
**Baseline Release:** Version 20, Commit `f5cd7ef`  
**Exact Git Commit:** `6a13275` (`6a13275cd70412792dd03426eca94a295882ee74`)  
**Target Repository:** `https://github.com/Shadabur-Rahaman/python-lab`  
**Live Site:** `https://shadabur-rahaman.github.io/python-lab/`  
**Lead Evaluator:** Senior QA Engineer, React/TypeScript Developer, Python Education Specialist & Release Auditor (Google Antigravity)  

---

## 1. Executive Summary

Version 21 focuses strictly on **verification integrity, machine-verifiable test reproducibility, empirical startup performance baselines, slow-network usability reality, and practical classroom pilot readiness**.

Key outcomes:
1. **Reconciled Historical Contradictions:** Resolved the discrepancies between V19 and V20 reports. Proved through Git history and machine-generated discovery that the test suite has always contained **exactly 81 browser tests across 16 spec files** (not 77, not 82).
2. **Automated Release Evidence Pipeline:** Created `scripts/verify-release.mjs` (callable via `npm run verify:release`), which executes the build, unit tests, and Playwright tests, enforces mathematical equality assertions across all totals, and outputs machine-readable evidence to `docs/v21-test-evidence.json`.
3. **Correct Test Runner Nomenclature:** Clarified that unit tests execute via Node.js built-in `node:test` runner (`node --test tests/*.test.mjs`), correcting erroneous references to Vitest.
4. **Reproducible Multi-Run Benchmarking:** Upgraded `scripts/benchmark-startup.mjs` to measure multi-run stats (median, min, max, mean) across 5 scenarios (Cold Cache, Warm Cache, Worker Reuse, Fast 3G, Mobile Viewport), saving machine-readable results to `docs/v21-benchmark-results.json`.
5. **Slow-Network Usability & CDN Caching Audit:** Audited jsDelivr CDN cache headers (`Cache-Control: public, max-age=31536000`), explaining why native HTTP caching meets requirements and why introducing a Service Worker would introduce unnecessary failure modes.
6. **Teaching Precision:** Corrected "syntax typo" to "casing typo" in Chapter 1 milestone header (`LessonView.tsx`) to strictly distinguish runtime `NameError` from syntactic mistakes.
7. **Classroom Pilot Package:** Finalized a neutral, non-coaching usability testing protocol with an anonymous 10-field observer sheet in `docs/USABILITY_TESTING_PROTOCOL.md`, with testing status explicitly marked **PENDING**.

---

## 2. Investigation of V19 and V20 Report Contradictions

### 2.1 The Root Causes
An investigation of the repository, Git history, and past release documents revealed two distinct human reporting errors:

1. **The V19 Discrepancy (81 vs 77):**
   In the Version 19 document, Playwright reported `81 passed`. However, a manually drafted markdown summary table undercounted tests across 4 files (`runtime-performance.spec.ts`: reported 2, actual 4; `syntax.spec.ts`: reported 4, actual 6; `runtime-isolation.spec.ts`: reported 3, actual 4; `resources.spec.ts`: reported 5, actual 4). Net error: 77 reported vs 81 actual.
2. **The V20 Chat Response Hallucination (81 vs 82 with Invented Filenames):**
   While the file committed to disk (`docs/VERSION_20_CLASSROOM_VALIDATION_REPORT.md`, lines 47–64) correctly listed the 16 real filenames from disk totaling 81 tests, the final conversational summary generated in chat hallucinated 16 completely invented filenames (`activity-layout.spec.ts`, `chapter-0-flow.spec.ts`, `chapter-readiness.spec.ts`, etc.) and assigned arbitrary counts summing to **82**.
3. **The Test Runner Mislabeling:**
   The conversational summary also mislabeled the unit test runner as "Vitest". The project uses Node.js's built-in `node:test` runner via `"test": "node --test tests/*.test.mjs"`. Vitest is not installed.

### 2.2 Git History Audit
A chronological Git audit of `tests/browser/` (`git log --oneline --name-status -- tests/browser`) proves that every spec file was added as part of an official version release, and no files were ever deleted or renamed:

| Commit | Release | Spec File Added | Test Count |
| :--- | :--- | :--- | :---: |
| `543236b` | Foundation | `tests/browser/course.spec.ts` | 8 |
| `2029a8f` | V3 Preview | `tests/browser/glossary.spec.ts` | 4 |
| `2029a8f` | V3 Preview | `tests/browser/resources.spec.ts` | 4 |
| `2029a8f` | V3 Preview | `tests/browser/syntax.spec.ts` | 6 |
| `b006809` | V4 | `tests/browser/learning.spec.ts` | 3 |
| `21a5e7c` | V5 | `tests/browser/pilot.spec.ts` | 3 |
| `8f9b9b8` | V6 | `tests/browser/visual-curriculum.spec.ts` | 2 |
| `f8d4262` | V10 | `tests/browser/version2.spec.ts` | 10 |
| `032a15a` | V12 | `tests/browser/runtime-performance.spec.ts` | 4 |
| `0df413b` | V13 | `tests/browser/runtime-isolation.spec.ts` | 4 |
| `8cd4a58` | V14 | `tests/browser/beginner-visuals.spec.ts` | 6 |
| `3dfc47d` | V15 | `tests/browser/visual-models-ch6-10.spec.ts` | 6 |
| `79bc564` | V16 | `tests/browser/visual-models-ch11-15.spec.ts` | 6 |
| `ee01c96` | V17 | `tests/browser/ux-refinement.spec.ts` | 5 |
| `3ea7f31` | V18 | `tests/browser/focused-learning.spec.ts` | 6 |
| `5c33eb2` | V19 | `tests/browser/first-10-minutes.spec.ts` | 4 |
| **Total** | | **16 Spec Files** | **81 Tests** |

None of the hallucinated names (`activity-layout.spec.ts`, `chapter-0-flow.spec.ts`, etc.) have ever existed in git history.

---

## 3. Machine-Verified Test Inventory & Pass Results

Generated directly by `npm run verify:release` and stored in `docs/v21-test-evidence.json`:

### 3.1 Unit Test Suite (`node:test`)
- **Runner:** Node.js built-in `node:test` (`tests/*.test.mjs`)
- **Discovered & Passed:** **34 tests**
- **Failed:** **0**
- **Skipped:** **0**
- **Execution Time:** 27.89s
- **Files:**
  - `tests/error-feedback.test.mjs` (2 tests)
  - `tests/pdf-preview.test.mjs` (2 tests)
  - `tests/platform.test.mjs` (19 tests)
  - `tests/resource-validation.test.mjs` (6 tests)
  - `tests/syntax-academy.test.mjs` (5 tests)

### 3.2 Playwright Browser Test Suite
- **Runner:** `@playwright/test`
- **Discovered:** **81 tests across 16 files**
- **Passed:** **81 tests**
- **Failed:** **0**
- **Skipped:** **0**
- **Execution Time:** 325.9s (~5.4m)

| Spec File | Discovered | Passed | Failed | Skipped | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `tests/browser/beginner-visuals.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/course.spec.ts` | **8** | 8 | 0 | 0 | PASS |
| `tests/browser/first-10-minutes.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/focused-learning.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/glossary.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/learning.spec.ts` | **3** | 3 | 0 | 0 | PASS |
| `tests/browser/pilot.spec.ts` | **3** | 3 | 0 | 0 | PASS |
| `tests/browser/resources.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/runtime-isolation.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/runtime-performance.spec.ts` | **4** | 4 | 0 | 0 | PASS |
| `tests/browser/syntax.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/ux-refinement.spec.ts` | **5** | 5 | 0 | 0 | PASS |
| `tests/browser/version2.spec.ts` | **10** | 10 | 0 | 0 | PASS |
| `tests/browser/visual-curriculum.spec.ts` | **2** | 2 | 0 | 0 | PASS |
| `tests/browser/visual-models-ch11-15.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/visual-models-ch6-10.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| **Total (16 files)** | **81** | **81** | **0** | **0** | **ALL PASSED** |

### 3.3 Mathematical Verification Check
```
Total Discovered: 81
Sum of File Rows: 81 (81 === 81: TRUE)
Passed: 81, Failed: 0, Skipped: 0 (81 + 0 + 0 === 81: TRUE)
Sum of File Passed: 81 (81 === 81: TRUE)
Mathematical Integrity Verified: TRUE
```

---

## 4. Multi-Run Startup Benchmark Results

Executed via `scripts/benchmark-startup.mjs` on:
- **CPU:** AMD Ryzen 7 5800HS with Radeon Graphics (16 logical cores)
- **RAM:** 15.40 GB
- **OS:** Windows 11 (win32 10.0.26300)
- **Node.js:** v24.13.1
- **Browser:** Chromium 158.0.8127.18
- **Results File:** `docs/v21-benchmark-results.json`

### Multi-Run Summary Statistics

| Scenario | Runs | Cache & Worker State | Page Readiness (Median) | Python Exec to Output (Median) | Total Time to Output (Median) | Min / Max Total |
| :--- | :---: | :--- | :---: | :---: | :---: | :---: |
| **1. Cold Cache** | 5 | Cold context, no worker | 1,665 ms | 5,490 ms | **7,036 ms** | 6,213 ms / 11,313 ms |
| **2. Warm Cache** | 5 | Cached HTTP, fresh worker | 721 ms | 4,475 ms | **5,198 ms** | 5,152 ms / 6,468 ms |
| **3. Warm Worker Reuse** | 5 | In-memory hot worker | N/A (same page) | **78 ms** | **78 ms** | 70 ms / 95 ms |
| **4. Fast 3G Network** | 3 | 1.6 Mbps down, 750 kbps up | 1,798 ms | 31,525 ms | **33,325 ms** | 32,960 ms / 33,352 ms |
| **5. Mobile Viewport** | 5 | 390×844, warm HTTP cache | 1,499 ms | 4,459 ms | **6,013 ms** | 5,932 ms / 6,429 ms |

### Key Observations
1. **Pyodide Worker Reuse (78 ms):** Once initialized, execution is near-instantaneous. Across 5 repeated runs in the same session, execution times were `70ms, 95ms, 78ms, 77ms, 87ms`.
2. **Cold vs. Warm HTTP Cache:** Page readiness drops from ~1.66s to ~0.72s on warm cache. Execution drops from ~5.49s to ~4.48s.
3. **Simulated 3G Network (33.3s):** Downloading the Pyodide WebAssembly bundle (~10 MB compressed) over a simulated 1.6 Mbps connection consistently takes ~31.5 seconds. The 4-stage progress bar was displayed on 100% of runs.

---

## 5. Slow-Network UX & CDN Caching Audit

### 5.1 Pyodide Distribution Caching
Pyodide is loaded from `https://cdn.jsdelivr.net/pyodide/v0.27.7/full/`:
- `pyodide.js` (HTTP 200, `Cache-Control: public, max-age=31536000`, immutable versioned URL)
- `pyodide.asm.wasm` (HTTP 200, `Cache-Control: public, max-age=31536000`, immutable versioned URL)
- `python_stdlib.zip` (HTTP 200, `Cache-Control: public, max-age=31536000`, immutable versioned URL)

### 5.2 Why a Service Worker is NOT Recommended
1. **Native HTTP Cache Already Caches for 1 Year:** The browser's native HTTP cache respects `max-age=31536000` with ETags. On subsequent visits, assets are read from disk cache in under 1 second without hitting the network.
2. **Risk of Stale Runtimes:** Custom Service Workers often fail to invalidate cleanly during Pyodide updates or bundle changes, causing cryptic `RuntimeError` or `TypeError` crashes for returning students.
3. **Storage Quota:** Browser Cache Storage APIs on mobile devices can evict cross-origin opaque responses unpredictably.
4. **Maintenance Overhead:** The existing native browser HTTP cache provides optimal performance with zero maintenance risk.

### 5.3 UX Guardrails for Slow Connections
1. **4-Stage Truthful Indicator:** Shows `1. Preparing → 2. Loading files → 3. Starting engine → 4. Ready` so learners see continuous progress.
2. **No Duplicate Workers:** `run()` guards against re-entrant calls (`if (active.current) return;`) and disables the Run button while busy.
3. **90-Second Timeout:** Prevents the interface from hanging indefinitely if a connection drops.
4. **Local Draft Persistence:** Learner code is auto-saved to LocalStorage on every keystroke (`update(value) -> saveDraft(value)`), ensuring zero code loss if a retry or page reload occurs.
5. **Actionable Error Recovery:** If Pyodide fails to download, a friendly error card with a "Retry Python" button allows resuming without page reload.

---

## 6. Teaching Precision & Corrections

In `src/components/LessonView.tsx` (line 879):
- **Previous text:** `<h3>You've run Python, edited code, and fixed a syntax typo!</h3>`
- **Corrected text:** `<h3>You've run Python, edited code, and fixed a casing typo!</h3>`
- **Technical Justification:** Writing `Print("Hello, World!")` is syntactically valid Python (a call expression). It fails at runtime with a `NameError: name 'Print' is not defined` because Python is case-sensitive and does not define an uppercase `Print` identifier. Calling it a "syntax typo" conflates syntax with name lookup.
- **Accurate Conceptual Distinctions:**
  - `print()` is a **built-in function** (which can technically be shadowed), NOT a reserved keyword.
  - Reserved keywords (`if`, `for`, `class`, `def`) cannot be shadowed or assigned.
  - Python keywords are not all lowercase: `True`, `False`, and `None` are capitalized.

---

## 7. Real Classroom Pilot Preparation

The field-testing protocol has been updated in [`docs/USABILITY_TESTING_PROTOCOL.md`](file:///d:/Learn%20JS/python-lab/docs/USABILITY_TESTING_PROTOCOL.md):
- **Student Handout Sheet:** Standalone prompts for all 7 beginner tasks.
- **10-Field Observer Sheet:** Formatted for recording `Participant ID`, `Device & Browser`, `Task Completion`, `Time Taken`, `Hints Requested`, `Navigation Hesitation`, `Actual Errors`, `Code Explanation Depth`, `Ease Rating (1–5)`, and `Suggested Improvements`.
- **Non-Coaching Guidelines:** Explicit rules preventing facilitators from pointing, typing, or coaching.
- **Status:** **PENDING (Scheduled for field validation with real learners)**. Zero fabricated participant data.
- **Comparative Objectivity:** Explicit disclaimers against claiming superiority over W3Schools, GeeksforGeeks, or DataCamp without empirical comparative studies.

---

## 8. Files Modified in Version 21

| File | Changes Made |
| :--- | :--- |
| [`scripts/verify-release.mjs`](file:///d:/Learn%20JS/python-lab/scripts/verify-release.mjs) | Created automated release verification pipeline with mathematical consistency assertions |
| [`package.json`](file:///d:/Learn%20JS/python-lab/package.json) | Added `"verify:release": "node scripts/verify-release.mjs"` script |
| [`scripts/benchmark-startup.mjs`](file:///d:/Learn%20JS/python-lab/scripts/benchmark-startup.mjs) | Upgraded benchmark to multi-run statistics, system info collection, and automatic preview server lifecycle |
| [`src/components/LessonView.tsx`](file:///d:/Learn%20JS/python-lab/src/components/LessonView.tsx) | Fixed milestone heading from "syntax typo" to "casing typo" |
| [`docs/USABILITY_TESTING_PROTOCOL.md`](file:///d:/Learn%20JS/python-lab/docs/USABILITY_TESTING_PROTOCOL.md) | Standardized classroom usability testing protocol with non-coaching rules and 10-field observer sheet |
| [`docs/v21-benchmark-results.json`](file:///d:/Learn%20JS/python-lab/docs/v21-benchmark-results.json) | Machine-readable multi-run benchmark results across 5 scenarios |
| [`docs/v21-test-evidence.json`](file:///d:/Learn%20JS/python-lab/docs/v21-test-evidence.json) | Machine-readable release test evidence verifying 34 unit tests and 81 browser tests |
| [`docs/VERSION_21_RELEASE_VALIDATION.md`](file:///d:/Learn%20JS/python-lab/docs/VERSION_21_RELEASE_VALIDATION.md) | Comprehensive Version 21 release validation report |

---

## 9. Platform Preservation Checklist

- [x] All 16 foundational chapters preserved without curriculum alterations.
- [x] Interactive concept models preserved across Chapters 0–15.
- [x] V18 Focused Learning Mode (Guided, Reference, Practice & Quiz) preserved.
- [x] V19 First 10 Minutes flow (Chai recipe sequencer, IPO workflow, immediate first code) preserved.
- [x] Syntax Academy 2.0 (30 topics, 13 categories, Hinglish memory hints) preserved.
- [x] Warm Pyodide worker reuse preserved (78ms median execution).
- [x] Local storage persistence schema (`python-lab.editor.v1:*`) preserved.
- [x] Responsive layout across mobile (360px, 390px), tablet (768px), and desktop (1366px+) preserved with 0 horizontal overflow.
- [x] Zero unnecessary dependencies added.
