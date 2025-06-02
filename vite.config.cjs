const { defineConfig } = require("vite");
module.exports = defineConfig({
  build: {
    ssr: "src/index.js",
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: "index.js" } },
  },
});
