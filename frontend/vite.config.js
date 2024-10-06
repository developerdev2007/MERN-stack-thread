import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    ////////////// GEt rid of the CORS error
    proxy: {
      "/api": {
        target: "https://mern-stack-thread-backend.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
