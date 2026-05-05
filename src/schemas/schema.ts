import { GraphQLSchema } from "graphql";

import RootQueryType from "@/schemas/types/root_query.type";
import RootMutationType from "@/schemas/types/root_mutation.type";

export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
