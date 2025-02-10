import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  server: {
    proxy: {
      '/metadata': {
        target: 'http://localhost:9753',
        changeOrigin: true
      },
      '/rtc': {
        target: 'http://localhost:9753',
        changeOrigin: true
      },
    },
  },
})
