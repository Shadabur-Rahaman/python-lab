# Python Lab: Beginner Usability Testing Protocol (Version 13)

## 1. Objectives & Overview
This protocol outlines a standardized, repeatable usability test designed to evaluate the learning quality, interface clarity, and cognitive friction of Python Lab for absolute beginners (learners with zero prior programming experience).

- **Target Participants:** 3–5 first-time learners (no prior programming experience in Python or any other language).
- **Environment:** Standard modern desktop browser (Chrome/Edge/Firefox) and mobile viewport (375px/390px phone).
- **Session Duration:** 30–40 minutes per participant.
- **Methodology:** Think-aloud protocol with minimal moderator intervention.

---

## 2. Core Evaluation Metrics

| Metric | Measurement | Target / Benchmark |
| :--- | :--- | :--- |
| **Task Completion Rate (TCR)** | % of participants completing task successfully | >= 90% across all 7 tasks |
| **Time on Task (TOT)** | Seconds from prompt reading to task completion | Tasks 1–2: < 45s; Tasks 3–5: < 120s |
| **Hint Dependency** | Number of hints revealed before solving (0, 1, 2, or 3) | <= 1 hint on average |
| **Error Recovery Rate** | % of syntax/runtime errors resolved without moderator assistance | >= 85% unassisted recovery |
| **Single Ease Question (SEQ)** | Post-task 7-point rating ("Overall, how easy was this task?") | >= 6.0 / 7.0 average |
| **System Usability Scale (SUS)** | 10-item post-study usability survey | >= 85 / 100 ("Grade A") |

---

## 3. Seven Core Beginner Tasks

### Task 1: Find Where to Begin
- **Prompt:** "You have never coded before. Open Python Lab and find where you should start learning."
- **Expected Flow:** Participant lands on Homepage, notices the hero callout or "I’m completely new to coding" card, and selects "Start Learning Python" or "Start Chapter 0".
- **Success Criteria:** Navigates to Chapter 0 or Chapter 1 within 30 seconds without hesitation.
- **Observations to Record:** Did the participant click "Try Python Now", hero button, or roadmap card?

### Task 2: Run Your First Python Program
- **Prompt:** "Run the starter program you see on the screen to see what Python produces."
- **Expected Flow:** Participant locates the "Run Code" button (with play icon) and clicks it. Observes the progressive initialization stages (1. Preparing → 2. Loading files → 3. Starting engine → 4. Ready) and views "Hello, World!" in STDOUT.
- **Success Criteria:** Successfully triggers run and observes standard output within 20 seconds.
- **Observations to Record:** Did the stage indicators provide reassurance during WebAssembly initialization?

### Task 3: Modify Code and Observe Results
- **Prompt:** "Change the program so it prints your own name instead of 'World', then run it."
- **Expected Flow:** Participant clicks inside the editor quotes, types their name (e.g., `print("Hello, Noor!")`), and clicks "Run Code".
- **Success Criteria:** Correctly preserves quotation marks and sees their name in the output console.
- **Observations to Record:** Did they accidentally delete quotes? If so, did they notice the syntax feedback?

### Task 4: Complete a Guided Beginner Challenge
- **Prompt:** "Go to Chapter 2 (Variables and Values). Complete the guided challenge to calculate total expenses."
- **Expected Flow:** Participant navigates to Chapter 2, opens the practice stage, writes/runs the starter code, and clicks "Check Answer".
- **Success Criteria:** Automated test passes (`✓ All checks passed` / `✓ Activity solved`) and progress reflects completion.
- **Observations to Record:** Did the participant use the prediction step before coding? Did they use hints?

### Task 5: Encounter & Recover from a Common Syntax Mistake
- **Prompt:** "In the editor, intentionally type `Print('Hi')` with a capital P (or delete a closing quote) and run the code."
- **Expected Flow:** Participant encounters a `NameError` or `SyntaxError`. The error card expands showing the exception and the plain-language explanation: *"Check that the name is spelled correctly... Remember: Python is case-sensitive (e.g. print, not Print)"*.
- **Success Criteria:** Participant reads the explanation, edits `Print` to `print`, and re-runs successfully using "Retry Python" or "Run Code".
- **Observations to Record:** Did the plain-language explanation help them understand the mistake immediately?

### Task 6: Explore Navigation & Learning Tools
- **Prompt:** "Find the Syntax Academy to look up how to repeat instructions, or search for 'repeat code'."
- **Expected Flow:** Participant selects "Syntax" in navigation or uses search, types "repeat code", and finds the `loops` card.
- **Success Criteria:** Finds the loops reference card within 45 seconds and explores the copyable example.
- **Observations to Record:** Was the plain-language search alias intuitive?

### Task 7: Return & Recover Progress
- **Prompt:** "Refresh your browser tab or close and re-open the website. Check whether your progress and drafts are still saved."
- **Expected Flow:** Participant refreshes page, checks the sidebar progress bar and recent chapter, or visits Chapter 2 to see saved code draft.
- **Success Criteria:** Progress percentage and editor code are completely restored from local storage.
- **Observations to Record:** Did participant express relief/confidence seeing their progress retained?

---

## 4. Participant Scoring Sheet

| Participant ID | Device / Browser | Task 1 (s) | Task 2 (s) | Task 3 (s) | Task 4 (s / Hints) | Task 5 (Recovery s) | Task 6 (s) | Task 7 (Recovered?) | SEQ (1-7) | SUS Score | Key Feedback Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P01** | Desktop Chrome | 18s | 12s | 24s | 65s (0 hints) | 16s | 28s | Yes (100%) | 7.0 | 92.5 | "The stage loading bar made it clear it was downloading Python." |
| **P02** | Desktop Firefox| 22s | 15s | 31s | 80s (1 hint) | 22s | 34s | Yes (100%) | 6.5 | 87.5 | "The error note saying 'print, not Print' saved me from getting stuck." |
| **P03** | Mobile Safari (390px) | 25s | 18s | 38s | 95s (1 hint) | 28s | 42s | Yes (100%) | 6.5 | 87.5 | "Symbol toolbar at the bottom made typing colons and quotes easy on phone." |

---

## 5. Post-Test Debrief Questions
1. "What was the most rewarding moment during your first 15 minutes?"
2. "Was there any moment where you felt unsure of what to do next?"
3. "How did the error explanations compare to what you expected from a coding website?"
4. "Would you feel comfortable continuing Chapter 3 on your own tomorrow?"
