# Adding and maintaining content

## Articles

Create a UTF-8 Markdown file under `src/content/articles/`. The filename without `.md` is its collection ID, used by references. The `slug` controls its URL. Use lower-case hyphenated names for both; keep them the same unless there is a reason not to.

```yaml
---
title: A considered title
slug: a-considered-title
description: An accurate summary of what this essay explores.
author: Truth to Live By
publication_date: 2026-09-14
pillar: self
tags: [attention, reflection]
hero_image: ../../assets/attention.svg
hero_alt: Describe the meaningful image content.
draft: true
placeholder: true
featured: false
takeaway: A practical interpretation that does not overstate the evidence.
evidence_note: Explain what is established, uncertain or interpretive.
related_articles: [what-deserves-your-attention]
sources: []
---
Opening paragraphs.

## A useful section heading

Write the essay here.
```

Use existing pillar IDs: `self`, `relationships`, `living-well`. Add a new pillar as described below; no component changes are needed. Article hero images are required by this implementation. Use local images with meaningful alt text and confirmed rights. Markdown supports headings, links, blockquotes, lists and inline images. The template provides the practical takeaway, references, evidence notes, corrections, related articles and optional video link. MDX is not currently installed.

Additional fields: `subtitle`, `updated_date`, `seo_title`, `seo_description`, `seo_image`, `correction_note`, `related_video`. Reading time is derived from the Markdown body. Sources are objects with `title`, HTTPS `url` and `classification`; optional fields are `author`, `publisher`, `publication_date`, `locator` and `note`. Classification must be one of `established evidence`, `emerging evidence`, `interpretation`, `opinion`, `hypothesis`. It is an editorial judgment, not an automatic stamp of scientific validity.

Never invent citations or attribute generated text to a real expert. Verify primary sources for factual claims. Sample essays are original editorial reflections without research claims. Their sample status must remain until the owner approves final copy.

## Publication and corrections

1. Add the draft and review locally with npm run dev.
2. Review factual claims, sources, practical advice, image rights and metadata. Record owner editorial approval.
3. Set `draft: false` and `placeholder: false` only for approved content. Use the actual publication date; a future date excludes the article until a subsequent build on/after that date. There is no scheduled rebuild service.
4. Run npm run validate and applicable UI tests. At most one published article can have `featured: true`.
5. Commit on a feature branch and follow the approved GitHub/Cloudflare release procedure.

For corrections, preserve the slug, update the text, set `updated_date` and add a `correction_note` when the factual change is substantive. Keep published URLs stable. If a slug must change, add an explicit Cloudflare redirect and verify incoming links.

All public lists/routes, search data, related links and sitemap must omit unapproved items. Preview mode intentionally includes them, with visible labels and noindex. A preview is not an access-controlled hosted environment; keep it local until an appropriate preview release is approved.

## Videos and Shorts

Add one JSON object per file under `src/content/videos/`. The first verified entry is “How to Stay Calm | Stoic Wisdom” (https://www.youtube.com/shorts/7Gx-8crjg58), 53 seconds, published 5 January 2025. Its channel ID and publication metadata were read from the public YouTube page. The channel exposed one public Short when inspected; two more verified entries are needed for the launch target. Do not substitute made-up IDs or unrelated creators.

Required properties: `title`, `slug`, `description`, `publication_date`, `pillar`, `format` (`video` or `short`), `youtube_url` (a specific watch/Short URL), `thumbnail` (relative local image path), `thumbnail_alt`, `draft`, `placeholder`, `verified`. Optional: `duration` in ISO 8601 format such as PT5M30S and `related_article` collection ID.

The existing `format` field also determines the on-site player shape: `short` is 9:16, `video` is 16:9. Keep the ordinary YouTube URL; the player derives its privacy-enhanced embed URL automatically. Local thumbnails appear before Play, and YouTube loads only after activation. Related-article links are resolved from the filtered library; otherwise the video links to its pillar. No embed HTML or extra content fields are needed.

Obtain the exact title, actual date, URL and thumbnail from the owner's channel. Confirm image rights. Set `verified: true` only after checking that URL and its metadata. Use `draft: false` / `placeholder: false` when publication is approved. Adding an entry automatically makes it available to the Watch collection. Set an article's `related_video` to the video filename ID for a companion link.

## Pillars and images

Add `src/content/pillars/new-pillar.json` with `title`, `description`, `display_order` and `label`. Its filename is the pillar ID. Pillar pages and navigation cards are generated from this data.

The original illustrations in src/assets were authored for this site. Keep them free of external references and executable content. SVG rasterization is enabled for this reviewed artwork; do not insert arbitrary external SVG files. Photos can be added as local JPEG/PNG/WebP after rights review; Astro will optimize them. Article social images are generated from `seo_image` or the hero image.

To regenerate the brand social PNG after a brand-copy change, edit scripts/social-card.mjs and run `node scripts/social-card.mjs`, then inspect public/social/brand.png and rebuild. Fonts used in the website are self-hosted packages with OFL licenses.
