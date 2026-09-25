# Truth to Live By

An independent editorial website for truthtoliveby.fyi. Astro 7, Markdown content collections, plain CSS, local fonts and optimized illustrations. The intended audience flow is **YouTube / Instagram / TikTok → website → beehiiv email list**.

The owner approved the architecture and design; public release is not approved. This repository currently provides a working local preview, with four labeled sample essays. See DEPLOYMENT-REPORT.md for current validation and outstanding launch items.

## Run locally

Use Node 24 (Node >=22.12 is required) and npm. From this directory:

```sh
npm ci
npm run dev -- --port 4321
```

Open http://127.0.0.1:4321. Astro 7 may detach the development server; use `npx astro dev status`, `npx astro dev logs` or `npx astro dev stop` for this project. The local developer preview includes marked drafts and disables newsletter collection. Do not expose this development server publicly.

## Build and verify

```sh
npm run validate
npm run build:preview
npm run test:site
npx playwright install chromium
npm run test:browser
```

`validate` checks types, publication/integration tests, a public-mode static build and generated links/metadata. Public mode excludes all sample essays. `build:preview` includes samples and sets noindex. Browser tests expect the four supplied samples and start a local static server on port 4322 with production-style CSP headers. Screenshots go to ignored `artifacts/`; Playwright reports go to ignored `playwright-report/`.

`npm run build:release` includes the release-readiness gate. It is expected to fail until launch requirements and approvals are satisfied. None of these commands deploys.

For mobile Lighthouse measurements, start `node scripts/serve-dist.mjs` after a preview build, then run `node scripts/audit-performance.mjs`. Reports are written under `artifacts/lighthouse/`. Preview SEO results intentionally reflect noindex.

## Configuration

Copy `.env.example` to `.env` only when configuring integrations. Values prefixed `PUBLIC_` are public, not secrets. The verified beehiiv homepage is https://one-truth-to-live-by-newsletter.beehiiv.com/; it currently displays “truthtoliveby.fyi.” The dedicated Gmail address and TikTok handle are configured in the central brand data. Mailbox delivery/spam handling, the TikTok public profile and final privacy details still need launch verification. Never use an API key as a public setting.

Brand text/navigation/social links: `src/config/brand.ts`. Design tokens and responsive styles: `src/styles/global.css`. Content schema: `src/content.config.ts`. Release review facts: `config/release.json`.

## Maintenance guides

- CONTENT.md — add/edit articles, videos and pillars.
- ARCHITECTURE.md — implementation and data flow.
- DEPLOYMENT.md — approved Cloudflare/GitHub release and rollback.
- SECURITY.md — secrets, third parties and defensive controls.
- AGENTS.md — instructions for future coding agents.
- DEPLOYMENT-REPORT.md — what is built, tested and still blocked.

Source: https://github.com/gonna-dev/truth_to_live_by. Cloudflare has not been configured by this build. No public upload or deployment has occurred.
