import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import UsersResolver from './resolvers/UsersResolver';

async function createServer() {
  const schema = await buildSchema({
    resolvers: [UsersResolver],
  });
  // Create the GraphQL server
  const server = new ApolloServer({ schema });

  return server;
}

export default createServer;
