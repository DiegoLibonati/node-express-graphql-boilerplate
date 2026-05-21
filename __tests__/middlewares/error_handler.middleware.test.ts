import type { NextFunction, Request, Response } from "express";
import type { AppError } from "@/errors/app.error";

import { BadRequestError } from "@/errors/bad_request.error";
import { NotFoundError } from "@/errors/not_found.error";

import { errorHandler } from "@/middlewares/error_handler.middleware";

import { logger } from "@/configs/logger.config";

import { CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_ERROR } from "@/constants/messages.constant";

const mockedLogger = logger as jest.Mocked<typeof logger>;

jest.mock("@/configs/logger.config", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

const buildMockReq = (): Request => ({}) as Request;

const buildMockRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("error_handler.middleware", () => {
  it("should respond with the status from an AppError", () => {
    const err: AppError = new BadRequestError("ERR_INVALID", "bad payload");
    const mockReq: Request = buildMockReq();
    const mockRes: Response = buildMockRes();
    const mockNext: NextFunction = jest.fn();

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      code: "ERR_INVALID",
      message: "bad payload",
    });
  });

  it("should respond with 404 for a NotFoundError using its defaults", () => {
    const err: NotFoundError = new NotFoundError();
    const mockReq: Request = buildMockReq();
    const mockRes: Response = buildMockRes();
    const mockNext: NextFunction = jest.fn();

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      code: err.code,
      message: err.message,
    });
  });

  it("should respond with 500 and generic code for a plain Error", () => {
    const err: Error = new Error("boom");
    const mockReq: Request = buildMockReq();
    const mockRes: Response = buildMockRes();
    const mockNext: NextFunction = jest.fn();

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      code: CODES_ERROR.generic,
      message: MESSAGES_ERROR.generic,
    });
  });

  it("should log via logger.error when status is >= 500", () => {
    const err: Error = new Error("boom");
    const mockReq: Request = buildMockReq();
    const mockRes: Response = buildMockRes();
    const mockNext: NextFunction = jest.fn();

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockedLogger.error).toHaveBeenCalledTimes(1);
    expect(mockedLogger.error).toHaveBeenCalledWith({ err }, err.message);
  });

  it("should not log via logger.error when status is < 500", () => {
    const err: AppError = new BadRequestError("ERR_INVALID", "bad payload");
    const mockReq: Request = buildMockReq();
    const mockRes: Response = buildMockRes();
    const mockNext: NextFunction = jest.fn();

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockedLogger.error).not.toHaveBeenCalled();
  });

  it("should not call next after handling the error", () => {
    const err: Error = new Error("boom");
    const mockReq: Request = buildMockReq();
    const mockRes: Response = buildMockRes();
    const mockNext: NextFunction = jest.fn();

    errorHandler(err, mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });
});
