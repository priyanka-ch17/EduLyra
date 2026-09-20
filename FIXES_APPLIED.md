# EduLyra – Stability Fixes

This package is the existing EduLyra project with targeted fixes only.

## Fixed source/runtime issues
- Removed the duplicated `export function IndustryDashboard()` declaration that caused the Vite/Babel syntax error in `src/pages/RoleDashboards.tsx`.
- Added the missing `listValue()` helper used by `src/pages/PlatformPages.tsx`.
- Added the missing `AssessmentEventType` and `AssessmentSession` TypeScript types used by `src/services/assessmentService.ts`.
- Preserved the existing EduLyra pages, navigation, roles, UI, local data store, and Industry functionality.
- Kept Industry posting and certification flows intact: Opportunities, Challenges, Training, Workshops, and issuing certifications to Students/Faculty.

## Clean installation
Do not copy `node_modules` into this project. From the `EduLyra2` folder run:

```bash
npm install
npm run build
npm run dev
```

If a previous `node_modules` folder gives an npm optional-dependency/Rollup error, delete `node_modules` and run `npm install` again.
