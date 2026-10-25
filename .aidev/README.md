# Automated contributions

This directory configures the automated development platform that contributes to this
repository. This note says which branches it uses here and how its work reaches the
project's main line.

## Branches

- `aidev/integration` — the integration branch. Automated work lands here and nowhere else.
- `main` — the project's main line; reached from `aidev/integration` only by merge request (`aidev handoff`, a linear one-commit-per-change copy on `aidev/handoff`).
- `ai/*` — one branch per task, created and deleted by the platform. Do not commit to them.
- `session/*` — a session's accumulated work, landed on the integration branch as a batch.

## How work reaches the main line

Task and session branches never reach `aidev/integration` through merge requests; the platform
lands them after its own verification. `aidev/integration` reaches the main line by this project's usual process, merge requests included — the
platform never merges into any other branch.

Whether this project's CI pipelines skip `ai/*` and `session/*` branches is decided by the
project's CI rules; maintainers record that decision here.

## Suites run before work lands

Declared in `.aidev/project.yaml` under `verification`, all through `.aidev/run-checks.sh`
(steps: `lint` = `eslint .` without `--fix`; `build` = `nuxt build`; `test-build` =
`pnpm run build:test`, tsc plus the rollup test bundle; `test` = Playwright):

- `quick` — lint build test-build test
- `full` — lint build test-build test
- `baseline` — build test-build test
- `canary` — lint build test-build test
- `static` — lint
- `coverage` — test-build test
- `system` — build test-build test

Each run writes `test-results/<suite>/junit.xml` (one case per step) and keeps
Playwright's own report as `test-results/<suite>/playwright-junit.xml`.

`test` runs the Playwright projects that package.json's `test` script names, except
those in `NETWORK_PROJECTS` in `run-checks.sh`: suites run without network, and
`tx_inspector_api_testsuite` (`__tests__/detailed/txInspector-base.ts`) analyses
transactions through the live `https://api.hive.blog/` node.

## Test runtime

`.aidev/runtime/Dockerfile` builds on common-ci-configuration's `node-test-tools` and adds
a pnpm store filled from `pnpm-lock.yaml` (with the workspace catalogs and `.npmrc`
registry, both symlinks into the `common-ci-configuration` submodule) and the Chromium
build of the lockfile's Playwright version. Rebuild and re-pin it with
`.aidev/runtime/build.sh --push` when the Dockerfile, `pnpm-lock.yaml`, or the
submodule's `pnpm-workspace.yaml` / `.npmrc` changes, and put the printed
`repo@sha256:…` into `environment.image`.

## Known failures at onboarding (2026-10-25)

The tests never ran in CI, and fail on the existing code:

- `test-build`: rollup cannot bundle `@hiveio/wax/vite` (its `wax.common.wasm?url`
  import is a Vite-only feature), so `dist/bundle` is never written.
- `test`: with no bundle, 27 of the 29 offline tests fail
  (`createTxAnalyzerTestFor is not a function`). The "mock" projects also reach
  `https://api.hive.blog` through wax's `createTransaction` (chain reference data),
  which the mocked API provider does not cover.
- `typecheck` (not bound): vue-tsc 1.8.27 crashes on typescript 5.7.3.
- Every `nuxt` command (`postinstall`'s `nuxt prepare`, `build`, `typecheck`) fails in
  a linked git worktree: `nuxt.config.ts`'s `getCommitHash` reads `.git/HEAD` as a
  path, and there `.git` is a file (`ENOTDIR`).

## Known state at onboarding (2026-10-25)

The runtime installs offline, builds the app and launches Chromium, but the suite does not pass yet:
`nuxt.config.ts` reads `.git/HEAD` as a path (fails in a git worktree, where `.git` is a file);
`pnpm build:test` cannot bundle `@hiveio/wax/vite` (`wasm?url` needs Vite); the "mock" test
projects still reach api.hive.blog through wax; `nuxt typecheck` crashes (vue-tsc 1.8.27 with
TypeScript 5.7.3). `tx_inspector_api_testsuite` is left out of the required slots because it
analyses transactions through the live api.hive.blog.
