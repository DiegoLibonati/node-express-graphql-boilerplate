import { requireEnv } from "@/helpers/require_env.helper";

describe("require_env.helper", () => {
  const originalEnv = process.env;

  beforeEach((): void => {
    process.env = { ...originalEnv };
  });

  afterAll((): void => {
    process.env = originalEnv;
  });

  it("should return the value when the environment variable is set", () => {
    process.env.TEST_KEY = "hello";

    const result: string = requireEnv("TEST_KEY");

    expect(result).toBe("hello");
  });

  it("should throw when the environment variable is undefined", () => {
    delete process.env.TEST_KEY;

    expect(() => requireEnv("TEST_KEY")).toThrow("Missing required environment variable: TEST_KEY");
  });

  it("should throw when the environment variable is an empty string", () => {
    process.env.TEST_KEY = "";

    expect(() => requireEnv("TEST_KEY")).toThrow("Missing required environment variable: TEST_KEY");
  });

  it("should include the key name in the error message", () => {
    delete process.env.MY_SECRET;

    expect(() => requireEnv("MY_SECRET")).toThrow("MY_SECRET");
  });
});
