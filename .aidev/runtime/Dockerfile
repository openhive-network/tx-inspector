# The image AIDEV runs this project's suites in (`environment.image` in
# .aidev/project.yaml). Suites run with `--network none` and the caller's uid, so
# everything they need is in the image:
#
# * common-ci-configuration's node-test-tools (Ubuntu 26.04, Node v24.21.0, pnpm),
#   the same tool image CI's npm templates use. Its own pnpm runs as is:
#   npm_config_manage_package_manager_versions=false stops it switching to
#   package.json's `packageManager` (pnpm@10.0.0), which would be a download;
# * a pnpm store filled from pnpm-lock.yaml (`pnpm fetch`, with the catalogs of
#   pnpm-workspace.yaml and the @hiveio registry of .npmrc — both symlinks into
#   the common-ci-configuration submodule, copied resolved by build.sh), so
#   `pnpm install --offline` works in the sandbox. http-server, rollup and nuxt
#   are lockfile devDependencies, so `npx http-server` and `nuxt prepare`
#   resolve from node_modules with no download;
# * the Chromium build of the lockfile's playwright version in /opt/pw-browsers
#   (the base image's /ms-playwright holds another playwright's build). Playwright
#   1.58 predates Ubuntu 26.04 and refuses to pick a download for it, so the
#   install names ubuntu24.04-x64, whose Chromium build is the same portable
#   linux binary; the base image already carries Chromium's system libraries.
#
# Build and pin it with .aidev/runtime/build.sh; see .aidev/README.md.
FROM registry.gitlab.syncad.com/hive/common-ci-configuration/node-test-tools@sha256:e49773279d26e2b546c5e785e656fcec5caa983def88aef5816e2d95ec72ef1a
USER root
ENV HOME=/tmp \
    npm_config_store_dir=/opt/pnpm-store \
    npm_config_manage_package_manager_versions=false \
    PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    HUSKY=0 \
    CI=1 \
    NUXT_TELEMETRY_DISABLED=1 \
    DO_NOT_TRACK=1
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc /tmp/pnpm-fetch/
RUN cd /tmp/pnpm-fetch \
    && pnpm fetch \
    && pw="$(grep -m1 -oE '^  playwright@[0-9][0-9.]*:' pnpm-lock.yaml | grep -oE '[0-9][0-9.]*[0-9]')" \
    && echo "playwright from pnpm-lock.yaml: ${pw:?no playwright in pnpm-lock.yaml}" \
    && mkdir -p /opt/pw-browsers \
    && npm install --prefix /tmp/pw-cli --no-fund --no-audit --ignore-scripts "playwright@$pw" \
    && PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 /tmp/pw-cli/node_modules/.bin/playwright install chromium \
    && ls /opt/pw-browsers \
    && cd / && rm -rf /tmp/pnpm-fetch /tmp/pw-cli /tmp/.npm /tmp/.cache \
    && chmod -R a+rwX /opt/pnpm-store /opt/pw-browsers
