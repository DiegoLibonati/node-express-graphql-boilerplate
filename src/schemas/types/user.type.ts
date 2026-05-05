import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";

import CompanyType from "@/schemas/types/company.type";

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    website: { type: GraphQLString },
    company: { type: CompanyType },
  },
});

export default UserType;
