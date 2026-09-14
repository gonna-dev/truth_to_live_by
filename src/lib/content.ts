import { getCollection } from 'astro:content';
import { visibleEntries, validateRelations } from './publication.mjs';

export const previewMode = import.meta.env.DEV || import.meta.env.CONTENT_PREVIEW === 'true';
export const indexable = !previewMode && import.meta.env.RELEASE_APPROVED === 'true';

export async function library() {
  const [allArticles, allVideos, pillars] = await Promise.all([
    getCollection('articles'), getCollection('videos'), getCollection('pillars'),
  ]);
  const errors = validateRelations(allArticles, allVideos, pillars);
  if (errors.length) throw new Error(errors.join('\n'));
  return {
    articles: visibleEntries(allArticles, previewMode) as typeof allArticles,
    videos: visibleEntries(allVideos, previewMode) as typeof allVideos,
    pillars: pillars.sort((a, b) => a.data.display_order - b.data.display_order),
  };
}

export const articleUrl = (slug: string) => `/ideas/${slug}/`;
export const dateLabel = (date: Date) => new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
export const readingTime = (body = '') => Math.max(1, Math.ceil(body.split(/\s+/).length / 200));
export const jsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
