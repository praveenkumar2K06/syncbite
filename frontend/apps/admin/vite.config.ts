import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const pick = (key: string, fallback: string) => process.env[key] || env[key] || fallback;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
        "@syncbite/shared": path.resolve(import.meta.dirname, "../../packages/shared/src"),
      },
    },
    server: {
      port: parseInt(process.env.PORT || "8445"),
      proxy: {
        "/api/v1": {
          target: pick("VITE_API_PROXY_TARGET", "http://127.0.0.1:8000"),
          changeOrigin: true,
        },
      },
    },
  };
});
