# Rolling out /tai-lieu-nocobase-3/ (not applied; needs approval)

Source: nocobase/website-v3 `doc/` at 039ed3bf846414b0efec57b9d9adc55310bcbce9. That repository has no license
file, so republishing a translation needs NocoBase's permission first.

Build: `oxmode/build.sh` -> `$OUT/tai-lieu-nocobase-3/` (69 pages, vi; untranslated pages show the English
original, marked EN in the menu and with a note on the page). Local check: `oxmode/serve.py` + `oxmode/crawl.py`.

## Order (zero downtime)

1. Repository variables: `SKIP_PUBLIC_PROBE=true`, `KEEP_LEGACY_TREE=true`.
2. Push this tree to `oxmode-path`. The workflow builds the new tree, hard-links the old `tai-lieu-nocobase/`
   tree from the live release into the new release, swaps `current`. Old URLs keep working (Caddy unchanged);
   the new tree is on disk but not routed yet.
3. Back up and edit Caddy (oxmode.ai block only):
   `cp -a /etc/caddy/Caddyfile /etc/caddy/Caddyfile.pre-docs3-$(date +%Y%m%dT%H%M%S)`,
   apply `caddy-docs3.diff`, `caddy validate --config /etc/caddy/Caddyfile`, `systemctl reload caddy`,
   then run the caddy-verify checks (site, /lien-he, blog, /en, robots, other subdomains, docs URLs).
4. Merge the website PR (footer, partner modal, robots/sitemap -> /tai-lieu-nocobase-3/).
5. Unset `SKIP_PUBLIC_PROBE`; once the 301s are live, unset `KEEP_LEGACY_TREE` (next release drops the old tree).

## Rollback

- Caddy: `cp -a /etc/caddy/Caddyfile.pre-docs3-<ts> /etc/caddy/Caddyfile && caddy validate --config
  /etc/caddy/Caddyfile && systemctl reload caddy`. The old tree is still in `current`, so the old site is back
  immediately.
- Docs release: `ln -sfn releases/<previous> current.next && mv -Tf current.next current` in `/srv/oxmode/docs`.
