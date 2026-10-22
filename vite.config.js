import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [react()],
    root: "public",
    build: { outDir: "../dist", emptyOutDir: true },
    server: {
        port: 4041,
        proxy: { "/api": "http://localhost:4040" },
    },
});
