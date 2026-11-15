# Python Lab V23 — Practice Coverage & Curriculum Audit

**Audit Date:** November 2026  
**Auditor:** Principal React/TypeScript Engineer, Python Educator & QA Specialist  
**Target Repository:** `https://github.com/Shadabur-Rahaman/python-lab`  
**Reference Baseline:** V22 Release (Commit `215e035197b27d679b533a138df2962b29ed2f32`)

---

## 1. Executive Summary & Inventory Reconciliation

An exhaustive audit of the Python Lab repository was conducted to inspect practice coverage, exercise distribution, grading integrity, and feedback fidelity across the curriculum.

### Verified Asset Counts

| Asset Category | Reported Count | Actual Verified Count | Verification Source |
|---|:---:|:---:|---|
| **Foundational Chapters** | 16 | **16** (Chapters 0–15) | `curriculum.ts` (0–12) + `intermediate.ts` (13–15) |
| **Beginner Graded Challenges** | 39 | **39** | `curriculum.ts` (`allTasks.length` = 13 × 3) |
| **Intermediate Graded Challenges** | 9 | **9** | `intermediate.ts` (3 × 3) |
| **Total Graded Coding Challenges** | 48 | **48** | Verified across all 16 chapters |
| **Guided Projects** | 11 | **11** | `projects.ts` (Projects 1–11) |
| **Chapter Checkpoints** | 16 | **16** | `checkpoints.ts` (1 per chapter) |
| **Syntax Academy Topics** | 30 | **30** | `src/data/syntax/` catalog |
| **Chapter Quizzes** | 16 | **16** (112 questions) | 7 questions per chapter in `curriculum.ts` & `intermediate.ts` |

---

## 2. Chapter-by-Chapter Practice Mapping

The table below maps all 16 foundational chapters, their core learning objectives, and their existing practice coverage across the three core formats: **Predict the Output**, **Find and Fix the Bug**, and **Write the Code Yourself**.

| Ch # | Chapter Title | Core Learning Objectives | Predict Output | Find & Fix Bug | Graded Coding Challenges | Checkpoint Task |
|:---:|---|---|:---:|:---:|:---:|:---:|
| **0** | Before Python | Algorithm thinking, IPO rhythm, statement sequencing | ❌ *Missing* | ❌ *Missing* | 3 tasks (`0-0`, `0-1`, `0-2`) | Chai recipe automation |
| **1** | Your First Python Program | `print()`, strings, numbers, case sensitivity, comments | ❌ *Missing* | ❌ *Missing* | 3 tasks (`1-0`, `1-1`, `1-2`) | 2-line receipt |
| **2** | Variables and Values | Identifiers, assignment `=`, snake_case, updates | ✅ (Chai shop bill) | ✅ (`totel` NameError) | 3 tasks (`2-0`, `2-1`, `2-2`) | Basket item update |
| **3** | Data Types & Conversion | `int`, `float`, `str`, `bool`, `type()`, explicit casts | ✅ (Text to int) | ✅ (`raw + 5` TypeError) | 3 tasks (`3-0`, `3-1`, `3-2`) | Text price conversion |
| **4** | Taking User Input | `input()`, string-to-number conversion, prompt queue | ✅ (Ticket count) | ✅ (`input() + 1` TypeError) | 3 tasks (`4-0`, `4-1`, `4-2`) | Quantity increment |
| **5** | Python Operators | `//`, `%`, arithmetic precedence, `==` vs `=` | ✅ (Box leftovers) | ✅ (`/` vs `//` quotient) | 3 tasks (`5-0`, `5-1`, `5-2`) | Box packing (17 // 5) |
| **6** | Making Decisions | `if`, `elif`, `else`, comparison operators, colons | ✅ (Pass/Fail threshold) | ✅ (Missing colon) | 3 tasks (`6-0`, `6-1`, `6-2`) | Order discount (500 boundary) |
| **7** | Loops & Repetition | `for`, `range(start, stop)`, `while`, `break`, `continue` | ✅ (`range(3)` stop bound) | ✅ (Missing loop indentation) | 3 tasks (`7-0`, `7-1`, `7-2`) | Ticket loop (1 to 3) |
| **8** | Working With Strings | 0-indexing, slicing `[start:stop]`, `.strip()`, immutability | ✅ (Customer name `.strip()`) | ✅ (Uncalled method `name.strip`) | 3 tasks (`8-0`, `8-1`, `8-2`) | Whitespace normalization |
| **9** | Lists & Tuples | `[]` mutable lists, `.append()`, `len()`, `()` tuples | ✅ (Index lookup `scores[1]`) | ✅ (`IndexError: 3`) | 3 tasks (`9-0`, `9-1`, `9-2`) | Shopping list append |
| **10** | Dictionaries & Sets | Key-value pairs `{}`, `.get(key, default)`, set uniqueness | ✅ (`product.get()` fallback) | ✅ (`KeyError: 'stock'`) | 3 tasks (`10-0`, `10-1`, `10-2`) | Word frequency count |
| **11** | Functions & Reusable Code | `def`, parameters, `return` vs `print()`, scope | ✅ (`subtotal(20, 5)`) | ✅ (`print` instead of `return`) | 3 tasks (`11-0`, `11-1`, `11-2`) | Subtotal return value |
| **12** | Your First Mini-Projects | Multi-step logic, expense tracking, accumulator loops | ✅ (Budget boundary check) | ✅ (Resetting total inside loop) | 3 tasks (`12-0`, `12-1`, `12-2`) | Test division by zero |
| **13** | Transforming Collections | List comprehensions, filtering, `sorted(..., reverse=True)` | ✅ (Comprehension count) | ✅ (Strict `>` vs `>=`) | 3 tasks (`trim-labels`, `passing-scores`, `sort-orders`) | Comprehension filter |
| **14** | Files, JSON & Exceptions | `open()`, `json.load()`, `try/except`, `FileNotFoundError` | ✅ (JSON array decode) | ✅ (Catching wrong exception) | 3 tasks (`read-count`, `read-names`, `load-stock`) | Missing file exception |
| **15** | Classes & Object State | `class`, `__init__`, `self.attr`, instance encapsulation | ✅ (Independent cart total) | ✅ (Shared class list bug) | 3 tasks (`make-counter`, `counter-reset`, `shopping-basket`) | Cart instance separation |

---

## 3. Findings & Identified Gaps

### Gap 1 — Missing Core Practice Formats in Chapters 0 and 1
- **Finding:** While Chapters 2–15 have Predict and Debug activities defined in `pilotActivities.ts`, Chapters 0 and 1 were completely absent from `pilotActivities`.
- **Educational Impact:** A complete beginner starting in Chapter 0 or 1 had no guided opportunities to predict what Python will do before running it, nor any safe beginner bugs to debug.
- **Action Plan:** Author high-quality, beginner-appropriate Predict and Debug exercises for Chapters 0 and 1 in `pilotActivities.ts` and integrate them into the practice architecture.

### Gap 2 — Practice Tab Disconnection
- **Finding:** In `LessonView.tsx`, the chapter "Practice" tab (`panel-practice`) only showed the single multiple-choice checkpoint and the 3 coding tasks (`TaskCard`). The Predict and Debug exercises were only accessible if the user remained in the "Guided" mode stepper of `PilotLesson`.
- **Educational Impact:** When students clicked on the "Practice" tab looking for targeted problem solving, they were immediately confronted with open-ended coding challenges without the preliminary scaffold of output prediction or bug fixing.
- **Action Plan:** Unify the Practice view within each chapter into a cohesive **Practice & Mastery Studio** with 3 distinct format cards:
  1. *Predict the Output* (prediction input, instant check, Pyodide execution, concept explanation, Hinglish memory hint)
  2. *Find and Fix the Bug* (live broken code in Pyodide, hint ladder, Pyodide execution, error explanation)
  3. *Write the Code Yourself* (graded challenges with 3-level progressive hints and intelligent feedback)

### Gap 3 — Weak, Repetitive 2-Line Hints Across Graded Challenges
- **Finding:** In `src/data/curriculum.ts`, the `tasks()` seed helper hardcoded:
  ```ts
  hints: [
    'Read the expected output carefully. Work out the result by hand first.',
    `Useful starting point: ${solution.split('\n')[0]}`
  ]
  ```
  This applied to all 39 beginner challenges.
- **Educational Impact:**
  1. Hint 1 was a static, non-actionable platitude.
  2. Hint 2 immediately revealed code from the solution (e.g., `Useful starting point: print("Hello Python")`), skipping the critical intermediate stages of conceptual recall and guidance.
  3. It completely lacked the required 3-level progression: Direction → Specific Guidance → Strong Hint.
- **Action Plan:** Replace the generic generator with bespoke, 3-tiered progressive hints for all challenges:
  - **Level 1 (Direction):** Concept reminder without code.
  - **Level 2 (Specific Guidance):** Pinpoints the exact variables, methods, or syntax to focus on.
  - **Level 3 (Strong Hint):** Shows an analogous structure or partial template without revealing the final answer.

### Gap 4 — Weak Assessment Feedback in CodeLab
- **Finding:** In `CodeLab.tsx`:
  - Output mismatch resulted in a generic note: `"Output differs. Compare your output with the expected result."`
  - Errors resulted in: `"Fix the error before checking your answer again."`
- **Educational Impact:** Beginners struggled to diagnose *why* their code didn't match:
  - Did they produce no output because they computed without `print()`?
  - Was there a case mismatch (e.g. `'even'` instead of `'Even'`)?
  - Was there extra trailing whitespace or newline discrepancies?
  - What kind of error occurred (SyntaxError vs NameError vs TypeError)?
- **Action Plan:** Implement intelligent diagnosis in `CodeLab.tsx`:
  - Distinguish empty output ("No output produced. Did you forget to call print()?").
  - Distinguish casing differences ("Output differs in letter casing. Check uppercase and lowercase letters.").
  - Distinguish whitespace differences ("Output spacing differs. Check spaces and newlines.").
  - Distinguish error families (SyntaxError, NameError, TypeError, IndexError, ValueError) with targeted advice.
  - Provide partial credit insight for test suites ("2 of 3 checks passed. Review edge cases.").

### Gap 5 — Binary Progress Tracking (No "Attempted" State)
- **Finding:** In `progress.mjs`, progress only tracked `visited` (page visited) and `solved` (check verified). There was no intermediate tracking of `attempted`.
- **Educational Impact:** Students who wrote code and ran it or modified a draft but hadn't yet achieved 100% check verification appeared indistinguishable from students who had never opened the challenge.
- **Action Plan:** Add backward-compatible `attempted: string[]` support to `progress.mjs` (migrating seamlessly from v2 storage) and update `TaskCard` and `PracticeView` to clearly display:
  - ⚪ **Not attempted**
  - 🟡 **Attempted**
  - 🟢 **Verified solved**

---

## 4. Conclusion & Transition to V23 Implementation

This audit establishes a solid, evidence-based foundation for Python Lab V23. All counts have been verified against the physical repository. The subsequent tasks will address each identified gap while strictly preserving existing functionality, real Pyodide execution, and backward compatibility.
