import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite acesso de outros dispositivos na rede
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
