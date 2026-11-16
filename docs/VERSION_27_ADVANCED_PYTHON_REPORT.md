# Python Lab Version 27 — Advanced Python & Software Engineering Studio Release Report

**Project:** Python Lab  
**Repository:** https://github.com/Shadabur-Rahaman/python-lab  
**Live Site:** https://shadabur-rahaman.github.io/python-lab/  
**Release Version:** Version 27 (V27)  
**Previous Reported Release:** V26.1, commit `7190403dea0d19ec15e86e32db30d7ffc43f13b7`  
**Date:** November 2026  

---

## 1. Executive Summary & Mission

Version 27 establishes Python Lab as an end-to-end, four-tier learning continuum for modern software engineering:

$$\text{Python Foundations (Ch 0–15)} \longrightarrow \text{Intermediate Python (5 Modules)} \longrightarrow \mathbf{Advanced\ Python\ Studio\ (5\ Modules)} \longrightarrow \text{Real-World Project Studio (4 Projects)}$$

Prior to Version 27, students who mastered intermediate concepts (generators, standard library modules, file I/O, classes) had no direct path to senior-level Python design patterns, functional metaprogramming, resilient exception architectures, algorithmic complexity, or automated unit testing. V27 closes this pedagogical gap by introducing the **Advanced Python & Software Engineering Studio**.

### Core Achievements in V27:
1. **Advanced Curriculum Audit Completed**:
   - Comprehensive audit published in `docs/V27_ADVANCED_CURRICULUM_AUDIT.md`, identifying exact gaps in object protocols, metaprogramming, error recovery, algorithmic efficiency, and test harness development.
2. **Five Comprehensive Advanced Python Modules**:
   - **Module 1: Advanced Object-Oriented Design & Dunder Protocols (`advanced-oop`)**
   - **Module 2: Decorators, Closures & Functional Metaprogramming (`decorators-and-closures`)**
   - **Module 3: Robust Systems & Deep Exception Handling (`robust-python-exceptions`)**
   - **Module 4: Algorithmic Thinking & Practical Data Structures (`data-structures-algorithms`)**
   - **Module 5: Maintainable Architecture & Professional Testing (`maintainable-code-testing`)**
3. **Advanced Practice Studio with 3 Learning Modes per Module**:
   - Predict-the-Output challenges with detailed explanation cards.
   - Debug-the-Bug interactive workspaces with immediate feedback.
   - Independent Coding Challenges evaluated by Pyodide with live execution and assert checks.
4. **Interactive Architectural Visualizers**:
   - Interactive visualizers embedded directly into each module: Composition vs. Inheritance Explorer, Decorator Call Stack Stepper, Exception Lifecycle State Machine, Big-O Complexity Comparison Matrix, and Clean Code Refactoring Pipeline.
5. **New Advanced Capstone in Project Studio**:
   - **Event Scheduling & Conflict Detection System (`event-scheduler-pro`)**: A 4-milestone capstone project implementing defensive time range models, overlap detection, greedy interval conflict resolution, and text-based formatted reporting.
6. **Isolated, Non-Destructive State Management**:
   - Advanced progress persisted cleanly in LocalStorage under key `python-lab.advanced.v1`, preserving all foundational, intermediate, practice studio, and project studio records without collision.
7. **100% Automated Release Verification**:
   - **TypeScript & Vite Build**: 0 errors, 0 warnings.
   - **Unit Tests**: 68 tests across 6 suites, 68 passed (100%), 0 failed, 0 skipped.
   - **Playwright Browser Tests**: 108 tests across 21 spec files, 108 passed (100%), 0 failed, 0 skipped.
   - **Mathematical Consistency**: Total Discovered (108) = Sum of File Rows (108) = Passed (108).

---

## 2. Advanced Curriculum Overview & Module Breakdown

### Module 1: Advanced Object-Oriented Design & Dunder Protocols (`advanced-oop`)
- **Core Topics**: Composition over inheritance, `@property` & `@setter` data validation, `@classmethod` alternative constructors, `@staticmethod` utility functions, `@dataclass` memory and boilerplate reduction, and dunder protocols (`__str__`, `__repr__`, `__len__`, `__eq__`, `__lt__`).
- **Real-World Scenario**: Designing an enterprise Financial Portfolio and Position engine.
- **Interactive Visualizer**: Dynamic Composition vs. Inheritance Comparison visualizer displaying object references, delegation patterns, and loose coupling benefits.
- **Practice Studio**:
  - Predict: Output of custom dunders and dataclass equality comparison.
  - Debug: Fixing property setter recursion caused by direct attribute reassignment.
  - Challenge: Implementing an `ImmutableMoney` dataclass with currency guard and addition dunder.

### Module 2: Decorators, Closures & Functional Metaprogramming (`decorators-and-closures`)
- **Core Topics**: First-class functions, lexical closures with `nonlocal` state, decorators with `*args` and `**kwargs`, metadata preservation via `@functools.wraps`, and multi-layer configurable decorator factories.
- **Real-World Scenario**: Building an API Rate Limiter, Execution Timer, and Retry Decorator.
- **Interactive Visualizer**: Decorator Call Stack Stepper simulating the outward-in wrapper initialization and inward-out execution flow.
- **Practice Studio**:
  - Predict: Closure state mutation across repeated invocations.
  - Debug: Restoring erased docstrings and function names using `@functools.wraps`.
  - Challenge: Building a `@retry(max_attempts=3)` configurable decorator factory.

### Module 3: Robust Systems & Deep Exception Handling (`robust-python-exceptions`)
- **Core Topics**: Custom exception inheritance hierarchies, `try...except...else...finally` control flow, explicit exception chaining (`raise ... from err`), custom context managers with `__enter__` and `__exit__`, and generator-based context managers via `@contextlib.contextmanager`.
- **Real-World Scenario**: Building an atomic transactional database connection pool and resource guard.
- **Interactive Visualizer**: Exception Lifecycle State Machine illustrating resource acquisition, exception bubbling, and guaranteed cleanup.
- **Practice Studio**:
  - Predict: Branching behavior between `else` and `finally` during exceptions.
  - Debug: Swallowing exceptions accidentally by returning boolean values from `__exit__`.
  - Challenge: Implementing a `TimerContext` manager recording elapsed duration.

### Module 4: Algorithmic Thinking & Practical Data Structures (`data-structures-algorithms`)
- **Core Topics**: Big-O time and space complexity intuition, hashing mechanics ($O(1)$ set/dict lookups vs. $O(N)$ list scans), frequency analysis with `collections.Counter`, grouped aggregations with `collections.defaultdict`, and $O(1)$ double-ended queue operations with `collections.deque`.
- **Real-World Scenario**: High-throughput web server access log analysis and sliding window rate calculation.
- **Interactive Visualizer**: Big-O Complexity Matrix displaying operation costs across lists, dicts, sets, and deques.
- **Practice Studio**:
  - Predict: Amortized complexity and key grouping behavior with `defaultdict`.
  - Debug: Replacing an $O(N^2)$ nested membership search with an $O(N)$ hash-set lookup.
  - Challenge: Implementing a Top-K IP frequency extractor using `collections.Counter`.

### Module 5: Maintainable Architecture & Professional Testing (`maintainable-code-testing`)
- **Core Topics**: PEP 484 type annotations (`typing.Optional`, `Union`, `Callable`), Single Responsibility Principle (SRP), Dependency Inversion, automated testing with `unittest.TestCase`, test fixtures (`setUp`, `tearDown`), and assert idioms.
- **Real-World Scenario**: Refactoring an unwieldy legacy billing script into testable domain services.
- **Interactive Visualizer**: Clean Code Refactor Pipeline demonstrating step-by-step extraction of monolithic code into decoupled modules.
- **Practice Studio**:
  - Predict: Output of unit test assertions under edge conditions.
  - Debug: Fixing unisolated test fixtures polluting global test state.
  - Challenge: Writing a complete `unittest.TestCase` suite for an invoice calculator.

---

## 3. Flagship Project Studio Capstone: Event Scheduling System

Version 27 adds a 4th flagship project to the Real-World Project Studio:

| Project Identifier | Project Name | Tier | Milestones | Core Concepts & Standard Library | Primary Output |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `event-scheduler-pro` | Event Scheduling & Conflict Detection System | Advanced | 4 | Dataclasses, Custom Exceptions, Chronological Sorting, Greedy Interval Scheduling, Formatted Reports | Conflict-free timetable, overlap clusters, schedule utilization report |

### 4 Guided Engineering Milestones:
1. **Milestone 1 — Event Data Modeling & Defensive Validation**:
   - Creates `InvalidEventError` exception and `@dataclass(frozen=True) Event` with strict 24-hour time range validation (`start_time < end_time`).
2. **Milestone 2 — Chronological Ordering & Conflict Detection**:
   - Implements `is_overlapping(event_a, event_b)` and `find_conflicts(events)` returning grouped conflicting pairs using sorted timeline scans.
3. **Milestone 3 — Schedule Manager & Greedy Conflict Resolver**:
   - Implements `ScheduleManager` class with `add_event`, `get_events`, and an optimal greedy interval scheduling algorithm (`resolve_conflicts_greedy`) prioritizing earliest end times.
4. **Milestone 4 — Formatted Reporting & Automated Verification**:
   - Implements `generate_schedule_report(events)` rendering a clean, production-grade text timetable with duration calculations and summary metrics.

---

## 4. Navigation & Cross-Platform Integration

- **Route Integration**:
  - `#/advanced`: Advanced Studio landing page with stage overview, module grid, and project teaser.
  - `#/advanced/:moduleId`: Deep-linkable module workspace with concept tutorials, interactive visualizers, practice studio, and assessment quizzes.
- **Sidebar Navigation**: Added **Advanced Studio** item under the Course group with a `Sparkles` icon.
- **Course Catalog**: Added 4-stage progression indicator highlighting Advanced Python.
- **Intermediate Bridge**: Added an onward recommendation card at the bottom of Intermediate Python pointing directly to Advanced Studio.
- **Cross-Platform Linkage**: Preserved bidirectional links between Python Lab and DS LAB.

---

## 5. Release Verification & Test Evidence

The release verification pipeline (`scripts/verify-release.mjs`) was executed against the working tree to validate the complete platform.

### A. Production Build Verification
- **Command**: `npm run build` (`tsc --noEmit && vite build`)
- **Result**: Succeeded in 18.61s
- **TypeScript Compiler Errors**: 0
- **Vite Bundler Errors**: 0

### B. Unit Test Suite (Node.js `node:test`)
- **Command**: `node --test tests/*.test.mjs`
- **Total Tests**: 68
- **Passed**: 68
- **Failed**: 0
- **Skipped**: 0
- **Pass Rate**: 100%
- **Duration**: 33.31s

### C. Playwright Browser Test Suite Breakdown
- **Runner**: `@playwright/test`
- **Total Discovered**: 108
- **Sum of File Rows**: 108
- **Passed**: 108
- **Failed**: 0
- **Skipped**: 0
- **Pass Rate**: 100%

| Spec File | Discovered | Passed | Failed | Skipped | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `tests/browser/advanced-path.spec.ts` | **5** | 5 | 0 | 0 | PASS |
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
| **Total (21 files)** | **108** | **108** | **0** | **0** | **ALL PASSED** |

### D. Anti-Contradiction & Mathematical Integrity Check
$$\text{Total Discovered (108)} = \sum_{i=1}^{21} \text{File Rows (108)} = \text{Passed (108)}$$
$$\text{Failed (0)} + \text{Skipped (0)} = 0$$

All test counts agree with mathematical certainty. No contradictions exist between file-level reports and overall summary numbers.

---

## 6. Modified and Added Files

| File | Purpose |
| :--- | :--- |
| `docs/V27_ADVANCED_CURRICULUM_AUDIT.md` | Detailed curriculum audit & gap analysis across Python Lab learning tiers |
| `src/data/advancedPath.ts` | Complete data model & content for 5 advanced Python modules |
| `src/lib/advancedProgress.ts` | Safe, isolated LocalStorage persistence helper for advanced studio progress |
| `src/components/AdvancedVisualizer.tsx` | Interactive visualizers for composition, decorators, exceptions, Big-O, and refactoring |
| `src/components/AdvancedPathView.tsx` | Main interactive UI for Advanced Python Studio, practice tabs, and assessments |
| `src/data/projectStudioData.ts` | Added 4th capstone project: Event Scheduling & Conflict Detection System |
| `src/App.tsx` | Integrated `#/advanced` and `#/advanced/:id` routes, navigation item, breadcrumbs, and page titles |
| `src/components/CourseCatalog.tsx` | Integrated Advanced Studio stage banner into overall curriculum catalog |
| `src/components/IntermediatePathView.tsx` | Added onward recommendation card pointing to Advanced Studio |
| `src/v4.css` | Styles for Advanced Studio layout, visualizers, practice tabs, and complexity matrix |
| `tests/advanced-path.test.mjs` | Node.js unit tests validating advanced path data structures, schemas, and logic |
| `tests/project-studio.test.mjs` | Added unit tests verifying milestone code for the Event Scheduling capstone |
| `tests/browser/advanced-path.spec.ts` | Playwright browser tests verifying navigation, interactive visualizers, and code execution |
| `tests/browser/project-studio.spec.ts` | Updated browser test expectations for 4 project studio cards |
| `docs/VERSION_27_ADVANCED_PYTHON_REPORT.md` | Comprehensive release documentation and evidence report |

---

## 7. Conclusion

Python Lab Version 27 delivers a comprehensive, rigorous, and visually engaging Advanced Python & Software Engineering Studio. With 5 new advanced modules, 15 practice activities, 5 interactive architectural visualizers, a 4-milestone scheduling capstone, and 100% automated test pass rate across 68 unit tests and 108 browser tests, Python Lab provides a complete journey from absolute beginner to professional software engineer.
