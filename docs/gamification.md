# Gamification rules

All rules are pure functions in `src/features/progress/lib` and
`src/features/achievements/lib`, with their constants in `constants.ts` files.

## XP

| Event                       | XP                           |
| --------------------------- | ---------------------------- |
| Finishing a lesson          | 10                           |
| Finishing a review session  | 5                            |
| Each correct first attempt  | 1 (capped at 30 per session) |
| Session without any mistake | +5                           |

## Levels

Reaching level `n` requires `50 × (n − 1) × n` XP in total: 100 XP for level 2, 300 for
level 3, 600 for level 4, 1,000 for level 5, and so on.

## Streak

A day counts when at least one session is finished. Days are calendar days in the
`Europe/Paris` time zone. Missing a full day resets the streak; the longest streak is kept.

## Mastery and spaced repetition

Each molecule has a strength from 0 to 5 per user.

- All answers about the molecule correct in a session: strength +1.
- Any wrong answer: strength falls back to 1 (or stays at 0).
- Next review after 0, 1, 2, 4, 8 or 16 days depending on the new strength.
- A molecule is **mastered** from strength 4.

The review session takes up to eight due molecules, weakest first. When nothing is due it
offers free practice on the weakest known molecules.

## Lesson unlocking

Inside a collection, lessons unlock one after another. Completed lessons can be replayed.
Collections are all open from the start so that a learner can go straight to their service.

## Achievements

The catalogue (`src/features/achievements/catalog.ts`) is declarative: each achievement is a
metric and a threshold. Metrics cover lessons, perfect sessions, streak, XP, level, molecules
seen and mastered, review sessions, completed collections and friends. Adding an achievement
is a one-line change.
