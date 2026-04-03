import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, "src/content/index.ts"),
      output: {
        format: "iife",
        name: "ClavisPassContentScript",
        inlineDynamicImports: true,
        entryFileNames: "content/index.js"
      }
    }
  },
  publicDir: false
});
