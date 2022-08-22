import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import UsersResolver from './resolvers/UsersResolver';
import TicketsResolver from './resolvers/TicketsResolver';
import ProjectsResolver from './resolvers/ProjectsResolver';
import LoginResolver from './resolvers/LoginResolver';
import customAuthChecker from './auth/customAuthChecker';
import SanitizeInputMiddleware from './utils/sanitizeInput';

async function createServer() {
  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      TicketsResolver,
      ProjectsResolver,
      LoginResolver,
    ],
    authChecker: customAuthChecker,
    globalMiddlewares: [SanitizeInputMiddleware],
  });

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      token: req?.headers.authorization,
      user: null,
    }),
    csrfPrevention: true,
    cors: {
      origin: [
        /http:\/\/localhost:/,
        'https://studio.apollographql.com',
        'https://paris2-0921.wns.wilders.dev',
        'https://staging.paris2-0921.wns.wilders.dev/',
      ],
      credentials: true,
    },
  });

  return server;
}

export default createServer;
