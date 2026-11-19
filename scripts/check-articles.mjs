import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';

const root = process.cwd();
const articlesDir = path.join(root, 'src/content/articles');
const pagesDir = path.join(root, 'src/pages');
const pillarsFile = path.join(root, 'src/data/pillars.ts');
const glossaryFile = path.join(root, 'src/data/glossary.ts');
const checkDist = process.argv.includes('--dist');

const pillars = [...fs.readFileSync(pillarsFile, 'utf8').matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1]);
const glossaryIds = [...fs.readFileSync(glossaryFile, 'utf8').matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1]);

const banned = [
  ['guaranteed', /\bguaranteed\b/i],
  ['to the moon', /to the moon/i],
  ['get rich', /get rich/i],
  ['100x', /\b100x\b/i],
  ['risk-free', /risk-free/i],
  ['risk free', /risk free/i],
  ['act now', /\bact now\b/i],
  ['limited time', /limited time/i],
  ['last chance', /last chance/i],
  ["don't miss out", /don'?t miss out/i],
  ["before it's too late", /before it'?s too late/i],
];

const requiredKeys = [
  'title',
  'description',
  'slug',
  'pillar',
  'tags',
  'publishDate',
  'updatedDate',
  'sources',
  'readingLevel',
  'keyTakeaways',
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function isRealDate(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function rawFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : '';
}

function rawDate(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})["']?\\s*$`, 'm'));
  return match ? match[1] : null;
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) url.pathname = url.pathname.slice(0, -1);
    return url.toString();
  } catch {
    return value;
  }
}

function hasInlineLink(text) {
  return /\[[^\]]+\]\([^)\s]+\)/.test(text) || /<a\s[^>]*href=/.test(text);
}

function sectionsOf(body) {
  const parts = body.split(/^## /m);
  const sections = [{ heading: '(introduction)', content: parts[0] ?? '' }];
  for (const part of parts.slice(1)) {
    const [headingLine, ...rest] = part.split('\n');
    sections.push({ heading: headingLine.trim(), content: rest.join('\n') });
  }
  return sections;
}

function scanText(label, text, errors) {
  if (typeof text !== 'string') return;
  for (const [name, pattern] of banned) {
    if (pattern.test(text)) errors.push(`${label} contains banned phrase "${name}"`);
  }
  if (/lorem ipsum|REPLACE_ME|\bTODO\b/i.test(text)) {
    errors.push(`${label} still contains a placeholder`);
  }
}

function extractHttpUrls(body) {
  const urls = new Set();
  for (const match of body.matchAll(/\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g)) urls.add(match[1]);
  for (const match of body.matchAll(/href\s*=\s*["'](https?:\/\/[^"']+)["']/g)) urls.add(match[1]);
  for (const match of body.matchAll(/<(https?:\/\/[^>\s]+)>/g)) urls.add(match[1]);
  return [...urls];
}

function extractInternal(body) {
  const urls = [];
  for (const match of body.matchAll(/\[[^\]]*\]\((\/[^)\s]+)\)/g)) urls.push(match[1]);
  for (const match of body.matchAll(/(?:href|src)\s*=\s*["'](\/[^"']+)["']/g)) urls.push(match[1]);
  return urls;
}

function answerText(content) {
  const cleaned = content.replace(/import\s+.+from\s+['"].+['"];?/g, '');
  const lines = [];
  for (const line of cleaned.split('\n')) {
    if (!line.trim()) {
      if (lines.length) break;
      continue;
    }
    lines.push(line.trim());
  }
  return lines.join(' ');
}

function figureAlts(body) {
  const alts = [];
  for (const match of body.matchAll(/\balt=["']([^"']+)["']/g)) alts.push(match[1]);
  for (const match of body.matchAll(/!\[([^\]]*)\]\([^)]+\)/g)) alts.push(match[1]);
  return alts;
}

const genericAlt = /^(image|photo|picture|illustration|diagram|graphic|hero)$/i;

function validateArticle(fileName, raw, options = {}) {
  const errors = [];
  let parsed;
  try {
    parsed = matter(raw);
  } catch (error) {
    return [`could not parse frontmatter (${error.message})`];
  }
  const data = parsed.data ?? {};
  const body = parsed.content ?? '';
  const frontmatter = rawFrontmatter(raw);

  for (const key of requiredKeys) {
    if (data[key] === undefined || data[key] === null || data[key] === '') {
      errors.push(`missing ${key}`);
    }
  }

  if (typeof data.title === 'string') scanText('title', data.title, errors);
  if (typeof data.description === 'string') {
    scanText('description', data.description, errors);
    const length = [...data.description].length;
    if (length > 160) errors.push(`description is ${length} characters (max 160)`);
    if (length === 0) errors.push('description is empty');
  } else if (data.description != null) {
    errors.push('description must be a string');
  }

  const slugFromFile = fileName.replace(/\.mdx?$/, '');
  if (typeof data.slug === 'string') {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) errors.push(`slug "${data.slug}" is not lowercase kebab-case`);
    if (data.slug !== slugFromFile) errors.push(`slug "${data.slug}" does not match filename "${slugFromFile}"`);
  }

  if (data.pillar != null && !pillars.includes(data.pillar)) {
    errors.push(`pillar "${data.pillar}" is not one of: ${pillars.join(', ')}`);
  }

  if (data.tags != null && (!Array.isArray(data.tags) || data.tags.length === 0 || data.tags.some((tag) => typeof tag !== 'string' || !tag.trim()))) {
    errors.push('tags must be a non-empty list of strings');
  }

  if (!['beginner', 'intermediate'].includes(data.readingLevel)) {
    errors.push('readingLevel must be beginner or intermediate');
  }

  if (data.keyTakeaways != null && (!Array.isArray(data.keyTakeaways) || data.keyTakeaways.length === 0)) {
    errors.push('keyTakeaways must be a non-empty list');
  }

  const publish = rawDate(frontmatter, 'publishDate');
  const updated = rawDate(frontmatter, 'updatedDate');
  if (!publish || !isRealDate(publish)) errors.push('publishDate must be a real YYYY-MM-DD date');
  if (!updated || !isRealDate(updated)) errors.push('updatedDate is missing or invalid');
  if (publish && updated && updated < publish) errors.push('updatedDate is earlier than publishDate');
  if (updated && updated > todayIso()) errors.push('updatedDate is in the future');

  if (!Array.isArray(data.sources)) {
    errors.push('sources must be a list');
  } else {
    if (data.sources.length < 3) errors.push(`only ${data.sources.length} source(s); need at least 3`);
    data.sources.forEach((source, index) => {
      const label = `source ${index + 1}`;
      if (!source || typeof source !== 'object') {
        errors.push(`${label} is not an object`);
        return;
      }
      for (const field of ['title', 'url', 'publisher', 'accessed']) {
        if (typeof source[field] !== 'string' || !source[field].trim()) errors.push(`${label} is missing ${field}`);
      }
      if (typeof source.url === 'string') {
        let parsedUrl;
        try {
          parsedUrl = new URL(source.url);
        } catch {
          errors.push(`${label} URL is invalid`);
        }
        if (parsedUrl && parsedUrl.protocol !== 'https:') errors.push(`${label} URL must be https`);
        if (parsedUrl && ['example.com', 'example.org'].includes(parsedUrl.hostname)) {
          errors.push(`${label} still uses a placeholder host`);
        }
        if (typeof source.url === 'string' && !body.includes(source.url) && !body.includes(source.url.replace(/\/$/, ''))) {
          errors.push(`${label} URL is not linked in the article body`);
        }
      }
      if (typeof source.accessed === 'string' && !isRealDate(source.accessed)) {
        errors.push(`${label} accessed date is invalid`);
      }
    });
  }

  const sourceUrls = new Set(
    (Array.isArray(data.sources) ? data.sources : [])
      .map((source) => (typeof source?.url === 'string' ? normalizeUrl(source.url) : null))
      .filter(Boolean),
  );
  for (const url of extractHttpUrls(body)) {
    if (!sourceUrls.has(normalizeUrl(url))) {
      errors.push(`external link is not in the sources list: ${url}`);
    }
  }

  if (!/not financial advice/i.test(body)) {
    errors.push('missing the disclaimer phrase "not financial advice"');
  }

  for (const section of sectionsOf(body)) {
    const meaningful = section.content.replace(/import\s+.+from\s+['"].+['"];?/g, '').trim();
    if (!meaningful && section.heading === '(introduction)') continue;
    if (!meaningful) {
      errors.push(`section "${section.heading}" is empty`);
      continue;
    }
    if (!hasInlineLink(section.content)) {
      errors.push(`section "${section.heading}" has no inline link`);
    }
    const isDisclaimer = /^a note on advice\b/i.test(section.heading);
    if (section.heading !== '(introduction)' && !isDisclaimer) {
      if (!section.heading.trim().endsWith('?')) {
        errors.push(`heading "${section.heading}" must be a question ending in ?`);
      }
      const answer = answerText(section.content);
      if (/^<(Figure|img)\b/i.test(answer)) {
        errors.push(`section "${section.heading}" starts with a diagram; answer the question in a sentence first`);
      } else if ([...answer].length < 40) {
        errors.push(`section "${section.heading}" must answer the question in the opening sentence`);
      }
    }
  }

  const alts = figureAlts(body).filter((alt) => [...alt].length >= 24 && !genericAlt.test(alt.trim()));
  if (alts.length < 2) {
    errors.push(`need at least 2 explanatory diagrams with descriptive alt text (found ${alts.length})`);
  }

  if (typeof data.featuredImage !== 'string' || !/^\/images\/.+\.(svg|webp|avif|png)$/.test(data.featuredImage)) {
    errors.push('featuredImage must be a path like /images/articles/slug.svg');
  } else if (options.checkAssets) {
    const asset = path.join(root, 'public', data.featuredImage.replace(/^\//, ''));
    if (!fs.existsSync(asset)) errors.push(`featured image file is missing: ${data.featuredImage}`);
  }
  if (typeof data.featuredImageAlt !== 'string' || [...data.featuredImageAlt].length < 40 || genericAlt.test(data.featuredImageAlt.trim())) {
    errors.push('featuredImageAlt must be a descriptive sentence of at least 40 characters');
  }
  for (const field of ['featuredImageWidth', 'featuredImageHeight']) {
    if (typeof data[field] !== 'number' || data[field] <= 0) errors.push(`${field} must be a positive number`);
  }

  const prose = [
    body,
    ...(Array.isArray(data.keyTakeaways) ? data.keyTakeaways : []),
    ...(Array.isArray(data.faq) ? data.faq.flatMap((item) => [item?.question, item?.answer]) : []),
    ...(Array.isArray(data.tags) ? data.tags : []),
  ].join('\n');
  scanText('article text', prose, errors);

  if (Array.isArray(data.faq)) {
    data.faq.forEach((item, index) => {
      if (!item?.question || !item?.answer) errors.push(`FAQ ${index + 1} needs a question and answer`);
    });
  }

  return errors;
}

function selfTest() {
  const failures = [];
  const base = `---
title: "A fine title"
description: "Short description."
slug: fine-title
pillar: crypto-basics
tags:
  - bitcoin
publishDate: 2026-11-01
updatedDate: 2026-11-19
readingLevel: beginner
featuredImage: "/images/articles/what-is-bitcoin.svg"
featuredImageAlt: "A descriptive featured image alt text that explains the picture for someone who cannot see it."
featuredImageWidth: 800
featuredImageHeight: 450
keyTakeaways:
  - "One idea."
sources:
  - title: "Bitcoin FAQ"
    url: "https://bitcoin.org/en/faq"
    publisher: "Bitcoin.org"
    accessed: "2026-11-19"
  - title: "How it works"
    url: "https://bitcoin.org/en/how-it-works"
    publisher: "Bitcoin.org"
    accessed: "2026-11-19"
  - title: "Investor.gov"
    url: "https://www.investor.gov/additional-resources/spotlight/crypto-assets"
    publisher: "SEC"
    accessed: "2026-11-19"
---

See the [FAQ](https://bitcoin.org/en/faq).

## What does this section explain?

The [how it works page](https://bitcoin.org/en/how-it-works) explains the ledger. [Investor.gov](https://www.investor.gov/additional-resources/spotlight/crypto-assets) names the category.

<img alt="A ledger diagram showing one block pointing at the block before it so the chain can be checked." src="/diagrams/blockchain-links.svg" width="440" height="640" />
<img alt="A second diagram showing a private key beside the public record it can spend." src="/diagrams/transaction-flow.svg" width="440" height="760" />

## A note on advice

This page is general education, not financial advice. Read the [disclaimer](/disclaimer/).
`;
  const ok = validateArticle('fine-title.md', base);
  if (ok.length) failures.push(`valid fixture failed: ${ok.join('; ')}`);

  const tooLong = base.replace('Short description.', 'x'.repeat(161));
  if (!validateArticle('fine-title.md', tooLong).some((error) => error.includes('160'))) {
    failures.push('did not catch a long description');
  }
  const hype = base.replace('See the', 'See the guaranteed');
  if (!validateArticle('fine-title.md', hype).some((error) => error.includes('guaranteed'))) {
    failures.push('did not catch hype language');
  }
  const noLink = base.replace('## What does this section explain?\n\nThe [how it works page](https://bitcoin.org/en/how-it-works) explains the ledger. [Investor.gov](https://www.investor.gov/additional-resources/spotlight/crypto-assets) names the category.', '## What does this section explain?\n\nNo source in this section at all, just a long enough claim without any link here.');
  if (!validateArticle('fine-title.md', noLink).some((error) => error.includes('no inline link'))) {
    failures.push('did not catch a section without a link');
  }
  if (failures.length) {
    console.error('Self-test failed:');
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
  console.log('Self-test passed.');
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function pageRoute(file) {
  let rel = path.relative(pagesDir, file).split(path.sep).join('/');
  if (rel === 'rss.xml.ts') return '/rss.xml';
  if (!rel.endsWith('.astro')) return null;
  rel = rel.slice(0, -'.astro'.length);
  if (rel === '404') return null;
  if (rel.includes('[')) return null;
  if (rel.endsWith('/index')) rel = rel.slice(0, -'/index'.length);
  if (rel === 'index') rel = '';
  if (!rel) return '/';
  return `/${rel}/`;
}

function normalizeRoute(pathname) {
  if (!pathname.startsWith('/')) return null;
  if (pathname === '/') return '/';
  const hasExtension = /\.[a-z0-9]+$/i.test(pathname);
  if (hasExtension) return pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function idsInFile(file, seen = new Set()) {
  if (!file || seen.has(file) || !fs.existsSync(file)) return [];
  seen.add(file);
  const text = fs.readFileSync(file, 'utf8');
  const ids = [...text.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const match of text.matchAll(/from\s+['"](\.[^'"]+\.astro)['"]/g)) {
    ids.push(...idsInFile(path.resolve(path.dirname(file), match[1]), seen));
  }
  return ids;
}

function headingIds(body) {
  const slugger = new GithubSlugger();
  const ids = [];
  for (const match of body.matchAll(/^(#{1,6})\s+(.+)$/gm)) {
    ids.push(slugger.slug(match[2].trim()));
  }
  return ids;
}

function collectSite() {
  const routes = new Set(['/']);
  const anchors = new Map();
  const add = (route, ids) => {
    routes.add(route);
    const set = anchors.get(route) ?? new Set(['main']);
    for (const id of ids) set.add(id);
    anchors.set(route, set);
  };

  for (const file of walk(path.join(root, 'public'))) {
    const rel = path.relative(path.join(root, 'public'), file).split(path.sep).join('/');
    routes.add(`/${rel}`);
  }

  for (const file of walk(pagesDir)) {
    const route = pageRoute(file);
    if (route) add(route, idsInFile(file));
  }

  const articleLayout = path.join(root, 'src/layouts/Article.astro');
  const articleIds = idsInFile(articleLayout);
  for (const file of fs.readdirSync(articlesDir).filter((name) => /\.mdx?$/.test(name))) {
    const raw = fs.readFileSync(path.join(articlesDir, file), 'utf8');
    const parsed = matter(raw);
    if (parsed.data.draft) continue;
    const slug = parsed.data.slug;
    add(`/articles/${slug}/`, [...articleIds, ...headingIds(parsed.content)]);
  }

  const glossaryRoute = '/glossary/';
  const glossaryAnchors = anchors.get(glossaryRoute) ?? new Set(['main']);
  for (const id of glossaryIds) glossaryAnchors.add(id);
  for (const id of glossaryIds) {
    const letter = id[0]?.toLowerCase();
    if (letter) glossaryAnchors.add(`letter-${letter}`);
  }
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach((letter) => glossaryAnchors.add(`letter-${letter}`));
  anchors.set(glossaryRoute, glossaryAnchors);
  routes.add(glossaryRoute);

  return { routes, anchors };
}

function checkInternalLinks(articleBodies) {
  const { routes, anchors } = collectSite();
  const errors = [];
  const files = [
    ...walk(path.join(root, 'src')).filter((file) => /\.(astro|md|mdx)$/.test(file)),
  ];

  const consider = (from, raw) => {
    if (!raw || raw.startsWith('http') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('#')) return;
    const hashIndex = raw.indexOf('#');
    const pathPart = hashIndex === -1 ? raw : raw.slice(0, hashIndex);
    const hash = hashIndex === -1 ? '' : decodeURIComponent(raw.slice(hashIndex + 1));
    const route = normalizeRoute(pathPart.split('?')[0]);
    if (!route) return;
    if (!routes.has(route)) {
      errors.push(`${from} links to missing route ${raw}`);
      return;
    }
    if (hash) {
      const known = anchors.get(route);
      if (known && !known.has(hash)) errors.push(`${from} links to missing anchor ${raw}`);
    }
  };

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(root, file);
    for (const raw of extractInternal(text)) consider(rel, raw);
  }
  return errors;
}

function checkBuiltHtml() {
  const dist = path.join(root, 'dist');
  if (!fs.existsSync(dist)) {
    console.error('dist/ is missing. Run npm run build before --dist.');
    process.exit(1);
  }
  const htmlFiles = walk(dist).filter((file) => file.endsWith('.html') || file.endsWith('.svg'));
  const routes = new Map();
  for (const file of htmlFiles) {
    if (!file.endsWith('.html')) continue;
    let rel = path.relative(dist, file).split(path.sep).join('/');
    if (rel === '404.html') continue;
    let route;
    if (rel === 'index.html') route = '/';
    else if (rel.endsWith('/index.html')) route = `/${rel.slice(0, -'index.html'.length)}`;
    else route = `/${rel}`;
    routes.set(route, file);
  }
  for (const file of walk(dist)) {
    if (file.endsWith('.html')) continue;
    const rel = `/${path.relative(dist, file).split(path.sep).join('/')}`;
    routes.set(rel, file);
  }

  const errors = [];
  for (const [route, file] of routes) {
    if (!file.endsWith('.html')) continue;
    const html = fs.readFileSync(file, 'utf8');
    const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]));
    const refs = [
      ...html.matchAll(/(?:href|src)=["']([^"']+)["']/g),
    ].map((match) => match[1]);
    for (const ref of refs) {
      if (!ref || ref.startsWith('http') || ref.startsWith('mailto:') || ref.startsWith('tel:') || ref.startsWith('data:')) continue;
      const base = route.endsWith('/') ? `https://satsplain.com${route}` : `https://satsplain.com${route}/`;
      const url = new URL(ref, base);
      if (url.origin !== 'https://satsplain.com') continue;
      const target = normalizeRoute(url.pathname) ?? url.pathname;
      const targetFile = routes.get(target) || routes.get(url.pathname);
      if (!targetFile) {
        errors.push(`${route} -> missing ${ref}`);
        continue;
      }
      if (url.hash && targetFile.endsWith('.html')) {
        const targetHtml = fs.readFileSync(targetFile, 'utf8');
        const targetIds = new Set([...targetHtml.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]));
        const id = decodeURIComponent(url.hash.slice(1));
        if (id && !targetIds.has(id)) errors.push(`${route} -> missing anchor ${ref}`);
      }
    }
    void ids;
  }
  return errors;
}

function main() {
  selfTest();
  const files = fs.readdirSync(articlesDir).filter((name) => /\.mdx?$/.test(name));
  const seenTitles = new Map();
  const seenSlugs = new Map();
  const problems = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(articlesDir, file), 'utf8');
    const errors = validateArticle(file, raw, { checkAssets: true });
    const data = matter(raw).data;
    if (typeof data.title === 'string') {
      const key = data.title.trim().toLowerCase();
      if (seenTitles.has(key)) errors.push(`duplicate title also used by ${seenTitles.get(key)}`);
      else seenTitles.set(key, file);
    }
    if (typeof data.slug === 'string') {
      if (seenSlugs.has(data.slug)) errors.push(`duplicate slug also used by ${seenSlugs.get(data.slug)}`);
      else seenSlugs.set(data.slug, file);
    }
    if (errors.length) problems.push({ file, errors });
  }

  const linkErrors = checkInternalLinks();
  if (linkErrors.length) problems.push({ file: 'internal links', errors: linkErrors });

  if (checkDist) {
    const built = checkBuiltHtml();
    if (built.length) problems.push({ file: 'built HTML', errors: built });
  }

  if (problems.length) {
    console.error(`Article quality gate failed (${problems.reduce((sum, item) => sum + item.errors.length, 0)} problems):`);
    for (const problem of problems) {
      console.error(`\n${problem.file}`);
      for (const error of problem.errors) console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log(`Article quality gate passed (${files.length} articles, internal links ok${checkDist ? ', built HTML ok' : ''}).`);
}

main();
