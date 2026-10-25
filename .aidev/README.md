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
(steps: `lint` = `eslint .` without `--fix`; `build` = `nuxt build`; `typecheck` =
`nuxt typecheck`; `test-build` = `pnpm run build:test`, tsc plus the rollup test bundle;
`test` = Playwright):

- `quick` — lint build test-build test
- `full` — lint build test-build test
- `baseline` — build test-build test
- `canary` — lint build test-build test
- `static` — lint typecheck
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

## Offline tests

The mock projects answer the chain API calls wax makes from the page
(`get_dynamic_global_properties`, `find_accounts`) from the project's mock file and
`__tests__/assets/mock/dynamic_global_properties_data.json`
(`__tests__/assets/chain-api-mock.ts`); any other request leaving the page gets a JSON-RPC
error naming the call. CI's `test` job runs the same projects.

Twelve mock test cases are marked `test.fail`: with the chain calls answered from their
own mock data, the analyzer's verdict disagrees with the recorded expectation (satisfied
or not, which signature matched which authority, `blockchain_forced_true`), or the
analyzer throws (recover account). Each marker names the disagreement. Whether the
expectation or the analyzer is wrong is for a maintainer to decide; a marked case that
starts passing fails the suite, so fixing either side shows up.
