# V1 verification

Verified locally on 2 November 2026. Application source is isolated in `python-lab/`; existing workspace applications were not modified.

## Automated checks

`npm test`: **12 test groups pass**, covering:

- All 13 ordered chapter records, learning sections, examples, exercises, and quizzes.
- All 91 question records, valid and varied answer keys, unique options, and explanations.
- Correct and incorrect quiz scoring, plus explicit arithmetic and string-length answer checks.
- 39 unique practice tasks and all ten guided project records.
- Accepted and rejected normalized print output.
- Progress round trips, first-program milestone, malformed data recovery, storage failures, and total completion.
- All 29 lesson examples executed in local Python 3 with their documented expected output.
- All 39 reference practice solutions, including assertion-based function tests.
- Incorrect function starters rejected with assertion failures.
- All ten project reference solutions; random guessing game tested using a fixed target.

`npm run build`: TypeScript and Vite production build pass. Final main bundle is about 374 KB (120 KB gzipped), excluding the separately downloaded Pyodide runtime.

`npm install`: completed with a lockfile; the installation audit reported zero vulnerabilities.

## Browser checks

Performed through the in-app browser, with the app served locally:

- Dashboard, chapter links, lesson content, runnable examples, practice submission, quiz answers, final score, and progress dashboard.
- Every chapter 0–12 renders the complete shared A–L structure (E and F share a section), three practice cards, and a quiz.
- Real Pyodide execution produced the expected first lesson output.
- All seven experiment presets executed in Pyodide with correct output: variables, types, operators, conditions, loops, lists, and functions.
- Queued input with `Ayaan` and `21` produced `Name: Number: Ayaan 42`.
- SyntaxError and ZeroDivisionError displayed tracebacks and educational guidance.
- An infinite `while True: pass` program was stopped manually; a second run was automatically terminated at the 12-second execution limit. The UI stayed usable.
- Reset restored the preset and discarded the worker.
- A deliberately incorrect grade function failed checks; the correct implementation passed its boundary cases.
- A complete chapter 0 quiz scored 100%; a refresh retained the best score.
- Practice topic and difficulty filters returned the expected function challenge.
- The project catalogue showed all ten projects.
- A named snippet was saved and appeared in the saved-snippet selector.
- Light and dark theme controls worked; saved preferences were restored on reload.
- A 390 × 844 mobile viewport displayed a single-column layout, usable navigation, and no horizontal document overflow. Temporary viewport overrides were reset afterward.
- Desktop and mobile screenshots are `preview-desktop.jpg` and `preview-mobile.jpg`.
- The production build was served separately under `/python-lab/` to verify its entrypoint and asset paths.

Browser testing exposed a stale-progress overwrite between tabs. The app now synchronizes storage events and reads the current persisted state before applying updates. A subsequent completed quiz survived refresh.

## Deployment and limits

GitHub Pages is configured, but no repository was created, pushed, or deployed. Copy this app's contents into the intended `python-lab` repository root before using the included workflow; see README.

The first Python run needs internet access to the pinned Pyodide CDN and may take time on a slow classroom connection. Local progress is browser/device specific. Chapter and project completion are honestly labeled self-reported; practice and quizzes use checks. Output tasks check their specified fixed examples, while function tasks have multiple assertion cases. The browser runtime and visible tests are teaching tools, not an exam-security system. Comprehensive assistive-technology and physical-device testing remain outside this local verification.
