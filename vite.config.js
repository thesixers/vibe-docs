import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  return {
    base: mode === 'production' ? '/vibegx/' : '/',
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
    },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/highlight.js')) {
            return 'highlight';
          }
          if (id.includes('node_modules/marked')) {
            return 'marked';
          }
        }
      }
    }
  }
};
});
