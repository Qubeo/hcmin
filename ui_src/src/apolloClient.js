import { ApolloClient } from "apollo-client";
// import { SchemaLink } from "apollo-link-schema";
// import { makeExecutableSchema } from "graphql-tools";
// import apolloLogger from "apollo-link-logger";
// import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { typeDefs } from "./graphql/schema.gql";
import { resolvers } from "./resolvers";

console.log(resolvers);

/*
const schemaLink = new SchemaLink({
  schema: makeExecutableSchema({ typeDefs, resolvers })
});
*/

// Q: Do the WS calls directly over Apollo?
// Q: Implement GraphQL server directly on Holochain? :o
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql"
});

// var links = [schemaLink];

/* if (process.env.NODE_ENV !== "test") {
  links = [apolloLogger].concat(links);
} */

// const link = ApolloLink.from(links);

const apolloCache = new InMemoryCache(); // Q: { addTypename: true }?

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: apolloCache,
  typeDefs,
  resolvers,  
  connectToDevTools: true
});

export default apolloClient;
