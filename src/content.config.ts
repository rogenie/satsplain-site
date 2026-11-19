import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(160),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    pillar: z.enum([
      'crypto-basics',
      'buying-and-apps',
      'wallets-and-security',
      'scams-and-safety',
      'taxes-and-rules',
      'trending-explained',
    ]),
    tags: z.array(z.string().min(1)).min(1),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    author: z.string().min(1).default('Satsplain Research Desk'),
    reviewedBy: z.string().min(1).optional(),
    sources: z
      .array(
        z.object({
          title: z.string().min(1),
          url: z.url(),
          publisher: z.string().min(1),
          accessed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        }),
      )
      .min(3),
    draft: z.boolean().default(false),
    faq: z
      .array(
        z.object({
          question: z.string().min(1),
          answer: z.string().min(1),
        }),
      )
      .optional(),
    readingLevel: z.enum(['beginner', 'intermediate']),
    keyTakeaways: z.array(z.string().min(1)).min(1),
  }),
});

export const collections = { articles };
