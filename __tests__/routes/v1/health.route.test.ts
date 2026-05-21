import request from "supertest";

import type { Response } from "supertest";

import app from "@/app";

import { CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

describe("health.route", () => {
  describe("GET /api/v1/health/live", () => {
    it("should respond with 200 and the healthLive payload", async () => {
      const response: Response = await request(app).get("/api/v1/health/live");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.healthLive,
        message: MESSAGES_SUCCESS.healthLive,
        data: null,
      });
    });

    it("should serve JSON content", async () => {
      const response: Response = await request(app).get("/api/v1/health/live");

      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });
  });

  describe("GET /api/v1/health/ready", () => {
    it("should respond with 200 and the healthReady payload", async () => {
      const response: Response = await request(app).get("/api/v1/health/ready");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.healthReady,
        message: MESSAGES_SUCCESS.healthReady,
        data: null,
      });
    });
  });

  describe("unknown health subpath", () => {
    it("should respond with 404 from the not-found handler", async () => {
      const response: Response = await request(app).get("/api/v1/health/unknown");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        code: "NOT_FOUND_ROUTE",
        message: "[GraphQL] Route not found.",
      });
    });
  });
});
