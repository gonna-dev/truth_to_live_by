import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
const manifest = JSON.parse(readFileSync('dist/content-manifest.json', 'utf8'));

const pages = [
  '/',
  '/ideas/',
  '/ideas/topic/self/',
  '/watch/',
  '/about/',
  '/join/',
  '/contact/',
  '/privacy/',
  '/terms/',
  '/publishing/',
  '/ideas/what-deserves-your-attention/',
];
for (const route of pages) {
  test(`${route} loads without accessibility or layout failures`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    const report = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(report.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}
test('search covers article body, handles empty results and clears', async ({ page }) => {
  await page.goto('/ideas/');
  const input = page.getByRole('searchbox', { name: 'Find an idea' });
  await input.fill('administration');
  await expect(page.locator('[data-result-count]')).not.toHaveText('0 ideas found');
  await expect(page.getByRole('heading', { name: 'What deserves your attention?' })).toBeVisible();
  await input.fill('nonsense-no-match');
  await expect(page.getByRole('heading', { name: 'No ideas found, yet.' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(input).toHaveValue('');
  await expect(page.locator('[data-result-count]')).toHaveText(`${manifest.articles.length} ideas`);
  await page.getByRole('link', { name: 'Relationships', exact: true }).first().click();
  await expect(page).toHaveURL(/\/ideas\/topic\/relationships\//);
  await expect(
    page.getByRole('heading', { name: 'The space between listening and replying' }),
  ).toBeVisible();
});
test('newsletter never pretends to accept email while unconfigured', async ({ page }) => {
  await page.goto('/join/');
  await expect(
    page.getByRole('heading', { name: 'A little perspective, delivered.' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Visit the newsletter' })).toHaveAttribute(
    'href',
    'https://one-truth-to-live-by-newsletter.beehiiv.com/',
  );
  await expect(page.locator('input[type=email], iframe')).toHaveCount(0);
});
test('dedicated contact and official social routes are exposed', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.getByRole('link', { name: 'Email Truth to Live By' })).toHaveAttribute(
    'href',
    'mailto:truthtoliveby.fyi@gmail.com',
  );
  await page.goto('/');
  const socials = page.getByRole('navigation', { name: 'Social channels' });
  await expect(socials.getByRole('link', { name: 'TikTok' })).toHaveAttribute(
    'href',
    'https://www.tiktok.com/@truthtoliveby',
  );
  await expect(socials.getByRole('link', { name: 'Facebook' })).toHaveAttribute(
    'href',
    'https://www.facebook.com/profile.php?id=61594741382572',
  );
});
test('OAuth publishing disclosure describes the private YouTube workflow', async ({ page }) => {
  await page.goto('/publishing/');
  await expect(
    page.getByRole('heading', { name: 'The Truth to Live By publishing system.' }),
  ).toBeVisible();
  await expect(
    page.getByText('The current workflow creates uploaded videos as private.'),
  ).toBeVisible();
  await expect(page.getByText('youtube.upload', { exact: true })).toBeVisible();
  await expect(page.getByText('youtube.readonly', { exact: true })).toBeVisible();
  await expect(page.getByText(/operated by Mark Walsh/)).toBeVisible();
  await expect(
    page.getByText(/Operational publishing logs are retained for 12 months/),
  ).toBeVisible();
  await expect(page.getByText(/completed within 30 days/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Truth to Live By Privacy Notice' })).toHaveAttribute(
    'href',
    '/privacy/',
  );
});
test('privacy and terms match the reviewed services and retention rules', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByText(/Mark Walsh is the data controller/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The website and hosting' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The newsletter' })).toBeVisible();
  await expect(page.getByText(/deleted within 24 months/)).toBeVisible();
  await expect(
    page.getByText(/Operational publishing logs are retained for 12 months/),
  ).toBeVisible();
  await expect(page.getByText(/Standard Contractual Clauses/)).toBeVisible();
  await expect(page.getByText(/Irish Data Protection Commission/)).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'truthtoliveby.fyi@gmail.com' }).first(),
  ).toHaveAttribute('href', 'mailto:truthtoliveby.fyi@gmail.com');

  await page.goto('/terms/');
  await expect(page.getByText(/operated by Mark Walsh in Ireland/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Acceptable use' })).toBeVisible();
  await expect(page.getByText(/governed by Irish law/)).toBeVisible();
  await expect(page.getByText(/Draft for owner review/)).toHaveCount(0);
});
test('keyboard navigation and mobile menu work', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  if (isMobile) {
    await page.locator('.mobile-menu summary').click();
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open');
    await page.locator('.mobile-menu summary').click();
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'About' })
      .click();
  } else
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'About' })
      .click();
  await expect(page).toHaveURL(/\/about\//);
});
test('unknown route returns branded 404 and useful recovery links', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: 'Not every path leads where we expect.' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Return home' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4322/');
});
test('capture home, library and essay for visual review', async ({ page }, testInfo) => {
  for (const [name, route] of [
    ['home', '/'],
    ['ideas', '/ideas/'],
    ['article', '/ideas/what-deserves-your-attention/'],
    ['publishing', '/publishing/'],
    ['privacy', '/privacy/'],
    ['terms', '/terms/'],
  ]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `artifacts/${testInfo.project.name}-${name}.png`,
      fullPage: true,
    });
  }
});
test('content remains navigable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/ideas/');
  await expect(page.getByRole('searchbox')).not.toBeVisible();
  await page.getByRole('link', { name: 'Relationships', exact: true }).first().click();
  await expect(
    page.getByRole('heading', { name: 'The space between listening and replying' }),
  ).toBeVisible();
  await context.close();
});
