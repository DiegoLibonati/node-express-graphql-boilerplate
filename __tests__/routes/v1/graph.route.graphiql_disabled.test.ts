import express from "express";
import request from "supertest";

import type { Response } from "supertest";
import type { Router } from "express";

jest.mock("@/configs/env.config", () => ({
  envs: {
    ENV: "production",
    PORT: 5050,
    BASE_URL: "",
    API_URL: "http://test-api",
    HTTP_TIMEOUT_MS: 5000,
    RATE_LIMIT_WINDOW_MS: 60000,
    RATE_LIMIT_MAX: 0,
    GRAPHIQL_ENABLED: false,
    GRAPHQL_INTROSPECTION: false,
    LOG_LEVEL: "silent",
    BODY_LIMIT: "1gb",
    SEED_DEFAULT_DATA: false,
  },
}));

describe("graph.route (graphiql disabled)", () => {
  it("should not register /graphiql when GRAPHIQL_ENABLED is false", async () => {
    const routeMod: { default: Router } = jest.requireActual("@/routes/v1/graph.route");
    const app = express();
    app.use("/api/v1", routeMod.default);
    app.use((_req, res) => {
      res.status(404).json({ code: "NOT_FOUND_ROUTE" });
    });

    const response: Response = await request(app).get("/api/v1/graphiql");

    expect(response.status).toBe(404);
  });
});
