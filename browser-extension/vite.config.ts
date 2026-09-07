import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

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
  plugins: [react(), escapeNonAsciiJavaScript()],
  server: {
    fs: {
      allow: [resolve(__dirname, "..")]
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/background/index.ts")
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background") {
            return "background/index.js";
          }

          return "assets/[name]-[hash].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  },
  publicDir: "public"
});
