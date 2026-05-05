import { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLNonNull } from "graphql";

import UserType from "@/schemas/types/user.type";

import { QueryResolver } from "@/resolvers/query.resolver";

const RootQueryType = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: QueryResolver.users,
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: QueryResolver.user,
    },
  },
});

export default RootQueryType;
