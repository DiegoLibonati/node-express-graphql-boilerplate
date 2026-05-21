import { AppError } from "@/errors/app.error";
import { ConflictError } from "@/errors/conflict.error";

describe("conflict.error", () => {
  it("should be an instance of AppError and Error", () => {
    const error: ConflictError = new ConflictError("ERR", "conflict");

    expect(error).toBeInstanceOf(ConflictError);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });

  it("should set status to 409", () => {
    const error: ConflictError = new ConflictError("ERR", "conflict");

    expect(error.status).toBe(409);
  });

  it("should expose the provided code and message", () => {
    const error: ConflictError = new ConflictError("ERR_DUPLICATE", "Already exists");

    expect(error.code).toBe("ERR_DUPLICATE");
    expect(error.message).toBe("Already exists");
  });

  it("should set name to ConflictError", () => {
    const error: ConflictError = new ConflictError("ERR", "conflict");

    expect(error.name).toBe("ConflictError");
  });
});
