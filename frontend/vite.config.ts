import svgr from "@svgr/rollup";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      watch: {
        usePolling: true,
      },
      cors: false,
    },
    preview: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      cors: false,
    },
    define: {
      "process.env.API_URL": JSON.stringify(env.VITE_API_URL),
      "process.env.FRONT_URL": JSON.stringify(env.VITE_FRONT_URL),
    },
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: browserslistToTargets(browserslist('>= 0.25%'))
      }
    },
    build: {
      cssCodeSplit: true,
      cssMinify: 'lightningcss',
    },
    plugins: [
      react({
        babel: {
          plugins: ["@emotion/babel-plugin"],
        },
      }),
      svgr(),
      TanStackRouterVite(),
      ViteImageOptimizer({
        png: {
          quality: 70,
        },
        jpeg: {
          quality: 70,
        },
        jpg: {
          quality: 70,
        },
        webp: {
          lossless: true,
        },
        avif: {
          lossless: true,
        },
        svg: {
          multipass: true,
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  removeViewBox: false,
                  removeEmptyAttrs: false,
                },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
