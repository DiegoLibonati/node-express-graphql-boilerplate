import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";

describe("bad_request.error", () => {
  it("should be an instance of AppError and Error", () => {
    const error: BadRequestError = new BadRequestError("ERR", "bad");

    expect(error).toBeInstanceOf(BadRequestError);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });

  it("should set status to 400", () => {
    const error: BadRequestError = new BadRequestError("ERR", "bad");

    expect(error.status).toBe(400);
  });

  it("should expose the provided code and message", () => {
    const error: BadRequestError = new BadRequestError("ERR_INVALID", "Invalid payload");

    expect(error.code).toBe("ERR_INVALID");
    expect(error.message).toBe("Invalid payload");
  });

  it("should set name to BadRequestError", () => {
    const error: BadRequestError = new BadRequestError("ERR", "bad");

    expect(error.name).toBe("BadRequestError");
  });
});
