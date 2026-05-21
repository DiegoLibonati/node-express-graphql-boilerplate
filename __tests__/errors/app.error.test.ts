import { AppError } from "@/errors/app.error";

describe("app.error", () => {
  it("should be an instance of Error", () => {
    const error: AppError = new AppError(500, "ERR_GENERIC", "boom");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it("should expose status, code and message from the constructor", () => {
    const error: AppError = new AppError(418, "ERR_TEAPOT", "I am a teapot");

    expect(error.status).toBe(418);
    expect(error.code).toBe("ERR_TEAPOT");
    expect(error.message).toBe("I am a teapot");
  });

  it("should set name to AppError when instantiated directly", () => {
    const error: AppError = new AppError(500, "X", "y");

    expect(error.name).toBe("AppError");
  });

  it("should set name to the subclass when extended", () => {
    class CustomError extends AppError {
      constructor() {
        super(403, "FORBIDDEN", "denied");
      }
    }
    const error: AppError = new CustomError();

    expect(error.name).toBe("CustomError");
  });

  it("should expose status and code as readonly at compile time and stable at runtime", () => {
    const error: AppError = new AppError(500, "X", "y");
    const firstStatus: number = error.status;
    const firstCode: string = error.code;

    expect(error.status).toBe(firstStatus);
    expect(error.code).toBe(firstCode);
  });

  it("should be catchable by instanceof in a try/catch", () => {
    try {
      throw new AppError(500, "X", "boom");
    } catch (e) {
      expect(e instanceof AppError).toBe(true);
      expect(e instanceof Error).toBe(true);
    }
  });
});
