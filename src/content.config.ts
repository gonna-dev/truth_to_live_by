import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const httpsUrl = z.url().refine((s) => s.startsWith('https://'), 'Use HTTPS URLs');
const source = z.object({
  title: z.string().min(1), url: httpsUrl,
  classification: z.enum(['established evidence', 'emerging evidence', 'interpretation', 'opinion', 'hypothesis']),
  author: z.string().optional(), publisher: z.string().optional(), locator: z.string().optional(), note: z.string().optional(),
  publication_date: z.coerce.date().optional(),
});
const editorialDates = (data: { publication_date: Date; updated_date?: Date }) => !data.updated_date || data.updated_date >= data.publication_date;

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) => z.object({
    title: z.string().min(1), slug, subtitle: z.string().optional(), description: z.string().min(20),
    author: z.string().default('Truth to Live By'), publication_date: z.coerce.date(), updated_date: z.coerce.date().optional(),
    pillar: reference('pillars'), tags: z.array(z.string()).min(1),
    hero_image: image(), hero_alt: z.string().min(1),
    featured: z.boolean().default(false), draft: z.boolean().default(true), placeholder: z.boolean().default(true),
    seo_title: z.string().optional(), seo_description: z.string().optional(), seo_image: image().optional(),
    sources: z.array(source).default([]), takeaway: z.string().optional(), evidence_note: z.string().optional(),
    correction_note: z.string().optional(), related_articles: z.array(reference('articles')).default([]), related_video: reference('videos').optional(),
  }).refine(editorialDates, 'Updated date cannot precede publication date'),
});
const videos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/videos' }),
  schema: ({ image }) => z.object({
    title: z.string().min(1), slug, description: z.string().min(20), publication_date: z.coerce.date(),
    pillar: reference('pillars'), format: z.enum(['video', 'short']),
    youtube_url: httpsUrl.refine((value) => /^https:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=[A-Za-z0-9_-]{11}(?:&[^\s]*)?|shorts\/[A-Za-z0-9_-]{11})$/.test(value) || /^https:\/\/youtu\.be\/[A-Za-z0-9_-]{11}$/.test(value), 'Use a specific YouTube video or Short URL'),
    thumbnail: image(), thumbnail_alt: z.string().min(1), duration: z.string().regex(/^PT(?:\d+H)?(?:\d+M)?(?:\d+S)?$/).optional(),
    related_article: reference('articles').optional(), verified: z.boolean().default(false),
    draft: z.boolean().default(true), placeholder: z.boolean().default(true),
  }).refine((v) => v.draft || v.placeholder || v.verified, 'Published video URLs must be verified'),
});
const pillars = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/pillars' }),
  schema: z.object({ title: z.string(), description: z.string(), display_order: z.number().int(), label: z.string() }),
});
export const collections = { articles, videos, pillars };
