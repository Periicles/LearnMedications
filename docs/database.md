# Database

Supabase Postgres. The schema lives in `supabase/migrations/` and is applied in file-name
order.

## Tables

| Table                | Content                                        | Who can read           |
| -------------------- | ---------------------------------------------- | ---------------------- |
| `profiles`           | Username, avatar, total XP, streak             | Any signed-in user     |
| `study_sessions`     | One row per finished session (mode, XP, score) | Owner                  |
| `lesson_completions` | Completed lessons per collection               | Owner                  |
| `substance_mastery`  | Strength and next review date per molecule     | Owner                  |
| `user_achievements`  | Unlocked achievements                          | Any signed-in user     |
| `friendships`        | Friend requests and accepted friendships       | The two users involved |

Learning content is not in the database; rows reference it by slug.

## Security model

- Row level security is enabled on every table.
- Users can update only `username` and `avatar` on their own profile (column-level grants).
- Progress tables have no write policy: only the server writes them, with the secret key,
  through `apply_session_result`. A user cannot grant themselves XP through the API.
- Friend requests can only be created as oneself, and only the addressee can accept.
- Deleting an account removes every related row by cascade.

## Functions

| Function                 | Caller      | Purpose                                             |
| ------------------------ | ----------- | --------------------------------------------------- |
| `handle_new_user`        | Trigger     | Creates the profile when a user signs up            |
| `is_username_available`  | Anyone      | Username check on the sign-up form                  |
| `apply_session_result`   | Server only | Stores a finished session atomically                |
| `get_session_stats`      | Signed-in   | Counters about the caller's sessions                |
| `get_daily_xp`           | Signed-in   | XP per day for the caller                           |
| `get_friend_leaderboard` | Signed-in   | Caller and friends ranked by XP earned since Monday |

## Applying migrations

With the Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
```

Or paste each file of `supabase/migrations/` into the SQL editor of the dashboard, in order.

## Changing the schema

Add a new timestamped file in `supabase/migrations/`; never edit a migration that has been
applied. Add or update a test in `supabase/tests/`: every migration runs on an in-memory
Postgres during `npm run test`.
