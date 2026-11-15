# Python Lab — Classroom Usability Pilot Protocol & Evaluation Package

**Version:** 22.0  
**Status:** **PENDING (Scheduled for Field Validation)**  
**Target Audience:** 3–5 genuine complete beginner students (zero prior programming experience in Python or any other language)  
**Study Type:** Think-aloud observational usability evaluation  
**Privacy Policy:** Completely anonymous (`P01`–`P05`), zero personal identifying information (PII) collected or stored  

---

## 1. Facilitator Protocol & Non-Coaching Guidelines

To ensure empirical validity, the facilitator must maintain neutral, non-interventional standards throughout the session.

### Core Principles
1. **Test the Platform, Not the Student:** Remind the learner that any hesitation, confusion, or error reflects a design opportunity in Python Lab, not their ability.
2. **Never Touch the Controls:** The facilitator must never type on the student's keyboard, touch their screen, or move their mouse.
3. **Never Point or Direct:** Do not indicate where buttons, links, or text are located.
4. **Think-Aloud Prompting:** If the participant falls silent for more than 10 seconds, prompt neutrally:
   - *"What are you thinking right now?"*
   - *"What are you looking at on the screen?"*
   - *"What would you expect to happen next?"*
5. **Handling Requests for Help:** If the student asks *"What do I click?"* or *"Is this right?"*, deflect neutrally:
   - *"What does the page suggest to you?"*
   - *"What would you normally try next if you were working by yourself?"*
6. **When to Provide a Hint:** Only offer a hint if a student is completely blocked for more than 2 minutes on a single task and expresses distress. Record every hint given in the Observer Sheet.

---

## 2. Participant Welcome & Briefing Script

*Read aloud to each student at the beginning of the evaluation:*

> *"Welcome, and thank you for taking the time to test Python Lab!*  
> 
> *Today, we are testing how easy and understandable our platform is for someone who has never written computer code before. We are testing the software—we are NOT testing you. You cannot break anything, and you cannot make any wrong moves.*  
> 
> *As you go through each task, please speak your thoughts out loud. Tell us what you notice, what makes sense, what feels unclear, and what you expect to happen when you click or tap something.*  
> 
> *There is no rush at all. Take all the time you need. Let's begin with Task 1!"*

---

## 3. Student Task Sheet (Participant Handout)

Students receive the following task prompts one at a time:

### Task 1: Find Where to Start
- **Goal:** From the Python Lab homepage, find where a complete beginner should start learning.
- **Learner Prompt:** *"You have just arrived at Python Lab with zero coding experience. Show us where you would start your learning journey."*

### Task 2: Complete the Chai-Recipe Algorithm
- **Goal:** Experience the concept of an ordered sequence of instructions.
- **Learner Prompt:** *"Read the chai tea recipe in Chapter 0. Try the ingredient scaler, then arrange the recipe steps so the tea is prepared in the correct order."*

### Task 3: Run Your First Python Program
- **Goal:** Execute real Python code in the browser.
- **Learner Prompt:** *"Move to Chapter 1 ('Your First Python Program'). Without scrolling down, find where code is executed and run your very first Python program."*

### Task 4: Change the Message
- **Goal:** Edit a string literal and observe immediate execution changes.
- **Learner Prompt:** *"Change the program in the editor so it prints your name or a personal greeting of your choice, then run it again to see your changes."*

### Task 5: Explain the Output
- **Goal:** Articulate the conceptual difference between string text and numeric calculation.
- **Learner Prompt:** *"In your own words, what is the difference between writing `print(\"10 + 20\")` and writing `print(10 + 20)`? Look at what appears on screen."*

### Task 6: Correct `Print` to `print`
- **Goal:** Experience error recovery and learn that errors are normal feedback.
- **Learner Prompt:** *"Look at the 'Fix a mistake' confidence builder. Run the code with `Print('Hello, World!')`. Read the message that appears, and try to fix the program so it runs without an error."*

### Task 7: Move to Chapter 2
- **Goal:** Navigate forward to the next concept without assistance.
- **Learner Prompt:** *"Now that you have completed your first program and fixed an error, how would you continue to the next chapter on Variables?"*

### Task 8: Complete One Short Guided Activity
- **Goal:** Interact with Chapter 2 variables (predicting, updating, or running variable assignment).
- **Learner Prompt:** *"In Chapter 2 ('Variables and Values'), explore the memory storage boxes model and run the first variable example (`age = 20`). Change the age to your own age and see what happens."*

---

## 4. Observer Recording Sheet (Data Collection Template)

Record observations for each anonymous participant (`P01` to `P05`) across the required metrics:

| Metric | Values / Guidance |
| :--- | :--- |
| **Participant ID** | Anonymous identifier: `P01`, `P02`, `P03`, `P04`, `P05` |
| **Device & Browser** | e.g., Windows Laptop (Chrome 131), iPhone 14 (Mobile Safari), Android (Chrome) |
| **Task Completion** | `Yes` (completed unassisted) / `Partial` (required minor prompt) / `No` (abandoned) |
| **Time Taken** | Elapsed seconds from task prompt to completion |
| **Hints Required** | Number of explicit requests for assistance or guidance |
| **Navigation Difficulties** | Observed wandering, scrolling back and forth, clicking wrong tabs |
| **Error Recovery** | How the student responded to NameError/typo and whether they recovered independently |
| **Ability to Explain Concept** | Evaluated depth of understanding on a 3-point scale: `Clear` / `Partial` / `Unclear` |
| **Ease-of-Use Rating** | Single Ease Question (SEQ) on 1–5 scale: 1 = Very Difficult, 5 = Very Easy |
| **Suggested Improvements** | Direct participant quote or concrete suggestion for UX clarification |

### Observer Data Matrix (Template for Field Execution)

```markdown
### Participant P01
- Device & Browser: [                                            ]
- Overall Pilot Date: [                                          ]
- Observer Name: [                                               ]

| Task | Completion (Y/P/N) | Time (s) | Hints Required | Navigation Difficulties | Error Recovery | Explain Concept | Ease Rating (1–5) |
| :--- | :---: | :---: | :---: | :--- | :--- | :---: | :---: |
| 1. Find start | [ ] | [ ]s | [ ] | [ ] | N/A | N/A | [ ] / 5 |
| 2. Chai algorithm | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 3. First Python run | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 4. Change message | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 5. Explain output | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 6. Correct Print to print | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 7. Move to Chapter 2 | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 8. Guided activity (Ch 2) | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |

- Suggested Improvements / Direct Feedback:
  > "[Participant quote here]"

---

### Participant P02
- Device & Browser: [                                            ]
- Overall Pilot Date: [                                          ]
- Observer Name: [                                               ]

| Task | Completion (Y/P/N) | Time (s) | Hints Required | Navigation Difficulties | Error Recovery | Explain Concept | Ease Rating (1–5) |
| :--- | :---: | :---: | :---: | :--- | :--- | :---: | :---: |
| 1. Find start | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 2. Chai algorithm | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 3. First Python run | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 4. Change message | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 5. Explain output | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 6. Correct Print to print | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 7. Move to Chapter 2 | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 8. Guided activity (Ch 2) | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |

- Suggested Improvements / Direct Feedback:
  > "[Participant quote here]"

---

### Participant P03
- Device & Browser: [                                            ]
- Overall Pilot Date: [                                          ]
- Observer Name: [                                               ]

| Task | Completion (Y/P/N) | Time (s) | Hints Required | Navigation Difficulties | Error Recovery | Explain Concept | Ease Rating (1–5) |
| :--- | :---: | :---: | :---: | :--- | :--- | :---: | :---: |
| 1. Find start | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 2. Chai algorithm | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 3. First Python run | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 4. Change message | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 5. Explain output | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 6. Correct Print to print | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 7. Move to Chapter 2 | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 8. Guided activity (Ch 2) | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |

- Suggested Improvements / Direct Feedback:
  > "[Participant quote here]"

---

### Participant P04
- Device & Browser: [                                            ]
- Overall Pilot Date: [                                          ]
- Observer Name: [                                               ]

| Task | Completion (Y/P/N) | Time (s) | Hints Required | Navigation Difficulties | Error Recovery | Explain Concept | Ease Rating (1–5) |
| :--- | :---: | :---: | :---: | :--- | :--- | :---: | :---: |
| 1. Find start | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 2. Chai algorithm | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 3. First Python run | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 4. Change message | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 5. Explain output | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 6. Correct Print to print | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 7. Move to Chapter 2 | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 8. Guided activity (Ch 2) | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |

- Suggested Improvements / Direct Feedback:
  > "[Participant quote here]"

---

### Participant P05
- Device & Browser: [                                            ]
- Overall Pilot Date: [                                          ]
- Observer Name: [                                               ]

| Task | Completion (Y/P/N) | Time (s) | Hints Required | Navigation Difficulties | Error Recovery | Explain Concept | Ease Rating (1–5) |
| :--- | :---: | :---: | :---: | :--- | :--- | :---: | :---: |
| 1. Find start | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 2. Chai algorithm | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 3. First Python run | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 4. Change message | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 5. Explain output | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 6. Correct Print to print | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |
| 7. Move to Chapter 2 | [ ] | [ ]s | [ ] | [ ] | [ ] | N/A | [ ] / 5 |
| 8. Guided activity (Ch 2) | [ ] | [ ]s | [ ] | [ ] | [ ] | [ ] | [ ] / 5 |

- Suggested Improvements / Direct Feedback:
  > "[Participant quote here]"
```

---

## 5. Post-Study Debrief Interview

Following task completion, the observer conducts a 3-minute qualitative debrief:

1. *"Overall, how easy or challenging was it to get started with coding today? (1 = very difficult, 5 = very easy)"*
2. *"What felt like the clearest or most satisfying part of the experience?"*
3. *"Was there any moment where you felt stuck, confused, or unsure what the platform wanted you to do?"*
4. *"If you were practicing on your own at home, would you feel comfortable continuing through Chapter 2?"*

---

## 6. Scientific Integrity & Usability Status

> [!IMPORTANT]
> **Human Usability Validation: PENDING**  
> In accordance with Google Antigravity research standards, no simulated or fabricated participant observations, ratings, or appointment times are presented. Automated browser and unit tests verify technical correctness. Field evaluation data will be collected and recorded using this protocol when human participant sessions occur.
>
> **Comparative Objectivity Notice:** Python Lab does not claim to be "objectively easier" or "superior" to established platforms such as W3Schools, GeeksforGeeks, or DataCamp without rigorous, side-by-side empirical testing.
