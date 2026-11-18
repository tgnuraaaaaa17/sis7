import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'sis7-service-worker',
    generateBundle(_, bundle) {
      const files = Object.keys(bundle).filter((file) => bundle[file].type === 'asset' || bundle[file].type === 'chunk');
      const sw = readFileSync(new URL('./public/sw.js', import.meta.url), 'utf8')
        .replace('__PRECACHE_FILES__', JSON.stringify(['index.html', ...files]));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: sw });
    },
  }],
  // Relative base so the same build works on GitHub Pages (/repo/) and on Vercel (/).
  base: './',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
