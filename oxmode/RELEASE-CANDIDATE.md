> Historical preparation notes: the operator expressly authorized deployment on 2026-11-09; see RELEASE-AUTHORIZATION.md for exact statement and scope. Any earlier blocked-status wording below records the prior state.

# Release candidate checklist — 2026-11-07

Status: local preview only. Do not publish. Current snapshot: 199/199 translations, including Studio 50/50. The local candidate uses preview mode with noindex and local canonical origin. The production gate remains blocked because republication permission has not been established; its attestation is not evidence of permission.

Read-only live evidence at 06:01 UTC: HTTPS `/tai-lieu-nocobase-3/` returned 200 from Caddy; public `release.json` reports `9e05fcb779cd`; remote `oxmode-path` points to `9e05fcb779cd61b4dbd2e050f668d0ee39a1544b`. GitHub API listed no repository Actions variables. This does not establish organization-level settings or server filesystem/rollback state. Workflow on the branch deploys on push; do not push without coordinated release.

Before release:

- [x] Integrate all 199 translation paths and build preview without English fallbacks. Translation/content review remains a separate requirement.
- [ ] Record reference, scope and terms of actual NocoBase authorization to republish/translate this corpus and assets; existing confirmation is sufficient if it covers the proposed use. No such evidence found locally. Set `NOCOBASE_REPUBLICATION_AUTHORIZED=yes` only after authorization is established; if GitHub deploy is used, ensure workflow sees it and other required credentials.
- [ ] Re-run build and crawl, fragment and duplicate-ID checks, historical URL/anchor verification, image and ZIP checks, Pagefind and SEO/canonical/hreflang/sitemap tests. Review translated prose, code examples and asset licensing.
- [ ] Manually verify desktop and mobile layouts, including Studio concepts and states and Getting started's diagram, plus navigation and search. Headless Chrome checked those specific diagrams at 1440px and 390px without page-wide overflow; comprehensive visual review, navigation/search and accessibility remain open.
- [ ] Reinspect live Caddy, deployment target, repository workflow, Actions settings and current/previous release in read-only mode; confirm backups, rollback, historical URL behavior, old prefix routing and operator availability. Do not infer server state solely from public release.json.
- [ ] Build and inspect release in an isolated non-publishing environment, including intended SEO and release.json; coordinate production release and post-deployment checks separately. Restore known previous release if required according to reviewed rollback procedure.

Latest local checks: 390 local resources crawled, no broken or escaping references; 284 HTML pages, no unresolved internal fragments and no duplicate IDs; 69 baseline pages and 510 legacy IDs retained. Studio concepts and statuses HTML contains labelled diagrams and states. Pinned upstream concept-map color rules were added to local integration CSS; state and mobile map CSS exist. Headless Chrome additionally rendered the named diagrams and states at desktop and mobile sizes; this is not a full-site visual or accessibility audit.

Final local preview check: 199/199 current pages have a noindex,nofollow meta tag; Pagefind “triển khai” returned 155 results, and four ZIP archives passed integrity checks. Canonical origin is localhost in preview and must be checked again in a real authorized release build.

Read-only audit located the live target and checked candidate rollback files and disk headroom; no rollback was performed. A disposable production-mode build with a clearly simulated, process-only attestation passed canonical, no-preview-noindex, OG, sitemap, Pagefind and fixture-marker checks. This is not NocoBase authorization. For measured capacity, exact current/previous targets and operator sequence see CORPUS-HANDOFF.md; revalidate live state at release time.
