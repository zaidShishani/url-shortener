import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
    plugins: [react(), tailwindcss()],
    root: "public",
    resolve: { alias: { "@": path.resolve(import.meta.dirname, "public/src") } },
    build: { outDir: "../dist", emptyOutDir: true },
    server: {
        port: 4041,
        proxy: { "/api": "http://localhost:4040" },
    },
}));
