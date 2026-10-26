# Tài liệu NocoBase tiếng Việt, do OXMODE biên dịch

Vietnamese translation of the [official NocoBase 3 documentation](https://docs.nocobase.com/), published by
[OXMODE](https://oxmode.ai/) at <https://oxmode.ai/tai-lieu-nocobase/>.

- Source: a trimmed copy of the `docs/` workspace from [nocobase/nocobase](https://github.com/nocobase/nocobase)
  (branch `v3-develop`) with the Vietnamese translation (`docs/docs/vi`) and the OXMODE edition changes
  (attribution bar, site title, links to the official docs for English and Chinese).
- NocoBase, its name, logo and documentation are the property of NocoBase and are used under its license:
  [LICENSE.txt](LICENSE.txt) and [LICENSE-APACHE.txt](LICENSE-APACHE.txt).
- The root `package.json` drops the upstream `postinstall` script (it syncs repository skills that are not part of
  this copy); the lockfile is unchanged.

## Build

```sh
pnpm install --frozen-lockfile --filter @nocobase/docs...
OUT=/tmp/release oxmode/build.sh <release-id>   # writes /tmp/release/tai-lieu-nocobase/...
python3 oxmode/serve.py /tmp/release 8917 & python3 oxmode/crawl.py http://127.0.0.1:8917
```

Deployment: `.github/workflows/deploy-docs.yml` (push to `oxmode-path`).
The `gh-pages` branch holds the earlier GitHub Pages preview and is not touched by this workflow.
