# EduLyra — Strict Prompt Implementation

This archive is a modified version of the supplied EduLyra project. Existing pages, branding, routes and working components were preserved.

Implemented/strengthened from the supplied master prompt:
- Four isolated roles and role-aware navigation.
- Role-specific registration fields, career goals and validation.
- Strong password + confirmation validation.
- Country-code phone input with country-specific length validation.
- Supabase email-verification flow retained; unverified accounts are not treated as verified.
- Career-goal-dependent assessment engine with a larger question bank and randomized subsets/options.
- 15-minute timed assessment, auto-submit, progress tracking and browser event logging.
- Persistent assessment attempt history in the local workspace model.
- Assessment-driven strengths, weaknesses and skill gaps.
- Skill-gap-driven learning/career recommendations.
- Video completion + Quick Check gating before module completion.
- Automatic certificate records with unique IDs and verification pages.
- Automatic certificate insertion into the student's portfolio.
- Internship/job application and recruiter workflows preserved.
- Separate academician opportunities and institution analytics preserved.
- Feedback section added to the landing page.
- Expanded Supabase schema for assessments, learning progress, certificates, documents, privacy, reviews, recruitment stages, internship tasks/feedback, faculty opportunities, industry programs and collaborations.
- Replaced the overly broad Supabase profile-read policy with an authorization-aware policy and added institution access policies.

No existing website content was intentionally removed.
