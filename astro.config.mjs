import { defineConfig } from 'astro/config';
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

// Directories excluded from service-slug auto-detection
const SKIP_DIRS = new Set([
  'local', 'assets', 'services', 'sitemap', 'locations', 'node_modules',
  'dist', 'src', 'docs', 'scripts', 'generators', 'public', 'lazy-method',
  'api', 'projects', 'booking', 'thank-you', 'about-us', 'web-design',
  'seo', 'boomy-digital-marketing-blog',
]);

function isServiceDir(dirPath) {
  try {
    return fs.readdirSync(dirPath).some(sub => {
      const idx = path.join(dirPath, sub, 'index.html');
      return fs.existsSync(idx) && fs.statSync(idx).isFile();
    });
  } catch { return false; }
}

function resolveLocalPath(url) {
  const clean = url.split('?')[0].replace(/\/$/, '');

  // Legacy roots (local/, assets/, services/)
  const legacyRoots = ['local', 'assets', 'services'];
  const matched = legacyRoots.find(r => clean === `/${r}` || clean.startsWith(`/${r}/`));
  if (matched) {
    let filePath = path.join(root, clean);
    if (!path.extname(filePath)) filePath = path.join(filePath, 'index.html');
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile() ? filePath : null;
  }

  // New /{service}/{city} pattern — 2-level deep service pages
  const parts = clean.split('/').filter(Boolean);
  if (parts.length === 2 && !SKIP_DIRS.has(parts[0])) {
    const filePath = path.join(root, parts[0], parts[1], 'index.html');
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile() ? filePath : null;
  }

  return null;
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

      // Production build: copy legacy dirs + auto-detected service dirs + SEO root files
      'astro:build:done': async ({ dir }) => {
        const distRoot = fileURLToPath(dir);

        // Known static dirs (including topical authority dirs)
        for (const dirName of ['local', 'assets', 'services', 'sitemap', 'locations',
                               'guides', 'best', 'industries']) {
          const src = path.join(root, dirName);
          if (fs.existsSync(src)) {
            await copyDir(src, path.join(distRoot, dirName));
          }
        }

        // Auto-detect directories: /{service}/{city}/ AND /{service}/ (direct index.html)
        const entries = fs.readdirSync(root);
        for (const entry of entries) {
          if (SKIP_DIRS.has(entry) || entry.startsWith('.') || entry.startsWith('_')) continue;
          const src = path.join(root, entry);
          if (!fs.statSync(src).isDirectory()) continue;
          // /{service}/{city}/ pattern (has sub-dirs with index.html)
          if (isServiceDir(src)) {
            await copyDir(src, path.join(distRoot, entry));
            continue;
          }
          // /{service}/ pattern (direct index.html — topical authority service pillars)
          const directIdx = path.join(src, 'index.html');
          if (fs.existsSync(directIdx)) {
            await copyDir(src, path.join(distRoot, entry));
          }
        }

        for (const fileName of ['robots.txt', 'llms.txt', 'manifest.json', 'sitemap.xml']) {
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
    // Manual sitemap.xml in root takes priority — copied by legacyStaticPages hook
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
