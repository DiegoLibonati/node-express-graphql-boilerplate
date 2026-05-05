import type { GraphQLInputFieldMap } from "graphql";

import CreateUserInputType from "@/schemas/types/create_user_input.type";

describe("create_user_input.type", () => {
  it("should have the expected name", () => {
    expect(CreateUserInputType.name).toBe("CreateUserInput");
  });

  it("should expose the expected input field names", () => {
    const fields: GraphQLInputFieldMap = CreateUserInputType.getFields();

    expect(Object.keys(fields).sort()).toEqual(["email", "name", "phone", "username", "website"]);
  });

  it("should require name as non-null String", () => {
    const fields: GraphQLInputFieldMap = CreateUserInputType.getFields();

    expect(fields.name!.type.toString()).toBe("String!");
  });

  it("should require username as non-null String", () => {
    const fields: GraphQLInputFieldMap = CreateUserInputType.getFields();

    expect(fields.username!.type.toString()).toBe("String!");
  });

  it("should require email as non-null String", () => {
    const fields: GraphQLInputFieldMap = CreateUserInputType.getFields();

    expect(fields.email!.type.toString()).toBe("String!");
  });

  it("should expose phone as optional String", () => {
    const fields: GraphQLInputFieldMap = CreateUserInputType.getFields();

    expect(fields.phone!.type.toString()).toBe("String");
  });

  it("should expose website as optional String", () => {
    const fields: GraphQLInputFieldMap = CreateUserInputType.getFields();

    expect(fields.website!.type.toString()).toBe("String");
  });
});
