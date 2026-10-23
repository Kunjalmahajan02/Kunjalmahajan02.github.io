import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` makes every built asset URL relative, so the same build works
// both as a user site (https://<user>.github.io/) and as a project site
// (https://<user>.github.io/<repo>/). Routing uses the URL hash, so GitHub
// Pages never has to rewrite paths and refreshes always work.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 2048,
  },
});
