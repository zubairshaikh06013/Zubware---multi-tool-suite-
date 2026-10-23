import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  base: process.env.ZUBWARE_PLUGIN_BASE || '/',
  root: fileURLToPath(new URL('.', import.meta.url)),
  publicDir: fileURLToPath(new URL('../public', import.meta.url)),
  plugins: [react(), tailwindcss()],
  build: { outDir: 'dist', chunkSizeWarningLimit: 1200 },
});
