import type { Envs } from "@/types/env";

jest.mock("@/configs/dotenv.config", () => ({
  loadEnvFiles: (): string[] => [],
}));

describe("env.config", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  const loadEnvs = (): { envs: Envs; loadedEnvFiles: string[] } => {
    return jest.requireActual("@/configs/env.config");
  };

  it("should expose an envs object", () => {
    const { envs } = loadEnvs();

    expect(envs).toBeDefined();
  });

  it("should expose the list of applied env files", () => {
    const { loadedEnvFiles } = loadEnvs();

    expect(loadedEnvFiles).toEqual([]);
  });

  it("should default PORT to 5050 when PORT is not set", () => {
    delete process.env.PORT;

    const { envs } = loadEnvs();

    expect(envs.PORT).toBe(5050);
  });

  it("should coerce PORT from string to number", () => {
    process.env.PORT = "3000";

    const { envs } = loadEnvs();

    expect(envs.PORT).toBe(3000);
    expect(typeof envs.PORT).toBe("number");
  });

  it("should default NODE_ENV to development when not set", () => {
    delete process.env.NODE_ENV;

    const { envs } = loadEnvs();

    expect(envs.ENV).toBe("development");
  });

  it("should accept production as NODE_ENV", () => {
    process.env.NODE_ENV = "production";

    const { envs } = loadEnvs();

    expect(envs.ENV).toBe("production");
  });

  it("should default BASE_URL to empty string", () => {
    delete process.env.BASE_URL;

    const { envs } = loadEnvs();

    expect(envs.BASE_URL).toBe("");
  });

  it("should expose API_URL when provided", () => {
    process.env.API_URL = "http://test-api";

    const { envs } = loadEnvs();

    expect(envs.API_URL).toBe("http://test-api");
  });

  it("should throw when API_URL is missing", () => {
    delete process.env.API_URL;

    expect(() => loadEnvs()).toThrow(/Invalid environment variables/);
  });

  it("should throw when API_URL is not a valid URL", () => {
    process.env.API_URL = "not-a-url";

    expect(() => loadEnvs()).toThrow(/Invalid environment variables/);
  });

  it("should default HTTP_TIMEOUT_MS to 5000", () => {
    delete process.env.HTTP_TIMEOUT_MS;

    const { envs } = loadEnvs();

    expect(envs.HTTP_TIMEOUT_MS).toBe(5000);
  });

  it("should default RATE_LIMIT_WINDOW_MS to 60000", () => {
    delete process.env.RATE_LIMIT_WINDOW_MS;

    const { envs } = loadEnvs();

    expect(envs.RATE_LIMIT_WINDOW_MS).toBe(60_000);
  });

  it("should default RATE_LIMIT_MAX to 100", () => {
    delete process.env.RATE_LIMIT_MAX;

    const { envs } = loadEnvs();

    expect(envs.RATE_LIMIT_MAX).toBe(100);
  });

  it("should accept 0 as RATE_LIMIT_MAX to disable rate limiting", () => {
    process.env.RATE_LIMIT_MAX = "0";

    const { envs } = loadEnvs();

    expect(envs.RATE_LIMIT_MAX).toBe(0);
  });

  it("should default LOG_LEVEL to info", () => {
    delete process.env.LOG_LEVEL;

    const { envs } = loadEnvs();

    expect(envs.LOG_LEVEL).toBe("info");
  });

  it("should accept silent as LOG_LEVEL", () => {
    process.env.LOG_LEVEL = "silent";

    const { envs } = loadEnvs();

    expect(envs.LOG_LEVEL).toBe("silent");
  });

  it("should throw when LOG_LEVEL is not a recognized value", () => {
    process.env.LOG_LEVEL = "bogus";

    expect(() => loadEnvs()).toThrow(/Invalid environment variables/);
  });

  it("should default BODY_LIMIT to 1gb", () => {
    delete process.env.BODY_LIMIT;

    const { envs } = loadEnvs();

    expect(envs.BODY_LIMIT).toBe("1gb");
  });

  it("should default SEED_DEFAULT_DATA to false", () => {
    delete process.env.SEED_DEFAULT_DATA;

    const { envs } = loadEnvs();

    expect(envs.SEED_DEFAULT_DATA).toBe(false);
  });

  it("should default GRAPHIQL_ENABLED to true when NODE_ENV is not production", () => {
    process.env.NODE_ENV = "development";
    delete process.env.GRAPHIQL_ENABLED;

    const { envs } = loadEnvs();

    expect(envs.GRAPHIQL_ENABLED).toBe(true);
  });

  it("should default GRAPHIQL_ENABLED to false when NODE_ENV is production", () => {
    process.env.NODE_ENV = "production";
    delete process.env.GRAPHIQL_ENABLED;

    const { envs } = loadEnvs();

    expect(envs.GRAPHIQL_ENABLED).toBe(false);
  });

  it("should respect explicit GRAPHIQL_ENABLED=false even in development", () => {
    process.env.NODE_ENV = "development";
    process.env.GRAPHIQL_ENABLED = "false";

    const { envs } = loadEnvs();

    expect(envs.GRAPHIQL_ENABLED).toBe(false);
  });

  it("should default GRAPHQL_INTROSPECTION to false when NODE_ENV is production", () => {
    process.env.NODE_ENV = "production";
    delete process.env.GRAPHQL_INTROSPECTION;

    const { envs } = loadEnvs();

    expect(envs.GRAPHQL_INTROSPECTION).toBe(false);
  });

  it("should respect explicit GRAPHQL_INTROSPECTION=true even in production", () => {
    process.env.NODE_ENV = "production";
    process.env.GRAPHQL_INTROSPECTION = "true";

    const { envs } = loadEnvs();

    expect(envs.GRAPHQL_INTROSPECTION).toBe(true);
  });
});
