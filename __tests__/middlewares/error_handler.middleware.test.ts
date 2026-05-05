import type { NextFunction, Request, Response } from "express";

import { errorHandler } from "@/middlewares/error_handler.middleware";

const buildReq = (): Partial<Request> => ({});

const buildRes = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("error_handler.middleware", () => {
  let mockConsoleError: jest.SpyInstance;

  beforeEach((): void => {
    mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => {
      // Empty fn
    });
  });

  it("should respond with status 500", () => {
    const err: Error = new Error("boom");
    const req = buildReq() as Request;
    const res = buildRes() as Response;
    const next: NextFunction = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should respond with the generic code and message", () => {
    const err: Error = new Error("boom");
    const req = buildReq() as Request;
    const res = buildRes() as Response;
    const next: NextFunction = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      code: "ERROR_GENERIC",
      message: "[GraphQL] Something went wrong!",
    });
  });

  it("should not call next after handling the error", () => {
    const err: Error = new Error("boom");
    const req = buildReq() as Request;
    const res = buildRes() as Response;
    const next: NextFunction = jest.fn();

    errorHandler(err, req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("should log the error to console", () => {
    const err: Error = new Error("boom");
    const req = buildReq() as Request;
    const res = buildRes() as Response;
    const next: NextFunction = jest.fn();

    errorHandler(err, req, res, next);

    expect(mockConsoleError).toHaveBeenCalled();
  });

  it("should prefer err.stack over err.message when logging", () => {
    const err: Error = new Error("boom");
    err.stack = "Error: boom\n  at test:1";
    const req = buildReq() as Request;
    const res = buildRes() as Response;
    const next: NextFunction = jest.fn();

    errorHandler(err, req, res, next);

    expect(mockConsoleError).toHaveBeenCalledWith(err.stack);
  });

  it("should fall back to err.message when stack is undefined", () => {
    const err: Error = new Error("no stack");
    err.stack = undefined!;
    const req = buildReq() as Request;
    const res = buildRes() as Response;
    const next: NextFunction = jest.fn();

    errorHandler(err, req, res, next);

    expect(mockConsoleError).toHaveBeenCalledWith("no stack");
  });
});
