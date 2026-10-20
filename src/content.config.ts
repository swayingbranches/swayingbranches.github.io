import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TOPICS } from './site.config';

const topicNames = TOPICS.map((t) => t.name) as [string, ...string[]];

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    /** The post's address, kept exactly as it was on Blogger and Jekyll. */
    permalink: z.string().regex(/^\/\d{4}\/\d{2}\/[a-z0-9_-]+\.html$/),
    blogger_url: z.url(),
    topic: z.enum(topicNames),
    tags: z.array(z.string().min(1)).max(4).default([]),
    featured: z.boolean().default(false),
    /** One line, shown in lists. */
    summary: z.string().min(10).max(200),
    /** Two or three sentences, shown at the top of the post. */
    summary_long: z.string().min(20).max(700),
    /** True when the summaries were written by AI rather than by the family. */
    summary_ai: z.boolean(),
    /** Set to true once a family member has read and approved the summaries. */
    summary_reviewed: z.boolean().default(false),
  }),
});

export const collections = { posts };
