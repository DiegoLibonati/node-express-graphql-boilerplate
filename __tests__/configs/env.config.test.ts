import { envs } from "@/configs/env.config";

jest.mock("@/helpers/require_env.helper", () => ({
  requireEnv: jest.fn().mockReturnValue("http://test-api"),
}));

describe("env.config", () => {
  it("should export an envs object", () => {
    expect(envs).toBeDefined();
  });

  it("should expose PORT as a number", () => {
    expect(typeof envs.PORT).toBe("number");
  });

  it("should default PORT to 5050 when PORT env var is not set", () => {
    expect(envs.PORT).toBe(5050);
  });

  it("should expose ENV as a valid environment string", () => {
    const validEnvs: string[] = ["development", "production", "test"];

    expect(validEnvs).toContain(envs.ENV);
  });

  it("should expose BASE_URL as a string", () => {
    expect(typeof envs.BASE_URL).toBe("string");
  });

  it("should set API_URL from the requireEnv call", () => {
    expect(envs.API_URL).toBe("http://test-api");
  });
});
