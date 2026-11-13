# Private Teacher Studio

Open [Teacher Studio](https://shadabur-rahaman.github.io/python-lab/#/teacher/resources) directly. Sign in with a Supabase Auth account that already has an active teacher or admin role in the dedicated Python Lab project.

The app checks the session with the Edge Function before requesting private material records. The Edge Function verifies the role for protected actions. The public material view and Storage policies are separate from teacher authentication. Keep the teacher link out of student navigation and search.

Use the upload form to select one or more files, assign metadata, and save as a draft or publish. Edit a material to replace its file. The file versions action lists retained copies. Trash is recoverable as a draft until the retention window expires. Administrators have access to the existing backup manifest and retention controls.

Password recovery uses Supabase Auth with PKCE. Add the exact production redirect URL to the Python project Auth redirect allowlist before relying on email recovery. The target is the Pages root with the query parameter teacher-recovery=1. Open the recovery link in the browser where it was requested. Recovery email delivery and a production teacher account are required for the end-to-end check.
