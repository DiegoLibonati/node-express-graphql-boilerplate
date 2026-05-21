import type { NextFunction, Request, Response } from "express";

import { requestId } from "@/middlewares/request_id.middleware";

const HEADER = "x-request-id";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const buildMockReq = (incomingHeader?: string): Request => {
  const headers: Record<string, string> = {};
  if (incomingHeader !== undefined) {
    headers[HEADER] = incomingHeader;
  }
  return {
    header: (name: string): string | undefined => headers[name.toLowerCase()],
  } as unknown as Request;
};

const buildMockRes = (): Response => {
  const res: Partial<Response> = {};
  res.setHeader = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("request_id.middleware", () => {
  it("should reuse the incoming x-request-id header when present", () => {
    const mockReq: Request = buildMockReq("abc-123");
    const mockRes: Response = buildMockRes();
    const mockNext: NextFunction = jest.fn();

    requestId(mockReq, mockRes, mockNext);

    expect(mockReq.id).toBe("abc-123");
    expect(mockRes.setHeader).toHaveBeenCalledWith(HEADER, "abc-123");
  });

  it("should generate a UUID when the header is missing", () => {
    const mockReq: Request = buildMockReq();
    const mockRes: Response = buildMockRes();
    const mockNext: NextFunction = jest.fn();

    requestId(mockReq, mockRes, mockNext);

    expect(mockReq.id).toMatch(UUID_RE);
    expect(mockRes.setHeader).toHaveBeenCalledWith(HEADER, mockReq.id);
  });

  it("should generate a UUID when the header is an empty string", () => {
    const mockReq: Request = buildMockReq("");
    const mockRes: Response = buildMockRes();
    const mockNext: NextFunction = jest.fn();

    requestId(mockReq, mockRes, mockNext);

    expect(mockReq.id).toMatch(UUID_RE);
  });

  it("should generate distinct UUIDs across calls without incoming headers", () => {
    const ids: string[] = [];
    for (let i = 0; i < 3; i += 1) {
      const mockReq: Request = buildMockReq();
      const mockRes: Response = buildMockRes();
      const mockNext: NextFunction = jest.fn();
      requestId(mockReq, mockRes, mockNext);
      ids.push(mockReq.id);
    }

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should call next exactly once with no arguments", () => {
    const mockReq: Request = buildMockReq("abc-123");
    const mockRes: Response = buildMockRes();
    const mockNext: NextFunction = jest.fn();

    requestId(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith();
  });
});
