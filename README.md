# Python Lab — Learn Python From Zero

Learn it. Try it. Break it. Fix it. Master it.

A static React/TypeScript teaching platform for absolute beginners. It contains all 13 chapters (0–12), 29 executable examples, 39 checked practice tasks, 91 chapter questions, a 26-question mixed revision assessment, seven visual experiments, ten guided projects, a searchable glossary, themes, and device-local progress. No account, backend, paid API, or private credentials are required.

## Run locally

Requires Node.js 22 or later and npm. Python 3.12+ is required **only for development tests**, not by students using the site.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5175/python-lab/`. The application lives in its own directory and does not modify the JavaScript, HTML, or CSS Lab applications in the parent workspace.

```sh
npm test
npm run build
npm run preview
```

`dist/` is the complete production site. Tests cover curriculum integrity, answer keys and scoring, output comparison, progress persistence and recovery, all reference examples, all task solutions, rejection of incorrect functions, and all project reference solutions. Tests execute Python through the `python` command; ensure that command is on your PATH. The deterministic game test replaces its random target with 7.

## GitHub Pages

The Vite base is `/python-lab/`. All application routes use URL hashes, so refreshing a chapter on GitHub Pages does not request a nonexistent server route. The Python worker URL also respects the base.

To deploy at `https://shadabur-rahaman.github.io/python-lab/`:

1. Create or select a GitHub repository named `python-lab`.
2. Place the **contents of this directory** at its root (including the lockfile and `.github` folder). Do not accidentally include the parent workspace or its environment files.
3. Push to its `main` branch when authorized.
4. In repository Settings → Pages, choose **GitHub Actions** as the build source.
5. The included `.github/workflows/deploy.yml` installs, tests, builds, and deploys the artifact. It can also be started using workflow_dispatch.

The workflow is intentionally inside this standalone application. GitHub will not discover a workflow nested under `python-lab/.github` in the existing parent JavaScript repository; copy the app into the intended repository root first. For a different repository name, update `base` in `vite.config.ts`.

No remote push or public deployment is performed by local setup.

## Architecture

```text
src/
  App.tsx                  Hash routing, dashboard, lessons, practice, projects, progress
  components/CodeLab.tsx   Highlighted editor, input queue, worker lifecycle, grading
  components/Quiz.tsx      Answer submission, explanations, final review, retry
  components/Experiments.tsx  Seven editable visual mental models
  data/types.ts            Typed curriculum contracts
  data/curriculum.ts       Chapter stories, concepts, examples, tasks, quizzes, glossary
  data/projects.ts         Ten complete project briefs and solutions
  lib/progress.mjs         Versioned storage parsing, grading, progress calculation
  lib/storage.ts           Persistent storage with an in-memory fallback
  styles.css               Responsive layout, accessible focus, light/dark themes
public/python-worker.js    Real Pyodide runtime isolated from the main interface
tests/platform.test.mjs    Curriculum and Python verification
```

React renders output as text. Code is not evaluated as JavaScript or inserted as HTML. React Simple Code Editor with Prism provides Python highlighting; an error boundary supplies a plain textarea if the enhanced editor fails. Press `Ctrl+M` (or `Ctrl+Shift+M` on macOS) in the enhanced editor to toggle whether Tab inserts indentation, allowing keyboard focus to leave the editor. Normal focus indicators are visible throughout.

## Real Python runtime

The classic worker loads the pinned **Pyodide 0.27.7** distribution from `https://cdn.jsdelivr.net/pyodide/v0.27.7/full/`. This version supports `importScripts`; newer Pyodide versions may require a module worker, so do not change only the URL without reviewing the worker API. It downloads Python/WASM on the first run and depends on CDN access. Google Fonts are optional; local fonts remain usable without them. The runtime is lazy: simply opening a lesson does not download Python.

- Each editor starts a worker on its first Run and reuses it until reset, stopped, timed out, or unmounted.
- Each run receives a fresh globals dictionary. Variables do not carry into another run; saved snippets store source code and queued input, not interpreter state.
- `stdout` and `stderr` are captured. Python exceptions and network/loading errors are shown as text.
- Put one response per line in **Program input** before Run. A blank line supplies an empty string when there are multiple queued lines. An entirely empty queue means no responses. Prompts are shown, but responses are not echoed. Exhausting the queue raises EOFError.
- Stop terminates the worker. Reset restores the original code and input and discards the runtime. The next run starts a new worker.
- Execution has a 12-second limit after initialization, a 90-second loading timeout, and an approximately 60 KB output cap. The page stays responsive during Python loops.
- A worker isolates execution from the page UI; this is not a hardened hostile-code or exam-security sandbox. Code can use APIs exposed by Pyodide, and all checking rules are visible in the client.
- Arbitrary local files, operating-system access, native packages, and backend persistence are not provided. V1 uses Python’s standard features. Browser virtual files are not files on a learner’s device.

## Grading and honest progress

**Run Code** executes without awarding practice completion. **Check Answer** runs the same source and checks normalized stdout for print tasks, or executes multiple assertions for function tasks. Normalization accepts CRLF, trailing line spaces, and surrounding whitespace while preserving interior content and case. Errors never count as a pass. The checked functions include negative, zero, empty, default-argument, and boundary cases where relevant. Fixed-output exercises can be passed by printing their target; they are teaching tools, not secure examinations.

Hints reveal progressively. Solutions are behind explicit disclosures. Quiz answers remain hidden until submission, and only completed assessments save a best percentage. Students can retry without reducing a previous best score.

Chapter completion and project completion are explicitly **self-reported**. Exercise completion comes from checks. Overall completion gives equal weight to 13 chapters, 39 exercises, 10 projects, and 13 completed chapter quizzes (75 items). The revision quiz is tracked separately. The graduate achievement requires all chapters, all exercises, and at least 70% on the revision assessment.

Storage keys:

- `python-lab.progress.v1`: visited/completed chapters, solved tasks, self-reported projects, best quiz scores, last chapter, first-program milestone.
- `python-lab.snippets.v1`: up to 30 user-named code snippets.
- `python-lab.theme`: theme preference.

Progress is scoped to the current browser/device and origin. Clearing browser storage removes it. Storage updates synchronize across tabs. Malformed or incompatible progress versions recover to safe defaults. If persistent storage fails, learning remains usable for the visit and a notice explains that progress cannot be retained. Reset requires confirmation and clears progress while keeping snippets and theme.

## Extend the course

### Chapters

Add a `Chapter` record in `src/data/curriculum.ts` with a stable ordered ID, story, objectives, concept pairs, visual steps, at least two examples (code, expected output, explanation, optional queued input), a mistake and fix, application, three graded tasks, and seven questions. The shared chapter renderer supplies all A–L sections. Keep explanations conversational, use accurate Python semantics, and explicitly explain new symbols. Update progress totals, ID validation and related tests when expanding beyond V1.

### Questions and practice

`q(prompt, correct, wrongAnswers, explanation)` places the answer at a deterministic varied position. Supply exactly three distinct distractors. Add questions to the chapter’s quiz array; `revisionQuiz` selects questions from each chapter. Use new stable task IDs when adding practice. A task needs a prompt, starter, hidden solution, expected output or assertion tests, progressive hints, and explanation. Supply `input` when a test reads responses. Function tasks should test behavior with several arguments, not merely accept successful execution.

### Experiments

Extend `Experiments.tsx` with a control panel, visual model, and the matching generated Python source. Controls deliberately reset the editor to a matching source preset; editing the source afterward does not drive the diagram. Verify diagrams against the interpreter. Do not simulate a Python console in JavaScript.

### Projects

Add a `Project` in `src/data/projects.ts` with prerequisite chapters, use case, functional requirements, ordered steps, starter/solution, sample queue/output, testing instructions, a common mistake, and extension ideas. The shared project renderer supplies the runnable editor and self-reported completion checkbox.

## Classroom flow

Each lesson suggests 10 minutes on the story, 15 on examples, 20 on practice, 10 on a quiz, and 5 on revision. All chapters remain unlocked. Encourage students to predict output, change one thing, inspect an error, and explain what changed. Review the three capstone projects after chapter 12, then use the mixed revision quiz.
