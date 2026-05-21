import type { NextFunction, Request, RequestHandler, Response } from "express";

const mockRateLimit: jest.Mock = jest.fn();

jest.mock("express-rate-limit", () => ({
  __esModule: true,
  default: mockRateLimit,
}));

describe("rate_limit.middleware", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach((): void => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterEach((): void => {
    process.env = originalEnv;
  });

  const loadModule = (): { rateLimiter: RequestHandler } => {
    return jest.requireActual("@/middlewares/rate_limit.middleware");
  };

  it("should build the limiter with the configured window and max when RATE_LIMIT_MAX > 0", () => {
    process.env.API_URL = "http://test-api";
    process.env.RATE_LIMIT_MAX = "10";
    process.env.RATE_LIMIT_WINDOW_MS = "60000";

    const stubbedHandler: RequestHandler = (
      _req: Request,
      _res: Response,
      next: NextFunction,
    ): void => {
      next();
    };
    mockRateLimit.mockReturnValue(stubbedHandler);

    loadModule();

    expect(mockRateLimit).toHaveBeenCalledTimes(1);
    expect(mockRateLimit).toHaveBeenCalledWith(
      expect.objectContaining({
        windowMs: 60000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
      }),
    );
  });

  it("should expose the limiter returned by express-rate-limit when RATE_LIMIT_MAX > 0", () => {
    process.env.API_URL = "http://test-api";
    process.env.RATE_LIMIT_MAX = "5";

    const stubbedHandler: RequestHandler = jest.fn();
    mockRateLimit.mockReturnValue(stubbedHandler);

    const { rateLimiter } = loadModule();

    expect(rateLimiter).toBe(stubbedHandler);
  });

  it("should expose a passthrough that calls next when RATE_LIMIT_MAX is 0", () => {
    process.env.API_URL = "http://test-api";
    process.env.RATE_LIMIT_MAX = "0";

    const { rateLimiter } = loadModule();

    expect(mockRateLimit).not.toHaveBeenCalled();

    const mockReq: Request = {} as Request;
    const mockRes: Response = {} as Response;
    const mockNext: NextFunction = jest.fn();

    rateLimiter(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith();
  });
});
