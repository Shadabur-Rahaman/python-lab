# Python Lab 3 verification

| Check | Result |
| --- | --- |
| TypeScript and Vite production build | Passed with the existing `/python-lab/` base path. Syntax, glossary and resource routes use separate bundles. |
| Node and Python regression suite | 22 test groups passed, including the existing curriculum, projects, progress migration, grading and three upload validation groups. |
| Playwright in Edge against the production build | 15 scenarios passed. These cover syntax search, filters and refresh, all 30 examples and their corrections in Pyodide, bilingual search and language controls, favorites, flashcards, keyboard focus restoration, double-click, a touch tap, mobile navigation, and existing course workflows. |
| Resource fallback in Edge | The chapter link opens the materials route with its chapter filter. Both library routes explain missing configuration, and syntax lessons still open. |
| Local PostgreSQL migration and permission script | Passed in a disposable PostgreSQL 18 instance. Checks include student write and draft-read denial, unreserved upload denial, role escalation denial, private object reads, stale edits, ownership, publication, immutable replacement paths, retention candidates and trash restoration. |

The first glossary suite exposed a double-click that could activate a link under the dialog. The final suite passed after the fix. The live baseline returned HTTP 200 and served the improved Variables lesson from 2.0. This release was tested locally.

## Still to verify

No intended Supabase project was supplied. Hosted Auth, Edge execution, signed URLs, actual uploads, retry, file version restoration and object cleanup need end-to-end acceptance testing. The SQL tests use local Auth and Storage fixtures. This report covers pre-deployment checks. Hosted migrations and retention cleanup were outside those checks. The browser checks are not a full accessibility audit.

## Inventory

30 syntax topics with one knowledge check each, 28 bilingual glossary terms, seven existing executable experiment presets and one existing aliasing model. The library implements published listing and signed-link requests, teacher sign-in, reservations, file verification, metadata updates, publication and unpublication, replacement, cancellation and retry, trash, draft restoration, retained-version restoration, metadata export and manual admin retention cleanup. See [setup](SUPABASE_RESOURCE_SETUP.md) for operations that require hosted verification.
