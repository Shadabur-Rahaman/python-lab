# Python Lab 3 gap audit

Baseline: `bae4d77`. Inspected App, catalog and curriculum, lesson and practice views, Quiz, Experiments, CodeLab and worker, projects, progress storage, tests, and the Pages workflow. The V2 roadmap, changelog and verification report distinguish published lessons from planned tracks.

| Area | Baseline finding | Priority |
| --- | --- | --- |
| Implemented features | Hash navigation, 16 chapters, 48 exercises, 11 projects, quizzes, seven experiments and an aliasing model. Progress migration preserves stable IDs. The worker executes Python and returns structured grading results. | Preserve routes, IDs, storage and runtime. |
| Incomplete functionality | Advanced and professional levels and specialization tracks are roadmap entries. Quiz records track best scores rather than attempts. | Continue curriculum releases separately. |
| Learning content | Later topics need explicit prerequisites, syntax explanations and runnable examples. | Add searchable syntax topics with links into existing lessons. |
| Syntax coverage | Chapters cover beginner constructs and selected collections, file and class topics. Async, generators, parameter markers, pattern matching and modern typing lack a systematic reference. | Group syntax by purpose and check minimum versions against Python 3.12. |
| Glossary | English definitions in a tuple array feed a search dialog. Terms lack stable IDs, translations, related links and revision tools. | Migrate definitions into a typed canonical registry. |
| UI and discovery | Sidebar navigation is flat. Lesson search and practice search are separate. Editor state is tied to its mounted view. | Group navigation and index the public content. Address durable drafts separately. |
| Accessibility | Existing tests cover mobile navigation and Escape. The baseline does not establish contrast, screen-reader behavior or focus restoration across all views. | Add focused keyboard and touch checks and record limits. |
| Classroom materials | Python Lab has no resource backend or teacher authentication. | Use a dedicated Supabase project after local verification. |
| Security and reliability | The Pyodide worker separates execution from the UI. Client grading is formative. Runtime loading needs the CDN. Published attachments will need separate server authorization and validation. | Preserve timeout and output limits. Require cloud acceptance tests before enabling resources. |

## Resource references and isolation

Reviewed JS Lab’s setup and verification docs, migrations, API and maintenance functions, resource UI and policy tests. The reusable flow is a server-verified teacher role, an upload reservation for an immutable object path, server-side finalization, and a short-lived signed URL issued only after checking current publication status. The reference uses RLS and private storage, and separates routine operations from maintenance. HTML Lab also has its own resource and private-access verification notes. Python Lab should use a dedicated Supabase project. Shared Auth, public schema names and Storage policies make reusing a classroom project unnecessarily risky.

## Implementation order

1. Validate syntax topics and route/search integration against the existing build.
2. Add bilingual definitions, contextual navigation and revision interactions.
3. Implement and exercise the isolated resource backend before attaching teacher and student screens.
4. Verify the intended cloud project, accessibility and deployment after owner authorization.
