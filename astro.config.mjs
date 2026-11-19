import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import matter from 'gray-matter';

function articleLastmods() {
  const dir = path.join(process.cwd(), 'src/content/articles');
  const map = new Map();
  if (!fs.existsSync(dir)) return map;
  for (const file of fs.readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const parsed = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (parsed.data.draft) continue;
    const updated = parsed.data.updatedDate;
    const iso =
      updated instanceof Date ? updated.toISOString().slice(0, 10) : String(updated).slice(0, 10);
    map.set(parsed.data.slug, iso);
  }
  return map;
}

const lastmods = articleLastmods();

export default defineConfig({
  site: 'https://satsplain.com',
  trailingSlash: 'always',
  output: 'static',
  compressHTML: true,
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const match = item.url.match(/\/articles\/([^/]+)\/?$/);
        if (match && lastmods.has(match[1])) {
          item.lastmod = lastmods.get(match[1]);
        }
        return item;
      },
    }),
  ],
});
