import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";

const CreateUserInputType = new GraphQLInputObjectType({
  name: "CreateUserInput",
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLString },
    website: { type: GraphQLString },
  },
});

export default CreateUserInputType;
