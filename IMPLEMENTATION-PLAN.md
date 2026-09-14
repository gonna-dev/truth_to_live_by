# Truth to Live By — proposal for approval

14 September 2026 · Planning only · Based on TTLB-URS-001 and its final brand decisions.

## Recommended direction

Build a small, typography-led publication with Astro, structured Markdown content, maintainable plain CSS, GitHub source control and Cloudflare Pages delivery. The principal conversion is joining **One Truth to Live By** through beehiiv. The attached `VISUAL-CONCEPT.svg` shows proposed desktop and mobile first-screen layouts; it is a design board, not an implemented website.

The working directory was empty. The supplied browser context identifies the YouTube channel, but signed-in browser controls are not available in this session. No GitHub repository, Cloudflare project, Instagram profile content or beehiiv publication has been inspected or configured. Account ownership, plan entitlements and final assets remain unverified.

## Architecture

```text
Markdown articles + video data + brand configuration
                  ↓ schema validation
              Astro static build
                  ↓ quality checks
GitHub approved merge → Cloudflare Pages → reader
                                              ├─ beehiiv signup
                                              └─ YouTube / Instagram links
```

- Prerender public pages. No database, user accounts, CMS or always-on application server.
- Use Astro components for navigation, footer, cards, article references, newsletter, SEO and callouts. Add small native browser scripts only for menu/filter/search behavior; React is unnecessary initially.
- Keep positioning, social URLs, navigation and integration settings in one brand configuration file. Keep colors, typography, spacing, widths and focus styles in one token stylesheet.
- Store articles as Markdown; support MDX only for approved richer editorial blocks. Use validated collections for articles, videos and extensible pillar definitions. Adding articles or pillars must not require editing page components.
- Start with a provider-hosted beehiiv embedded form behind a reusable component. Verify keyboard access, consent text, confirmation, errors and double opt-in in the actual publication. Keep a visible fallback link to its hosted signup page. If the embed fails acceptance tests, assess a minimal server-side adapter against the existing account's API access before changing architecture or introducing costs.
- Prefer locally stored, optimized editorial images and linked video thumbnails. Do not load a YouTube player on initial page load. Links work without JavaScript.
- Contact proposal: a dedicated brand mailbox link with enquiry guidance, avoiding a personal address and relying on mailbox spam filtering. A form would require selecting a delivery service and a small validated, spam-protected endpoint; defer that choice until the mailbox is known.
- Privacy-conscious aggregate analytics can be configured after processor review. Treat beehiiv-confirmed subscriptions as conversions; outbound clicks alone are signup intent, not successful subscriptions.

Astro supports schema-validated content collections and static routes ([Astro documentation](https://docs.astro.build/en/guides/content-collections/)). Cloudflare documents Astro deployment and pull-request previews ([Cloudflare guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)). beehiiv offers external embedded signup forms, but these do not support its native multi-step signup flows ([beehiiv documentation](https://www.beehiiv.com/support/article/12977090590487)). Exact dependency versions will be selected and locked during implementation.

## Sitemap and page behavior

| Route | Purpose |
| --- | --- |
| `/` | Positioning, primary Join CTA, Explore Ideas, featured idea, latest articles, three pillars, selected video, newsletter |
| `/ideas/` | All published ideas, pillar filters and small local search over titles, descriptions, tags and body |
| `/ideas/[slug]/` | Article, dates, author, reading time, takeaway, evidence notes, references, corrections, related ideas/video, signup |
| `/ideas/topic/[pillar]/` | Shareable pillar archive; generated from pillar data |
| `/watch/` | Verified long-form videos and Shorts, with related articles |
| `/about/` | Brand purpose, editorial method, evidence approach and synthetic-presenter transparency |
| `/join/` | Newsletter proposition, consent/privacy link and beehiiv form |
| `/contact/` | Editorial, corrections, collaboration and commercial enquiry route |
| `/privacy/` | Actual controller/contact, purposes, processors, retention and rights information, reviewed before collection |
| `/terms/` | Concise site-use and editorial terms; no invented company details |
| `/404.html` | Branded recovery page; return an actual 404 response |
| `/sitemap-index.xml`, `/robots.txt` | Production discovery; preview environments excluded from indexing |

Header: Home, Ideas, Watch, About, Join. Footer: Contact, Privacy, Terms, YouTube, Instagram. Mobile: brand, visible Join action and accessible menu. No important action requires hover.

## Content model

| Collection | Required data | Optional or derived data |
| --- | --- | --- |
| Article | title, slug, description, author, publication_date, pillar reference, tags, draft, placeholder, Markdown body | subtitle, updated_date, hero_image/alt, related_video, featured, seo_title/description/image, sources, takeaway, evidence_note, correction_note, related_articles; reading time derived |
| Video | title, slug, description, publication_date, pillar reference, verified youtube_url, format (video/short), thumbnail and alt, draft, placeholder | related_article, duration when verified |
| Pillar | id, title, description, display_order | accent token |
| Source within article | title, URL, evidence classification | author, publisher, publication date, locator, explanatory note |

Use explicit references rather than duplicate URLs for article/video relationships. Classifications can distinguish established evidence, emerging evidence, interpretation, opinion and hypothesis; they are editorial assessments, never automatically inferred proof. Markdown supplies headings, quotes, lists and citations; reusable blocks supply callouts and the practical takeaway.

Validation must reject duplicate slugs, invalid references/URLs, missing required fields, invalid dates, updated dates before publication and missing alt text for meaningful images. At most one published featured idea. Filter drafts, future-dated items and placeholders consistently out of public routes, search, related content and sitemap. An explicit local preview mode can display them with a conspicuous label. Production readiness must check launch content minimums and flag any unapproved placeholder exceptions.

## Visual concept — warm editorial minimalism

Use a quiet masthead, fine divider lines and a large serif headline: **Ideas worth understanding. Truths worth living.** Supporting text remains simple and practical. Olive Join buttons make the newsletter the strongest action; Explore Ideas remains a visible secondary action, with YouTube nearby.

| Token | Proposal |
| --- | --- |
| Background | Warm paper `#F6F3EB` |
| Text | Charcoal `#272923` |
| Accent | Deep olive `#4B583F` |
| Secondary surface | Pale oat `#E9E4D8` |
| Decorative rule | `#D5CFC0` (not a form-control boundary) |
| Display typography | Literary serif, self-hosted and licensed; Georgia fallback |
| Body typography | Clear sans serif, system fallback; 18px reading text |
| Reading measure | Approximately 65 characters |
| Layout | Up to 1180px; generous spacing; one column on mobile |
| Controls | At least 44px target height, strong visible keyboard focus |

Below the hero: one larger featured idea, then a quieter latest-ideas list, pillar links, a selected-video section and a full-width newsletter invitation. Article pages use a narrower reading column. Images should evoke books, timber and natural light when appropriate and available, with confirmed rights. The concept uses labeled image space instead of invented brand photography. Article headings in the concept are illustrative, not claims about existing channel content.

## Implementation sequence and review gates

1. **Approve this proposal and concept.** This follows the supplied instruction: “URS → architecture → visual concept → implementation plan → your approval → build.” No application implementation or deployment at this stage.
2. **Foundation.** Initialize local Git, add Astro and locked dependencies, brand tokens, schemas, layouts and reusable components. Add `.gitignore`, `.env.example` without credentials, and agent instructions. Confirm target GitHub repository before configuring a remote.
3. **Reading experience.** Build every route, responsive navigation, article/pillar templates, filtering/search, related content, video cards, 404, SEO and image pipeline. Produce local desktop/mobile preview.
4. **Editorial and integrations.** Prepare 3–5 clearly labeled draft articles and 3–5 video entries using verified channel URLs. Drafts needing evidence stay unpublished. Configure beehiiv and the chosen contact route, prepare accurate privacy information, and verify actual form behavior. Preview forms remain disabled until personal-data collection is authorized and documented.
5. **Quality and documentation.** Run the checks below and resolve failures. Write README.md, AGENTS.md, ARCHITECTURE.md, CONTENT.md, DEPLOYMENT.md, SECURITY.md and CHANGELOG.md against the actual implementation. Commit coherent stages separately.
6. **Completed preview approval.** Deliver the local preview and report: implemented requirements, test results, remaining launch blockers, costs, processors and maintenance instructions. Do not create a publicly accessible preview URL without approval; `noindex` is not access control.
7. **Approved release.** Configure GitHub/Cloudflare deployment and domain, test HTTPS and live integrations, verify rollback, and deliver the final deployment report. Future approved merges deploy automatically after required checks.

## Deployment and verification design

Propose Cloudflare Pages Git integration with `main` as production branch. Include the full production-critical validation command in the Cloudflare build command, so deployment cannot race ahead of GitHub tests. Configure required GitHub checks/branch protections where the repository plan supports them. Cloudflare supplies PR preview deployments ([Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)); establish preview access restrictions before using real unpublished content. The authoritative source remains the owner's GitHub repository.

Use a successful previous deployment as the rollback target and document a corresponding Git revert to preserve source/deployment consistency. Test the actual rollback procedure during approved deployment work. Failed validations must block publishing new output.

| Area | Planned evidence |
| --- | --- |
| Build/content | Clean install, schema/type checks, production build, draft leakage and invalid-reference checks |
| Links/navigation | Crawl generated internal links/assets and anchors; test menu, search/filter, empty results, pillar and related-content links |
| Forms | Keyboard labels, invalid email, pending, confirmed success, provider failure, retry, duplicate subscriber and configured double opt-in; no false success |
| Responsive | 360/390px mobile, tablet and desktop; no horizontal overflow; touch targets and reduced-motion behavior |
| Accessibility | Automated axe checks plus manual keyboard/focus, headings, contrast and form feedback review; WCAG 2.2 AA target |
| SEO | Titles/descriptions, canonical URLs, social images, Article/brand/breadcrumb and eligible VideoObject data, sitemap, robots and true 404 |
| Performance | Mobile Lighthouse targets: performance 90+, accessibility/best practices/SEO 95+; check representative home/article/Join pages |
| Web vitals | Aim for LCP <2.5s, CLS <0.1 and good INP; distinguish lab checks from field results available after real traffic |
| Security | Secret/dependency scan, HTTPS/security headers, external-link safety and provider input handling; no secrets in client output |
| Release | Approved hostname, live signup test, privacy completeness, launch content counts, preview indexing/access and rollback |

## Assumptions and owner decisions

Approval of this proposal selects warm editorial styling, Astro/plain CSS, static Cloudflare Pages, Markdown collections, beehiiv embed-first integration and a brand-mailbox contact route. These are recommendations rather than completed configuration.

Before integration/release, establish the GitHub repository and visibility, Cloudflare account/project, beehiiv publication/form and contact mailbox. Obtain brand assets and rights, select real video entries, approve final article copy and identify the controller details needed for privacy information. None of these require passwords or tokens in chat; use secure account/environment configuration when available.

Domain connection, public publication, paid services and final editorial/legal content require owner approval. A newsletter placeholder can appear in local preview; launching with one requires the explicit temporary-placeholder approval allowed by the URS. All unresolved acceptance criteria must appear in the deployment report rather than being called complete.

## Cost and scope

Target free-tier or low-cost hosting at modest traffic. Existing domain renewal continues. beehiiv costs depend on the owner's current plan, subscriber count and features; no plan has been verified and no paid subscription is proposed here. Mailbox costs depend on the chosen existing provider. No paid search, CMS, database, commerce, accounts, custom video hosting or advertising stack. Check applicable hosting/build/analytics quotas before release and ask before any cost-generating integration.

## Status of this deliverable

Requirements preserved in USER-REQUIREMENTS.txt. Proposal and design board prepared locally. No application build, runtime tests, external writes, account changes, paid services or publication have occurred. The full requested maintenance documentation and deployment report belong to the implementation stage and will describe tested behavior.
