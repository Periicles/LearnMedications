# Architecture

## Overview

LearnMedications is a Next.js App Router application. Pages are Server Components that read
the signed-in user's data from Supabase; interactivity (the lesson player, forms, search) lives
in small Client Components. Learning content is static JSON shipped with the code; only user
data lives in the database.

```
Browser ──► Next.js (Vercel) ──► Supabase Auth + Postgres
              │
              └── content/*.json (bundled at build time)
```

## Folder structure

```
content/areas/        Medication dataset, one JSON file per therapeutic area
docs/                 Project documentation
scripts/              Maintenance scripts (BDPM cross-check)
supabase/migrations/  SQL migrations, applied in file-name order
supabase/tests/       Migration tests running on an in-memory Postgres
src/
  app/                Routes only: pages, layouts, route handlers
    (auth)/           Login, sign-up and password pages
    (app)/            Signed-in pages sharing the navigation shell
    lesson/           Full-screen lesson and review sessions
  components/         Shared UI primitives (ui/) and layout pieces (layout/)
  constants/          App-wide constants (routes, navigation, texts)
  features/           One folder per feature
    <feature>/
      components/     React components of the feature
      lib/            Pure logic, queries and their tests
      actions.ts      Server Actions
      constants.ts    Feature constants
  lib/                Cross-cutting helpers (Supabase clients, env, forms)
  schemas/            Zod validation schemas
  types/              Every type, interface and props definition
  proxy.ts            Session refresh and route protection
```

Features: `auth`, `content`, `quiz`, `progress`, `learn`, `review`, `achievements`, `profile`,
`friends`, `library`, `marketing`, `demo`.

## Coding rules

These rules are enforced by ESLint (`eslint.config.mjs`) and checked in CI.

- **Types live in `src/types`.** Type aliases, interfaces, enums and inline object types are
  forbidden in code files. Validation schemas live in `src/schemas`.
- **Small files.** At most 150 lines per file and 80 per function.
- **Meaningful names.** Identifiers are 4 to 28 characters long.
- **English only** in code, comments, commits and pull requests. User-facing texts are French.
- Routes stay thin: a page loads data and composes feature components.
- Business rules are pure functions in `features/*/lib`, each with unit tests.

## Rendering and data flow

- `cacheComponents` is enabled. Anything that reads the session is dynamic and rendered behind
  a `<Suspense>` boundary (see `src/app/(app)/layout.tsx`), so the navigation shell is static
  and appears instantly.
- `src/proxy.ts` refreshes the Supabase session cookie on every request and redirects guests
  away from protected pages. It is an optimistic check only: every page and Server Action
  calls `requireUser()` again, and the database enforces row level security.
- Reads use the request-scoped Supabase client (`src/lib/supabase/server.ts`) and are subject
  to row level security.
- Progress writes never come from the browser. The `completeSession` Server Action validates
  the answers, computes XP, streak, mastery and achievements in TypeScript, then stores
  everything atomically through the `apply_session_result` SQL function using the secret key
  (`src/lib/supabase/admin.ts`).

## Lesson lifecycle

1. The lesson page builds a `LessonPlan` on the server (`features/quiz/lib/plan.ts`): intro
   cards, then exercises with plausible distractors taken from the same family or area.
2. `LessonPlayer` runs the session in the browser with a reducer
   (`features/quiz/lib/session.ts`). A failed exercise comes back once at the end; only the
   first attempt counts.
3. On completion, `TrackedLesson` sends the answer records to `completeSession`, which returns
   the rewards shown on the summary screen.

## Testing

- `npm run test` runs Vitest: pure logic, dataset validation and exercise generation for every
  lesson of every collection.
- Migrations are executed on PGlite with small stand-ins for Supabase roles and `auth.uid()`
  (`supabase/tests/stubs.sql`), which lets tests assert row level security rules.
