import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://boomymarketing.com',
  output: 'static',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  build: {
    format: 'directory', // clean URLs: /about/ instead of /about.html
  },
  vite: {
    // Exclude legacy HTML directories from Vite's scanner (pre-Astro migration).
    // These static HTML files are served directly by Vercel from the repo root.
    // Phase 5 will migrate local/ to getStaticPaths(); until then keep them out.
    optimizeDeps: {
      // Restrict pre-bundling to only src/
      entries: ['src/**/*.{astro,ts,js}'],
    },
    build: {
      rollupOptions: {
        // Prevent Rollup from crawling outside src/
        input: {},
      },
    },
  },
});
