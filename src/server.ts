import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import UsersResolver from './resolvers/UsersResolver';
import TicketsResolver from './resolvers/TicketsResolver';
import ProjectsResolver from './resolvers/ProjectsResolver';
import LoginResolver from './resolvers/LoginResolver';
import customAuthChecker from './auth/customAuthChecker';

async function createServer() {
  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      TicketsResolver,
      ProjectsResolver,
      LoginResolver,
    ],
    authChecker: customAuthChecker,
  });

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,

    // @TODO: WIP - temporary disabling authentication to make integration tests work
    // context: ({ req }) => ({
    //   token: req.headers.authorization,
    //   user: null,
    // }),
  });

  return server;
}

export default createServer;
