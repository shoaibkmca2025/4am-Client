import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split the big libraries into their own chunks so they download in
        // PARALLEL (HTTP/2) instead of as one 453KB blob, and stay cached
        // across app-code deploys. No animation is touched — same code, just
        // loaded smarter. Vite auto-emits <link rel="modulepreload"> for these.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
          'gsap-vendor': ['gsap', 'lenis'],
        },
      },
    },
  },
});
