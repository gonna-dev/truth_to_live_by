# Deployment report

Updated 26 September 2026. Status: local review preview; not approved for publication.

## 26 September — social publisher and YouTube OAuth evidence

The separate `Social_media_bot` project is now a multi-brand, multi-platform publisher. Its merged `master` commit `4d675f8` isolates MKP and TruthToLiveBy manifests, credentials, logs and publishing state. Follow-up commit `634df32` locks TruthToLiveBy publishing to the expected YouTube channel ID before any upload. The TruthToLiveBy YouTube adapter refreshes OAuth access, checks the authorised channel identity, uploads a local MP4 through YouTube’s resumable upload API and supplies title, description, tags, category and made-for-kids metadata. Code rejects every visibility other than private. Media and brand credentials remain local and are excluded from Git.

The owner reports that the current OAuth authorisation resolves to “Truth to Live By,” channel ID `UCm6qo4ralmcA24XzOwn9xBw`, using the channel-owning Google account. An initial private test reached an unintended channel before that account issue was corrected. A second private test reached the intended channel and appeared as a vertical Short. The completed test rows are archived outside the active manifest, which is now empty. The private video identifiers remain in the bot’s ignored local state rather than this website. The placeholder credential template is restored, the bot worktree is clean, and all 26 automated tests pass in the configured dependency runtime. Its TruthToLiveBy Windows task is installed but disabled, so no unattended upload is enabled. TikTok draft support exists in code but has not been connected or tested live.

The owner confirmed Google Cloud project `TruthToLiveBy-YouTubePublish` (`truthtoliveby-youtubepublish`), using a Web application OAuth client in Testing. Support and developer contact both use the dedicated brand Gmail address. The requested scopes are `https://www.googleapis.com/auth/youtube.upload` for uploads and `https://www.googleapis.com/auth/youtube.readonly` for the channel identity safeguard. The temporary redirect is Google OAuth Playground and no authorised domain is configured yet.

The owner supplied the controller identity Mark Walsh. The website now contains a `/publishing/` application homepage and expanded draft Privacy and Terms disclosures identifying Mark Walsh as the individual operator and data controller, describing the verified owner-operated data flow and both requested scopes. The site neither receives OAuth tokens nor runs the publisher. These pages remain local and explicitly marked for owner/OAuth review; privacy, terms and publication flags remain false.

The owner approved a 12-month retention period for operational publishing logs. OAuth credentials are retained only while authorisation remains active and are deleted when replaced, revoked or no longer required. Approved requests to delete locally stored publishing records are completed within 30 days unless a legal obligation requires retention; privacy requests are handled within the legally applicable period through the dedicated brand contact route.

Website verification passed: 0 Astro/type errors, warnings or hints; 9 unit tests; production build and static checks across 13 pages; preview build and static checks across 17 pages; and all 48 desktop/mobile browser tests. The new publishing disclosure has automated content, privacy-link, accessibility and overflow checks. Full-page desktop and mobile screenshots were generated and inspected; the page retains the approved editorial presentation and remains readable at both sizes.

## 25 September — Facebook page supplied and verified

The owner supplied the Facebook page name “Truthtoliveby.fyi” and its numeric address, `https://www.facebook.com/profile.php?id=61594741382572`. A logged-out browser check resolved that address to Facebook’s “Truthtoliveby.fyi” page at `/people/Truthtolivebyfyi/61594741382572/`. The stable owner-supplied numeric address is now in central brand configuration, the footer, About page, privacy copy and Organization structured data. Facebook remains an ordinary outbound link and does not change the CSP or load Facebook resources into the site.

The acquisition path is now YouTube / Instagram / TikTok / Facebook → truthtoliveby.fyi → beehiiv. No Facebook credentials, page settings or content were changed. This addition does not change any publication or release flag.

Verification passed: 0 Astro/type errors, warnings or hints; 9 unit tests; production build and static checks across 12 pages; preview build and static checks across 16 pages; and all 44 desktop/mobile browser tests. The social-route test now asserts the exact numeric Facebook page address. Updated full-page desktop and mobile screenshots were inspected; the additional footer link fits without overflow or accessibility violations. The known Windows Playwright cleanup hang recurred after every test passed, and terminating only the identified local `scripts/serve-dist.mjs` process allowed the suite to exit successfully.

## 25 September — TikTok profile verified

The owner confirmed that the intended public TikTok profile at `https://www.tiktok.com/@truthtoliveby` is complete. This resolves the outstanding profile-identity check for the TikTok link already used in central brand configuration, the footer, About page, privacy copy and Organization structured data. No TikTok credentials, content or account settings were changed through the website project.

This confirmation does not change any release flag. Contact-email delivery and spam handling remain separate checks, and the completed website preview still requires explicit publication approval.

## 24 September — dedicated mailbox and TikTok supplied

The owner supplied the dedicated brand address `truthtoliveby.fyi@gmail.com` and TikTok handle `@truthtoliveby`. The Gmail address is now the Contact-page default and remains overridable through `PUBLIC_CONTACT_EMAIL`; it passed local syntax and rendered-link validation. The TikTok URL is in central brand configuration, the footer, About page, privacy copy and Organization structured data. The intended acquisition path now includes YouTube, Instagram and TikTok.

No message was sent during this change, and the TikTok page could not then be independently read through the available web lookup. Mail delivery in both directions and spam handling must therefore still be checked before setting `contactVerified`. The TikTok profile was subsequently confirmed by the owner on 25 September, as recorded above. The release flags remain unchanged.

Verification passed: 0 Astro/type errors, warnings or hints; 9 unit tests; production build and static checks across 12 pages; preview build and static checks across 16 pages; and all 44 desktop/mobile browser tests, including the new Gmail `mailto:` and TikTok footer-link assertions. The usual Windows Playwright server-cleanup hang occurred after all tests completed; terminating its identified local server allowed the suite to exit successfully.

## 16 September — user-requested on-site video playback

Implemented a reusable lazy YouTube player on the homepage, Watch cards and article-related video sections. No video content fields were changed. Local thumbnails and a native Play button precede a user-triggered `www.youtube-nocookie.com` iframe. Shorts use 9:16 and long-form uses 16:9. No YouTube request or connection hint is made before activation. The bundled player script is approximately 1.8 kB uncompressed, with no new dependency or YouTube SDK.

Close removes the iframe and returns focus to Play; keyboard users can enter and leave native player controls. Starting a second player removes the first. Related Ideas (companion article if published, otherwise the pillar), newsletter and explicit Watch on YouTube links remain beneath each player. Browser restrictions can require a second Play inside the iframe. A persistent fallback and Close/reopen route remain available when the provider fails. Escape closes the player while focus is in the host component; YouTube controls its own iframe keyboard events.

Live verification: the connected browser displayed the actual Short playing within the homepage, with its seek control progressing and a Mute control. Closing restored focus to Play. The first provider attempt stayed blank; reopening loaded successfully. Direct standalone embed navigation reports YouTube error 153 without an embedding referrer, as expected; the site iframe explicitly uses `strict-origin-when-cross-origin`.

Final validation: production and preview builds plus static checks passed (12/16 pages), 0 type errors/warnings/hints, 9 unit tests and all 42 desktop/mobile browser tests passed. New tests cover zero external requests before Play, keyboard activation and frame focus, portrait/landscape geometry, recovery after provider failure, no-JavaScript fallback, retained CTAs and actual CSP rejection of an unapproved frame origin. Deterministic iframe tests use a local response substitute; the real provider was separately checked above. Long-form geometry was tested using the component's landscape presentation, without inventing a published video. Player screenshots under `artifacts/` and live playback were inspected.

CSP adds only `https://www.youtube-nocookie.com` to `frame-src`; host scripts and connections remain self-only. Privacy copy now explains the explicit YouTube connection and that privacy-enhanced playback is not anonymous. Implementation references: [YouTube player parameters](https://developers.google.com/youtube/player_parameters) and [YouTube embedding guidance](https://support.google.com/youtube/answer/171780).

Final mobile Lighthouse rerun: homepage and Watch performance 97, accessibility 100 and best practices 100. Home LCP 2.18 s / CLS 0; Watch LCP 2.11 s / CLS 0.0014. Article and Join were also audited (Join performance 99); all accessibility/best-practices scores remain 100. The Play label mismatch identified in the first audit was corrected and no longer appears. Preview SEO remains limited by intentional noindex. These are initial-load lab results, before the visitor activates YouTube; provider playback cost is deliberately deferred.

## Implemented

Astro static publication with home, searchable Ideas library, pillar pages, essay pages, Watch, About, Join, Contact, draft Privacy/Terms and branded 404. Responsive navigation, keyboard interactions, local fonts/images, metadata, structured data, sitemap, security headers and publication filtering are implemented. Four clearly marked sample essays appear only in preview. One verified owner-channel Short, “How to Stay Calm | Stoic Wisdom,” appears in both builds.

The acquisition path links YouTube, Instagram and TikTok audiences through the site to https://one-truth-to-live-by-newsletter.beehiiv.com/. Circle is excluded. The website currently uses an external newsletter link; no email input or newsletter iframe is rendered in preview.

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
