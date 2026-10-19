import { defineConfig } from "@playwright/test";
import path from "node:path";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "editor.spec.ts",
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3120", channel: "chrome", trace: "on-first-retry" },
  projects: [{ name: "editor-desktop", use: { viewport: { width: 1280, height: 900 } } }],
  webServer: {
    command: "npm run dev -- --webpack --hostname 127.0.0.1 --port 3120",
    url: "http://127.0.0.1:3120/gestao",
    reuseExistingServer: false,
    timeout: 120_000,
    // Fictitious configuration; browser tests mock mutations and never write to Sanity.
    env: {
      NEXT_FONT_GOOGLE_MOCKED_RESPONSES: path.resolve("tests/font-responses.cjs"),
      NEXT_PUBLIC_SANITY_PROJECT_ID: "editor-test",
      NEXT_PUBLIC_SANITY_DATASET: "test",
      SANITY_EDITOR_TOKEN: "test-only-not-a-real-token",
      EDITOR_USERNAME: "test-editor",
      EDITOR_PASSWORD_HASH: "test-only",
      EDITOR_SESSION_SECRET: "test-only-session-secret-with-at-least-32-characters",
    },
  },
});
