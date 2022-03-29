import 'reflect-metadata';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import UsersResolver from './resolvers/UsersResolver';
import TicketsResolver from './resolvers/TicketsResolver';
import ProjectsResolver from './resolvers/ProjectsResolver';
import LoginResolver from './resolvers/LoginResolver';

export const jwtKey = 'my_secret_key_that_must_be_very_long';
async function createServer() {
  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      TicketsResolver,
      ProjectsResolver,
      LoginResolver,
    ],
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      console.log(req.headers.authorization);
      const token = req.headers.authorization;
      if (token) {
        let payload: JwtPayload;
        try {
          payload = jwt.verify(token, jwtKey) as JwtPayload;
          return { authenticatedUserEmail: payload.user };
        } catch (err) {
          console.log('err', err);
          return {};
        }
      } else return {};
    },
  });

  return server;
}

export default createServer;
