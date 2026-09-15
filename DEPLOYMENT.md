# Cloudflare and GitHub deployment

## Current state

Local branch: `codex/website-v1`, based on the repository's original `main` commit. Remote: https://github.com/gonna-dev/truth_to_live_by. No build commits have been pushed. No Cloudflare project, DNS change or public preview has been created. The owner must approve the completed preview before public publication.

Local preview: `npm run dev -- --port 4321`. Production-shaped preview for testing: `npm run build:preview` followed by `node scripts/serve-dist.mjs`, served only on 127.0.0.1:4322. Noindex is not access control.

## Complete launch inputs

- Review and approve at least three substantive articles; remove draft/placeholder flags only after approval.
- Add at least three verified YouTube entries with actual dates and thumbnails.
- Update beehiiv publication branding. Its current verified homepage is https://one-truth-to-live-by-newsletter.beehiiv.com/ and the displayed name is “truthtoliveby.fyi.”
- The beehiiv v3 form is configured and its standalone URL is recorded in `.env.example`. Double opt-in is enabled in the saved form. Verify iframe compatibility, consent, success, duplicate handling, failure/retry and actual confirmation-email delivery before enabling collection. Empty-email validation has been checked; a loaded form is not proof of subscription success. See DEPLOYMENT-REPORT.md.
- Configure the dedicated brand mailbox. Confirm mailbox delivery and spam filtering.
- Replace privacy/terms drafts with accurate approved text. Include actual controller, processors, purposes/legal bases, retention, rights/contact and transfer safeguards as applicable.
- Review screenshots and quality results; record completed-preview approval.

## Secure configuration

Use `.env` locally, never Git. Cloudflare environment settings supply the same variables for builds. Public URLs and contact addresses are not secrets, but never put credentials in variables prefixed PUBLIC_. This embed implementation needs no API key.

```text
PUBLIC_BEEHIIV_EMBED_URL=<verified embed URL>
PUBLIC_BEEHIIV_SIGNUP_URL=https://one-truth-to-live-by-newsletter.beehiiv.com/
PUBLIC_CONTACT_EMAIL=<dedicated brand mailbox>
PUBLIC_PRIVACY_READY=true
PUBLIC_NEWSLETTER_ENABLED=true
EDITORIAL_APPROVED=true
RELEASE_APPROVED=true
```

Set approval flags only after their corresponding review. Update `config/release.json` to reflect actual verification, including `completedPreviewApprovedForPublication`. If the owner explicitly approves temporarily launching without signup, record `temporaryNewsletterPlaceholderApproved`; all other release requirements still apply. Do not reduce content minimums to silence failures.

## After completed-preview approval

1. Review staged changes and local commit history, then push the feature branch to the supplied repository. Open a draft PR targeting main. Configure required `Website quality / quality` status checks where the repository supports them. Review before merge.
2. In the owner's Cloudflare dashboard, create a Pages project using the existing GitHub repository, production branch `main`, Node 24, output directory `dist` and **build command `npm run build:cloudflare`**. The branch-aware wrapper runs `build:release` for main. Cloudflare automatically installs dependencies; verify it uses the lockfile. No Astro server adapter is needed for static output.
3. Add the approved environment configuration above. Run the full browser checks locally/CI before approving the merge. The build command repeats types/unit/static-output checks and release-readiness checks, so Cloudflare cannot deploy a build that bypasses those failures.
4. For automatic PR previews after authorization, restrict access through Cloudflare Access if unpublished material is present. Set `PREVIEW_DEPLOYMENT_APPROVED=true` only in the preview environment after that approval. The same build wrapper uses Cloudflare's `CF_PAGES_BRANCH`: non-main branches run public validation followed by a draft-enabled preview build and generated-site checks. Without preview approval the wrapper fails. Preview output remains noindex and does not collect subscriber data. Do not set a guessed branch value or replace the production release gate.
5. Approve and merge the PR. Confirm the Cloudflare deployment succeeds and check its deployment URL. Connect `truthtoliveby.fyi` through Pages custom domains and the owner's Cloudflare DNS. Verify HTTPS, certificate status, canonical URLs and redirects. Configure www only if the owner wants it and redirect it to the canonical apex.
6. Run live navigation, sitemap/robots, HTTP 404, security headers, social-preview and signup checks. Send a test subscription only to an owner-authorized test address. Record delivery/double-opt-in evidence without storing personal data in Git.

Cloudflare's documented Astro Pages integration and PR previews are described at https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/ and https://developers.cloudflare.com/pages/get-started/git-integration/. Dashboard settings and account entitlements must be verified during configuration.

## Rollback

Before the first update, record the last successful production deployment ID and Git commit. If a release is faulty, use Pages deployment rollback to restore that known-good version. Then revert the faulty commit through Git and a reviewed PR so the source of truth matches the intended deployment. Do not reset/force-push main. Failed builds should leave the last successful deployment serving. The actual rollback procedure must be tested during approved release work; it has not been exercised locally.

## Costs and operations

Target Cloudflare's free tier at modest traffic. Verify current build/traffic limits before release. Domain registration renewal remains payable under the owner's existing account. beehiiv cost depends on the actual plan and subscriber volume; no plan or charge has been changed. Mailbox cost depends on the chosen provider. No database, server subscription, paid search or paid analytics was added.

Analytics is currently off. Review an optional privacy-conscious service and its actual data handling before adding it, then update privacy information and CSP. Newsletter confirmed-subscriber reporting belongs in beehiiv; website CTA clicks must not be reported as completed subscriptions.
