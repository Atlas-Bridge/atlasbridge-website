import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./client/src/__tests__/setup.ts"],
    include: ["client/src/**/*.test.{ts,tsx}", "shared/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["client/src/**/*.{ts,tsx}", "shared/**/*.ts"],
      exclude: ["**/__tests__/**", "**/*.test.*", "client/src/components/ui/**"],
    },
  },
});
