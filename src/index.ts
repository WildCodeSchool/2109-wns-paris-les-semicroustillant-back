/* eslint-disable no-console */
import 'reflect-metadata';

import createConnection from './createConnection';
import createServer from './server';

async function start() {
  
  try {
    const db = 'semidb';

    console.log('awaiting for database connection');
    await createConnection(`mongodb://127.0.0.1:27017/${db}`);
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