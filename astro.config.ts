import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/site.config';

export default defineConfig({
  site: SITE.url,
  // Posts live at /YYYY/MM/slug.html and pages at /about/ etc., exactly as before.
  build: { format: 'preserve' },
  integrations: [sitemap()],
});
