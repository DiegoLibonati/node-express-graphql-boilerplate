import { AppError } from "@/errors/app.error";
import { UnauthorizedError } from "@/errors/unauthorized.error";

describe("unauthorized.error", () => {
  it("should be an instance of AppError and Error", () => {
    const error: UnauthorizedError = new UnauthorizedError("ERR", "no auth");

    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });

  it("should set status to 401", () => {
    const error: UnauthorizedError = new UnauthorizedError("ERR", "no auth");

    expect(error.status).toBe(401);
  });

  it("should expose the provided code and message", () => {
    const error: UnauthorizedError = new UnauthorizedError("ERR_NO_TOKEN", "Missing token");

    expect(error.code).toBe("ERR_NO_TOKEN");
    expect(error.message).toBe("Missing token");
  });

  it("should set name to UnauthorizedError", () => {
    const error: UnauthorizedError = new UnauthorizedError("ERR", "no auth");

    expect(error.name).toBe("UnauthorizedError");
  });
});
