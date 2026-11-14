# Testing

| Layer      | Tool                           | Command                 | Scope                                              |
| ---------- | ------------------------------ | ----------------------- | -------------------------------------------------- |
| Unit       | Vitest, Testing Library, jsdom | `npm run test:coverage` | Logic, components, hooks, Server Actions, queries  |
| Database   | Vitest, PGlite                 | `npm run test`          | Migrations, SQL functions, row level security      |
| End-to-end | Playwright                     | `npm run test:e2e`      | Real user flows in real browsers, against Supabase |

## Unit tests

Tests sit next to the code: `*.test.ts` runs in Node, `*.test.tsx` runs in jsdom.

- `src/testing/fake-supabase.ts` is a chainable stand-in for the Supabase client: queue results
  with `respond("<table or rpc>", …)` and inspect `calls`.
- Server Actions are tested with mocked `next/navigation` and `next/cache`; a redirect is a
  thrown `NEXT_REDIRECT:<path>` error.
- Async Server Components are awaited, then rendered.

Coverage is measured on `src/**`, excluding route files (`src/app`, thin compositions covered by
the end-to-end suite), types and test helpers. `npm run test:coverage` fails under **80%** of
statements, branches, functions or lines; CI runs it on every pull request.

## End-to-end tests

Specs live in `e2e/` and run against a production build started by Playwright.

| Spec               | Flows                                                                     |
| ------------------ | ------------------------------------------------------------------------- |
| `public.spec.ts`   | Landing page, demo lesson, manifest, route protection, sign-up validation |
| `learning.spec.ts` | Lesson with rewards and unlocking, achievements, review session, library  |
| `social.spec.ts`   | Accepting, removing, sending and cancelling friend requests, leaderboard  |
| `account.spec.ts`  | Wrong password, login, profile edition, logout, account deletion          |
| `layout.spec.ts`   | Every signed-in page fits the screen; navigation adapts to the device     |

### Devices

Each spec runs on: **iPhone 12 Mini**, **iPhone 16**, **iPhone 16 Pro**, **iPad Pro 11**,
**Desktop Chrome**, **Desktop Firefox** and **Desktop Safari**.

Apple profiles use the WebKit engine, like Safari. WebKit needs system libraries
(`sudo npx playwright install-deps webkit`). Where they are missing, run the Apple profiles on
Chromium, which still emulates their screen size, touch input and user agent:

```bash
E2E_MOBILE_ENGINE=chromium npm run test:e2e
npm run test:e2e -- --project="iPhone 16 Pro"   # a single device
```

To test a deployed site instead of a local build, set its address:

```bash
E2E_BASE_URL=https://pharmalingo.vercel.app npm run test:e2e
```

Emulation checks layout and behaviour; it does not replace a final check on a real phone.

### Backend and test data

Signed-in flows need `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and
`SUPABASE_SECRET_KEY` (from `.env.local`, or the `E2E_SUPABASE_*` repository secrets in CI).
Without them only the public flows run.

- A setup step creates one confirmed member per device through the admin API (no e-mail is
  sent) and signs it in once; a teardown step deletes them. Specs create and delete the extra
  accounts they need.
- Test accounts use `e2e-…@pharmalingo.test` addresses and `e2e_…` usernames.
- Supabase limits sign-ins per IP address. The suite signs in about twenty times per run;
  running it several times in a row may hit the limit.
