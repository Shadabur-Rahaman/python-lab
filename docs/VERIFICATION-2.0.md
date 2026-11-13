# Python Lab 2.0 foundation verification

## Build and content

- TypeScript and Vite production build passed. The three new lessons are in a separate 21.47 kB JavaScript bundle, 7.68 kB gzipped.
- All 18 automated data and Python test groups passed using Node 24 and Python 3.14.3. They cover the V1 curriculum, migrated progress, backups, unique IDs, prerequisites, quiz keys, expanded examples and repairs, reference and alternative task solutions, negative grading, and the inventory report's malformed input and boundary cases.
- The initial Windows test run could not write in the restricted temporary directory. The same suite passed with ordinary filesystem access.
- Dependency installation reported zero known vulnerabilities. Playwright is a development dependency. The browser still loads the pinned Pyodide 0.27.7 runtime.

## Browser checks

All eight Playwright scenarios passed across the full run and targeted reruns in Microsoft Edge against the production preview:

- V1 migration, navigation from chapter 12 to chapter 13, and bookmark persistence after refresh.
- Validation of malformed progress imports and successful progress import and export.
- Keyboard navigation, Escape to close the mobile menu, lesson search, and no document overflow at 390 px.
- Real Pyodide grading with a hardcoded answer rejected, a general solution accepted, and a runaway loop stopped at the execution limit.
- The editor's run shortcut, separate standard output and standard error, and Python syntax error guidance.
- Recovery message when the pinned runtime download is blocked.
- A virtual-file example executed in Pyodide and the aliasing model stepped through shared and copied lists.
- Loading, renaming, exporting and importing legacy snippets.

The first migration check matched two elements, so its locator was narrowed. A later browser run stalled while downloading Pyodide, and the snippet test's implicit-label locator timed out. The download scenario passed on retry and the corrected snippet scenario passed in the targeted rerun.

## Release status

The production preview uses the same `/python-lab/` base and hash routes as GitHub Pages. The Pages workflow builds and tests the course before publishing.

Phases beyond the foundation and the first three core lessons remain open. This preview adds part of the interactive engine, including worker grading and one illustrative stepper. It does not include arbitrary-program tracing, a full accessibility audit, professional track lessons, or capstones.
