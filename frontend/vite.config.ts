import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

const babelPlugins = [];

if (process.env.MIGHTYMELD) {
  babelPlugins.push("mightymeld/babel-plugin-mightymeld");
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: babelPlugins,
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:3030",
    },
  },
});
