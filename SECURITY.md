# Security and privacy maintenance

## Secrets and third parties

Never commit .env files, tokens, browser sessions, credentials or subscriber data. Use Cloudflare/GitHub secret mechanisms if a future server-side integration needs credentials. Current beehiiv embed integration requires public URLs only. PUBLIC_ settings are visible to readers.

Newsletter stays disabled until privacy/configuration review is complete. Iframes accept HTTPS `embeds.beehiiv.com`, plus UUID form paths under `subscribe-forms.beehiiv.com/v3/forms/` without query strings or fragments. Script and preview URLs on the new host are rejected. Hosted fallback URLs are restricted to beehiiv.com and its subdomains, without embedded credentials. Custom newsletter domains require an explicit allowlist update and tests. No cross-origin message is trusted as a subscription confirmation. The provider loader and attribution scripts are not added to the site.

The separate owner-operated social publisher stores YouTube OAuth client credentials and refresh tokens only in its ignored local brand environment. It verifies the authorised channel and currently enforces private YouTube uploads. Its Google Cloud configuration requests `youtube.upload` for uploads and `youtube.readonly` for the channel identity safeguard. The website documents that data flow but does not receive OAuth callbacks or credentials, invoke the publisher, or expose publishing controls.

No third-party player loads before Play. User activation creates a privacy-enhanced YouTube iframe; the host page does not load a YouTube SDK or tracking script. `youtubeEmbed()` extracts a valid ID from an allowlisted HTTPS YouTube URL and builds a fixed `www.youtube-nocookie.com/embed/` URL. CSP permits that exact frame origin while keeping scripts/connections local. Privacy-enhanced playback is not anonymous; the player can contact YouTube after activation. The iframe sends the site origin as referrer, required for YouTube client identification. Instagram, TikTok and Facebook remain ordinary outbound links. Fonts and illustrations are local. Contact is a dedicated brand Gmail link with provider spam filtering; no site form endpoint is exposed.

## Browser controls

Cloudflare `_headers` are generated after build from config/security-headers.txt. They specify CSP, no framing, no MIME sniffing, a restrictive permissions policy, referrer policy and HSTS. Executable scripts are emitted as same-origin assets. JSON-LD is escaped to prevent closing the script element. Review CSP whenever integrations change; do not add wildcards or unsafe-eval to avoid fixing an integration.

The local static test server applies the same browser controls except HSTS/upgrade-insecure-requests, which require HTTPS. This server is for testing, listens on loopback only, and is not a production host.

## Content and dependencies

Markdown/JSON is trusted repository content reviewed through Git. It is not an untrusted-user input system. Keep source links HTTPS, never embed arbitrary HTML/scripts, and inspect imported assets. Astro SVG rasterization is enabled for the reviewed repository-owned artwork; do not introduce untrusted SVGs or external-resource references. No upload endpoint exists.

Use npm ci and commit the lockfile. Dependabot configuration requests npm and Actions updates. Test before merging, especially Astro major upgrades. Run npm audit and inspect advisories; never apply force-upgrades blindly. Scan tracked content for credentials before pushing, and enable repository secret scanning where available.

## Release safeguards

Public builds filter drafts, placeholders and future content. A separate release gate rejects unfinished legal pages, absent contact/signup verification, insufficient published content and missing owner approval. Noindex protects discoverability, not confidentiality; keep unapproved previews local or behind verified access controls.

The approval flags are maintenance checks, not an authorization service. They must accurately reflect human review, and an agent must never toggle them just to obtain a passing build. Report open requirements honestly in DEPLOYMENT-REPORT.md.
