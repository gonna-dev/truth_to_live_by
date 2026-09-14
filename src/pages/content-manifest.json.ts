import type { APIRoute } from 'astro';
import { library, previewMode, indexable, articleUrl } from '../lib/content';
export const GET: APIRoute = async () => {
  const { articles, videos } = await library();
  return new Response(JSON.stringify({ preview: previewMode, indexable, articles: articles.map((a) => ({ url: articleUrl(a.data.slug), draft: a.data.draft, placeholder: a.data.placeholder, publication_date: a.data.publication_date })), videos: videos.map((v) => ({ url: v.data.youtube_url, verified: v.data.verified, draft: v.data.draft, placeholder: v.data.placeholder })) }), { headers: { 'Content-Type': 'application/json' } });
};
