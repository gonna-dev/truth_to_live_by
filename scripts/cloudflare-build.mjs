import { spawnSync } from 'node:child_process';
import { loadEnv } from 'vite';
import { existsSync } from 'node:fs';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const branch = env.CF_PAGES_BRANCH;
if (!branch)
  throw new Error(
    'This command requires CF_PAGES_BRANCH from Cloudflare Pages. Use build or build:preview locally.',
  );
if (branch !== 'main' && env.PREVIEW_DEPLOYMENT_APPROVED !== 'true')
  throw new Error('Hosted previews require owner approval and appropriate access restrictions.');
const npmCli = process.env.npm_execpath;
if (!npmCli || !existsSync(npmCli)) throw new Error('Run this through npm run build:cloudflare.');
const commands = branch === 'main' ? ['build:release'] : ['validate', 'build:preview', 'test:site'];
for (const command of commands) {
  const result = spawnSync(process.execPath, [npmCli, 'run', command], { stdio: 'inherit', env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
