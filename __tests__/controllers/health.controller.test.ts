import type { NextFunction, Request, Response } from "express";

import { HealthController } from "@/controllers/health.controller";

import { CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

const buildMockReq = (): Request => ({}) as Request;

const buildMockRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("health.controller", () => {
  describe("live", () => {
    it("should respond with status 200", () => {
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      HealthController.live(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should respond with the healthLive code, message and null data", () => {
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      HealthController.live(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.healthLive,
        message: MESSAGES_SUCCESS.healthLive,
        data: null,
      });
    });

    it("should not call next on the happy path", () => {
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      HealthController.live(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should forward the error to next when res.json throws", () => {
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();
      const boom: Error = new Error("boom");
      (mockRes.json as jest.Mock).mockImplementation((): never => {
        throw boom;
      });

      HealthController.live(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(boom);
    });
  });

  describe("ready", () => {
    it("should respond with status 200", () => {
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      HealthController.ready(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should respond with the healthReady code, message and null data", () => {
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      HealthController.ready(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.healthReady,
        message: MESSAGES_SUCCESS.healthReady,
        data: null,
      });
    });

    it("should not call next on the happy path", () => {
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();

      HealthController.ready(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should forward the error to next when res.json throws", () => {
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();
      const boom: Error = new Error("boom");
      (mockRes.json as jest.Mock).mockImplementation((): never => {
        throw boom;
      });

      HealthController.ready(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(boom);
    });
  });
});
