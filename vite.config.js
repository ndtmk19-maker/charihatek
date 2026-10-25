import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures relative assets loading on GitHub Pages and custom subpaths
  build: {
    outDir: 'dist',
  },
});
