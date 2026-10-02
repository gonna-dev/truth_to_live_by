# Cloudflare and GitHub deployment

## Current state

Remote `main` at https://github.com/gonna-dev/truth_to_live_by is authoritative. The Git-connected Cloudflare Pages project `truth-to-live-by-site` builds production from `main` with `npm run build:cloudflare`, publishes `dist/`, and serves https://truthtoliveby.fyi/. The apex domain and HTTPS are active. Three approved articles and three verified public videos satisfy the configured content minimums. The beehiiv double-opt-in flow and redirect to `/join/confirmed/` are verified. See DEPLOYMENT-REPORT.md for the latest evidence and the current production collection state.

Local preview: `npm run dev -- --port 4321`. Production-shaped preview for testing: `npm run build:preview` followed by `node scripts/serve-dist.mjs`, served only on 127.0.0.1:4322. Noindex is not access control.

## Verified launch inputs

- Three substantive articles and three verified YouTube entries are approved and public.
- The beehiiv v3 form URL is recorded in `.env.example`; publication-level double opt-in, confirmation-email delivery and the website confirmation redirect have been tested successfully.
- Delivery in both directions for `truthtoliveby.fyi@gmail.com` was verified on 30 September 2026.
- YouTube, Instagram, TikTok and Facebook identities are recorded in central brand configuration.
- `/publishing/`, `/privacy/` and `/terms/` are approved. The publishing disclosure records the `youtube.upload` and `youtube.readonly` scopes.
- The completed preview, release configuration, production build and live domain have been reviewed. Exact evidence is retained in DEPLOYMENT-REPORT.md.

## Secure configuration

Use `.env` locally, never Git. Cloudflare environment settings supply the same variables for builds. Public URLs and contact addresses are not secrets, but never put credentials in variables prefixed PUBLIC_. This embed implementation needs no API key.

```text
PUBLIC_BEEHIIV_EMBED_URL=<verified embed URL>
PUBLIC_BEEHIIV_SIGNUP_URL=https://one-truth-to-live-by-newsletter.beehiiv.com/
PUBLIC_CONTACT_EMAIL=truthtoliveby.fyi@gmail.com
PUBLIC_PRIVACY_READY=true
PUBLIC_NEWSLETTER_ENABLED=true
EDITORIAL_APPROVED=true
RELEASE_APPROVED=true
```

Set approval flags only after their corresponding review. Update `config/release.json` to reflect actual verification, including `completedPreviewApprovedForPublication`. If the owner explicitly approves temporarily launching without signup, record `temporaryNewsletterPlaceholderApproved`; all other release requirements still apply. Do not reduce content minimums to silence failures.

## Deployment workflow

1. Create a feature branch from current `origin/main`; do not work directly on `main` or rewrite its history.
2. Run the checks appropriate to the change. For release-affecting work, run the production and preview builds plus the browser suite with approved environment values.
3. Push the branch and open a PR targeting `main`. Merge only after `Website quality / quality` succeeds and the visible change has been reviewed.
4. Confirm the Git-connected Cloudflare production deployment matches the merge commit. Failed builds should leave the last successful deployment serving.
5. For changes affecting routing, integrations or collection, repeat live navigation, sitemap/robots, HTTP 404, security-header and provider-flow checks. Never store subscriber addresses or confirmation credentials in Git.
6. Keep Cloudflare environment settings aligned with the approved state. Preview output remains noindex and must not collect subscriber data.

Cloudflare's documented Astro Pages integration and PR previews are described at https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/ and https://developers.cloudflare.com/pages/get-started/git-integration/. Dashboard settings and account entitlements must be verified during configuration.

## Rollback

Before the first update, record the last successful production deployment ID and Git commit. If a release is faulty, use Pages deployment rollback to restore that known-good version. Then revert the faulty commit through Git and a reviewed PR so the source of truth matches the intended deployment. Do not reset/force-push main. Failed builds should leave the last successful deployment serving. The actual rollback procedure must be tested during approved release work; it has not been exercised locally.

## Costs and operations

Target Cloudflare's free tier at modest traffic. Verify current build/traffic limits before release. Domain registration renewal remains payable under the owner's existing account. beehiiv cost depends on the actual plan and subscriber volume; no plan or charge has been changed. Mailbox cost depends on the chosen provider. No database, server subscription, paid search or paid analytics was added.

Analytics is currently off. Review an optional privacy-conscious service and its actual data handling before adding it, then update privacy information and CSP. Newsletter confirmed-subscriber reporting belongs in beehiiv; website CTA clicks must not be reported as completed subscriptions.
