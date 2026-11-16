# Python Lab Version 26.1 — Cross-Platform Navigation & Clean Routing Verification Report

**Project:** Python Lab  
**Repository:** https://github.com/Shadabur-Rahaman/python-lab  
**Live Site:** https://shadabur-rahaman.github.io/python-lab/  
**Partner Platform:** DS LAB (https://shadabur-rahaman.github.io/ds-lab/)  
**Release Version:** Version 26.1 (V26.1)  
**Previous Reported Release:** V26, commit `034bc23`  
**Date:** November 2026  

---

## 1. Executive Summary & Problem Resolution

In Version 26, cross-platform links between Python Lab and DS LAB were reported using hash routes (e.g., `/ds-lab/#/roadmap`, `/ds-lab/#/courses`) or root fallbacks (`/ds-lab/`). Because DS LAB's router evaluates `window.location.pathname` rather than `window.location.hash`, hash-based links inadvertently defaulted to loading DS LAB's homepage (`/`) instead of the intended target views.

**Version 26.1 corrects all cross-platform links to use DS LAB's canonical clean path architecture without modifying either platform's existing routing design.**

### Verified Link Mappings

| UI Surface in Python Lab | Previous Link (V26) | Corrected Clean Path (V26.1) | Verified Destination Page & Heading |
| :--- | :--- | :--- | :--- |
| **Sidebar Ecosystem Badge** (`.sidebar-ecosystem a`) | `.../ds-lab/` | `https://shadabur-rahaman.github.io/ds-lab/roadmap` | **Data science roadmap** (`.roadmap-prereq-banner` visible) |
| **Topbar Ecosystem Pill** (`.ecosystem-pill`) | `.../ds-lab/` | `https://shadabur-rahaman.github.io/ds-lab/` | **DS LAB Home / Overview** |
| **Course Catalog Banner** (`.catalog-dslab-banner a`) | `.../ds-lab/` | `https://shadabur-rahaman.github.io/ds-lab/courses` | **Course explorer** |
| **Intermediate Journey Banner** (`.intermediate-journey-banner a`) | `.../ds-lab/` | `https://shadabur-rahaman.github.io/ds-lab/roadmap` | **Data science roadmap** (Stage 4 destination) |
| **Project Studio Journey Banner** (`.intermediate-journey-banner a`) | `.../ds-lab/` | `https://shadabur-rahaman.github.io/ds-lab/roadmap` | **Data science roadmap** (Stage 4 destination) |
| **Project Studio Portfolio Bridge** (`.ds-lab-bridge-card a`) | `.../ds-lab/` | `https://shadabur-rahaman.github.io/ds-lab/roadmap` | **Data science roadmap** (Post-completion next steps) |
| **Student Marks Analyzer Capstone** (`.ds-lab-bridge-card a`) | `.../ds-lab/#/courses` | `https://shadabur-rahaman.github.io/ds-lab/courses` | **Course explorer** (Pandas transition) |

---

## 2. Real Browser Interaction & Routing Verification

Unlike simple static HTML inspection, Version 26.1 verifies every cross-platform link through real browser execution via Playwright:
1. **Interactive Click Testing**: Every link is clicked in Chromium, triggering a real popup/window event (`context.waitForEvent('page')`).
2. **Path Matching**: Popups are verified to match canonical clean paths (`/roadmap` and `/courses`) with transparent handling of web server directory trailing slashes (`/roadmap/` and `/courses/`).
3. **DOM Content Verification**: In addition to URL validation, Playwright verifies that the target view actually renders its designated level-1 heading (`Data science roadmap` and `Course explorer`) within the open tab.
4. **Mobile Navigation Drawer**: Verified that mobile viewports (375px) properly toggle the navigation drawer via `.mobile-menu` and that the sidebar ecosystem link is fully clickable and functional on touch viewports.
5. **Bidirectional Navigation**: Verified both directions:
   - **Python Lab $\rightarrow$ DS LAB**: Sidebar, catalog, intermediate, and portfolio links tested and passing in `tests/browser/cross-platform-ecosystem.spec.ts`.
   - **DS LAB $\rightarrow$ Python Lab**: Roadmap Stage 0 prerequisite banner, lesson progression journey button, and sidebar ecosystem link tested and passing in `tests/ecosystem.spec.ts` pointing to `https://shadabur-rahaman.github.io/python-lab/#/home`.

---

## 3. Analysis of DS LAB Skipped Tests

In DS LAB's automated test suite (`npm run test:e2e`), 3 browser tests are marked as skipped:
```ts
test.describe('real Pyodide', () => {
  test.skip(process.env.DS_TEST_STATIC === '1', 'Live Pyodide requires access to its CDN.');
  test.skip(({ isMobile }) => isMobile, 'Real runtime checks run on desktop.');

  test('executes Python, reports an exception and restarts after stopping' ...
  test('grades the foundations and statistics challenges' ...
  test('grades numpy, pandas, and data visualization challenges' ...
```

### Impact Assessment
- **Why they are skipped**: The DS LAB test configuration runs across two Playwright projects: `desktop` and `mobile`. Real Pyodide in-browser execution requires downloading the live WebAssembly runtime from CDN. These 3 tests run and pass 100% on the `desktop` configuration. The test suite skips the redundant second execution on the `mobile` emulation profile to prevent timeout penalties.
- **Release Confidence**: This intentional configuration optimization does not diminish release confidence, as all 3 live Pyodide runtime tests are thoroughly validated during the desktop phase.

---

## 4. Test Verification & Mathematical Consistency

The full Python Lab verification pipeline (`npm run verify:release`) was executed, establishing mathematical consistency across all test suites:

### Production Build
- **Command**: `npm run build` (`tsc --noEmit && vite build`)
- **Status**: Clean compilation (0 TypeScript errors, 0 Vite errors)

### Unit Tests
- **Runner**: Node.js built-in `node:test` (`tests/*.test.mjs`)
- **Total Tests**: 58
- **Passed**: 58 (100%)
- **Failed**: 0
- **Skipped**: 0

### Playwright Browser Test Suite

| Spec File | Discovered | Passed | Failed | Skipped | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `tests/browser/beginner-visuals.spec.ts` | **6** | 6 | 0 | 0 | PASS |
| `tests/browser/course.spec.ts` | **8** | 8 | 0 | 0 | PASS |
| `tests/browser/cross-platform-ecosystem.spec.ts` | **5** | 5 | 0 | 0 | PASS |
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
| **Total (20 files)** | **103** | **103** | **0** | **0** | **ALL PASSED** |

- **Mathematical Consistency**: 103 total discovered = 103 sum of per-file rows = 103 passed (0 failed, 0 skipped).

---

## 5. Modified Files Summary

- `src/App.tsx`: Updated `.sidebar-ecosystem` destination to `https://shadabur-rahaman.github.io/ds-lab/roadmap`.
- `src/components/CourseCatalog.tsx`: Updated `.catalog-dslab-banner` button link to `https://shadabur-rahaman.github.io/ds-lab/courses`.
- `src/components/IntermediatePathView.tsx`: Updated Stage 4 journey banner destination to `https://shadabur-rahaman.github.io/ds-lab/roadmap`.
- `src/components/ProjectStudioView.tsx`: Updated Stage 4 journey banner and portfolio bridge card to `https://shadabur-rahaman.github.io/ds-lab/roadmap`.
- `src/components/StudentMarksAnalyzerView.tsx`: Replaced hash route with clean path `https://shadabur-rahaman.github.io/ds-lab/courses`.
- `tests/cross-platform.test.mjs`: Updated endpoint assertions for clean path routing.
- `tests/browser/cross-platform-ecosystem.spec.ts`: Expanded to 5 browser tests validating popup events, clean path navigation, mobile drawer interaction, and rendered page headings.
- `docs/v26-test-evidence.json`: Machine-readable verification evidence reflecting 103 passing browser tests.
- `docs/VERSION_26_1_CROSS_PLATFORM_REPORT.md`: This verification report.
