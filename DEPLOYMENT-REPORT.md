# Deployment report

Updated 15 September 2026. Status: local review preview; not approved for publication.

## Implemented

Astro static publication with home, searchable Ideas library, pillar pages, essay pages, Watch, About, Join, Contact, draft Privacy/Terms and branded 404. Responsive navigation, keyboard interactions, local fonts/images, metadata, structured data, sitemap, security headers and publication filtering are implemented. Four clearly marked sample essays appear only in preview. One verified owner-channel Short, “How to Stay Calm | Stoic Wisdom,” appears in both builds.

The acquisition path links YouTube and Instagram audiences through the site to https://one-truth-to-live-by-newsletter.beehiiv.com/. Circle is excluded. The website currently uses an external newsletter link; no email input or provider iframe is rendered in preview.

## beehiiv work and evidence

The signed-in publication and hosted address were inspected in the connected browser on 15 September. Created external subscribe form `7ac19e35-e25b-4244-ad46-52a60f9c6725`, with title “One Truth to Live By” and subtitle “Ideas worth understanding. Truths worth living.” Required double opt-in was enabled, saved and verified after leaving and reopening the editor.

The provider-generated embed uses `https://subscribe-forms.beehiiv.com/v3/loader.js`. The editor itself displays a provider iframe. Its standalone form URL, `https://subscribe-forms.beehiiv.com/v3/forms/7ac19e35-e25b-4244-ad46-52a60f9c6725`, was opened and showed the saved title/subtitle and email form. An empty submission displayed required-field validation without sending an address. The exact form URL is in `.env.example`. Integration validation and CSP now permit the new form host while rejecting script paths and preview query parameters. No external loader or attribution script was installed.

Rendering and saved settings are verified. With explicit owner authorization, one test subscription was submitted on 15 September. The dashboard shows it as Pending with acquisition source “embed,” confirming receipt and the confirmation gate. The standalone form reset without displaying the configured success message; iframe success presentation still needs testing. The owner confirmed receipt and clicked the email link; the dashboard was refreshed and the subscriber changed to Active. Email delivery and completion of double opt-in are verified. Duplicate behavior, failure/retry and iframe success presentation remain unverified. The test address is intentionally omitted from source control. `newsletterVerified`, privacy and collection flags remain false. No subscribers were imported, paid plan changed, or website deployment performed.

## Quality evidence

- `npm run validate`: passed on 15 September; 0 type errors/warnings/hints, 8 unit tests, production build and static checks across 12 pages. All four draft essays excluded; one verified video included.
- `npm run build:preview` and `npm run test:site`: passed across 16 pages after the latest allowlist change.
- Browser suite: all 32 desktop/mobile tests passed again after the allowlist update, including accessibility, layout overflow, search, keyboard navigation, no-JavaScript content and disabled signup. Windows server cleanup hung after tests and required terminating the identified test server. Avoiding POSIX graceful shutdown did not resolve the environment issue. Workaround: start `node scripts/serve-dist.mjs` in a separate terminal before running the suite; the configured reuse option avoids ownership of server shutdown outside CI.
- Desktop/mobile screenshots are generated under ignored `artifacts/`. Mobile homepage inspected after the newsletter/video updates; the real video thumbnail and Watch layout were also inspected in the connected browser.
- Earlier Lighthouse mobile audits: home performance 98, essay 96, Join 97; accessibility and best practices 100. SEO scores 66–69 reflected intentional noindex. These measurements predate the final video/newsletter edits and are not claims about a deployed site.
- `release:check` intentionally fails: publication/editorial/privacy/terms/contact/newsletter approvals and content minimums remain unmet.

## Outstanding launch requirements

Owner review of completed preview; at least three approved substantive articles; two additional verified video entries; dedicated brand mailbox and delivery test; final privacy/controller details and terms; end-to-end beehiiv verification; then explicit public publication approval. Do not lower release checks to bypass these requirements.

No feature branch has been pushed, PR opened, Cloudflare Pages project created, domain connected, or public preview published. Local feature branch is `codex/website-v1`; existing repository history is preserved. Deployment commands and rollback plan are in DEPLOYMENT.md. Maintenance guidance is in CONTENT.md and ARCHITECTURE.md. No new paid services were introduced; account pricing/entitlements must be checked before launch.
