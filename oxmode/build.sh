#!/usr/bin/env bash
# Builds a production release only after translation completion and republication authorization.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"
OUT="${OUT:-${TMPDIR:-/tmp}/oxmode-docs-release}"
REL="${1:-$(git -C "$REPO" rev-parse --short=12 HEAD)}"
[ -d "$REPO/doc/node_modules" ] || npm ci --prefix "$REPO/doc" --no-audit --no-fund
python3 "$HERE/build-corpus.py" --output "$OUT" --origin https://oxmode.ai
printf '{"release": "%s", "built_at": %s}\n' "$REL" "$(date +%s)" > "$OUT/tai-lieu-nocobase-3/release.json"
