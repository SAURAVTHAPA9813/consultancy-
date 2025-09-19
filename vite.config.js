// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),        // @ → src
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)), // @styles → src/styles
    },
  },
  alias: {
  '@': fileURLToPath(new URL('./src', import.meta.url)),
  '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
}

});
