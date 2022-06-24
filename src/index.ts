/* eslint-disable no-console */
import 'reflect-metadata';
import createConnection from './createConnection';
import createServer from './server';

async function start() {
  try {
    const db = process.env.DB_NAME;

    console.log('awaiting for database connection');

    /* ---- If running the server locally, use : ---- */
    await createConnection(`mongodb://127.0.0.1:27017/${db}`);

    /* ---- If running with Docker, use : ---- */
    // await createConnection(`mongodb://mongodb:27017/${db}`);

    console.log('connected to database');
    const server = await createServer();

    // Start the server
    const { url } = await server.listen(4000);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
  } catch (err: unknown) {
    console.log(err);
  }
}

start();

/*
@TODO: 
  [x] add input sanitizer middleware, remove $
  [x] create reusable method to remove `hash` for data
  [x] only return necessary data in queries/mutation

  [] user profile picture to be handled with a File System.
  [] add csurf in cookie management to prevent csrf attacks
  [] add cookie management / session management

  [] Remove cors since already in Apollo server
*/
