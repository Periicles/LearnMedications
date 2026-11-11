# Contributing

## Branches

| Branch    | Role                                              |
| --------- | ------------------------------------------------- |
| `main`    | Released code, deployed to production             |
| `develop` | Integration branch and base of every pull request |

Work branches are created from `develop` and named `type/short-description`, with the same
types as commits: `feat/friends`, `fix/streak-reset`, `docs/deployment`, `chore/…`, `ci/…`,
`refactor/…`, `test/…`. The name is checked in CI.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), in English, checked by
commitlint locally (husky hook) and in CI:

```
feat(quiz): add matching exercise
fix(progress): keep streak when a session ends after midnight
```

Make several focused commits per feature rather than one large commit.

## Pull requests

- Target `develop`, with a conventional title in English.
- CI must be green: formatting, lint, type check, tests and production build.
- Merge with a merge commit so that the individual commits stay in the history.

## Local checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

The pre-commit hook runs ESLint and Prettier on staged files.

## Releases

1. Open a pull request from `develop` to `main` titled `chore(release): vX.Y.Z`.
2. Once merged, tag the merge commit (`git tag vX.Y.Z && git push --tags`) and publish a GitHub
   release.
3. Vercel deploys `main` to production.
