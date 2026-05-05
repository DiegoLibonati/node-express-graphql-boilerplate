import { GraphQLNonNull, GraphQLObjectType } from "graphql";

import CreateUserInputType from "@/schemas/types/create_user_input.type";
import UserType from "@/schemas/types/user.type";

import { MutationResolver } from "@/resolvers/mutation.resolver";

const RootMutationType = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        input: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: MutationResolver.createUser,
    },
  },
});

export default RootMutationType;
