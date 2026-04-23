import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
};

async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  for (const entry of await fsp.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await fsp.copyFile(s, d);
  }
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  res.end(fs.readFileSync(filePath));
}

function resolveLocalPath(url) {
  // Strip query string and trailing slash
  const clean = url.split('?')[0].replace(/\/$/, '');

  const legacyRoots = ['local', 'assets', 'services'];
  const matched = legacyRoots.find(r => clean === `/${r}` || clean.startsWith(`/${r}/`));
  if (!matched) return null;

  let filePath = path.join(root, clean);
  // If no extension → append index.html (clean URLs)
  // If ends with /index.html → also fine as-is
  if (!path.extname(filePath)) filePath = path.join(filePath, 'index.html');

  return fs.existsSync(filePath) && fs.statSync(filePath).isFile() ? filePath : null;
}

/**
 * Astro integration — must use astro:server:setup hook so the middleware
 * runs BEFORE Astro's own router (which would otherwise 404 on .html URLs).
 */
function legacyStaticPages() {
  return {
    name: 'legacy-static-pages',

    hooks: {
      // Runs before Astro's routing — inject at the FRONT of the Connect stack
      'astro:server:setup': ({ server }) => {
        const handler = (req, res, next) => {
          const filePath = resolveLocalPath(req.url ?? '');
          if (filePath) serveFile(res, filePath);
          else next();
        };
        // Prepend so it runs before Astro's own router middleware
        server.middlewares.stack.unshift({ route: '', handle: handler });
      },

      // Production build: copy legacy dirs + SEO root files into dist/
      'astro:build:done': async ({ dir }) => {
        const distRoot = fileURLToPath(dir);
        for (const dirName of ['local', 'assets', 'services', 'sitemap']) {
          const src = path.join(root, dirName);
          if (fs.existsSync(src)) {
            await copyDir(src, path.join(distRoot, dirName));
          }
        }
        for (const fileName of ['sitemap.xml', 'robots.txt', 'llms.txt']) {
          const src = path.join(root, fileName);
          if (fs.existsSync(src)) {
            await fsp.copyFile(src, path.join(distRoot, fileName));
          }
        }
      },
    },
  };
}

export default defineConfig({
  site: 'https://boomymarketing.com',
  output: 'static',
  integrations: [
    legacyStaticPages(),
    // sitemap({
    //   changefreq: 'weekly',
    //   priority: 0.7,
    //   lastmod: new Date(),
    //   filter: (page) => !page.includes('/404') && !page.includes('/error'),
    // }),
  ],
  build: {
    format: 'directory',
  },
  vite: {
    optimizeDeps: {
      entries: ['src/**/*.{astro,ts,js}'],
    },
    build: {
      rollupOptions: {
        input: {},
      },
    },
  },
});
