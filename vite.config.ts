import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';
import { generateSeoHtmlAndSitemap } from './scripts/generateSeoAndSitemap';

function generateToolPagesAndSitemapPlugin(): Plugin {
  return {
    name: 'generate-tool-pages-and-sitemap',
    closeBundle() {
      try {
        generateSeoHtmlAndSitemap();
      } catch (err) {
        console.error('[Zubware SEO] Failed to generate tool HTML pages & sitemap:', err);
      }
    }
  };
}

function devSpaFallbackPlugin(): Plugin {
  return {
    name: 'dev-spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url) {
          // Direct serve for root favicon and icon assets
          if (/^\/(favicon|icon|apple-touch-icon|manifest)\.(svg|ico|png|json)/i.test(req.url)) {
            const filename = req.url.slice(1).split('?')[0];
            const filePath = path.join(__dirname, 'public', filename);
            if (fs.existsSync(filePath)) {
              const ext = path.extname(filePath).toLowerCase();
              const mimeMap: Record<string, string> = {
                '.svg': 'image/svg+xml',
                '.png': 'image/png',
                '.ico': 'image/x-icon',
                '.json': 'application/json'
              };
              _res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
              fs.createReadStream(filePath).pipe(_res);
              return;
            }
          }

          // SPA fallback for HTML pages: rewrite non-asset routes to index.html
          const urlObj = new URL(req.url, 'http://localhost');
          const pathname = urlObj.pathname;
          // If accessing a page route that doesn't look like a static asset (.js, .css, .wasm, etc)
          const isAsset = /\.(js|ts|tsx|css|json|png|jpg|jpeg|webp|svg|wasm|ico|woff2?|ttf|eot)(\?.*)?$/i.test(pathname);
          const isViteInternal = pathname.includes('/@') || pathname.includes('/node_modules/');

          // Check if file physically exists on disk
          const localFilePath = path.join(__dirname, pathname);

          if (!isAsset && !isViteInternal && !fs.existsSync(localFilePath)) {
            req.url = '/index.html' + urlObj.search;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss(), generateToolPagesAndSitemapPlugin(), devSpaFallbackPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
