import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const site = 'https://satsplain.com';

export function publishedArticles(root = process.cwd()) {
  const dir = path.join(root, 'src/content/articles');
  const articles = [];
  if (!fs.existsSync(dir)) return articles;
  for (const name of fs.readdirSync(dir)) {
    if (!/\.mdx?$/.test(name)) continue;
    const parsed = matter(fs.readFileSync(path.join(dir, name), 'utf8'));
    if (parsed.data.draft) continue;
    if (typeof parsed.data.slug !== 'string' || !parsed.data.slug) continue;
    articles.push({ slug: parsed.data.slug, file: name });
  }
  return articles.sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Top-level names that already own a URL, so a short article path must not reuse them. */
export function reservedSlugs(root = process.cwd()) {
  const reserved = new Set(['index', '404']);
  const pages = path.join(root, 'src/pages');
  for (const entry of fs.readdirSync(pages, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) {
      reserved.add(entry.name);
      continue;
    }
    reserved.add(entry.name.replace(/\.(astro|ts|js|mjs|md|mdx)$/i, ''));
  }
  const pub = path.join(root, 'public');
  if (fs.existsSync(pub)) {
    for (const entry of fs.readdirSync(pub, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      reserved.add(entry.name);
      if (entry.isDirectory()) continue;
      reserved.add(entry.name.replace(/\.[^.]+$/, ''));
    }
  }
  return reserved;
}

export function planRedirects(root = process.cwd()) {
  const reserved = reservedSlugs(root);
  const ok = [];
  const collisions = [];
  for (const article of publishedArticles(root)) {
    if (reserved.has(article.slug)) {
      collisions.push(article);
    } else {
      ok.push(article);
    }
  }
  return { ok, collisions, reserved };
}

export function redirectHtml(slug) {
  const target = `/articles/${slug}/`;
  const canonical = `${site}${target}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting to the guide</title>
  <meta name="robots" content="noindex">
  <link rel="canonical" href="${canonical}">
  <meta http-equiv="refresh" content="0;url=${target}">
  <script>location.replace(${JSON.stringify(target)});</script>
</head>
<body>
  <p><a href="${target}">Continue to the guide</a></p>
</body>
</html>
`;
}

export function collisionMessage(collisions) {
  return collisions
    .map(
      (article) =>
        `Article slug "${article.slug}" (${article.file}) collides with the existing top-level route /${article.slug}/. The short URL redirect was not created. Rename the slug so it does not match a page, a section, or a public file.`,
    )
    .join('\n');
}
