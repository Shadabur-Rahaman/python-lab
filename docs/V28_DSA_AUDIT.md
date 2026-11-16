# Python Lab Version 28 — DSA & Problem-Solving Arena Curriculum Audit

**Project:** Python Lab  
**Repository:** https://github.com/Shadabur-Rahaman/python-lab  
**Audit Date:** November 2026  
**Auditor:** Principal Python Engineer & Algorithms Educator  
**Baseline Release:** V27 (commit `09c1fcb`)  

---

## 1. Executive Summary

This audit assesses the algorithmic education and problem-solving readiness of Python Lab across all existing modules (Foundations Chapters 0–15, Intermediate Modules 1–5, Advanced Python Studio Modules 1–5, Practice Studio, and Project Studio).

While Version 27 introduced foundational Big-O complexity intuition and specialized standard library collections (`Counter`, `defaultdict`, `deque`) in Module 4 (`data-structures-algorithms`), Python Lab currently lacks a **dedicated algorithmic problem-solving arena** where students systematically learn, visualize, practice, and master data structures and algorithmic patterns.

### The Continuum Gap
Currently, the student journey moves from:
$$\text{Foundations (Ch 0–15)} \longrightarrow \text{Intermediate (5 Modules)} \longrightarrow \text{Advanced Studio (5 Modules)} \longrightarrow \text{Project Studio (4 Projects)}$$

Students transitioning from Advanced Python into large multi-file projects (such as `event-scheduler-pro` or `student-marks-analyzer`) frequently struggle when asked to:
1. Choose between hash sets, dictionaries, sorted lists, or deques for a given constraint set.
2. Formulate two-pointer or sliding window invariants instead of falling back to nested $O(N^2)$ loops.
3. Implement boundary-safe binary search loops without off-by-one errors.
4. Trace recursive call stacks and recognize stack overflow limits.
5. Reason rigorously about time and space complexity trade-offs between brute-force and optimal approaches.

---

## 2. Component-by-Component Audit

### A. Foundations Curriculum (Chapters 0–15)
- **Strengths**: Excellent visual models of variables, memory aliases, string indexing, list mutations, for/while loops, dictionaries, and functions.
- **Deficiencies for DSA**:
  - Focuses on basic language syntax rather than algorithmic problem-solving patterns.
  - Practice tasks test single-step outputs (e.g. printing a formatted string or summing a list) rather than algorithmic invariants.
  - No coverage of time/space complexity or multi-pointer techniques.

### B. Intermediate Python (5 Modules)
- **Strengths**: Teaches list comprehensions, generators, file handling, and standard library modules (`math`, `random`, `datetime`).
- **Deficiencies for DSA**:
  - Emphasizes Python idiomatic constructs rather than classic data structures or algorithms.
  - No coverage of binary search, stack/queue paradigms, or recursive problem decomposition.

### C. Advanced Python Studio (V27)
- **Existing Coverage**:
  - Module 4 introduces Big-O classification ($O(1)$, $O(\log N)$, $O(N)$, $O(N \log N)$, $O(N^2)$).
  - Demonstrates `collections.Counter`, `collections.defaultdict`, `collections.deque`.
  - Static visualizer: `complexity-matrix` comparison table.
  - Task: `adv-frequency-analyzer` (single log processing task).
- **Gaps Identified**:
  - No interactive step-by-step algorithm visualizers (e.g. stepping through pointers or call stacks).
  - No algorithmic patterns covered: Two Pointers, Sliding Window, Binary Search Invariants, Prefix Sums, Monotonic Stacks, Backtracking.
  - No collection of standalone algorithmic coding challenges with progressive difficulties and multi-case edge testing.

### D. Practice Studio & CodeLab Execution Architecture
- **Strengths**:
  - Pyodide WebAssembly worker (`public/python-worker.js`) running Python 3.12+ in the browser with standard library support.
  - Supports `data.tests` assertion suites and `data.cases` boolean checks (`bool(check)`).
  - Real-time syntax diagnostics in `CodeLab.tsx`.
- **Opportunities for Arena**:
  - Pyodide is fully capable of executing multi-case test harnesses, measuring execution results across boundary inputs (empty lists, duplicates, negative numbers, extreme constraints).
  - Can provide instant visual feedback on passed/failed test cases per problem.

### E. Project Studio
- **Strengths**: 4 multi-milestone software engineering projects (`expense-tracker-pro`, `inventory-management-pro`, `student-marks-analyzer`, `event-scheduler-pro`).
- **Role in Continuum**: Project Studio teaches multi-file application architecture, documentation, and portfolio exports. It is complementary to, but fundamentally different from, an Algorithmic Arena focused on pattern recognition, data structure selection, and optimal algorithmic design.

---

## 3. The V28 Learning Architecture: Problem-Solving Arena

To bridge these gaps without duplicating V27, Version 28 introduces:

### 1. Five Progressive DSA Modules
1. **Module 1 — Arrays, Lists & Strings**: Indexing, in-place traversals, frequency counting, prefix sums, two-pointer scanning, string tokenization and reconstruction.
2. **Module 2 — Hashing & Efficient Lookups**: Set/dict algorithms, duplicate detection, complement lookups (Two Sum pattern), frequency maps, grouping (Group Anagrams), Subarray Sum equals K ($O(N)$ with running prefix hash).
3. **Module 3 — Searching & Sorting**: Linear vs Binary Search, binary search invariants (`low <= high`, mid calculation, avoidance of infinite loops), custom sort keys (`key=lambda x: ...`), sorting stability, Timsort complexity.
4. **Module 4 — Stacks, Queues & Recursion**: LIFO stack mechanics, Monotonic stacks, bracket validation, FIFO queues, call stack tracing, recursion base cases, tree recursion, foundational backtracking.
5. **Module 5 — Algorithmic Problem-Solving Patterns**: Sliding window (fixed & variable size), two pointers (opposite ends & fast/slow), greedy interval scheduling, prefix sum queries, edge cases & invariant verification.

### 2. Six Interactive Step-by-Step Algorithm Visualizers
Interactive walkthrough visualizers with **Step Forward**, **Step Backward**, **Reset**, **Example Presets**, **State Inspection**, and **Synchronized Python Code**:
1. **Binary Search Visualizer**: Visualizes `low`, `mid`, `high` pointers narrowing the search space on a sorted array.
2. **Two-Pointer Visualizer**: Shows left and right pointers converging inwards to find a target sum.
3. **Sliding Window Visualizer**: Displays dynamic window expansion and contraction over an array.
4. **Stack Operations & Bracket Matcher**: Shows elements pushing to and popping from a vertical stack with bracket balance tracking.
5. **Recursive Call Stack Tracing**: Displays call frames being pushed onto and popped from the execution stack with return values.
6. **Sorting Walkthrough (Insertion Sort)**: Shows the sorted partition expanding as unsorted elements are shifted into position.

### 3. Curated Problem-Solving Arena (24 Challenges)
A suite of 24 distinct, high-yield algorithmic challenges spanning 3 difficulty tiers (Beginner, Intermediate, Advanced) across 6 topic domains:
- Arrays & Strings (4 problems)
- Hashing & Sets (4 problems)
- Searching & Sorting (4 problems)
- Stacks & Queues (4 problems)
- Two Pointers & Sliding Window (4 problems)
- Recursion & Backtracking (4 problems)

Each challenge features:
- Problem brief, input/output specifications, and constraints.
- Behavioral test suite testing standard cases, empty inputs, singletons, duplicates, negative values, and anti-hardcoding guards.
- 3-tier progressive hint ladder.
- Complexity analysis comparing Brute Force vs. Optimal approaches ($O(\text{Time})$ and $O(\text{Space})$).
- Clean, idiomatic Python solution with explanatory commentary.

### 4. Storage & Progress Preservation
- Dedicated LocalStorage key: `python-lab.dsa-arena.v1`.
- Fully isolated from `python-lab.progress.v1`, `python-lab.intermediate.v1`, `python-lab.advanced.v1`, and `python-lab.project-studio.v1`.
- No disruption or data loss for existing users.

---

## 4. Verification & Quality Gates

The V28 implementation will be verified through:
- Targeted Node.js unit tests (`tests/dsa-arena.test.mjs`) testing all problem data models, starter code, test suites, and reference solutions.
- Targeted Playwright browser tests (`tests/browser/dsa-arena.spec.ts`) validating navigation, topic filtering, visualizer step controls, code editor execution, and progress persistence.
- Full release verification pipeline (`scripts/verify-release.mjs`) ensuring 100% pass rate across unit tests and all browser test files with mathematical count integrity.
