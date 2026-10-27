#!/usr/bin/env bash
# Re-render doc/assets/og-default.png from og-image.html (needs Google Chrome and the fonts named in the HTML).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="${1:-$HERE/../../doc/assets/og-default.png}"
"${CHROME:-google-chrome}" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --screenshot="$OUT" "file://$HERE/og-image.html"
