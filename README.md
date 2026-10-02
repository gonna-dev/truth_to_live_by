# Truth to Live By

<!-- MARK-OS-CARD-START -->

## Project overview

**Purpose:** Production Astro website for the Truth to Live By editorial brand.

- **Authoritative source:** [`gonna-dev/truth_to_live_by`](https://github.com/gonna-dev/truth_to_live_by), branch `main`.
- **Change:** application code in `src/`, release configuration in `config/`, and structured editorial content described in [CONTENT.md](CONTENT.md).
- **Local production media:** source and exported MP4/WAV files stay local and are excluded from Git.
- **Generated output:** `dist/`, browser reports and test artifacts are ignored.
- **Run or review:** `npm run dev -- --port 4321` for local work; `npm run validate` for the standard quality suite.
- **Production:** Cloudflare Pages project `truth-to-live-by-site` serves [`truthtoliveby.fyi`](https://truthtoliveby.fyi/).

<!-- MARK-OS-CARD-END -->

An independent editorial website for truthtoliveby.fyi. Astro 7, Markdown content collections, plain CSS, local fonts and optimized illustrations. The intended audience flow is **YouTube / Instagram / TikTok → website → beehiiv email list**.

The website is live on Cloudflare Pages. The approved production library contains three articles and three verified videos. The beehiiv double-opt-in flow and confirmation redirect are verified; the current production collection state is recorded in [DEPLOYMENT-REPORT.md](DEPLOYMENT-REPORT.md). Four labeled sample essays remain available only in local preview builds.

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

`npm run build:release` includes the release-readiness gate and requires the approved production environment values. None of these commands deploys.

For mobile Lighthouse measurements, start `node scripts/serve-dist.mjs` after a preview build, then run `node scripts/audit-performance.mjs`. Reports are written under `artifacts/lighthouse/`. Preview SEO results intentionally reflect noindex.

## Configuration

Copy `.env.example` to `.env` only when configuring integrations. Values prefixed `PUBLIC_` are public, not secrets. The verified beehiiv homepage is https://one-truth-to-live-by-newsletter.beehiiv.com/. The dedicated Gmail address and verified social profiles are configured in the central brand data. Mailbox delivery, the public profiles, Privacy Notice, Terms and beehiiv double opt-in flow have been reviewed. Never use an API key as a public setting.

Brand text/navigation/social links: `src/config/brand.ts`. Design tokens and responsive styles: `src/styles/global.css`. Content schema: `src/content.config.ts`. Release review facts: `config/release.json`.

## Maintenance guides

- CONTENT.md — add/edit articles, videos and pillars.
- ARCHITECTURE.md — implementation and data flow.
- DEPLOYMENT.md — approved Cloudflare/GitHub release and rollback.
- SECURITY.md — secrets, third parties and defensive controls.
- AGENTS.md — instructions for future coding agents.
- DEPLOYMENT-REPORT.md — what is built, tested and still blocked.

Source: https://github.com/gonna-dev/truth_to_live_by. Merges to `main` are built by the Git-connected Cloudflare Pages project after the repository quality workflow passes.
