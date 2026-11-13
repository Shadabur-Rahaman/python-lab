# Connect a Python Lab classroom library

Use a dedicated Supabase project. The supplied migration is for a fresh Python Lab project. It uses private bucket `python-learning-resources` and includes public-schema table names that already exist in other Labs.

1. Provision a dedicated Supabase project. Enable email/password sign-in and disable public signup. Create or invite the teacher from the owner dashboard and confirm the account.
2. Link the CLI from the Python Lab directory and review the migration plan. Run `supabase link --project-ref YOUR_PYTHON_PROJECT_REF` and then `supabase db push` only against the intended project and with owner approval. The `supabase/tests/bootstrap.sql` file is for disposable local PostgreSQL.
3. In SQL Editor, grant the confirmed Auth user permission using their UUID. Use `teacher` for an account that manages its own materials or `admin` for an owner who also manages retained files.

   ```sql
   insert into public.authorized_teachers (user_id, role)
   values ('REPLACE_WITH_CONFIRMED_USER_UUID'::uuid, 'admin');
   ```

4. Deploy the function with `supabase functions deploy resource-api --no-verify-jwt`. The function verifies management JWTs through Supabase Auth and checks its server-maintained role table. The explicit verification in the handler permits the anonymous published-download operation.
5. Copy `.env.example` to `.env.local`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to the dedicated project’s public values. The client expects an `sb_publishable_` key. Restart Vite. For Pages, set the corresponding repository Actions **variables** and authorize a build. The service-role key belongs in the Edge runtime.
6. Open `#/teacher/resources` and sign in. Save a disposable file as draft. In a separate anonymous session, verify that neither the listing nor a link request exposes it. Publish it and verify that it appears and downloads. Unpublish and confirm that new links are denied. Test another teacher’s ownership boundary, stale edits, replacement, restore, expired sessions, wrong file types, and direct Storage denial.

Teachers can save multiple files with individual titles and shared metadata, and edit each material independently after saving. Use Study Materials to browse without an account. Chapter, syntax and glossary links filter the library. A configuration or connection failure stays inside the materials feature.

An admin may explicitly run retention cleanup in Teacher Dashboard. Replaced files remain recoverable for seven days and trash for thirty days. Download the metadata manifest and use the owner’s Storage tools to back up object bytes separately, preserving object paths and checksums. Restore to an isolated project first, verify current-version references and byte hashes, and validate public visibility before any cutover.

The repository contains a migration, Edge Function and local tests. No hosted project has been configured or migrated for this delivery. Run the acceptance steps above before enabling classroom use.
