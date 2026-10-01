# Architecture

## Runtime

Astro 7 builds HTML/CSS and small JavaScript modules to `dist/`. Public content needs no server runtime or database. Cloudflare Pages is the intended static host. No Cloudflare adapter, Worker, user account system or CMS is installed.

Astro 7's CLI entrypoint is resolved from its package metadata by `scripts/build.mjs`. The wrapper supplies the explicit content-preview flag and writes Cloudflare headers plus a non-secret build-status manifest after a successful build. Environment variables are loaded from the standard Vite production environment files. The lockfile pins the dependency graph; use npm ci.

## Rendering and routing

`src/layouts/Base.astro` owns document metadata, local font imports, header, footer and preview notice. `src/components` supplies article/video cards, the Ideas library and the newsletter. Astro file routes create the main pages; dynamic routes generate article and pillar pages from the collections.

`src/lib/content.ts` is the page-level content entry point. It loads collections, validates references via `publication.mjs`, applies one publication filter and sorts articles. The same helper feeds routes, article relationships, search and the content manifest. `draft`, `placeholder` and future publication dates exclude articles from public output. An explicit preview build or dev server includes them with labels. Public output remains noindex until release approval is configured.

`IdeasLibrary.astro` emits the relevant article title/description/tags/pillar/body as searchable data only for the currently visible collection. A small client script filters cards using all query words. Pillar navigation is real HTML links and works without JavaScript. Search controls remain hidden when JavaScript is off, rather than presenting a broken control. No paid search or browser storage.

The mobile navigation uses native details/summary, with progressive Escape/outside-click behavior. Article link copying uses the Clipboard API with a visible fallback. No React or client router.

## Visual and media system

CSS uses reset/base/components/responsive layers, central variables, a paper/charcoal/olive palette and Newsreader/DM Sans typography. Fonts are packaged locally. Original SVG illustrations live in src/assets; Astro produces responsive WebP variants and article PNG social cards. The brand PNG card is committed in public/social; its source generator is scripts/social-card.mjs. No remote image host or tracking pixel is needed.

SVG processing is explicitly enabled only for the reviewed source-controlled artwork. External SVG or arbitrary uploads are not supported. Preserve width/height and alt text for media. `VideoPlayer.astro` renders local video posters and progressively enhances a native Play button. No YouTube iframe, request, preconnect or SDK is loaded before activation. Play creates a fixed-origin `www.youtube-nocookie.com` iframe with native controls and requests inline autoplay; browsers may still require Play inside the iframe. Closing removes the frame and restores focus; opening another video closes the previous one. The existing `format` field selects 9:16 Shorts or 16:9 videos. External YouTube, related Ideas and newsletter links remain below each player, including when JavaScript or playback is unavailable. No content schema change or new dependency was needed.

## Newsletter and contact

The newsletter component encapsulates beehiiv rather than spreading provider markup across pages. The embedded form is enabled only when both newsletter and privacy switches are true, both embed and hosted URLs are allowlisted, and content preview is off. Otherwise the component links to the verified public publication at https://one-truth-to-live-by-newsletter.beehiiv.com/ without collecting emails or simulating success on this site. The default URL lives in brand configuration; an environment override remains available.

The embed owns actual validation, consent submission and provider success/error behavior. It uses a titled, lazy iframe, a limited sandbox and a hosted-page fallback. The iframe is not verified until the owner's real embed is provided and exercised. Tests of configuration gating do not prove delivery. No API credentials are required by the planned embed integration.

Contact uses the dedicated brand-mailbox link from central brand configuration, with an optional environment override. If validation fails, the page displays the official Instagram and TikTok profiles. It does not submit contact messages. Gmail spam filtering is the intended spam protection; no personal address is published.

Privacy and terms are explicitly marked drafts. The release checker rejects the current privacy and terms text even if someone toggles approval flags. Analytics is not enabled; no third-party analytics dependency is installed. Signup counts should come from confirmed beehiiv subscribers once integrated, not from counting CTA clicks as conversions.

## Quality and release

Unit tests cover draft isolation, date boundaries, reference validation and integration input gating. A generated-site crawler checks every HTML page for local assets/links/anchors, heading/metadata basics, structured data, sitemap/robots and CSP compatibility. Playwright plus axe exercises desktop/mobile pages, navigation, search, no-JavaScript use and 404s.

GitHub quality workflow runs public validation then preview browser tests. `build:release` additionally requires approved content, privacy/contact/signup and completed-preview approval. Cloudflare's build must use that command so a failed readiness or quality check cannot replace the last good deployment. The GitHub/Cloudflare integration itself is not configured yet.
