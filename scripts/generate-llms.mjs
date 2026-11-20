import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const site = 'https://satsplain.com';
const dir = path.join(root, 'src/content/articles');
const articles = fs
  .readdirSync(dir)
  .filter((name) => /\.mdx?$/.test(name))
  .map((name) => matter(fs.readFileSync(path.join(dir, name), 'utf8')).data)
  .filter((data) => !data.draft)
  .sort((a, b) => String(a.publishDate).localeCompare(String(b.publishDate)));

const pages = [
  ['Start here', '/start-here/', 'The beginner path, in order.'],
  ['Glossary', '/glossary/', 'Short definitions with the source for each word.'],
  ['Editorial policy', '/editorial-policy/', 'What a guide is allowed to say.'],
  ['Sourcing', '/sourcing/', 'Which documents we trust first.'],
  ['Corrections', '/corrections/', 'How to challenge a sentence, and the public log.'],
  ['Disclaimer', '/disclaimer/', 'Education, not financial advice.'],
  [
    'Safety Kit',
    '/safety-kit/',
    'A blank steel seed-phrase plate, a punch, a pouch, and a setup card. Not for sale yet. Satsplain will sell it and says so on the page. A paper backup is enough.',
  ],
];

const llms = [
  '# Satsplain',
  '',
  '> Plain-English crypto guides for beginners. Every factual claim links to a regulator, an official document, or another primary source. This is education, not financial advice, and the site does not predict prices.',
  '',
  'Satsplain is an independent research desk. Articles are researched and drafted with automated tools, fact-checked in a second pass against primary sources, and must pass an automated quality gate before publishing. Corrections are welcome at https://satsplain.com/contact/.',
  '',
  '## Guides',
  '',
  ...articles.map(
    (article) =>
      `- [${article.title}](${site}/articles/${article.slug}/): ${article.description}`,
  ),
  '',
  '## Site',
  '',
  ...pages.map(([title, href, text]) => `- [${title}](${site}${href}): ${text}`),
  '',
  '## Optional',
  '',
  `- [Full text summaries](${site}/llms-full.txt): key takeaways and sources for each guide.`,
  '',
];

const full = [
  '# Satsplain, full guide summaries',
  '',
  '> Use these summaries with the linked pages. The pages, not this file, are the source of truth. Updated dates are on each page. Articles are researched and drafted with automated tools, fact-checked in a second pass against primary sources, and must pass an automated quality gate before publishing. Corrections are welcome at https://satsplain.com/contact/.',
  '',
  ...articles.flatMap((article) => {
    const takeaways = Array.isArray(article.keyTakeaways)
      ? article.keyTakeaways.map((item) => `- ${item}`).join('\n')
      : '';
    const sources = Array.isArray(article.sources)
      ? article.sources.map((source) => `- ${source.title} (${source.publisher}): ${source.url}`).join('\n')
      : '';
    return [
      `## ${article.title}`,
      '',
      `${site}/articles/${article.slug}/`,
      '',
      article.description,
      '',
      'Key takeaways:',
      '',
      takeaways,
      '',
      'Sources:',
      '',
      sources,
      '',
    ];
  }),
];

fs.writeFileSync(path.join(root, 'public/llms.txt'), `${llms.join('\n')}\n`);
fs.writeFileSync(path.join(root, 'public/llms-full.txt'), `${full.join('\n')}\n`);
console.log(`Wrote llms.txt and llms-full.txt for ${articles.length} guides.`);
