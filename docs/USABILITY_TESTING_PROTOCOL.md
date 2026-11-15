# Python Lab Version 20 — Classroom Validation & Usability Testing Protocol

## 1. Objectives & Overview

This protocol defines a rigorous, standardized usability study designed to evaluate Python Lab with **3–5 genuine complete beginners** (learners with zero prior programming experience in Python or any other language).

- **Target Cohort:** 3–5 first-time learners.
- **Testing Environments:**
  - Modern desktop browser (Chrome, Edge, or Firefox at 1366×768 or 1440×900).
  - Representative smartphone browser (Mobile Safari or Chrome at 360×800 or 390×844).
- **Session Duration:** 15–20 minutes per participant.
- **Methodology:** Think-aloud evaluation with neutral observation and minimal intervention.
- **Privacy & Ethics Guardrails:**
  - No unnecessary personally identifiable information (PII) is collected.
  - Participants are identified solely by anonymous codes (`P01` to `P05`).
  - No webcam recordings or keystroke loggers; observer records structured observations manually.

---

## 2. Student-Friendly Test Script

*Instructions to be read aloud by the facilitator at the start of the session:*

> *"Welcome! Today we are testing a learning tool called Python Lab. We are testing the platform, not you. You cannot do anything wrong here.*  
> *We want to see how easy it is for someone who has never coded to explore and learn. As you work through the tasks, please speak your thoughts aloud—tell us what you are looking at, what you expect to happen, and if anything feels confusing or surprising.*  
> *Take your time, and don't hesitate to tell us if something doesn't make sense. Let's begin!"*

---

## 3. Seven Core Beginner Tasks

### Task 1: Find Where to Begin
- **Prompt:** *"Imagine you want to start learning Python today. Open the homepage and show me where you would begin."*
- **Target Flow:** Learner views the homepage hero card or *"I’m completely new to coding"* onboarding and clicks **"Start Learning"** or navigates to Chapter 0.
- **Success Criteria:** Reaches Chapter 0 ("Before Python") within 30 seconds without external guidance.

### Task 2: Explain the Chai Recipe Algorithm
- **Prompt:** *"Look at Chapter 0. Read the chai recipe scenario and try the recipe arrangement activity. In your own words, what is an algorithm, and why does order matter?"*
- **Target Flow:** Learner reads the scenario, tests the ingredient scaler or `TeaOrder` step sequencer (`Boil water` → `Add tea leaves` → `Serve the chai`), and explains that computers need exact instructions in sequence.
- **Success Criteria:** Explains the core concept (order matters; computers execute top-to-bottom) and achieves the positive confirmation message.

### Task 3: Run Your First Python Program
- **Prompt:** *"Go to Chapter 1 ('Your First Python Program'). Without scrolling down, find where to run code and run your very first Python program."*
- **Target Flow:** Learner locates the prominent First Python Program Studio, clicks **Run Code**, and watches the output appear in the STDOUT console.
- **Success Criteria:** Clicks Run Code and confirms seeing `Hello, World!` in the output panel within 20 seconds.

### Task 4: Modify a Printed Message
- **Prompt:** *"Now change the program so it greets you with your own name or a message of your choice, then run it again."*
- **Target Flow:** Learner clicks inside the quotes in `print("Hello, World!")`, edits the text to `print("Hello, [Name]!")`, and clicks Run Code.
- **Success Criteria:** Successfully updates the string literal, runs the program, and observes their personalized greeting in output.

### Task 5: Fix a Simple Coding Error
- **Prompt:** *"Look at the typo recovery box. Run the code with `Print('Hello, World!')`. Notice what happens, and try to fix it."*
- **Target Flow:** Learner clicks Run Code on `fix_typo.py`, reads the friendly `NameError` clue explaining that Python is case-sensitive, changes uppercase `Print` to lowercase `print`, and re-runs.
- **Success Criteria:** Corrects the casing mistake unassisted within 45 seconds and sees successful output.

### Task 6: Find the Next Chapter
- **Prompt:** *"You have completed your first program and fixed an error. How do you move on to the next chapter?"*
- **Target Flow:** Learner locates the primary milestone card at the end of the first-10-minutes flow (`Continue to Chapter 2: Variables & Values →`) and clicks it.
- **Success Criteria:** Advances to Chapter 2 within 15 seconds without getting lost in secondary footer links.

### Task 7: Explain What Your Program Does
- **Prompt:** *"Looking back at what you just did, can you explain the difference between `print("Hello")` and `print(10 + 20)`?"*
- **Target Flow:** Learner references the syntax quick cards or token contrast model and explains that text in quotes is displayed as words, while unquoted numbers calculate arithmetic.
- **Success Criteria:** Articulates the distinction between text strings and numeric calculation.

---

## 4. Concise Observer Recording Sheet

| Participant | Task | Success (Y/N/Partial) | Time Taken (s) | Hesitation / Confusion Observed | Hints Requested (Count) | Errors Encountered | Learner Explanation | Ease Rating (1–5) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P01** | Task 1: Find start | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 2: Chai algorithm | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 3: First run | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 4: Modify message | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 5: Fix typo | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 6: Next chapter | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 7: Explain code | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| **P02** | Task 1: Find start | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 2: Chai algorithm | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 3: First run | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 4: Modify message | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 5: Fix typo | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 6: Next chapter | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 7: Explain code | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| **P03** | Task 1: Find start | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 2: Chai algorithm | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 3: First run | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 4: Modify message | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 5: Fix typo | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 6: Next chapter | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 7: Explain code | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| **P04** | Task 1: Find start | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 2: Chai algorithm | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 3: First run | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 4: Modify message | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 5: Fix typo | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 6: Next chapter | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 7: Explain code | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| **P05** | Task 1: Find start | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 2: Chai algorithm | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 3: First run | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 4: Modify message | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 5: Fix typo | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 6: Next chapter | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |
| | Task 7: Explain code | `[   ]` | `[   ]s` | | `[   ]` | | | `[  ] / 5` |

---

## 5. Testing Status Roster

> [!IMPORTANT]
> **Human Usability Testing Status: PENDING**  
> In accordance with Google Antigravity and academic research integrity standards, automated end-to-end browser specifications (`tests/browser/*.spec.ts`) continuously verify that all technical flows, mode tab switches, keyboard interactions, error feedback cards, and responsive controls operate cleanly. Actual human usability evaluations with live beginner subjects remain **PENDING** and will be conducted according to the schedule below without simulated or fabricated participant data.

| Participant ID | Target Profile | Device & Viewport | Testing Status | Scheduled Session |
| :--- | :--- | :--- | :--- | :--- |
| **P01** | Novice student, zero prior programming background | Desktop Chrome (1440×900) | **PENDING** | Classroom Cohort 1 |
| **P02** | Non-technical learner, first contact with coding | Desktop Firefox (1366×768) | **PENDING** | Classroom Cohort 1 |
| **P03** | Smartphone-first learner | Mobile Safari (390×844 phone) | **PENDING** | Mobile Testing Lab |
| **P04** | Entry-level smartphone learner | Mobile Chrome (360×800 phone) | **PENDING** | Mobile Testing Lab |
| **P05** | Tablet learner, touchscreen touch targets | iPad Safari (768×1024 tablet) | **PENDING** | Touch Usability Session |

---

## 6. Post-Study Single Ease & Feedback Prompts

After completing the 7 tasks, the facilitator asks:
1. *"On a scale of 1 to 5 (1 = very difficult, 5 = very easy), how would you rate your experience overall?"*
2. *"What was the clearest moment during your session?"*
3. *"Was there any moment where you felt stuck or unsure what the computer wanted you to do?"*
4. *"If you came back tomorrow, would you feel confident continuing to Chapter 2 on your own?"*
