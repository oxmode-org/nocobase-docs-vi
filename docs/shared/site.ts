/**
 * The public origin every absolute URL the site emits is built on: canonical and alternate links, Open Graph URLs,
 * `sitemap.xml`, `robots.txt`. Set `DOCS_SITE_ORIGIN` to build the same output for another host, such as a staging
 * domain; it must not carry a path.
 */
export const SITE_ORIGIN = normalizeOrigin(
  process.env.DOCS_SITE_ORIGIN || 'https://docs.nocobase.com',
);

function normalizeOrigin(value: string): string {
  const url = new URL(value);
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(
      `DOCS_SITE_ORIGIN must be an origin without a path, got ${value}`,
    );
  }
  return url.origin;
}

/** Absolute URL of a public path on the site origin. */
export function absoluteUrl(pathname: string): string {
  return SITE_ORIGIN + pathname;
}

/** The official NocoBase documentation, which a language this build does not host is linked to. */
export const UPSTREAM_ORIGIN = 'https://docs.nocobase.com';

/**
 * Languages this build publishes, from `DOCS_HOSTED_LANGUAGES` (comma-separated keys, such as `vi`). Unset means
 * every language. Links and alternates to any other language point at `UPSTREAM_ORIGIN`.
 */
const hosted = (process.env.DOCS_HOSTED_LANGUAGES ?? '')
  .split(',')
  .map((key) => key.trim())
  .filter(Boolean);

export function isHostedLanguage(language: string): boolean {
  return hosted.length === 0 || hosted.includes(language);
}

/** Public URL of a localized path: relative when this build hosts the language, else on the official docs. */
export function languageHref(language: string, pathname: string): string {
  return isHostedLanguage(language) ? pathname : UPSTREAM_ORIGIN + pathname;
}

/** Absolute URL of a localized path, on this site or on the official docs. */
export function absoluteLanguageUrl(
  language: string,
  pathname: string,
): string {
  return (
    (isHostedLanguage(language) ? SITE_ORIGIN : UPSTREAM_ORIGIN) + pathname
  );
}
