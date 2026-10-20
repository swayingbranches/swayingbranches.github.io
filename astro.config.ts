import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { SITE } from './src/site.config';
import { hastPlugins, mdastPlugins } from './src/lib/markdown';

export default defineConfig({
  site: SITE.url,
  // Posts live at /YYYY/MM/slug.html and pages at /about/ etc., exactly as before.
  build: { format: 'preserve' },
  markdown: {
    processor: satteri({
      // Dashes are handled by the kramdown-typography plugin instead.
      features: { smartPunctuation: { quotes: true, ellipses: true, dashes: false } },
      mdastPlugins,
      hastPlugins,
    }),
  },
  integrations: [sitemap()],
});
