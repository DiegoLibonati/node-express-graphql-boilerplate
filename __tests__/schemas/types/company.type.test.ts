import type { GraphQLFieldMap } from "graphql";

import CompanyType from "@/schemas/types/company.type";

describe("company.type", () => {
  it("should have the expected name", () => {
    expect(CompanyType.name).toBe("CompanyType");
  });

  it("should expose the expected field names", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = CompanyType.getFields();

    expect(Object.keys(fields).sort()).toEqual(["name"]);
  });

  it("should expose name as String type", () => {
    const fields: GraphQLFieldMap<unknown, unknown> = CompanyType.getFields();

    expect(fields.name!.type.toString()).toBe("String");
  });
});
