import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { site } from '../data/site';

export const GET: APIRoute = async (context) => {
  const articles = (await getCollection('articles'))
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    trailingSlash: true,
    customData: '<language>en-us</language>',
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.publishDate,
      description: article.data.description,
      link: `/articles/${article.data.slug}/`,
      categories: [article.data.pillar, ...article.data.tags],
    })),
  });
};
