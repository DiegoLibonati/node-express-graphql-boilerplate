import type { GraphQLFieldMap } from "graphql";

import UserType from "@/schemas/types/user.type";

describe("user.type", () => {
  it("should have the expected name", () => {
    expect(UserType.name).toBe("UserType");
  });

  it("should expose the expected field names", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = UserType.getFields();

    expect(Object.keys(fields).sort()).toEqual([
      "company",
      "email",
      "id",
      "name",
      "phone",
      "username",
      "website",
    ]);
  });

  it("should expose id as ID type", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = UserType.getFields();

    expect(fields.id!.type.toString()).toBe("ID");
  });

  it("should expose name as String type", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = UserType.getFields();

    expect(fields.name!.type.toString()).toBe("String");
  });

  it("should expose email as String type", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = UserType.getFields();

    expect(fields.email!.type.toString()).toBe("String");
  });

  it("should expose username as String type", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = UserType.getFields();

    expect(fields.username!.type.toString()).toBe("String");
  });

  it("should expose phone as String type", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = UserType.getFields();

    expect(fields.phone!.type.toString()).toBe("String");
  });

  it("should expose website as String type", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = UserType.getFields();

    expect(fields.website!.type.toString()).toBe("String");
  });

  it("should expose company as CompanyType", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = UserType.getFields();

    expect(fields.company!.type.toString()).toBe("CompanyType");
  });
});
