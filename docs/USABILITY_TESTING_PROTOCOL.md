# Python Lab Version 18 — Beginner Usability Testing Protocol & Observation Framework

## 1. Objectives & Overview

This protocol defines a standardized, repeatable usability test designed to evaluate the learning quality, interface clarity, and cognitive load of Python Lab for absolute beginners (learners with zero prior programming experience).

- **Target Participants:** 5 first-time learners (zero programming experience in Python or any other language).
- **Environment:** Standard modern desktop browser (Chrome/Edge/Firefox) and mobile viewport (375px/390px phone).
- **Session Duration:** 15–20 minutes per participant.
- **Methodology:** Think-aloud protocol with minimal moderator intervention.
- **Primary Version 18 Focus:** Focused Learning Mode, progressive chapter tabs (`Guided Learning`, `Detailed Reference`, `Practice & Quiz`), visual clutter reduction, and unassisted progression.

---

## 2. Core Evaluation Metrics

| Metric | Measurement | Target / Benchmark |
| :--- | :--- | :--- |
| **Task Completion Rate (TCR)** | % of participants completing task successfully | >= 90% across all 8 tasks |
| **Time on Task (TOT)** | Seconds from prompt reading to task completion | Tasks 1–2: < 30s; Tasks 3–5: < 90s; Tasks 6–8: < 60s |
| **Mode Switching Intuition** | % who successfully discover and switch between Guided, Reference, and Practice | 100% unassisted discovery |
| **Error Recovery Rate** | % of syntax/runtime errors resolved without moderator assistance | >= 85% unassisted recovery |
| **Single Ease Question (SEQ)** | Post-task 7-point rating ("Overall, how easy was this task?") | >= 6.0 / 7.0 average |
| **System Usability Scale (SUS)** | 10-item post-study usability survey | >= 85 / 100 ("Grade A") |

---

## 3. Eight Core Beginner Tasks (15–20 min total)

### Task 1: Find Where to Begin
- **Prompt:** "You have never coded before. Open Python Lab and find where you should start learning."
- **Expected Flow:** Participant lands on Homepage, notices the hero callout or "I’m completely new to coding" card, and selects "Start Learning Python" or "Start Chapter 0".
- **Success Criteria:** Navigates to Chapter 0 or Chapter 1 within 30 seconds without hesitation.

### Task 2: Run Your First Python Program
- **Prompt:** "Run the starter program you see on the screen to see what Python produces."
- **Expected Flow:** Participant locates the "Run Code" button (with play icon) and clicks it. Observes the progressive initialization stages and views output in STDOUT.
- **Success Criteria:** Successfully triggers run and observes standard output within 20 seconds.

### Task 3: Experience Focused Learning Mode
- **Prompt:** "Navigate to Chapter 2 (Variables and Values). Describe the layout you see. Do you feel overwhelmed by scrolling?"
- **Expected Flow:** Participant observes the clean, compact chapter card, the 3-tab mode switcher (`Guided Learning`, `Detailed Reference`, `Practice & Quiz`), and the active 5-stage activity.
- **Success Criteria:** Notes the uncluttered layout; scrolling is manageable (< 3 mousewheel scrolls) without encountering a massive 12,000px wall of text.

### Task 4: Switch Learning Modes
- **Prompt:** "You want to read in-depth theory notes about variable naming, and then you want to take the chapter quiz. How do you find them?"
- **Expected Flow:** Participant clicks the `Detailed Reference` tab to read naming rules, then clicks `Practice & Quiz` (or uses the quick jump navigation) to access the quiz.
- **Success Criteria:** Switches modes smoothly within 15 seconds; notices that code drafts and lesson position remain intact across tab changes.

### Task 5: Solve a Guided Activity Challenge
- **Prompt:** "In Chapter 2 Guided Learning, complete the tea shop billing activity through to the Practice stage."
- **Expected Flow:** Participant explores the price slider in Discover, predicts the output in Predict, fixes the missing price in Debug, and writes `travel = 40; food = 60` in Practice.
- **Success Criteria:** Completes the challenge, sees `✓ Activity solved`, and notices the completion prompt offering 1-click continuation.

### Task 6: Recover from a Syntax Mistake
- **Prompt:** "In the editor, intentionally type `Print('Hi')` with a capital P (or delete a quote) and run the code."
- **Expected Flow:** Participant encounters a beginner-friendly error card explaining case-sensitivity (`print` vs `Print`), edits the mistake directly in the editor, and re-runs.
- **Success Criteria:** Resolves the syntax mistake unassisted within 45 seconds.

### Task 7: Look Up a Syntax Reference
- **Prompt:** "Find the Syntax Academy to look up how to repeat instructions, or search for 'repeat code'."
- **Expected Flow:** Participant selects "Syntax" in navigation or uses search, types "repeat code", and finds the `loops` card.
- **Success Criteria:** Finds the loops reference card within 45 seconds and explores the copyable example.

### Task 8: Check Progress & State Persistence
- **Prompt:** "Refresh your browser tab or close and re-open the website. Check whether your progress, drafts, and selected mode are still saved."
- **Expected Flow:** Participant refreshes page, checks the sidebar progress bar and recent chapter, or visits Chapter 2 to see saved code draft and mode state.
- **Success Criteria:** Progress percentage, editor code, and mode tabs are completely restored from local storage.

---

## 4. Participant Observation Sheet

| Participant | Task 1 (Start) | Task 2 (Run) | Task 3 (Focused) | Task 4 (Modes) | Task 5 (Solve) | Task 6 (Error) | Task 7 (Syntax) | Task 8 (Save) | Overall SEQ | SUS Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P01** | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `/ 7` | `/ 100` |
| **P02** | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `/ 7` | `/ 100` |
| **P03** | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `/ 7` | `/ 100` |
| **P04** | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `/ 7` | `/ 100` |
| **P05** | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `[  ]s` | `/ 7` | `/ 100` |

---

## 5. Participant Testing Status Roster

> [!IMPORTANT]
> **Human Usability Testing Status: PENDING**  
> In accordance with Google Antigravity testing standards, automated end-to-end browser specifications (`tests/browser/*.spec.ts`) continuously verify that all technical flows, mode tab switches, keyboard interactions, error feedback cards, and responsive controls operate cleanly. Actual human usability evaluations with live beginner subjects remain **PENDING** and will be conducted according to the schedule below without simulated or fabricated participant data.

| Participant ID | Target Profile | Device & Viewport | Testing Status | Session Scheduled |
| :--- | :--- | :--- | :--- | :--- |
| **P01** | Complete novice, zero programming background | Desktop Chrome (1440×900) | **PENDING** | Upcoming Cohort A |
| **P02** | Non-technical student, first time with Python | Desktop Firefox (1366×768) | **PENDING** | Upcoming Cohort A |
| **P03** | Smartphone-first learner | Mobile Safari (390×844 phone) | **PENDING** | Upcoming Cohort B |
| **P04** | Smartphone learner, entry-level Android | Mobile Chrome (360×800 phone) | **PENDING** | Upcoming Cohort B |
| **P05** | Tablet learner, touchscreen touch targets | iPad Safari (768×1024 tablet) | **PENDING** | Upcoming Cohort C |

---

## 6. Post-Test Debrief Questions

1. "When you opened Chapter 2, was it immediately clear what you were supposed to do first?"
2. "How did switching between Guided Learning, Detailed Reference, and Practice & Quiz feel? Did you lose your place at any point?"
3. "Did you feel you had to scroll too much, or was everything within easy reach?"
4. "How did the error explanations compare to what you expected from a coding website?"
5. "Would you feel confident continuing to Chapter 3 on your own tomorrow?"
