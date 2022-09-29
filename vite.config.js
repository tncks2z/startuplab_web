import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '/@': fileURLToPath(new URL('./src', import.meta.url)),
      '/@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '/@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '/@service': fileURLToPath(new URL('./src/service', import.meta.url)),
      '/@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '/@store': fileURLToPath(new URL('./src/store', import.meta.url)),
    },
  },
  build: { chunkSizeWarningLimit: 1024 },
  css: {
    devSourcemap: true,
  },
});
