import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://truthtoliveby.fyi',
  output: 'static',
  // Rasterize only the reviewed, repository-owned SVG illustrations in src/assets.
  image: { dangerouslyProcessSVG: true },
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') && !page.endsWith('/404.html') })],
  devToolbar: { enabled: false },
  vite: { build: { assetsInlineLimit: 0 } },
});
