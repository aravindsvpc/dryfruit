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
});
