// @ts-nocheck
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(),  eslintPlugin()],
  optimizeDeps: {
    include: ["react", "react-dom","react-router", "react-router-dom"],
    force: true,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    watch: {
      usePolling: true, // helps on macOS + FS cache issues
    },
  },
});
