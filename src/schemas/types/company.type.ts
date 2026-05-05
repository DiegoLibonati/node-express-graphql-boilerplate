import { GraphQLObjectType, GraphQLString } from "graphql";

const CompanyType = new GraphQLObjectType({
  name: "CompanyType",
  fields: {
    name: { type: GraphQLString },
  },
});

export default CompanyType;
