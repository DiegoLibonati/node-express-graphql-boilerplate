import { MESSAGES_SUCCESS, MESSAGES_ERROR, MESSAGES_NOT } from "@/constants/messages.constant";

describe("messages.constant", () => {
  describe("MESSAGES_SUCCESS", () => {
    it("should expose healthLive message", () => {
      expect(MESSAGES_SUCCESS.healthLive).toBe("Service is alive.");
    });

    it("should expose healthReady message", () => {
      expect(MESSAGES_SUCCESS.healthReady).toBe("Service is ready.");
    });
  });

  describe("MESSAGES_ERROR", () => {
    it("should expose the generic error message", () => {
      expect(MESSAGES_ERROR.generic).toBe("[GraphQL] Something went wrong!");
    });

    it("should expose the validation error message", () => {
      expect(MESSAGES_ERROR.validation).toBe("Validation failed.");
    });
  });

  describe("MESSAGES_NOT", () => {
    it("should expose the foundRoute not-found message", () => {
      expect(MESSAGES_NOT.foundRoute).toBe("[GraphQL] Route not found.");
    });
  });
});
