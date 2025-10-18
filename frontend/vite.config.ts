// vite.config.ts
// @ts-nocheck
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import eslintPlugin from "vite-plugin-eslint";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),      // ✅ must come *before* reactRouter()
    reactRouter(),      // ✅ react-router CLI plugin
    tsconfigPaths(),
    eslintPlugin(),
  ],
  optimizeDeps: {
    include: ["react", "react-dom", "react-router", "react-router-dom"],
    force: true,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
});
