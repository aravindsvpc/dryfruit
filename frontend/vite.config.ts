import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173, // Render will override this with process.env.PORT
    allowedHosts: ['srisakhambari.onrender.com'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist', // Ensure build output is in dist
    sourcemap: false,
  },
  base: './', // Use relative base path for static hosting
});
