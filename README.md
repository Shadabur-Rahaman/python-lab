# Python Lab

Python Lab is a free React and TypeScript course with real Python in the browser. The 2.0 foundation preview includes the original beginner course, three additional lessons, 48 checked exercises, 100 chapter questions, seven experiment presets, an aliasing model and eleven guided projects.

Open Python Lab on [GitHub Pages](https://shadabur-rahaman.github.io/python-lab/).

The 3.0 preview adds a searchable Syntax Academy, bilingual glossary and optional classroom resources. Start with [the syntax map](SYNTAX_ACADEMY_MAP.md) or [glossary guide](BILINGUAL_GLOSSARY_GUIDE.md). Classroom resources require [a dedicated Supabase project](SUPABASE_RESOURCE_SETUP.md). See [resource security](RESOURCE_LIBRARY_SECURITY.md), [the baseline audit](PYTHON_LAB_3_GAP_AUDIT.md) and [test results](TEST_REPORT.md).

## Run locally

Use Node.js 22 or later and npm. The test suite uses the `python` command and supports Python 3.12 or later. Students can use the browser course without installing Python.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5175/python-lab/`.

```sh
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

The browser suite starts a production preview on port 4175 and exercises the `/python-lab/` path. It needs network access for the pinned Pyodide distribution. To use an installed browser, set `PYTHON_LAB_BROWSER_CHANNEL` to `msedge` or `chrome` before running the browser suite. On Linux, `npx playwright install --with-deps chromium` installs Chromium and its system dependencies. The build output is in `dist/`. See the [verification report](docs/VERIFICATION-2.0.md) for the checks run on this preview.

## GitHub Pages

The Vite base is `/python-lab/`. Hash routes such as `#/chapter/13` keep deep links on the same GitHub Pages entry point. Worker and module URLs use the Vite base.

The `.github/workflows/deploy.yml` workflow installs dependencies, runs unit and Python content tests, builds the site and publishes the build artifact. It runs on pushes to `main` and via manual dispatch. For a new repository, set **Settings → Pages → Source** to **GitHub Actions** and update the Vite base if the repository name changes. Publishing this preview requires an authorized push or deployment.

## Learning and progress

The chapters page groups available lessons by level and shows the planned specialization roadmap. Prerequisites guide the learner and all published lessons remain accessible. Practice filters include topic, level and difficulty. Learners can bookmark lessons and resume recently visited content.

Chapter and project completion are self-reported. Exercise completion comes from a check, and quizzes store the best completed score. The overall percentage includes one item per available chapter, chapter quiz, task and project. The V1 revision score is separate and the original graduate badge still uses the V1 curriculum.

V2 reads the legacy `python-lab.progress.v1` key when a current record is unavailable. Stable lesson, task, project and quiz IDs carry forward. Updates use `python-lab.progress.v2`, which also stores bookmarks and recent visits. A valid V2 reset takes precedence over the legacy backup. Importing JSON merges completion and keeps the higher quiz score. Export a backup before clearing browser storage or changing devices. Snippets and theme use their existing keys.

## Python runtime and grading

Pyodide 0.27.7 runs Python 3.12 in a dedicated worker. The first run downloads the pinned distribution. Each run starts with fresh program globals. The worker captures stdout, stderr and exceptions, limits output to 60,000 characters and is terminated on Stop or after 12 seconds of execution. The initial download can wait up to 90 seconds. A worker keeps the interface responsive. Educational grading and test cases are visible to learners.

Put one response per line in **Program input** before running `input()` examples. Use Ctrl or Command + Enter to run from the editor. The editor supports indentation and visible line numbers. Ctrl+M or Ctrl+Shift+M on macOS toggles Tab capture. Snippets can be saved, loaded, renamed and backed up as JSON.

**Run Code** executes the source. **Check Answer** also checks normalized stdout for fixed-output tasks or asks the worker to execute deterministic function cases. V1 assertion suites report one combined result. New tasks show individual cases. File exercises use the worker's virtual filesystem. Use local Python for device files, production services, and unsupported native packages.

## Project layout

- `src/data/catalog.mjs` indexes levels, prerequisites, stable IDs and planned tracks.
- `src/data/curriculum.ts` contains the original beginner lessons. `src/data/intermediate.ts` loads on demand.
- `src/components/LessonView.tsx` and `PracticeView.tsx` share task cards and the Python editor.
- `src/lib/progress.mjs` handles migration, backup validation and progress calculations.
- `public/python-worker.js` runs Python and returns structured case results.

See the [curriculum map](docs/CURRICULUM-MAP.md), [authoring guide](docs/AUTHORING.md), [audit and roadmap](docs/AUDIT-AND-ROADMAP.md), and [changelog](CHANGELOG.md).

## Study Materials and Teacher Studio

Use **Study Materials** in the student navigation to browse published resources. Filter by course chapter, language, difficulty, category, type or publication date. PDF, image and text files support preview.

Authorized teachers use the [direct studio link](https://shadabur-rahaman.github.io/python-lab/#/teacher/resources). See [Private Teacher Studio](PRIVATE_TEACHER_STUDIO.md) for account and recovery setup, and [Supabase connection verification](SUPABASE_CONNECTION_VERIFICATION.md) for the GitHub Pages configuration.

## Python Lab 5.0 pilot

Start from Home and open Variables and Values or Python Playground. The lesson and Playground share a browser-local receipt draft. See [the student journey](STUDENT_JOURNEY_V5.md) and [editor architecture](CONNECTED_EDITOR_ARCHITECTURE.md).

The visual curriculum adds 16 interactive teaching models and a Learn and Reference view for the Syntax Academy. See [the component guide](INTERACTIVE_COMPONENT_GUIDE.md).
Syntax Academy cards now show example code. Chapter models offer Roman-script hints. PDF previews support scrolling, direct page selection and zoom.
