import type { GraphQLFieldMap } from "graphql";

import RootMutationType from "@/schemas/types/root_mutation.type";

jest.mock("@/configs/env.config", () => ({
  envs: { API_URL: "http://test-api" },
}));

describe("root_mutation.type", () => {
  it("should have the expected name", () => {
    expect(RootMutationType.name).toBe("RootMutation");
  });

  it("should expose the expected field names", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = RootMutationType.getFields();

    expect(Object.keys(fields).sort()).toEqual(["createUser"]);
  });

  it("should expose createUser as UserType", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = RootMutationType.getFields();

    expect(fields.createUser!.type.toString()).toBe("UserType");
  });

  it("should require input as CreateUserInput! argument on createUser", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = RootMutationType.getFields();
    const inputArg = fields.createUser!.args.find((a) => a.name === "input");

    expect(inputArg).toBeDefined();
    expect(inputArg?.type.toString()).toBe("CreateUserInput!");
  });
});
