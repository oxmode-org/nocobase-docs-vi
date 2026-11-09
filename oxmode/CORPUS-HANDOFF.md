> Historical preparation notes: the operator expressly authorized deployment on 2026-11-09; see RELEASE-AUTHORIZATION.md for exact statement and scope. Any earlier blocked-status wording below records the prior state.

# Corpus integration — local staging only

- Current upstream: nocobase/website-v3 `6a9c7eae5a10d1c706983fa352877f62ba8a5797`, English `doc/content`, 199 pages. Navigation ordering is from its captured `llms.txt`; 3-column site design uses the OXMODE builder, not the upstream Astro renderer. Captured 2026-11-06. Upstream content and some images are copyrighted; no republication permission was found in the checkout.
- Existing live source baseline: oxmode-org/nocobase-docs-vi `9e05fcb779cd61b4dbd2e050f668d0ee39a1544b`, 69 pages. This is a local build of the pinned commit, not proof that every live file is identical. Check current deployment again before release.
- `corpus/en`: pinned English source and `upstream-llms.txt` navigation. `corpus/vi`: translated paths, with complete front matter and matching relative paths. Copy later approved overlays here before building. All build inputs needed are in this tree plus Node/Python and `npm ci --prefix doc`; the symlink `doc/node_modules` in this local staging copy is a convenience and must not be committed.
- Current local overlay at handoff: 199 translated, 0 missing (may have grown in `work/translations` after this file was written). Missing pages show English and explicit notice in HTML and Markdown. `--preview` disallows search engine indexing. Pagefind does not provide Vietnamese stemming.
- Legacy: the exact pinned old source builds 69 historical pages under `/legacy/`, noindexed and excluded from Pagefind. Sixteen retired old paths retain old page content with a historical notice. On pages that still exist, old main-content fragment IDs missing from the new page link to the exact archived fragment. These fragment bridge links are deliberately shown in the page; review user experience and headings before release. The old prefix `/tai-lieu-nocobase/` requires existing server-level routing; this local build does not change Caddy.

## Local verification

```
rsync -a ../translations/ oxmode/corpus/vi/  # run from work/integration; only after reviewing overlay
npm ci --prefix doc --no-audit --no-fund
python3 oxmode/build-corpus.py --preview --output /tmp/oxmode-docs-check --origin http://127.0.0.1:18766
python3 -m http.server 18766 --directory /tmp/oxmode-docs-check
python3 oxmode/crawl.py http://127.0.0.1:18766
python3 oxmode/check-fragments.py /tmp/oxmode-docs-check/tai-lieu-nocobase-3
python3 oxmode/check-legacy.py /tmp/oxmode-live-baseline /tmp/oxmode-docs-check/tai-lieu-nocobase-3
```

`check-legacy.py` needs the independently built pinned baseline (not committed build output). Build it from the pinned source using the existing `doc/build.mjs`. Last verification: 69 historical pages and 510 historical main-content IDs retained, no duplicate IDs; 284 built HTML pages have no unresolved internal fragment links; 390 same-site resources crawled with no broken or escaping links. Re-run these checks after every translation update. Explicit `client-services` and `server-services` anchors were present in the rendered services integration page.

## Release gate and outstanding work

`oxmode/build.sh` requires every upstream page translated and `NOCOBASE_REPUBLICATION_AUTHORIZED=yes`; all 199 translated paths are present, but permission and its attestation are not established. If the user provides an existing permission confirmation covering this publication, record its exact reference and scope here and set the variable for the build; the variable is an attestation, not evidence itself. Do not request fresh permission if existing authorization suffices. GitHub Actions reads the corresponding repository variable, which defaults to absent, and can deploy on a push to `oxmode-path`. Do not push this tree there until the user coordinates a release. The production CI builds from checked-in corpus, not the external `work/translations` directory.

Before release: complete and review translations against the pinned source; verify images and special markup visually (renderer differs from upstream), all URL/fragment checks and search; validate copyright permission and attribution; review old-link bridges, noindex and canonical/hreflang/sitemap behavior; review current deployment, rollback and Caddy rules; test full release build and workflow in a non-publishing environment. No production deployment, CI configuration, repository variable or live service was changed by this staging work.

A non-publishable synthetic release exercise copied English pages into a disposable fixture solely to cover the complete-build code path; with a fixture-only authorization attestation the build and release.json succeeded, and the fixture was deleted. This is not evidence of translation completion or republication permission.

## Read-only deployment audit and exact operator sequence (2026-11-07)

The verified SSH alias `oxmode-16` has `/srv/oxmode/docs/current -> releases/9e05fcb779cd`; the public release and remote `oxmode-path` matched. Current Caddy serves `/tai-lieu-nocobase-3/*` from that symlink, maps 404s to the release's 404, and redirects old prefix routes. Root `https://oxmode.ai/robots.txt` allows indexing and lists the docs sitemap; a prefix-local production robots.txt is neither expected nor generated. Reverify immediately before any release: the server or branch may have changed.

Read-only inspection found previous releases `25db7932fffd`, `b62bb7158b06`, `f9121e930ed2`, `f91cee24b328`. Current `9e05fcb779cd` and `25db7932fffd` each had nonempty index, 404, sitemap, release marker, and Pagefind entry. Two older releases lacked Pagefind entry. File presence is not an end-to-end restore test. Snapshot current's target as the rollback target immediately before the eventual switch, verify its contents and dependencies, and retain it; do not assume a previous candidate remains available after pruning. Caddy routes the old prefix without needing the old tree, but verify public old URLs and any special redirects during release. The server was unchanged during audit.

Capacity: candidate preview occupied 35,388 KiB (about 34.6 MiB) on the local filesystem; server `df -Pk` showed 6,045,564 KiB available (about 5.77 GiB), 94% used. This is a rough comparison: final production bytes, rsync temporary files, hardlinks, concurrent disk use and retention differ. Recheck actual headroom before release; do not prune user data speculatively.

A disposable *simulated* production build with the real 199 translations and process-only fixture attestation passed checks for production canonical, absence of preview noindex, OG origin, production sitemap, Pagefind entry and a `SIMULATED-FIXTURE` release marker. Its temporary files were deleted. This does not establish permission, deployability, a production backup, or final SEO review. A production build without the attestation correctly blocks.

Once the user has supplied or identified NocoBase permission covering the translation, images and distribution, and has coordinated production release, the operator should:

1. Record the exact permission source, scope and attribution terms; review the full translation and final diff. Sync the authoritative overlay into the candidate, remove the local `doc/node_modules` symlink from any git staging, and locally commit the intended files on a review branch. Confirm no local-only preview files, accidental credentials or stale source are included.
2. Run npm CI, full production build and all crawl, fragment, duplicate-ID, archive, search, screenshot and metadata tests against the exact release commit. Capture and review `release.json`, canonical/hreflang/OG, sitemap, root robots and 301/404 behavior. Confirm Actions secrets/variables and execution policy through appropriate read-only inspection. Only after documented permission set the repository authorization variable if the chosen CI process requires it; setting it is a production change and was not done during audit.
3. Read-only inspect `/srv/oxmode/docs/current`, release file presence, free disk, Caddy config and current public marker. Record and protect the actual current release and tested rollback plan; coordinate the maintenance owner. The workflow deploys automatically on push to `oxmode-path`, so the user-coordinated branch push is the deployment action, not a harmless code upload. Do not push until all gates pass.
4. On a coordinated authorized run, monitor the existing workflow: it builds, crawls, uploads to `releases/<sha>`, atomically switches `current`, checks server and public marker, and has a failure rollback step; confirm the actual workflow matches the reviewed candidate before relying on it. Verify site, old paths, archive fragments, 404, search, images, sitemap and release marker externally, and inspect workflow success. Note that workflow retention prunes older releases after success.
5. If rollback is required, authorized operator verifies the recorded target exists and has required files, then in `/srv/oxmode/docs` uses the reviewed atomic symlink pattern `ln -sfn releases/<recorded-previous> current.next && mv -Tf current.next current`; recheck public marker, URLs, search and 404. Do not execute this during preparation.
