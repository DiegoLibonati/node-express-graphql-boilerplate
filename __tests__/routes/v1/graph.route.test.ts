import request from "supertest";

import type { Response } from "supertest";

import app from "@/app";

describe("graph.route", () => {
  describe("POST /api/v1/graphql", () => {
    it("should respond from the GraphQL handler for a meta __typename query", async () => {
      const response: Response = await request(app)
        .post("/api/v1/graphql")
        .set("Content-Type", "application/json")
        .send({ query: "{ __typename }" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: { __typename: "RootQuery" } });
    });

    it("should respond with errors for an unknown field", async () => {
      const response: Response = await request(app)
        .post("/api/v1/graphql")
        .set("Content-Type", "application/json")
        .send({ query: "{ doesNotExist }" });

      expect(response.status).toBeLessThan(500);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /api/v1/graphiql", () => {
    it("should respond with 200 and HTML content when GRAPHIQL is enabled", async () => {
      const response: Response = await request(app).get("/api/v1/graphiql");

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/text\/html/);
      expect(response.text.length).toBeGreaterThan(0);
    });

    it("should override the default Content-Security-Policy so ruru assets from unpkg.com are allowed", async () => {
      const response: Response = await request(app).get("/api/v1/graphiql");

      const csp: string = response.headers["content-security-policy"] ?? "";
      expect(csp).toContain("script-src 'self' 'unsafe-inline' https://unpkg.com");
      expect(csp).toContain("connect-src 'self' https://unpkg.com");
    });
  });

  describe("POST /api/v1/unknown", () => {
    it("should respond with 404 from the not-found handler for unknown routes under /api/v1", async () => {
      const response: Response = await request(app).post("/api/v1/unknown");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        code: "NOT_FOUND_ROUTE",
        message: "[GraphQL] Route not found.",
      });
    });
  });
});
