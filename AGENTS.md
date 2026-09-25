# Truth to Live By — agent instructions

## Scope and ownership

Read USER-REQUIREMENTS.txt, IMPLEMENTATION-PLAN.md and the current DEPLOYMENT-REPORT.md before changing scope. The owner approved the architecture and visual concept on 14 September 2026. The acquisition flow is YouTube / Instagram / TikTok → truthtoliveby.fyi → beehiiv. Circle is not part of this site.

The source repository is https://github.com/gonna-dev/truth_to_live_by. Work on a feature branch. Keep meaningful changes in separate commits and preserve existing history. Never force-push or rewrite main.

The completed preview has not been approved for publication. Do not publish a public preview, deploy, connect the domain, introduce paid services or enable personal-data collection without the applicable owner approval. Existing session authorization takes precedence; do not ask again for an already approved action.

## Architecture and conventions

Astro 7 static pages, TypeScript, plain CSS and version-controlled content. No React, database, authentication, CMS or custom email backend. Use the existing components and the centrally defined tokens in src/styles/global.css. Brand copy and links live in src/config/brand.ts.

Articles are Markdown files in src/content/articles. Videos are JSON in src/content/videos. Pillars are JSON in src/content/pillars. Follow CONTENT.md. New editorial content should not require application component changes. Markdown is the current format; MDX is not installed.

Use the library() helper for all content lists. It validates cross-references and applies publication filtering. Do not query unfiltered content directly in pages. Drafts, placeholders and future dates must never leak into a public build, search data, related content or sitemap. Preview mode intentionally shows marked drafts and disables newsletter collection.

Do not fabricate video IDs, sources, research findings, author credentials, publication dates for real videos, subscriber counts or testimonials. Mark sample essays. Verify source material before publishing factual claims. Health/science content needs appropriate sources and evidence notes.

Use trusted local images. SVG rasterization is enabled for the reviewed repository-owned illustrations; never add remote/unreviewed SVG or permit arbitrary user uploads. Keep external integrations allowlisted in src/lib/integrations.mjs. Never render arbitrary external HTML or inline executable scripts. Preserve the CSP.

## Verification

For significant changes run npm run validate. For UI changes also run npm run build:preview, npm run test:site and npm run test:browser. Inspect screenshots in artifacts. Test the production build too, because it excludes samples. Do not call a preview production-ready when release:check fails. For new integration work test actual provider success, validation, failure/retry and double opt-in before marking it verified.

Use npm ci with the lockfile. Follow the runtime requirement in package.json. Keep tests meaningful: publication isolation, references, links, accessibility and user interactions. Update documentation to reflect actual implementation. See DEPLOYMENT.md for Cloudflare commands and approval gates.

## Restricted changes

Never commit .env files, credentials, browser cookies, logs, generated dist or node_modules. Never lower release flags or minimum content counts to make checks pass. Change config/release.json approval fields only after the corresponding review occurred, recording evidence in the deployment report. Do not mark a provider working based only on a configured URL.

Do not edit USER-REQUIREMENTS.txt to conceal deviations. Do not introduce accounts, payments, comments, custom video hosting or major infrastructure without an explicit scope change. Keep the repository portable and costs low.
