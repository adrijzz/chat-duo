import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseado no modo
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      host: true, // Permite acesso de outros dispositivos na rede
      port: parseInt(env.PORT || '5173'),
      strictPort: false, // Permite fallback para outra porta se a 5173 estiver em uso
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
    },
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'process.env.NODE_ENV': JSON.stringify(mode)
    }
  };
});
