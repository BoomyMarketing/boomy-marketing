import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://boomymarketing.com',
  output: 'static',
  integrations: [
    sitemap({
      // Sitemap generation — will be extended in Phase 5
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  build: {
    // Output to dist/ (Vercel picks this up automatically)
    format: 'directory', // generates clean URLs: /about/ instead of /about.html
  },
});
