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

export function webPage(page: { name: string; description: string; path: string }) {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(page.path)}#webpage`,
    url: absoluteUrl(page.path),
    name: page.name,
    description: page.description,
    isPartOf: { '@id': siteId },
    publisher: { '@id': orgId },
    inLanguage: site.locale,
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
  imageAlt?: string;
  tags: string[];
  reviewedBy?: string;
  sources?: { title: string; url: string; publisher: string; accessed: string }[];
}) {
  return {
    '@type': 'BlogPosting',
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
    image: {
      '@type': 'ImageObject',
      url: absoluteUrl(article.image),
      ...(article.imageAlt ? { caption: article.imageAlt } : {}),
    },
    keywords: article.tags.join(', '),
    inLanguage: site.locale,
    isAccessibleForFree: true,
    ...(article.sources?.length
      ? {
          citation: article.sources.map((source) => ({
            '@type': 'CreativeWork',
            name: source.title,
            url: source.url,
            publisher: { '@type': 'Organization', name: source.publisher },
            dateAccessed: source.accessed,
          })),
        }
      : {}),
  };
}

export function howToNode(howTo: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
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
  page?: { name: string; description: string; path: string };
  article?: Parameters<typeof articleNode>[0];
  faq?: { question: string; answer: string }[];
  howTo?: Parameters<typeof howToNode>[0];
  definedTerms?: { id: string; term: string; definition: string }[];
}) {
  const graph: Record<string, unknown>[] = [organization(), website()];
  if (options.crumbs?.length) graph.push(breadcrumbList(options.crumbs));
  if (options.page) graph.push(webPage(options.page));
  if (options.article) graph.push(articleNode(options.article));
  if (options.faq?.length) graph.push(faqNode(options.faq));
  if (options.howTo) graph.push(howToNode(options.howTo));
  if (options.definedTerms?.length) {
    graph.push({
      '@type': 'DefinedTermSet',
      name: 'Satsplain glossary',
      url: absoluteUrl('/glossary/'),
      hasDefinedTerm: options.definedTerms.map((term) => ({
        '@type': 'DefinedTerm',
        name: term.term,
        description: term.definition,
        url: absoluteUrl(`/glossary/#${term.id}`),
      })),
    });
  }
  return graph;
}

export function serializeJsonLd(graph: Record<string, unknown>[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(
    /</g,
    '\\u003c',
  );
}
