import type { ExceptionInfo } from "@/types/helpers";

import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";
import { ConflictError } from "@/errors/conflict.error";
import { NotFoundError } from "@/errors/not_found.error";
import { UnauthorizedError } from "@/errors/unauthorized.error";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

import { CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_ERROR } from "@/constants/messages.constant";

describe("get_exception_message.helper", () => {
  it("should return status, code and message from an AppError instance", () => {
    const error: AppError = new AppError(418, "ERR_TEAPOT", "I am a teapot");

    const result: ExceptionInfo = getExceptionMessage(error);

    expect(result).toEqual({ status: 418, code: "ERR_TEAPOT", message: "I am a teapot" });
  });

  it("should map a BadRequestError to status 400", () => {
    const error: BadRequestError = new BadRequestError("ERR_INVALID", "bad");

    const result: ExceptionInfo = getExceptionMessage(error);

    expect(result.status).toBe(400);
    expect(result.code).toBe("ERR_INVALID");
    expect(result.message).toBe("bad");
  });

  it("should map an UnauthorizedError to status 401", () => {
    const error: UnauthorizedError = new UnauthorizedError("ERR_AUTH", "no auth");

    const result: ExceptionInfo = getExceptionMessage(error);

    expect(result.status).toBe(401);
  });

  it("should map a NotFoundError to status 404 with its defaults", () => {
    const error: NotFoundError = new NotFoundError();

    const result: ExceptionInfo = getExceptionMessage(error);

    expect(result.status).toBe(404);
    expect(result.code).toBe(error.code);
    expect(result.message).toBe(error.message);
  });

  it("should map a ConflictError to status 409", () => {
    const error: ConflictError = new ConflictError("ERR_DUPLICATE", "conflict");

    const result: ExceptionInfo = getExceptionMessage(error);

    expect(result.status).toBe(409);
  });

  it("should fall back to generic 500 for a plain Error", () => {
    const error: Error = new Error("boom");

    const result: ExceptionInfo = getExceptionMessage(error);

    expect(result).toEqual({
      status: 500,
      code: CODES_ERROR.generic,
      message: MESSAGES_ERROR.generic,
    });
  });

  it("should fall back to generic 500 for a non-Error throw", () => {
    const result: ExceptionInfo = getExceptionMessage("oops");

    expect(result).toEqual({
      status: 500,
      code: CODES_ERROR.generic,
      message: MESSAGES_ERROR.generic,
    });
  });

  it("should fall back to generic 500 for null", () => {
    const result: ExceptionInfo = getExceptionMessage(null);

    expect(result).toEqual({
      status: 500,
      code: CODES_ERROR.generic,
      message: MESSAGES_ERROR.generic,
    });
  });

  it("should fall back to generic 500 for undefined", () => {
    const result: ExceptionInfo = getExceptionMessage(undefined);

    expect(result.status).toBe(500);
    expect(result.code).toBe(CODES_ERROR.generic);
  });
});
