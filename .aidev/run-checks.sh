#!/usr/bin/env bash
# Run the checks named after the suite and write test-results/<suite>/junit.xml.
#
#   .aidev/run-checks.sh <suite> <step>...
#
# Steps, each one junit case (its log the failure body):
#   lint        `eslint .` — package.json's `lint` without --fix, so it reports
#               instead of rewriting the tree
#   build       `nuxt build` (package.json `build`, CI's build job)
#   typecheck   `nuxt typecheck` (vue-tsc over the app)
#   test-build  `pnpm run build:test`: tsc -p configs/tsconfig-tests.json, then
#               its `postbuild:test` rollup bundle into dist/bundle, which
#               __tests__/assets/test.html loads
#   test        Playwright, the projects package.json's `test` names minus
#               NETWORK_PROJECTS; Playwright's own junit is kept as
#               test-results/<suite>/playwright-junit.xml. `pnpm test` itself is
#               not run: its `pretest` downloads Chromium, which the image has.
#               --max-failures is dropped so one failure doesn't hide the rest.
#               Runs test-build first when dist/bundle is missing.
#
# Runs offline in the image of .aidev/runtime/Dockerfile.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
root="$PWD"
suite="${1:?usage: $0 <suite> <step>...}"; shift
out="$root/test-results/$suite"
rm -rf "$out"; mkdir -p "$out"
cases="$out/cases.tsv"; : > "$cases"
source .aidev/junit-helpers.sh

# Playwright projects that need the live network: txInspector-base.ts drives
# TxInspectorEngine against https://api.hive.blog/ (__tests__/assets/globals.ts,
# createTxInspectorTestFor), and suites run with --network none.
NETWORK_PROJECTS=(tx_inspector_api_testsuite)

if ! source "$root/.aidev/pnpm-deps.sh"; then
    printf 'case\tinstall\tfail\t0\tpnpm install --offline failed\n' >> "$cases"
    junit_write_cases "$out/junit.xml" "$suite" "$cases"
    exit 1
fi

status=0
step() {
    local name="$1"; shift
    local log="$out/$name.log" t0=$SECONDS rc=0
    echo "== $name" >&2
    ( cd "$root" && "$@" ) > "$log" 2>&1 < /dev/null || rc=$?
    if [ "$rc" -eq 0 ]; then
        printf 'case\t%s\tpass\t%s\t\n' "$name" "$((SECONDS - t0))" >> "$cases"
    else
        status=1; tail -40 "$log" >&2
        printf 'case\t%s\tfail\t%s\texit %s\t%s\n' "$name" "$((SECONDS - t0))" "$rc" "$log" >> "$cases"
    fi
    return "$rc"
}

offline_projects() {
    EXCLUDE="${NETWORK_PROJECTS[*]}" node -e '
const exclude = new Set(process.env.EXCLUDE.split(" ").filter(Boolean));
const script = require("./package.json").scripts.test;
const projects = [...script.matchAll(/--project[= ]([^\s]+)/g)].map((m) => m[1]);
if (!projects.length) { console.error("package.json scripts.test names no --project"); process.exit(1); }
for (const p of projects) if (!exclude.has(p)) console.log(`--project=${p}`);'
}

playwright_tests() {
    local junit="$out/playwright-junit.xml" projects
    projects="$(offline_projects)" || return 1
    # --reporter replaces the config's junit/json reporters, which would write
    # results.xml / results.json into the tree; --output keeps Playwright's
    # outputDir (which it empties on start) away from test-results/<suite>/.
    # shellcheck disable=SC2086
    PLAYWRIGHT_JUNIT_OUTPUT_NAME="$junit" run_with_junit_fallback "$junit" playwright \
        pnpm exec playwright test --workers 1 --reporter=list,junit \
        --output "$out/playwright-output" $projects
}

test_built=0
test_build() {
    # Once per run: a failed test-build is reported once, not again by `test`.
    [ "$test_built" -eq 0 ] || return 0
    test_built=1
    step test-build pnpm run build:test
}

for s in "$@"; do
    case "$s" in
        lint) step lint pnpm exec eslint . ;;
        build) step build pnpm exec nuxt build ;;
        typecheck) step typecheck pnpm exec nuxt typecheck ;;
        test-build) test_build ;;
        test)
            if [ "$test_built" -eq 0 ] && [ ! -f dist/bundle/globals.js ]; then test_build; fi
            step test playwright_tests ;;
        *) printf 'case\t%s\tfail\t0\tunknown step\n' "$s" >> "$cases"; status=1 ;;
    esac
done
junit_write_cases "$out/junit.xml" "$suite" "$cases"
exit "$status"
