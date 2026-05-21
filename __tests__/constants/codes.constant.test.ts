import { CODES_SUCCESS, CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";

describe("codes.constant", () => {
  describe("CODES_SUCCESS", () => {
    it("should expose healthLive", () => {
      expect(CODES_SUCCESS.healthLive).toBe("SUCCESS_HEALTH_LIVE");
    });

    it("should expose healthReady", () => {
      expect(CODES_SUCCESS.healthReady).toBe("SUCCESS_HEALTH_READY");
    });
  });

  describe("CODES_ERROR", () => {
    it("should expose the generic error code", () => {
      expect(CODES_ERROR.generic).toBe("ERROR_GENERIC");
    });

    it("should expose the validation error code", () => {
      expect(CODES_ERROR.validation).toBe("ERROR_VALIDATION");
    });
  });

  describe("CODES_NOT", () => {
    it("should expose the foundRoute not-found code", () => {
      expect(CODES_NOT.foundRoute).toBe("NOT_FOUND_ROUTE");
    });
  });

  it("should not have duplicate values across all code groups", () => {
    const values: string[] = [
      ...Object.values(CODES_SUCCESS),
      ...Object.values(CODES_ERROR),
      ...Object.values(CODES_NOT),
    ];
    const unique = new Set(values);

    expect(unique.size).toBe(values.length);
  });
});
