import type { APIRoute } from 'astro';
import { indexable } from '../lib/content';
import { brand } from '../config/brand';
export const GET: APIRoute = () => new Response(indexable ? `User-agent: *\nAllow: /\nSitemap: ${brand.url}/sitemap-index.xml\n` : 'User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
