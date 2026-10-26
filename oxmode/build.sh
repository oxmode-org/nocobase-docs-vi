#!/usr/bin/env bash
# Build the Vietnamese NocoBase docs for https://oxmode.ai/tai-lieu-nocobase/ into ./dist (a release root).
# usage: build.sh [release-id]   (env: OUT=release root to write, default ./dist next to this script)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"
OUT="${OUT:-$HERE/dist}"
REL="${1:-$(git -C "$REPO" rev-parse --short HEAD)}"
DOCS_SITE_ORIGIN=https://docs-build.invalid DOCS_HOSTED_LANGUAGES=vi pnpm --dir "$REPO" --filter @nocobase/docs build
python3 "$HERE/package_vi.py" "$REPO/docs/dist" "$OUT" --release "$REL"
"$REPO/docs/node_modules/.bin/pagefind" --site "$OUT/tai-lieu-nocobase" \
  --exclude-selectors '.oxmode-bar' --output-subdir pagefind
# Pagefind stores URLs relative to --site and prefixes them at search time with the directory pagefind.js
# was loaded from (/tai-lieu-nocobase/), so results come back as /tai-lieu-nocobase/<page>.
du -sh "$OUT"; find "$OUT" -type f | wc -l
