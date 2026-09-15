import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { load } from 'cheerio';
if (existsSync('artifacts-youtube.html')) {
  const html = readFileSync('artifacts-youtube.html', 'utf8');
  const $ = load(html);
  console.log('YouTube page title:', $('title').text());
  const match = html.match(/var ytInitialData = (.*?);<\/script>/s);
  if (match) {
    const data = JSON.parse(match[1]);
    const videos = [];
    const walk = (node) => {
      if (!node || typeof node !== 'object') return;
      if (node.videoRenderer) {
        const v = node.videoRenderer;
        videos.push({
          id: v.videoId,
          title: v.title?.runs?.map((r) => r.text).join(''),
          description: v.descriptionSnippet?.runs?.map((r) => r.text).join(''),
          published: v.publishedTimeText?.simpleText,
          duration: v.lengthText?.simpleText,
          thumbnails: v.thumbnail?.thumbnails,
        });
      }
      if (node.shortsLockupViewModel) videos.push({ short: node.shortsLockupViewModel });
      for (const value of Object.values(node)) walk(value);
    };
    walk(data);
    mkdirSync('artifacts', { recursive: true });
    writeFileSync(
      'artifacts/youtube-public-data.json',
      JSON.stringify({ metadata: data.metadata, videos }, null, 2),
    );
    console.log(JSON.stringify({ metadata: data.metadata, videos }, null, 2));
  } else console.log('No public channel data found.');
}
if (existsSync('artifacts-beehiiv.html')) {
  const $ = load(readFileSync('artifacts-beehiiv.html', 'utf8'));
  console.log(
    'beehiiv page:',
    JSON.stringify(
      {
        title: $('title').text(),
        description: $('meta[name=description]').attr('content'),
        canonical: $('link[rel=canonical]').attr('href'),
        headings: $('h1,h2')
          .map((_, el) => $(el).text())
          .get(),
        formActions: $('form')
          .map((_, el) => $(el).attr('action'))
          .get(),
        signupLinks: $('a[href]')
          .map((_, el) => $(el).attr('href'))
          .get()
          .filter((url) => /subscribe|signup/.test(url)),
      },
      null,
      2,
    ),
  );
}
