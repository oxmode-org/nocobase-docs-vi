> Historical preparation notes: the operator expressly authorized deployment on 2026-11-09; see RELEASE-AUTHORIZATION.md for exact statement and scope. Any earlier blocked-status wording below records the prior state.

# Staging status — 2026-11-07

- 199/199 translated paths integrated, no missing or extra paths. Core 120/120, Getting started 4/4, tutorials 18/18, Studio 50/50, FAQ 6/6 and home 1/1. The preview is non-publishable and disallows indexing. Local snapshot: `work/rc-local/tai-lieu-nocobase-3/`.
- After the final overlay corrections: build succeeded; 390 local resources crawled, 0 broken/escaping; 284 HTML pages, 0 unresolved fragment links; 69 old pages and 510 old content IDs retained. A full duplicate-ID audit after the final corrections found no duplicate IDs. 99 distinct external image URLs returned HTTP 200 and image MIME; 99 distinct local image URLs appeared in the corpus; crawler checked local references.
- Headless Chrome desktop (1440px) and mobile (390px) checks covered the Getting started diagram and Studio concepts/states. They rendered with no page-wide horizontal overflow in tested viewports. This is a limited visual check, not comprehensive accessibility or site-wide browser QA.
- Release gate still blocks: no verified evidence of NocoBase republication permission. Do not set the authorization attestation or deploy until the permission and remaining release checklist are satisfied. Production public release and remote branch were both `9e05fcb779cd` at the prior read-only check.

Final preview: all 199 current HTML pages contain `noindex,nofollow` (in addition to robots.txt disallow); Pagefind search “triển khai” returned 155 results with a valid local first result; four ZIP archives passed testzip. Local preview http://127.0.0.1:18766/tai-lieu-nocobase-3/ while server is running.

Read-only live audit: oxmode-16 current `releases/9e05fcb779cd`; Caddy serves docs from current and redirects old prefix. Current and `25db7932fffd` rollback candidate have required index/404/sitemap/release/Pagefind files, but no live rollback was exercised. Available space was 6,045,564 KiB (94% used); local preview was 35,388 KiB. Production-mode build with disposable simulated attestation passed metadata and Pagefind checks; temporary output removed. This is not actual authorization. Details and exact coordinated release steps: CORPUS-HANDOFF.md.
