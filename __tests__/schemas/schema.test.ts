import type { GraphQLObjectType } from "graphql";

import { schema } from "@/schemas/schema";

jest.mock("@/configs/env.config", () => ({
  envs: { API_URL: "http://test-api" },
}));

describe("schema", () => {
  it("should expose a query type named RootQuery", () => {
    const queryType: GraphQLObjectType | null | undefined = schema.getQueryType();

    expect(queryType).toBeDefined();
    expect(queryType?.name).toBe("RootQuery");
  });

  it("should expose a mutation type named RootMutation", () => {
    const mutationType: GraphQLObjectType | null | undefined = schema.getMutationType();

    expect(mutationType).toBeDefined();
    expect(mutationType?.name).toBe("RootMutation");
  });

  it("should expose the expected query fields", () => {
    const queryType: GraphQLObjectType | null | undefined = schema.getQueryType();
    const fields = queryType?.getFields() ?? {};

    expect(Object.keys(fields).sort()).toEqual(["user", "users"]);
  });

  it("should expose the expected mutation fields", () => {
    const mutationType: GraphQLObjectType | null | undefined = schema.getMutationType();
    const fields = mutationType?.getFields() ?? {};

    expect(Object.keys(fields).sort()).toEqual(["createUser"]);
  });

  it("should require id as Int! argument on the user query", () => {
    const queryType: GraphQLObjectType | null | undefined = schema.getQueryType();
    const fields = queryType?.getFields() ?? {};
    const idArg = fields.user?.args.find((a) => a.name === "id");

    expect(idArg).toBeDefined();
    expect(idArg?.type.toString()).toBe("Int!");
  });
});
