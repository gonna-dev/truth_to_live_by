# Deployment report

Updated 1 October 2026. Status: completed preview approved for staged publication; newsletter collection remains disabled pending live verification.

## 1 October — post-merge release safeguards

Pull request #1 was merged into `main` at commit `6b23411`. A post-merge review identified three release-safety gaps, which are corrected on the follow-up branch `codex/release-safety-fixes`: an enabled but unverified beehiiv form can no longer pass by relying on the temporary disabled-newsletter approval; the Privacy Notice now accurately describes the lazy beehiiv iframe connection that can occur before submission; and a draft or scheduled video selected for the preview homepage is visibly marked “Scheduled preview video.”

Validation passed after the repairs: Astro reported 0 errors, warnings or hints; all 9 unit tests passed; the production build generated 17 pages; the preview build generated 21 pages; static checks passed for both builds; and all 54 desktop/mobile browser tests passed from a clean local server. The browser suite covers accessibility, layout, keyboard navigation, disabled newsletter collection, the new scheduled-video marker, the revised privacy disclosure, click-to-load YouTube behavior and Content Security Policy enforcement.

The release gate was also tested in both newsletter states. With newsletter collection disabled under the approved temporary placeholder, the only remaining blocker is the third verified published video. With newsletter collection enabled while `newsletterVerified` is false, the gate adds the required beehiiv end-to-end verification blocker even though the temporary placeholder approval exists. No deployment has been performed by these repairs.

## 1 October — staged publication approved

The owner approved the completed preview and a staged publication sequence with newsletter collection temporarily disabled. The release configuration now records `completedPreviewApprovedForPublication: true` and `temporaryNewsletterPlaceholderApproved: true`; `newsletterVerified` remains false. The beehiiv embedded form is configured to show “Success! Now check your email to confirm your subscription.” and to require double opt-in, while publication-level double opt-in remains disabled. The confirmation email is valid, but beehiiv has no Opt-in Redirect URL configured and therefore returns confirmed subscribers to the publication homepage.

The intended redirect target, `https://truthtoliveby.fyi/join/confirmed/`, could not be reached because the domain has no resolving DNS record. It must not be saved in beehiiv until the website is publicly reachable. The production release check otherwise passed type checking, all 9 unit tests, a 17-page production build and static checks; it remains blocked only by the third verified video, which is scheduled for 1 October 2026 at 11:00 UTC and is still a draft entry until public verification.

## 30 September — preview playback and newsletter-confirmation review

During owner review, the lazy YouTube iframe initially appeared as a black rectangle while the provider connected. Both public Shorts were then replayed successfully in the connected browser, with controls, captions and elapsed playback visible. The website now keeps an accessible “Connecting securely to YouTube…” layer over that interval and replaces it with explicit loaded/fallback guidance after the iframe load event. The iframe remains absent until Play is pressed, continues to use `youtube-nocookie.com`, and retains the direct Watch on YouTube link.

The beehiiv confirmation test succeeded technically but returned the subscriber to the publication homepage, which contains only the signup form and therefore gave no visible confirmation. This is beehiiv's default double-opt-in destination when no Opt-in Redirect URL is configured. The website now provides a no-index `/join/confirmed/` page with a clear success message, inbox guidance, unsubscribe information and a route back to the Ideas library. After the public site is available, beehiiv's Opt-in Redirect URL must be set to `https://truthtoliveby.fyi/join/confirmed/` and the full double-opt-in flow must be retested before `newsletterVerified` is enabled.

The preview build and static checks passed across 21 pages. The focused video suite passed all 10 desktop/mobile tests, and the complete browser suite passed all 52 tests, including accessibility and overflow checks for the new confirmation page. Completed-preview and editorial approval remain pending while this remediation is reviewed.

## 30 September — contact mailbox delivery and spam handling verified

The owner completed an end-to-end test of the public contact address, `truthtoliveby.fyi@gmail.com`. A message sent from an owner-controlled external mailbox arrived in the contact mailbox Inbox rather than Spam. A reply containing the agreed verification phrase was then sent from the contact mailbox and arrived back in the sender's Inbox. This verifies inbound delivery, outbound replies, basic sender identity and spam placement in both directions for the tested route.

The `contactVerified` release flag is now true. This verification does not approve the completed preview, enable newsletter collection or publish the website.

Post-update validation passed: Astro reported 0 errors and 0 warnings; all 9 unit tests passed; the production build generated 16 pages; and the static checks passed across all 16 pages. With the verified contact address supplied through `PUBLIC_CONTACT_EMAIL`, `release:check` no longer reports the contact-mailbox blocker. The release remains intentionally blocked by completed-preview and editorial approval, production privacy configuration, beehiiv verification, the third published video and production indexability.

## 30 September — first researched article batch approved

The owner requested publication of the three recent researched articles: “Discipline Is Not Self-Punishment,” “Why Adult Friendships Need Rituals, Not Just Good Intentions,” and “Why You Stay Up Even When You’re Exhausted.” Their cited records were checked against publisher, journal, PubMed, PMC and professional-body sources. The published copy preserves the stated limitations around experimental, observational, self-reported, student-sample and health evidence.

All three entries are now `draft: false` and `placeholder: false`. The production library contains three approved articles, satisfying the configured article minimum. Production routes, search data, pillar pages, related-content resolution and sitemap include them. The local MP4 files were not added to this article-only change; one verified video remains public and two additional verified video entries are still required.

Verification passed: 0 Astro/type errors, warnings or hints; 9 unit tests; production build and static checks across 16 pages; preview build and static checks across 20 pages; and all 50 desktop/mobile browser tests. Updated Home and Ideas screenshots were inspected at desktop and mobile sizes.

## 27 September — first researched article batch drafted

The first three articles in the approved editorial plan have been drafted, one for each pillar: “Discipline Is Not Self-Punishment” (Self), “Why Adult Friendships Need Rituals, Not Just Good Intentions” (Relationships), and “Why You Stay Up Even When You’re Exhausted” (Living Well). They are substantive drafts of approximately 1,700–2,000 words with structured source records, evidence notes, practical takeaways and related-article references. The drafts use the existing reviewed local illustrations and require no application-component changes.

The articles distinguish research findings from editorial interpretation and record material limitations. The discipline essay avoids treating experimental and correlational findings as a universal method; the friendship essay identifies the field’s observational, self-reported and student-sample limitations; and the sleep essay separates voluntary bedtime delay from insomnia, shift work, caregiving, pain and sleep disorders. Health-related guidance remains general and includes an appropriate route to professional assessment.

All three entries remain `draft: true` and `placeholder: true`. Their dates are provisional draft metadata, not public publication dates. They appear only in the local preview with sample labels and are excluded from production lists, search data, related content and sitemap. No editorial approval, completed-preview approval, release flag, newsletter setting or deployment state changed.

Verification passed: 0 Astro/type errors, warnings or hints; 9 unit tests; production build and static checks across 13 pages; preview build and static checks across 20 pages; and all 50 desktop/mobile browser tests. The Ideas library and all three full article pages were captured and visually inspected at desktop size, and the Ideas library was inspected at mobile size. Publication isolation remains intact.

## 26 September — social publisher and YouTube OAuth evidence

The separate `Social_media_bot` project is now a multi-brand, multi-platform publisher. Its merged `master` commit `4d675f8` isolates MKP and TruthToLiveBy manifests, credentials, logs and publishing state. Follow-up commit `634df32` locks TruthToLiveBy publishing to the expected YouTube channel ID before any upload. The TruthToLiveBy YouTube adapter refreshes OAuth access, checks the authorised channel identity, uploads a local MP4 through YouTube’s resumable upload API and supplies title, description, tags, category and made-for-kids metadata. Code rejects every visibility other than private. Media and brand credentials remain local and are excluded from Git.

The owner reports that the current OAuth authorisation resolves to “Truth to Live By,” channel ID `UCm6qo4ralmcA24XzOwn9xBw`, using the channel-owning Google account. An initial private test reached an unintended channel before that account issue was corrected. A second private test reached the intended channel and appeared as a vertical Short. The completed test rows are archived outside the active manifest, which is now empty. The private video identifiers remain in the bot’s ignored local state rather than this website. The placeholder credential template is restored, the bot worktree is clean, and all 26 automated tests pass in the configured dependency runtime. Its TruthToLiveBy Windows task is installed but disabled, so no unattended upload is enabled. TikTok draft support exists in code but has not been connected or tested live.

The owner confirmed Google Cloud project `TruthToLiveBy-YouTubePublish` (`truthtoliveby-youtubepublish`), using a Web application OAuth client in Testing. Support and developer contact both use the dedicated brand Gmail address. The requested scopes are `https://www.googleapis.com/auth/youtube.upload` for uploads and `https://www.googleapis.com/auth/youtube.readonly` for the channel identity safeguard. The temporary redirect is Google OAuth Playground and no authorised domain is configured yet.

The owner supplied the controller identity Mark Walsh. The website now contains a `/publishing/` application homepage and Privacy and Terms disclosures identifying Mark Walsh as the individual operator and data controller, describing the verified owner-operated data flow and both requested scopes. The site neither receives OAuth tokens nor runs the publisher. The pages remain local; the overall completed-preview and publication approvals remain false.

The owner approved a 12-month retention period for operational publishing logs. OAuth credentials are retained only while authorisation remains active and are deleted when replaced, revoked or no longer required. Approved requests to delete locally stored publishing records are completed within 30 days unless a legal obligation requires retention; privacy requests are handled within the legally applicable period through the dedicated brand contact route.

The owner expressly approved the final Privacy Notice and Terms on 26 September 2026, including deletion of contact correspondence within 24 months after the last substantive contact, subject to continuing relationships and legal obligations. The disclosures name the individual controller and contact route; describe Cloudflare hosting, click-to-load YouTube playback, beehiiv newsletter processing, Gmail correspondence and the local Google OAuth publisher; and cover purposes, legal bases, retention, international-transfer safeguards and individual rights. The corresponding Privacy and Terms approval flags are true. Those legal approvals do not complete the overall launch milestone. The three-article minimum was subsequently met on 30 September; two additional verified video entries are still required.

Website verification passed: 0 Astro/type errors, warnings or hints; 9 unit tests; production build and static checks across 13 pages; preview build and static checks across 17 pages; and all 50 desktop/mobile browser tests. The publishing, Privacy and Terms disclosures have automated content, accessibility and overflow checks. Full-page desktop and mobile screenshots were generated and inspected; the pages retain the approved editorial presentation and remain readable at both sizes.

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

Rendering and saved settings are verified. With explicit owner authorization, one test subscription was submitted on 15 September. The dashboard shows it as Pending with acquisition source “embed,” confirming receipt and the confirmation gate. The standalone form reset without displaying the configured success message; iframe success presentation still needs testing. The owner confirmed receipt and clicked the email link; the dashboard was refreshed and the subscriber changed to Active. Email delivery and completion of double opt-in are verified. Duplicate behavior, failure/retry and iframe success presentation remain unverified. The test address is intentionally omitted from source control. `newsletterVerified` and collection flags remain false. No subscribers were imported, paid plan changed, or website deployment performed.

## Quality evidence

- `npm run validate`: passed on 15 September; 0 type errors/warnings/hints, 8 unit tests, production build and static checks across 12 pages. All four draft essays excluded; one verified video included.
- `npm run build:preview` and `npm run test:site`: passed across 16 pages after the latest allowlist change.
- Browser suite: all 32 desktop/mobile tests passed again after the allowlist update, including accessibility, layout overflow, search, keyboard navigation, no-JavaScript content and disabled signup. Windows server cleanup hung after tests and required terminating the identified test server. Avoiding POSIX graceful shutdown did not resolve the environment issue. Workaround: start `node scripts/serve-dist.mjs` in a separate terminal before running the suite; the configured reuse option avoids ownership of server shutdown outside CI.
- Desktop/mobile screenshots are generated under ignored `artifacts/`. Mobile homepage inspected after the newsletter/video updates; the real video thumbnail and Watch layout were also inspected in the connected browser.
- Earlier Lighthouse mobile audits: home performance 98, essay 96, Join 97; accessibility and best practices 100. SEO scores 66–69 reflected intentional noindex. These measurements predate the final video/newsletter edits and are not claims about a deployed site.
- `release:check` intentionally fails: completed-preview/editorial approval, production privacy activation, contact/newsletter verification and content minimums remain unmet.

## Outstanding launch requirements

Owner review of the completed preview; the remaining verified public video requirement; remaining end-to-end beehiiv verification; production privacy configuration; search-engine indexability approval; then explicit public publication approval. The three-article minimum is met, and contact-mail delivery and spam placement are verified. Do not lower release checks to bypass the remaining requirements.

Feature branch `codex/website-v1` is pushed. No PR has been opened, Cloudflare Pages project created, domain connected or public preview published. Existing repository history is preserved. Deployment commands and rollback plan are in DEPLOYMENT.md. Maintenance guidance is in CONTENT.md and ARCHITECTURE.md. No new paid services were introduced; account pricing/entitlements must be checked before launch.


