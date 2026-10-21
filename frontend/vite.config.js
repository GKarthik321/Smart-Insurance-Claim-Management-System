import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VM deployment note: set VITE_API_BASE_URL at build time to point to the
// backend's reachable address (e.g. http://<vm-ip>:8080) if not served from
// the same origin/reverse proxy.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  preview: {
    host: true,
    port: 4173
  }
});
