import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const route of ['/', '/watch/']) {
  test(`${route} video loads only on Play, preserves CTAs and closes accessibly`, async ({
    page,
  }, testInfo) => {
    const youtubeRequests: string[] = [];
    page.on('request', (request) => {
      if (new URL(request.url()).hostname === 'www.youtube-nocookie.com')
        youtubeRequests.push(request.url());
    });
    // Deterministic integration boundary; live provider is inspected separately.
    await page.route('https://www.youtube-nocookie.com/**', (r) =>
      r.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><html lang="en"><title>Player test</title><body><main><button>Play video</button></main></body></html>',
      }),
    );
    const response = await page.goto(route);
    expect(response?.headers()['content-security-policy']).toContain(
      'https://www.youtube-nocookie.com',
    );
    const player = page.locator('ttlb-video').first();
    const videoUrl = await player.getAttribute('data-video-url');
    const videoTitle = await player.getAttribute('data-title');
    expect(videoUrl).toBeTruthy();
    expect(videoTitle).toBeTruthy();
    const videoId = new URL(videoUrl!).pathname.split('/').filter(Boolean).at(-1);
    const play = player.getByRole('button', { name: /^Play / });
    await play.scrollIntoViewIfNeeded();
    await expect(play).toBeVisible();
    await expect(player.locator('iframe')).toHaveCount(0);
    expect(youtubeRequests).toEqual([]);
    await play.focus();
    await page.keyboard.press('Enter');
    const frame = player.locator('iframe');
    await expect(frame).toHaveAttribute(
      'src',
      `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`,
    );
    await expect(frame).toHaveAttribute('title', `YouTube player: ${videoTitle}`);
    await expect(player.locator('.video-loading')).toBeHidden();
    await expect(player.getByRole('status').last()).toContainText('YouTube player loaded');
    await expect
      .poll(() =>
        youtubeRequests.some((url) => url.startsWith('https://www.youtube-nocookie.com/embed/')),
      )
      .toBe(true);
    await expect(page).toHaveURL(`http://127.0.0.1:4322${route}`);
    await expect(player.getByRole('button', { name: 'Close video' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(
      page.frameLocator('ttlb-video iframe').getByRole('button', { name: 'Play video' }),
    ).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(player.getByRole('button', { name: 'Close video' })).toBeFocused();
    const box = await frame.boundingBox();
    expect(box!.width / box!.height).toBeCloseTo(9 / 16, 2);
    await expect(player.getByRole('link', { name: 'Watch on YouTube' })).toBeVisible();
    await expect(
      player.getByRole('link', { name: /^(Read the companion idea|Explore related Ideas)/ }),
    ).toHaveAttribute('href', /^\/ideas\/(?:topic\/[a-z0-9-]+|[a-z0-9-]+)\/$/);
    await expect(player.getByRole('link', { name: 'Join One Truth to Live By' })).toHaveAttribute(
      'href',
      '/join/',
    );
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    await player.screenshot({
      path: `artifacts/${testInfo.project.name}-video-open-${route === '/' ? 'home' : 'watch'}.png`,
    });
    await page.keyboard.press('Escape');
    await expect(frame).toHaveCount(0);
    await expect(play).toBeFocused();
    await page.keyboard.press('Space');
    await expect(frame).toHaveCount(1);
    await player.getByRole('button', { name: 'Close video' }).click();
    await expect(frame).toHaveCount(0);
  });
}

test('landscape presentation uses 16:9, and provider failure retains recovery controls', async ({
  page,
}) => {
  await page.route('https://www.youtube-nocookie.com/**', (r) => r.abort());
  await page.goto('/watch/');
  const player = page.locator('ttlb-video').first();
  // Exercise the landscape presentation without adding fabricated editorial content.
  await player.locator('.video-stage').evaluate((el) => el.classList.remove('video-stage-short'));
  await player.getByRole('button', { name: /^Play / }).click();
  const box = await player.locator('iframe').boundingBox();
  expect(box!.width / box!.height).toBeCloseTo(16 / 9, 2);
  await expect(player.getByRole('status')).toContainText('Watch on YouTube');
  await player.getByRole('button', { name: 'Close video' }).click();
  await expect(player.getByRole('button', { name: /^Play / })).toBeFocused();
});

test('CSP blocks other frame origins and keeps scripts and connections local', async ({ page }) => {
  const response = await page.goto('/watch/');
  const policy = response!.headers()['content-security-policy'];
  expect(policy).toContain("script-src 'self';");
  expect(policy).toContain("connect-src 'self';");
  const violation = await page.evaluate(
    () =>
      new Promise((resolve) => {
        document.addEventListener(
          'securitypolicyviolation',
          (e) => resolve({ directive: e.effectiveDirective, uri: e.blockedURI }),
          { once: true },
        );
        const iframe = document.createElement('iframe');
        iframe.src = 'https://example.invalid/player';
        document.body.append(iframe);
      }),
  );
  expect(violation).toEqual({ directive: 'frame-src', uri: 'https://example.invalid' });
});

test('video has a deliberate external fallback without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/watch/');
  const player = page.locator('ttlb-video').first();
  await expect(player.locator('iframe')).toHaveCount(0);
  await expect(player.getByRole('button', { name: /^Play / })).not.toBeVisible();
  await expect(player.getByRole('link', { name: 'Watch on YouTube' })).toBeVisible();
  await context.close();
});
