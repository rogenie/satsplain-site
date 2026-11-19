import fs from 'node:fs';
import path from 'node:path';
import { collisionMessage, planRedirects, site } from './redirects.mjs';

const root = process.cwd();
const dist = path.join(root, 'dist');
const errors = [];
const { ok, collisions } = planRedirects(root);

if (collisions.length) {
  errors.push(collisionMessage(collisions));
}

if (!fs.existsSync(dist)) {
  errors.push('dist/ is missing. Build the site before checking short URL redirects.');
}

const sitemapText = fs.existsSync(dist)
  ? fs
      .readdirSync(dist)
      .filter((name) => name.startsWith('sitemap') && name.endsWith('.xml'))
      .map((name) => fs.readFileSync(path.join(dist, name), 'utf8'))
      .join('\n')
  : '';

const llmsText = ['llms.txt', 'llms-full.txt']
  .map((name) => {
    const file = path.join(dist, name);
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  })
  .join('\n');

for (const article of ok) {
  const file = path.join(dist, article.slug, 'index.html');
  const flat = path.join(dist, `${article.slug}.html`);
  const target = `/articles/${article.slug}/`;
  const canonical = `${site}${target}`;
  if (!fs.existsSync(file) || !fs.existsSync(flat)) {
    errors.push(`Missing short URL page for /${article.slug} and /${article.slug}/ -> ${target}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  if (fs.readFileSync(flat, 'utf8') !== html) {
    errors.push(`/${article.slug} and /${article.slug}/ do not serve the same redirect`);
  }
  if (!html.includes('content="noindex"')) {
    errors.push(`/${article.slug}/ is missing a noindex robots meta tag`);
  }
  if (!html.includes(`rel="canonical" href="${canonical}"`)) {
    errors.push(`/${article.slug}/ is missing a canonical link to ${canonical}`);
  }
  if (!html.includes(`http-equiv="refresh" content="0;url=${target}"`)) {
    errors.push(`/${article.slug}/ is missing a meta refresh to ${target}`);
  }
  if (!html.includes(`location.replace(${JSON.stringify(target)})`)) {
    errors.push(`/${article.slug}/ is missing a location.replace fallback to ${target}`);
  }
  const shortLoc = new RegExp(`<loc>\\s*${site}/${article.slug}/?\\s*</loc>`);
  if (shortLoc.test(sitemapText)) {
    errors.push(`Sitemap lists the short URL /${article.slug}/. Redirect stubs must stay out of the sitemap.`);
  }
  const shortLlms = new RegExp(`https://satsplain\\.com/${article.slug}/?(?![\\w-])`);
  if (shortLlms.test(llmsText)) {
    errors.push(`llms.txt or llms-full.txt links to the short URL /${article.slug}/. Use /articles/${article.slug}/ instead.`);
  }
}

if (errors.length) {
  console.error(`Short URL check failed (${errors.length}):`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Short URL check passed (${ok.length} redirects, absent from the sitemap and llms.txt).`);
