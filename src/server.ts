// import express from 'express';
import 'reflect-metadata';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import UsersResolver from './UsersResolver';
// import cors from 'cors';

const start = async () => {
  const schema = await buildSchema({
    resolvers: [UsersResolver],
  });

  const server = new ApolloServer({ schema });

  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`); // eslint-disable-line no-console

  const db = 'semidb';

  // Database
  mongoose
    .connect(`mongodb://127.0.0.1:27017/${db}`, {
      autoIndex: true,
    })
    .then(() => console.log(`Connected to database ${db}`)) // eslint-disable-line no-console
    .catch((err) => console.log(err)); // eslint-disable-line no-console
};

start();
