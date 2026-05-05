import type { Request, Response } from "express";

import { notFoundHandler } from "@/middlewares/not_found_handler.middleware";

const buildReq = (): Partial<Request> => ({});

const buildRes = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("not_found_handler.middleware", () => {
  it("should respond with status 404", () => {
    const req = buildReq() as Request;
    const res = buildRes() as Response;

    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should respond with the not-found code and message", () => {
    const req = buildReq() as Request;
    const res = buildRes() as Response;

    notFoundHandler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      code: "NOT_FOUND_ROUTE",
      message: "[GraphQL] Route not found.",
    });
  });

  it("should call status and json exactly once each", () => {
    const req = buildReq() as Request;
    const res = buildRes() as Response;

    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
