# Python Lab Version 16 — Complete Visual Learning Curriculum Audit
## Scope: Chapters 11 to 15 Interactive Visual Learning & Quality Audit

### Executive Summary
Following the visual learning transformations of Chapters 0–5 (Version 14) and Chapters 6–10 (Version 15), Version 16 completes the interactive visual curriculum across all 16 chapters by elevating Chapters 11–15 with beginner-friendly language, relatable analogies, and custom interactive visual models.

Audit baseline at commit `3dfc47d`:
- 34 passing Node unit tests (`node --test tests/*.test.mjs`).
- 60 passing Playwright browser tests (`npx playwright test`).
- Production build passing with 0 TypeScript/Vite errors.

---

### Chapter-by-Chapter Audit Findings

| Chapter | Title | Current Theoretical Friction / Missing Visuals | Version 16 Visual Learning Solution |
| :--- | :--- | :--- | :--- |
| **11** | Functions & Reusable Code | • Beginners struggle to distinguish function definition from function execution.<br>• Parameter vs argument terminology is often confused.<br>• `return` vs `print()` is a common pitfall (beginners forget that `print` produces `None` in callers).<br>• `ConceptModel` only renders generic text flow. | • Reusable machine analogy: "A function is like a machine: feed it arguments, execute the recipe, return the output."<br>• Interactive Function Visualizer: **Inputs (Arguments) ➔ Function (`subtotal(price, qty)`) ➔ Local Calculation ➔ Return Value ➔ Screen Output**.<br>• Argument changer showing live parameter binding, local scope variables, and caller display. |
| **12** | Your First Mini-Projects | • Jump from isolated single-concept exercises to multi-step projects can overwhelm beginners.<br>• Unclear visualization of how variables, loops, conditions, and functions fit together into a real architecture.<br>• `ConceptModel` lacks visual project structure. | • Interactive Project Builder & Architecture Visualizer: Data Flow Diagram (**Inputs ➔ Processing / Logic ➔ Running Accumulator ➔ Final Output**).<br>• Structured 7-stage project blueprint: Understand ➔ Inputs ➔ Logic ➔ Implement ➔ Test ➔ Debug ➔ Reflect.<br>• Test-case inspector testing normal, edge, and error-handling cases. |
| **13** | Transforming Collections | • List comprehensions look intimidating as compact one-line syntax.<br>• Unclear visual distinction between which items pass the filter and which are skipped.<br>• Learners confuse operations that return a new list (`sorted()`, comprehensions) with in-place mutations (`list.sort()`).<br>• `ConceptModel` has no interactive component. | • Interactive Data Transformation Pipeline: **Original Data `[50, 100, 200]` ➔ Filter Condition (`amount >= minimum`) ➔ Filtered Result**.<br>• Interactive threshold selector: cards visually marked with `✓ Keep` (green) or `✗ Skip` (dimmed red).<br>• Comprehension anatomy breakdown card connecting output expression, iteration, and filter condition. Data Science connection. |
| **14** | Files, JSON & Exceptions | • Filesystem operations and JSON parsing feel abstract in browser environments.<br>• Beginners frequently confuse `FileNotFoundError` (missing path) with `JSONDecodeError` (malformed JSON format).<br>• Lack of visual branching for `try/except` recovery.<br>• `ConceptModel` lacks custom visual components. | • Interactive File Processing Journey: **File ➔ Read UTF-8 Text ➔ `try: json.loads()` ➔ Parsed Value or Handled Exception**.<br>• Interactive file state selector: Valid JSON, Missing File (`FileNotFoundError`), and Malformed JSON (`JSONDecodeError`).<br>• Visual branching flowchart showing execution jumping straight to the matching `except` block, preventing application crashes. |
| **15** | Classes & Object State | • The concept of `self`, instances, and classes is the biggest conceptual leap in beginner Python.<br>• Beginners fall into the shared mutable class attribute pitfall (`class Cart: items = []`).<br>• `ConceptModel` has no dedicated component. | • Interactive Object State Visualizer: Side-by-side **Cart A** and **Cart B** instances.<br>• Live item adder: Adding items to Cart A increments Cart A (`₹40, ₹80...`), while Cart B remains completely isolated (`0 items · ₹0`).<br>• Shared Mutable State Callout: Side-by-side comparison of class-level shared list (bug) vs `__init__` per-instance allocation (correct). |

---

### Technical & Factual Audit: Chapter 8 Reporting Discrepancy
- **Audit Investigation**: During the Version 15 audit review, an inconsistency was identified in Chapter 8:
  - In `src/components/ConceptModel.tsx` line 231, the slice demonstration displayed:
    `"PYTHON"[0:3] ➔ "Pyt"`
  - Slicing the uppercase string `"PYTHON"` from index 0 to 3 extracts characters `'P'`, `'Y'`, `'T'`, which produces `"PYT"`, not `"Pyt"`.
  - **Resolution**: Fix the string literal in `ConceptModel.tsx` to `"PYT"`, update `tests/browser/visual-models-ch6-10.spec.ts` accordingly, and ensure full Python consistency.

---

### Invariant & Compatibility Preservation
1. **Curriculum & Intermediate Invariants**:
   - `curriculum.ts`: 13 ordered chapters (0–12).
   - `intermediate.ts`: 3 ordered chapters (13–15).
   - All tests in `tests/platform.test.mjs` (`chapters.length === 13`, `story.length > 100`, `application.length > 30`, `concepts.length >= 4`, `examples.length >= 2`, `tasks.length === 3`, `quiz.length >= 7`, Python execution checks) remain 100% satisfied.
2. **Pilot Activities & Practice Checks**:
   - `pilotActivities[11..15]` remain intact with verified solutions and test assertions in `PilotLesson.tsx`.
3. **Responsive Mobile Constraint**:
   - `document.documentElement.scrollWidth - innerWidth <= 1px` across 360px, 390px, 768px, 1366px, and 1440px viewports.
