# Classroom resource security

The Python Lab implementation adapts the JS Lab reservation and finalization flow to a dedicated Supabase project. The newer private-site access gate from JS Lab is outside this design. Python Lab published materials are public.

- Anonymous and authenticated clients see only published metadata through RLS. Metadata grants omit object paths. No client can change resource state or role mappings directly.
- The Edge Function verifies the Auth user before privileged operations. SQL mutations repeat the role and ownership checks. The server generates immutable upload paths. Storage permits an insert only for a matching unexpired reservation, with overwrite disabled.
- Finalization verifies stored size, byte format and checksum before a file becomes current. An optimistic revision guards replacements and edits. Privileged lifecycle changes are recorded in the audit table.
- The public link endpoint checks publication and a ready file version before signing. URLs expire after 60 seconds. A previously issued URL can work until its expiry even after unpublication. Draft links require an authorized owner or admin.
- PDF and supported images can be requested inline. The PDF frame is sandboxed and may be unavailable in some browsers. Other formats download as attachments. Byte signatures and structure checks do not certify the content as malware-free. Python files, Office documents, ZIP archives and notebooks are never executed or unpacked by the app.
- The admin retention operation requires explicit confirmation and is available manually. No recurring cleanup is scheduled. Keep metadata and Storage byte backups before permanent cleanup.

Local SQL assertions test database behavior using mock Auth claims and Storage tables. Those checks do not establish Supabase Auth, Storage or Edge runtime behavior in a hosted project. The owner must run the hosted checks in [the setup guide](SUPABASE_RESOURCE_SETUP.md) before classroom use.
