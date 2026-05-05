import type { GraphQLFieldMap } from "graphql";

import RootQueryType from "@/schemas/types/root_query.type";

jest.mock("@/configs/env.config", () => ({
  envs: { API_URL: "http://test-api" },
}));

describe("root_query.type", () => {
  it("should have the expected name", () => {
    expect(RootQueryType.name).toBe("RootQuery");
  });

  it("should expose the expected field names", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = RootQueryType.getFields();

    expect(Object.keys(fields).sort()).toEqual(["user", "users"]);
  });

  it("should expose users as a list of UserType", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = RootQueryType.getFields();

    expect(fields.users!.type.toString()).toBe("[UserType]");
  });

  it("should expose user as UserType", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = RootQueryType.getFields();

    expect(fields.user!.type.toString()).toBe("UserType");
  });

  it("should require id as Int! argument on the user field", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = RootQueryType.getFields();
    const idArg = fields.user!.args.find((a) => a.name === "id");

    expect(idArg).toBeDefined();
    expect(idArg?.type.toString()).toBe("Int!");
  });

  it("should have no arguments on the users field", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = RootQueryType.getFields();

    expect(fields.users!.args).toHaveLength(0);
  });
});
