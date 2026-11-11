import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const resolvePath = (relativePath: string) => fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@content": resolvePath("./content"),
      "@": resolvePath("./src"),
      // `server-only` throws outside a React Server environment; tests replace it with a no-op.
      "server-only": resolvePath("./src/testing/server-only.ts"),
    },
  },
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      // Route files are thin compositions exercised by the end-to-end suite.
      exclude: ["src/app/**", "src/types/**", "src/testing/**", "src/**/*.test.{ts,tsx}"],
      reporter: ["text-summary", "html", "json-summary"],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.test.ts", "scripts/**/*.test.ts", "supabase/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "jsdom",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["./src/testing/setup-dom.ts"],
        },
      },
    ],
  },
});
