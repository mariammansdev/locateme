import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Use SPA mode for GitHub Pages deployment.
  basename: "/locateme/",
  ssr: false,
  prerender: false,
} satisfies Config;
