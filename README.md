# EduLyra — Academia–Industry Collaboration Portal

Updated implementation for Problem Statement 26044.

## Included functionality
- Four role-based workspaces: Student, Academician, Industry, Institution.
- Multi-account registration/login with separate persistent local profiles.
- Three-stage skill assessment and persistent results.
- Skill Gap terminology and role-specific technical assessment.
- Search aliases/fuzzy-style partial matching for JavaScript/JS, React JS, SQL, etc.
- Opportunity detail routes with Apply/Save behavior.
- Industry opportunity publishing and candidate/application workspace.
- Learning completion persistence with automatic Portfolio/Resume course and certification updates.
- Notification center with unread/read state.
- Compact landing page and dedicated Explore Platform overview.

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

The application uses browser localStorage for the functional prototype data model, so multiple accounts remain separate in the same browser. For production multi-device synchronization, replace the store service with Supabase tables while preserving the same entity relationships.

## Updated implementation notes
- Student applications persist in the workspace state and are visible with live status changes.
- Assessment is multi-domain (Java, DSA, Python, Web Development, DBMS, SQL and Software Engineering) and does not reveal answers.
- Career Advisor uses the student's career goal, skills and assessment Skill Gaps to rank jobs/internships and recommend courses, certifications and learning resources.
- Industry recruitment is connected end-to-end: opportunity → application → AI-assisted shortlist → interview → selected/rejected → analytics/messages.
- Industry interviews and messages are generated from real recruitment actions rather than placeholder content.
- Faculty now has searchable opportunities, editable internship subjects/details, applications and an editable professional profile.
- Industry and Institution registration no longer require an unnecessary Full Name field; organization/institution information is used instead.
- Supabase is supported as the cross-device identity/workspace persistence layer when the VITE_SUPABASE_* variables are configured and the supplied schema is applied.
