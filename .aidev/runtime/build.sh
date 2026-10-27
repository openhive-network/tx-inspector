#!/usr/bin/env bash
# Build (and with --push, publish) the test runtime image of .aidev/runtime/Dockerfile
# and print the digest-pinned reference to put in .aidev/project.yaml's
# `environment.image`. See .aidev/README.md.
#
# The tag is `aidev-<hash>` of the image inputs (the Dockerfile, pnpm-lock.yaml,
# pnpm-workspace.yaml and .npmrc — the last two resolved through their symlinks
# into common-ci-configuration — and the current digest of the Dockerfile's
# moving FROM image). When <repository>:aidev-<hash> is already in the registry
# nothing is built: the script prints its digest.
#
#   .aidev/runtime/build.sh           # registry digest, or build locally and print the local tag
#   .aidev/runtime/build.sh --push    # registry digest, or build + push and print repo@sha256:<digest>
#   .aidev/runtime/build.sh --tag     # print the input-hash tag only
#
# AIDEV_RUNTIME_BUILDER names a buildx builder (e.g. a region builder whose
# mirror serves registry.gitlab.syncad.com); the current builder otherwise.
set -euo pipefail
cd "$(dirname "$0")/../.."
REPOSITORY="${AIDEV_RUNTIME_REPOSITORY:-registry.gitlab.syncad.com/hive/tx-inspector/aidev-tests}"
INPUTS=(.aidev/runtime/Dockerfile pnpm-lock.yaml pnpm-workspace.yaml .npmrc)
manifest_digest() {
    docker buildx imagetools inspect "$1" --format '{{json .Manifest}}' 2>/dev/null \
        | grep -o '"digest": *"sha256:[0-9a-f]*"' | head -1 | grep -o 'sha256:[0-9a-f]*' || true
}
BASE="$(awk '/^FROM /{print $2; exit}' .aidev/runtime/Dockerfile)"
input_hash() {
    # cat follows the symlinks, so a submodule bump that changes the catalogs
    # or the registry makes a new tag; the base digest makes a new tag whenever
    # ccc moves the base tag (e.g. a Node bump).
    local f base_digest
    base_digest="$(manifest_digest "$BASE")"
    {
        for f in "${INPUTS[@]}"; do printf '%s  %s\n' "$(cat "$f" | sha256sum | cut -d' ' -f1)" "$f"; done
        printf '%s  %s\n' "${base_digest:?cannot resolve the digest of $BASE}" "$BASE"
    } | sha256sum | cut -c1-16
}
TAG="aidev-$(input_hash)"
case "${1:-}" in
    --tag) echo "$TAG"; exit 0 ;;
    ""|--push) ;;
    *) echo "usage: $0 [--push|--tag]" >&2; exit 2 ;;
esac
digest="$(manifest_digest "$REPOSITORY:$TAG")"
if [ -n "$digest" ]; then
    echo "$REPOSITORY:$TAG exists in the registry; not building" >&2
    echo "$REPOSITORY@$digest"
    exit 0
fi
echo "$REPOSITORY:$TAG is not in the registry; building it" >&2
context="$(mktemp -d)"
trap 'rm -rf "$context"' EXIT
# Only the files the Dockerfile copies; -L because pnpm-workspace.yaml and
# .npmrc are symlinks into the common-ci-configuration submodule.
cp -L pnpm-lock.yaml pnpm-workspace.yaml .npmrc "$context/"
build=(docker buildx build --pull --provenance=false -f .aidev/runtime/Dockerfile -t "$REPOSITORY:$TAG")
[ -n "${AIDEV_RUNTIME_BUILDER:-}" ] && build+=(--builder "$AIDEV_RUNTIME_BUILDER")
if [ "${1:-}" != "--push" ]; then
    "${build[@]}" --load "$context" >&2
    echo "$REPOSITORY:$TAG"
    exit 0
fi
"${build[@]}" --push --metadata-file "$context/metadata.json" "$context" >&2
digest="$(grep -o '"containerimage.digest": *"sha256:[0-9a-f]*"' "$context/metadata.json" | grep -o 'sha256:[0-9a-f]*')"
echo "$REPOSITORY@${digest:?no digest in buildx metadata}"
