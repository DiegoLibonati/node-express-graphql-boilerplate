import { CODES_SUCCESS, CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";

describe("codes.constant", () => {
  describe("CODES_SUCCESS", () => {
    it("should be an empty object", () => {
      expect(CODES_SUCCESS).toEqual({});
    });
  });

  describe("CODES_ERROR", () => {
    it("should have the generic error code", () => {
      expect(CODES_ERROR.generic).toBe("ERROR_GENERIC");
    });
  });

  describe("CODES_NOT", () => {
    it("should have the foundRoute not-found code", () => {
      expect(CODES_NOT.foundRoute).toBe("NOT_FOUND_ROUTE");
    });
  });
});
