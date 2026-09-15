import { readFileSync } from 'node:fs';
import { loadEnv } from 'vite';
import { newsletterConfig, validEmail } from '../src/lib/integrations.mjs';

const config = JSON.parse(readFileSync('config/release.json', 'utf8'));
const status = JSON.parse(readFileSync('dist/build-status.json', 'utf8'));
const content = JSON.parse(readFileSync('dist/content-manifest.json', 'utf8'));
const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const issues = [];
if (status.preview) issues.push('A preview build may not be released.');
if (!config.completedPreviewApprovedForPublication || env.RELEASE_APPROVED !== 'true')
  issues.push('Owner approval of completed preview is required.');
if (env.EDITORIAL_APPROVED !== 'true') issues.push('Final editorial approval is required.');
if (!config.privacyNoticeApproved || env.PUBLIC_PRIVACY_READY !== 'true')
  issues.push('Final privacy notice and controller details must be approved.');
if (
  /Preview notice — not a final launch notice/.test(readFileSync('src/pages/privacy.astro', 'utf8'))
)
  issues.push('Replace the preview privacy notice with the actual approved notice.');
if (
  !config.termsApproved ||
  /Draft for owner review before launch/.test(readFileSync('src/pages/terms.astro', 'utf8'))
)
  issues.push('Final terms must be reviewed.');
if (!config.contactVerified || !validEmail(env.PUBLIC_CONTACT_EMAIL))
  issues.push('Configure and verify the brand contact mailbox.');
if (
  !config.temporaryNewsletterPlaceholderApproved &&
  (!config.newsletterVerified || !newsletterConfig(env).enabled)
)
  issues.push(
    'Verify beehiiv signup, confirmation, errors and double opt-in, or obtain explicit temporary-placeholder approval.',
  );
if (content.articles.length < config.minimumArticles)
  issues.push(
    `Need ${config.minimumArticles} approved articles; public build has ${content.articles.length}.`,
  );
if (
  content.videos.filter((v) => v.verified && !v.draft && !v.placeholder).length <
  config.minimumVideos
)
  issues.push(`Need ${config.minimumVideos} verified published video entries.`);
if (!status.indexable) issues.push('Production output must be indexable after approval.');
if (issues.length) {
  console.error('RELEASE BLOCKED\n' + issues.map((issue) => `- ${issue}`).join('\n'));
  process.exit(1);
}
console.log('Release readiness checks passed. This command does not deploy.');
