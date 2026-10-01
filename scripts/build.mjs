import { spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { loadEnv } from 'vite';
import path from 'node:path';

const preview = process.argv.includes('--preview');
const env = {
  ...loadEnv('production', process.cwd(), ''),
  ...process.env,
  CONTENT_PREVIEW: String(preview),
};
const astroPackage = JSON.parse(readFileSync('node_modules/astro/package.json', 'utf8'));
const result = spawnSync(
  process.execPath,
  [path.join('node_modules/astro', astroPackage.bin.astro), 'build'],
  { stdio: 'inherit', env },
);
if (result.status !== 0) process.exit(result.status ?? 1);
const indexable = !preview && env.RELEASE_APPROVED === 'true';
const headers = readFileSync('config/security-headers.txt', 'utf8');
writeFileSync(
  'dist/_headers',
  headers + (!indexable ? '\n/*\n  X-Robots-Tag: noindex, nofollow\n' : '\n'),
);
writeFileSync(
  'dist/build-status.json',
  JSON.stringify({ preview, indexable, builtAt: new Date().toISOString() }, null, 2),
);
if (!existsSync('dist/404.html')) throw new Error('Missing branded 404');
