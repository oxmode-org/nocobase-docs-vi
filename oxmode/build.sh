#!/usr/bin/env bash
# Build the Vietnamese NocoBase 3 docs for https://oxmode.ai/tai-lieu-nocobase-3/ into a release root.
# usage: build.sh [release-id]   (env: OUT=release root to write, default ./oxmode/dist)
# Output: $OUT/tai-lieu-nocobase-3/... and $OUT/tai-lieu-nocobase-3/release.json
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"
OUT="${OUT:-$HERE/dist}"
PREFIX="${PREFIX:-tai-lieu-nocobase-3}"
REL="${1:-$(git -C "$REPO" rev-parse --short=12 HEAD)}"
rm -rf "$OUT/$PREFIX"
( cd "$REPO/doc" && [ -d node_modules ] || npm ci --no-audit --no-fund )
DOCS_BASE="/$PREFIX/" DOCS_SITE_ORIGIN=https://oxmode.ai DOCS_OUT_DIR="$OUT/$PREFIX" node "$REPO/doc/build.mjs"
# Search index (Pagefind, from doc/package.json): only <main data-pagefind-body>, served from $PREFIX/pagefind/.
"$REPO/doc/node_modules/.bin/pagefind" --site "$OUT/$PREFIX" --output-subdir pagefind --quiet
printf '{"release": "%s", "built_at": %s}\n' "$REL" "$(date +%s)" > "$OUT/$PREFIX/release.json"
du -sh "$OUT/$PREFIX"; find "$OUT/$PREFIX" -type f | wc -l
