import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",        // necessario per funzionare in Docker
    port: 5173,             // porta esposta nel docker-compose
    strictPort: true,
    watch: {
      usePolling: true      // evita problemi con file system in Docker su Windows/Mac
    }
  }
});
