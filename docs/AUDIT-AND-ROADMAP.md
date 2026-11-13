# Python Lab 2.0 audit and roadmap

The existing application has real browser Python, reusable editors and quizzes, verified beginner content, and hash routes that work on GitHub Pages. Preserve the existing route IDs, quiz keys, task IDs, snippets, theme, and projects. Keep Pyodide in its dedicated worker with time and output limits.

| Area | V1 finding | Priority |
| --- | --- | --- |
| Curriculum | Typed content exists, but the app bundles all of it and assumes numeric IDs are array offsets. | Add a catalog and load expanded modules on demand. |
| Progress | Validation, totals, navigation and the graduate badge depend on V1 limits. | Derive counts from the catalog and migrate to V2. Keep the badge tied to its original curriculum. |
| Lessons | One large component owns navigation, editing, lessons and progress. Inline syntax heuristics misread some Python expressions. | Extract lesson and task views. Let authors supply precise annotations for new content. |
| Grading | The editor combines stdout and stderr and trusts a printed success marker for assertion checks. | Use explicit worker results and structured cases for new tasks. Retain fixed-output checks for V1 exercises. |
| Discovery | Search is limited to the chapter list. Specialization prerequisites and project readiness are absent. | Introduce a curriculum map and advisory readiness. Add bookmarks and progress backups. |
| Verification | The suite exercises source examples and reference solutions in Python. Browser checks were manual and the deployment runs on main. | Extend catalog, migration and grading regressions. Verify the production base path locally before publishing. |

1. **Foundations.** Introduce a catalog, migration, reusable lesson views, validated backups and regression coverage.
2. **Core.** Release individually verified modules, beginning with collection transformations, file data and exceptions, and object state. Follow with setup, iterators, deeper OOP, advanced Python and engineering.
3. **Interactive engine.** Improve editing, snippets, runtime feedback and trace visualizations.
4. **Specializations.** Add tracks after their shared prerequisites have usable lessons.
5. **Projects and careers.** Release tested projects, capstones, interview practice and revision resources.
6. **Hardening.** Repeat browser, mobile, accessibility, dependency and deployment verification for each release.
