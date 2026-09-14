export function isPublic(entry, now = new Date()) {
  const data = entry.data ?? entry;
  return !data.draft && !data.placeholder && new Date(data.publication_date) <= now;
}

export function visibleEntries(entries, preview, now = new Date()) {
  return entries.filter((entry) => preview || isPublic(entry, now))
    .sort((a, b) => new Date(b.data.publication_date) - new Date(a.data.publication_date) || a.id.localeCompare(b.id));
}

export function validateRelations(articles, videos, pillars) {
  const problems = [];
  for (const [name, entries] of [['articles', articles], ['videos', videos]]) {
    const seen = new Set();
    for (const entry of entries) {
      if (seen.has(entry.data.slug)) problems.push(`Duplicate ${name} slug: ${entry.data.slug}`);
      seen.add(entry.data.slug);
      if (!pillars.some((p) => p.id === entry.data.pillar.id)) problems.push(`${entry.id}: unknown pillar`);
      for (const reference of entry.data.related_articles ?? []) {
        if (!articles.some((a) => a.id === reference.id)) problems.push(`${entry.id}: unknown related article ${reference.id}`);
      }
      if (entry.data.related_video && !videos.some((v) => v.id === entry.data.related_video.id)) problems.push(`${entry.id}: unknown related video`);
      if (entry.data.related_article && !articles.some((a) => a.id === entry.data.related_article.id)) problems.push(`${entry.id}: unknown related article`);
    }
  }
  if (articles.filter((a) => isPublic(a) && a.data.featured).length > 1) problems.push('Only one published article may be featured');
  return problems;
}
