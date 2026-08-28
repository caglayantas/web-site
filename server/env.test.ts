import { afterEach, describe, expect, it, vi } from "vitest";

describe("production environment validation", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("fails closed when a required production variable is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    for (const key of ["DATABASE_URL", "JWT_SECRET", "VITE_APP_ID", "OAUTH_SERVER_URL", "OWNER_OPEN_ID", "BUILT_IN_FORGE_API_URL", "BUILT_IN_FORGE_API_KEY"]) {
      vi.stubEnv(key, "");
    }
    const { assertProductionEnv } = await import("./_core/env");
    expect(() => assertProductionEnv()).toThrow(/DATABASE_URL/);
  });
});
