import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

const root = path.resolve('dist');
const problems = [];
const pages = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (file.endsWith('.html')) pages.push(file);
  }
}
walk(root);
const status = JSON.parse(readFileSync(path.join(root, 'build-status.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(path.join(root, 'content-manifest.json'), 'utf8'));
const titles = new Set();
const documents = new Map(pages.map((file) => [file, load(readFileSync(file, 'utf8'))]));
const origin = 'https://truthtoliveby.fyi';
function targetFile(url) {
  const name = decodeURIComponent(url.pathname).replace(/^\//, '');
  let file = path.resolve(root, name);
  if (!file.startsWith(root + path.sep) && file !== root) return '';
  if (url.pathname.endsWith('/') || (existsSync(file) && statSync(file).isDirectory()))
    file = path.join(file, 'index.html');
  if (!existsSync(file) && !path.extname(file) && existsSync(path.join(file, 'index.html')))
    file = path.join(file, 'index.html');
  return file;
}
function inspectUrl(value, from, label, checkFragment = false) {
  if (!value || /^(mailto:|tel:|data:)/i.test(value)) return;
  let url;
  try {
    url = new URL(value, from);
  } catch {
    problems.push(`${label}: invalid URL ${value}`);
    return;
  }
  if (!['https:', 'http:'].includes(url.protocol)) {
    problems.push(`${label}: unsafe URL ${value}`);
    return;
  }
  if (url.origin !== origin) return;
  const target = targetFile(url);
  if (!target || !existsSync(target)) {
    problems.push(`${label}: missing local target ${url.pathname}`);
    return;
  }
  if (checkFragment && url.hash && documents.has(target)) {
    const id = decodeURIComponent(url.hash.slice(1));
    if (
      !documents
        .get(target)('[id]')
        .toArray()
        .some((node) => documents.get(target)(node).attr('id') === id)
    )
      problems.push(`${label}: missing anchor ${value}`);
  }
}
for (const [file, $] of documents) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const route = relative === 'index.html' ? '/' : relative.replace(/index\.html$/, '');
  const from = new URL(route, origin).href;
  const title = $('title').text();
  if (!title || titles.has(title)) problems.push(`${relative}: missing or duplicate title`);
  titles.add(title);
  if ($('h1').length !== 1) problems.push(`${relative}: expected exactly one h1`);
  if (!$('meta[name="description"]').attr('content'))
    problems.push(`${relative}: missing description`);
  if (
    !$('link[rel="canonical"]')
      .attr('href')
      ?.startsWith(origin + '/')
  )
    problems.push(`${relative}: invalid canonical`);
  if (!status.indexable && !$('meta[name="robots"]').attr('content')?.includes('noindex'))
    problems.push(`${relative}: preview is indexable`);
  for (const key of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt'])
    if (!$(`meta[property="${key}"]`).attr('content')) problems.push(`${relative}: missing ${key}`);
  $('img').each((_, image) => {
    if ($(image).attr('alt') === undefined || !$(image).attr('width') || !$(image).attr('height'))
      problems.push(`${relative}: image missing alt or dimensions`);
  });
  $(
    'a[href],link[href],script[src],img[src],iframe[src],meta[property="og:image"],meta[name="twitter:image"]',
  ).each((_, element) => {
    const el = $(element);
    inspectUrl(el.attr('href') ?? el.attr('src') ?? el.attr('content'), from, relative, el.is('a'));
  });
  $('img[srcset],source[srcset]').each((_, element) => {
    for (const item of $(element).attr('srcset').split(','))
      inspectUrl(item.trim().split(/\s+/)[0], from, relative);
  });
  $('script:not([src])').each((_, script) => {
    if ($(script).attr('type') === 'application/ld+json') {
      try {
        JSON.parse($(script).text());
      } catch {
        problems.push(`${relative}: invalid structured data`);
      }
    } else if ($(script).text().trim())
      problems.push(`${relative}: inline executable script conflicts with CSP`);
  });
}
for (const route of [
  'index.html',
  'ideas/index.html',
  'watch/index.html',
  'about/index.html',
  'join/index.html',
  'contact/index.html',
  'privacy/index.html',
  'terms/index.html',
  '404.html',
  'robots.txt',
  'sitemap-index.xml',
  'sitemap-0.xml',
  '_headers',
])
  if (!existsSync(path.join(root, route))) problems.push(`Missing required output: ${route}`);
const sitemap = readFileSync(path.join(root, 'sitemap-0.xml'), 'utf8');
const sitemapXml = load(sitemap, { xml: true });
sitemapXml('loc').each((_, node) => inspectUrl(sitemapXml(node).text(), origin, 'sitemap'));
for (const article of manifest.articles)
  if (!sitemap.includes(`${origin}${article.url}`))
    problems.push(`Article absent from sitemap: ${article.url}`);
if (
  !status.preview &&
  manifest.articles.some(
    (a) => a.draft || a.placeholder || new Date(a.publication_date) > new Date(),
  )
)
  problems.push('Draft or future content leaked into public manifest');
if (!status.preview) {
  for (const name of readdirSync('src/content/articles')) {
    const source = readFileSync(path.join('src/content/articles', name), 'utf8');
    if (/^(draft|placeholder): true$/m.test(source)) {
      const slug = source.match(/^slug: (.+)$/m)?.[1];
      if (
        slug &&
        (existsSync(path.join(root, 'ideas', slug, 'index.html')) ||
          sitemap.includes(`/ideas/${slug}/`))
      )
        problems.push(`Draft article was emitted: ${slug}`);
    }
  }
}
const robots = readFileSync(path.join(root, 'robots.txt'), 'utf8');
if (status.indexable ? !robots.includes('Sitemap:') : !robots.includes('Disallow: /'))
  problems.push('robots.txt does not match build state');
if (!readFileSync(path.join(root, '_headers'), 'utf8').includes("object-src 'none'"))
  problems.push('Security headers missing');
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(
  `PASS: ${pages.length} pages; internal links/assets/anchors, metadata, image dimensions, JSON-LD, sitemap, robots, CSP and draft isolation.`,
);
