# Supabase setup checklist

1. Create a project.
2. SQL Editor → paste `supabase/schema.sql` → Run.
3. SQL Editor → paste `supabase/seed.sql` → Run.
4. Authentication → Providers → enable Email.
5. Optionally enable Google OAuth and add the provider credentials.
6. Project Settings → API → copy Project URL and anon key.
7. Put them into `.env`:

VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

8. Restart `npm run dev`.

RLS is enabled in the schema. The policies are designed around `auth.uid()` and the user's application role. Review them with your actual business rules before production use.

## Cross-device workspace persistence
After running `schema.sql`, the app can use the `workspace_snapshots` table when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured. Supabase Authentication becomes the cross-device identity and the workspace snapshot keeps profile, assessment, learning, applications, recruitment state, interviews and messages available after signing in on another device. For immediate registration/login in this demo, configure Supabase Auth so email confirmation is disabled (or otherwise ensure a session is returned by sign-up).
