# LearnMedications

A Duolingo-style web app to learn medications: the **molecule** (INN/DCI), its **brand names**
and its **pharmacological family**. It targets healthcare staff, students and curious people
alike. The interface is in French; the code base is in English.

- Short lessons with multiple-choice, matching and typing exercises
- 529 molecules across 12 therapeutic areas, plus decks per hospital service
  (emergency, intensive care, neuro-ICU, anaesthesia, orthopaedic surgery, community pharmacy…)
- Accounts, profile, XP, levels, daily streaks, 29 achievements and statistics
- Spaced repetition: each molecule comes back for review just before it is forgotten
- Friends and a weekly leaderboard
- Responsive from a 5.4" phone to a desktop screen, installable as a PWA

> **Disclaimer** — This is a learning tool. It does not replace official sources (BDPM, Vidal,
> product monographs) or the advice of a healthcare professional. The content has not yet been
> reviewed by a pharmacist; see [docs/content.md](docs/content.md).

## Tech stack

| Area      | Choice                                                  |
| --------- | ------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Cache Components), React 19     |
| Language  | TypeScript (strict)                                     |
| Styling   | Tailwind CSS 4                                          |
| Backend   | Supabase (Postgres, Auth, row level security)           |
| Tests     | Vitest, PGlite (in-memory Postgres for migration tests) |
| Quality   | ESLint, Prettier, commitlint, husky, lint-staged        |
| Hosting   | Vercel                                                  |

## Getting started

Requirements: Node.js 22+ and a Supabase project (see [docs/deployment.md](docs/deployment.md)).

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase values
npm run dev
```

The landing page and the demo lesson (`/demo`) work without Supabase. Everything behind the
login needs the environment variables and the database migrations.

## Scripts

| Command                      | Purpose                                             |
| ---------------------------- | --------------------------------------------------- |
| `npm run dev`                | Start the development server                        |
| `npm run build`              | Production build                                    |
| `npm run lint`               | ESLint, no warnings allowed                         |
| `npm run typecheck`          | Generate route types and run the TypeScript checker |
| `npm run test`               | Unit tests and database migration tests             |
| `npm run test:coverage`      | Same, with the enforced 80% coverage threshold      |
| `npm run test:e2e`           | End-to-end tests on phone, tablet and desktop       |
| `npm run format`             | Format the code base with Prettier                  |
| `npm run content:check-bdpm` | Cross-check the content against the public BDPM     |

## Documentation

- [Architecture](docs/architecture.md) — folders, data flow and coding rules
- [Content](docs/content.md) — the medication dataset, its sources and how to extend it
- [Gamification](docs/gamification.md) — XP, levels, streaks, mastery and achievements
- [Testing](docs/testing.md) — unit, database and end-to-end tests, devices covered
- [Database](docs/database.md) — schema, security model and migrations
- [Deployment](docs/deployment.md) — Supabase, Vercel and the custom domain
- [Contributing](docs/contributing.md) — branches, commits, pull requests and releases

## AI assistance

This project was built with the help of an AI coding assistant, Claude (Anthropic), used
through Claude Code for the code, the tests, the documentation and the first draft of the
medication dataset. All of it is reviewed and owned by the maintainer.
