import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
//Line added so tscofig path alias and vite alias work in sync
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3100",
        secure: false,
      },
    },
  },

  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          open: true, // Automatically open the report in the browser
          filename: "bundle-report.html", // The name of the report file
        }),
      ],
    },
  },
});
