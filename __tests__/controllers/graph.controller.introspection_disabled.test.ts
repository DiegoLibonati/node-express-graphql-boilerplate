import { NoSchemaIntrospectionCustomRule } from "graphql";

const mockCreateHandler: jest.Mock = jest.fn();

jest.mock("graphql-http/lib/use/express", () => ({
  createHandler: mockCreateHandler,
}));

jest.mock("@/configs/env.config", () => ({
  envs: {
    ENV: "production",
    PORT: 5050,
    BASE_URL: "",
    API_URL: "http://test-api",
    HTTP_TIMEOUT_MS: 5000,
    RATE_LIMIT_WINDOW_MS: 60000,
    RATE_LIMIT_MAX: 100,
    GRAPHIQL_ENABLED: false,
    GRAPHQL_INTROSPECTION: false,
    LOG_LEVEL: "silent",
    BODY_LIMIT: "1gb",
    SEED_DEFAULT_DATA: false,
  },
}));

describe("graph.controller (introspection disabled)", () => {
  it("should include NoSchemaIntrospectionCustomRule in validationRules when GRAPHQL_INTROSPECTION is false", () => {
    mockCreateHandler.mockReturnValue(jest.fn());

    jest.requireActual("@/controllers/graph.controller");

    expect(mockCreateHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        validationRules: [NoSchemaIntrospectionCustomRule],
      }),
    );
  });
});
