import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/locateme/",
  plugins: [tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    outDir: "build/client",
  },
});
