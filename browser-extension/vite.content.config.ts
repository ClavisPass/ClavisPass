import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";

function escapeNonAsciiJavaScript(): Plugin {
  return {
    name: "escape-non-ascii-javascript",
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") {
          continue;
        }

        output.code = output.code.replace(/[^\x00-\x7F]/g, (character) => {
          const codePoint = character.codePointAt(0);
          if (codePoint === undefined) {
            return character;
          }

          return codePoint <= 0xffff
            ? `\\u${codePoint.toString(16).padStart(4, "0")}`
            : `\\u{${codePoint.toString(16)}}`;
        });
      }
    }
  };
}

export default defineConfig({
  plugins: [escapeNonAsciiJavaScript()],
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
