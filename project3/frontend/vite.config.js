import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // ⬅ necessario per importare "@/..."
    },
  },

  server: {
    host: '0.0.0.0',  // ⬅ necessario in Docker
    port: 8080,         // ⬅ porta frontend
  }
})
