# Authoring lessons

Add new core lessons to the on-demand module in `src/data/intermediate.ts`. For a larger module, create a separate content file and load it with a dynamic import for the corresponding routes. The original beginner curriculum remains in `src/data/curriculum.ts`.

1. Assign a permanent numeric lesson ID and register its metadata in `src/data/catalog.mjs`. Keep published IDs stable so existing links and progress still resolve.
2. Set the level, title, subtitle, searchable topics, ordered prerequisite IDs and task IDs. Prerequisites describe recommended preparation and should point to earlier available lessons.
3. Add a typed `Chapter` with learning outcomes, an analogy, concept explanations, an ordered visual model, an intentionally broken example and a working repair. Include at least two executable examples with expected stdout, an execution explanation and authored syntax annotations.
4. Write easy, medium and challenge exercises. A task should explain its input and output contract, provide starter code, reveal hints in stages, and include a reference solution. Use stable task IDs and case names.
5. For function tasks, add deterministic cases with a Python expression in each `check`. A case passes when that expression evaluates to a truthy value after the submitted code runs. Include at least one edge case and a second ordinary input. Cases share the submitted program's globals, so create fresh objects inside checks that mutate state.
6. Add concept questions with unique options, a zero-based answer index and an explanation. Keep the V1 revision assessment stable. Add a new assessment key if a separate assessment needs separate progress.
7. Record misconceptions, a cheat sheet and an interview question with an answer. Link related projects by adding lesson IDs to their prerequisites.
8. Run `npm test`, `npm run build` and `npm run test:browser`. Verify new examples in Pyodide as well as desktop Python. Keep OS, network, database and native-package exercises in clearly labeled local workflows.

Practice checks and expected output ship with the course. They provide formative feedback. Project completion is self-reported. Use the project's starter, functional requirements, sample input, expected output, testing instructions, troubleshooting and optional solution disclosure for each new project.

Check semantics against the official Python 3.12 documentation used by the browser runtime. [Collections](https://docs.python.org/3.12/tutorial/datastructures.html) · [Files and JSON](https://docs.python.org/3.12/tutorial/inputoutput.html) · [Classes](https://docs.python.org/3.12/tutorial/classes.html).
