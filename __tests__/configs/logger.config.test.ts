import type { Logger } from "pino";

const mockPino: jest.Mock = jest.fn();

jest.mock("pino", () => {
  return Object.assign(mockPino, { __esModule: true, default: mockPino });
});

describe("logger.config", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  const loadLogger = (): { logger: Logger } => {
    return jest.requireActual("@/configs/logger.config");
  };

  it("should create a pino logger once at import time", () => {
    process.env.API_URL = "http://test-api";
    mockPino.mockReturnValue({ tag: "stubbed-logger" });

    loadLogger();

    expect(mockPino).toHaveBeenCalledTimes(1);
  });

  it("should propagate the configured LOG_LEVEL to pino", () => {
    process.env.API_URL = "http://test-api";
    process.env.LOG_LEVEL = "debug";
    mockPino.mockReturnValue({ tag: "stubbed-logger" });

    loadLogger();

    expect(mockPino).toHaveBeenCalledWith(expect.objectContaining({ level: "debug" }));
  });

  it("should include the pino-pretty transport in development", () => {
    process.env.API_URL = "http://test-api";
    process.env.NODE_ENV = "development";
    mockPino.mockReturnValue({ tag: "stubbed-logger" });

    loadLogger();

    expect(mockPino).toHaveBeenCalledWith(
      expect.objectContaining({
        transport: expect.objectContaining({
          target: "pino-pretty",
          options: expect.objectContaining({ colorize: true }),
        }),
      }),
    );
  });

  it("should not include the pino-pretty transport in production", () => {
    process.env.API_URL = "http://test-api";
    process.env.NODE_ENV = "production";
    mockPino.mockReturnValue({ tag: "stubbed-logger" });

    loadLogger();

    const firstCallArgs = mockPino.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(firstCallArgs.transport).toBeUndefined();
  });

  it("should not include the pino-pretty transport in test", () => {
    process.env.API_URL = "http://test-api";
    process.env.NODE_ENV = "test";
    mockPino.mockReturnValue({ tag: "stubbed-logger" });

    loadLogger();

    const firstCallArgs = mockPino.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(firstCallArgs.transport).toBeUndefined();
  });

  it("should expose the created logger", () => {
    process.env.API_URL = "http://test-api";
    mockPino.mockReturnValue({ tag: "stubbed-logger" });

    const { logger } = loadLogger();

    expect(logger).toEqual({ tag: "stubbed-logger" });
  });
});
