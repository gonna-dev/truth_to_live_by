import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto('https://www.youtube.com/@TruthtoLiveBy/videos', {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });
  const reject = page.getByRole('button', { name: /Reject all/i });
  if (await reject.count()) {
    await reject.first().click();
    await page.waitForURL(/youtube\.com\//, { timeout: 30000 });
  }
  await page.waitForFunction(() => Boolean(window.ytInitialData), { timeout: 20000 });
  const data = await page.evaluate(() => window.ytInitialData);
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
    if (node.shortsLockupViewModel) {
      const s = node.shortsLockupViewModel;
      videos.push({
        id: s.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId,
        title: s.overlayMetadata?.primaryText?.content,
        format: 'short',
        thumbnails: s.thumbnailViewModel?.thumbnailViewModel?.image?.sources,
      });
    }
    for (const value of Object.values(node)) walk(value);
  };
  walk(data);
  await page.goto('https://www.youtube.com/@TruthtoLiveBy/shorts', {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });
  await page.waitForFunction(() => Boolean(window.ytInitialData), { timeout: 20000 });
  const shortsData = await page.evaluate(() => window.ytInitialData);
  walk(shortsData);
  const unique = [...new Map(videos.filter((v) => v.id).map((v) => [v.id, v])).values()];
  for (const video of unique.slice(0, 5)) {
    await page.goto(`https://www.youtube.com/watch?v=${video.id}`, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });
    await page.waitForFunction(() => Boolean(window.ytInitialPlayerResponse), { timeout: 20000 });
    const details = await page.evaluate(() => ({
      title: window.ytInitialPlayerResponse?.videoDetails?.title,
      description: window.ytInitialPlayerResponse?.videoDetails?.shortDescription,
      channelId: window.ytInitialPlayerResponse?.videoDetails?.channelId,
      lengthSeconds: window.ytInitialPlayerResponse?.videoDetails?.lengthSeconds,
      microformat: window.ytInitialPlayerResponse?.microformat?.playerMicroformatRenderer,
    }));
    video.title = details.title ?? video.title;
    video.description = details.description;
    video.channelId = details.channelId;
    video.seconds = details.lengthSeconds;
    video.publication_date = details.microformat?.publishDate;
    video.upload_date = details.microformat?.uploadDate;
  }
  const result = {
    channel: data.metadata?.channelMetadataRenderer?.title,
    channelId: data.metadata?.channelMetadataRenderer?.externalId,
    videos: unique,
  };
  mkdirSync('artifacts', { recursive: true });
  writeFileSync('artifacts/youtube-channel.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
