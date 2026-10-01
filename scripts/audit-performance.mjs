import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('artifacts/lighthouse', { recursive: true });
const browser = await chromium.launch({ args: ['--remote-debugging-port=9223'] });
try {
  const results = [];
  for (const [name, route] of [
    ['home', '/'],
    ['watch', '/watch/'],
    ['article', '/ideas/discipline-is-not-self-punishment/'],
    ['join', '/join/'],
  ]) {
    const report = await lighthouse(`http://127.0.0.1:4322${route}`, {
      port: 9223,
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      logLevel: 'error',
    });
    writeFileSync(`artifacts/lighthouse/${name}.json`, report.report);
    const { lhr } = report;
    results.push({
      page: name,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
      ),
      LCP: lhr.audits['largest-contentful-paint'].numericValue,
      CLS: lhr.audits['cumulative-layout-shift'].numericValue,
      failedAudits: Object.entries(lhr.audits)
        .filter(([, value]) => value.score !== null && value.score < 1)
        .map(([id, value]) => ({ id, title: value.title, score: value.score })),
    });
  }
  writeFileSync('artifacts/lighthouse/summary.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
