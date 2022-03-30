import 'reflect-metadata';
import 'dotenv/config';
// import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import UsersResolver from './resolvers/UsersResolver';
import TicketsResolver from './resolvers/TicketsResolver';
import ProjectsResolver from './resolvers/ProjectsResolver';
import LoginResolver from './resolvers/LoginResolver';
import customAuthChecker from './auth';

export const jwtKey = 'my_secret_key_that_must_be_very_long';
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

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      token: req.headers.authorization,
      user: null,
    }),
  });

  return server;
}

export default createServer;
