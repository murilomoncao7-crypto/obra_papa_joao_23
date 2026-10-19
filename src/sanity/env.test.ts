import { afterEach, describe, expect, it, vi } from "vitest";
import { getSanityPublicConfig, getSanityReadToken } from "./env";

afterEach(() => vi.unstubAllEnvs());

describe("Sanity integration environment", () => {
  it("accepts identifiers and read token names provided by the Vercel integration", () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", undefined);
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", undefined);
    vi.stubEnv("SANITY_API_PROJECT_ID", "institution-test");
    vi.stubEnv("SANITY_API_DATASET", "production");
    vi.stubEnv("SANITY_API_TOKEN", undefined);
    vi.stubEnv("SANITY_API_READ_TOKEN", "test-only-token");
    expect(getSanityPublicConfig()).toEqual({
      projectId: "institution-test",
      dataset: "production",
    });
    expect(getSanityReadToken()).toBe("test-only-token");
  });
  it("preserves the explicit configuration over integration aliases", () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "explicit-project");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "staging");
    vi.stubEnv("SANITY_API_PROJECT_ID", "integration-project");
    vi.stubEnv("SANITY_API_DATASET", "production");
    expect(getSanityPublicConfig()).toEqual({ projectId: "explicit-project", dataset: "staging" });
  });
});
