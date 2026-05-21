import { AppError } from "@/errors/app.error";
import { NotFoundError } from "@/errors/not_found.error";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

describe("not_found.error", () => {
  it("should be an instance of AppError and Error", () => {
    const error: NotFoundError = new NotFoundError();

    expect(error).toBeInstanceOf(NotFoundError);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });

  it("should set status to 404", () => {
    const error: NotFoundError = new NotFoundError();

    expect(error.status).toBe(404);
  });

  it("should default code to CODES_NOT.foundRoute when not provided", () => {
    const error: NotFoundError = new NotFoundError();

    expect(error.code).toBe(CODES_NOT.foundRoute);
  });

  it("should default message to MESSAGES_NOT.foundRoute when not provided", () => {
    const error: NotFoundError = new NotFoundError();

    expect(error.message).toBe(MESSAGES_NOT.foundRoute);
  });

  it("should accept a custom code and message", () => {
    const error: NotFoundError = new NotFoundError("ERR_USER_NOT_FOUND", "User not found");

    expect(error.code).toBe("ERR_USER_NOT_FOUND");
    expect(error.message).toBe("User not found");
  });

  it("should set name to NotFoundError", () => {
    const error: NotFoundError = new NotFoundError();

    expect(error.name).toBe("NotFoundError");
  });
});
