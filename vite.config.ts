
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const isProd = process.env.NODE_ENV === 'production' || process.env.MODE === 'production';

// Ensure Vercel builds use root base to avoid asset 404s when deployed at root.
const computedBase = isVercel ? '/' : (isProd ? '/epistemic-play--2-/' : '/');

export default defineConfig({
  // Vercel serves the app from root; keep GH Pages subpath for non-Vercel production builds.
  base: computedBase,
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    target: 'esnext'
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
});
