import { absoluteUrl, isoDate } from './format';
import { site } from '../data/site';

export type Crumb = { label: string; href: string };

const orgId = `${site.url}/#organization`;
const siteId = `${site.url}/#website`;

export function organization() {
  return {
    '@type': 'Organization',
    '@id': orgId,
    name: site.name,
    url: site.url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.png'),
    },
    email: site.email,
    description: site.description,
  };
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': siteId,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: site.locale,
    publisher: { '@id': orgId },
  };
}

export function breadcrumbList(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  };
}

export function articleNode(article: {
  title: string;
  description: string;
  path: string;
  published: Date;
  updated: Date;
  author: string;
  image: string;
  tags: string[];
  reviewedBy?: string;
}) {
  return {
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: isoDate(article.published),
    dateModified: isoDate(article.updated),
    author: {
      '@type': 'Organization',
      name: article.author,
      url: absoluteUrl('/about/'),
    },
    ...(article.reviewedBy
      ? { reviewedBy: { '@type': 'Person', name: article.reviewedBy } }
      : {}),
    publisher: { '@id': orgId },
    mainEntityOfPage: absoluteUrl(article.path),
    image: [absoluteUrl(article.image)],
    keywords: article.tags.join(', '),
    inLanguage: site.locale,
  };
}

export function faqNode(faq: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildGraph(options: {
  crumbs?: Crumb[];
  article?: Parameters<typeof articleNode>[0];
  faq?: { question: string; answer: string }[];
}) {
  const graph: Record<string, unknown>[] = [organization(), website()];
  if (options.crumbs?.length) graph.push(breadcrumbList(options.crumbs));
  if (options.article) graph.push(articleNode(options.article));
  if (options.faq?.length) graph.push(faqNode(options.faq));
  return graph;
}

export function serializeJsonLd(graph: Record<string, unknown>[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(
    /</g,
    '\\u003c',
  );
}
