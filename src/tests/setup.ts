import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import createConnection from '../createConnection';

let mongoServer: MongoMemoryServer;
let db: typeof mongoose;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  // @TODO: WIP - Trying to mock authentication in mongoose connection
  // mongoServer = await MongoMemoryServer.create({
  //   auth: { disable: true },
  //   instance: {
  //     auth: true,
  //     storageEngine: 'wiredTiger',
  //   },
  // });

  const mongoUri = mongoServer.getUri();
  db = await createConnection(mongoUri);
});

beforeEach(async () => {
  await db.connection.collection('users').deleteMany({});
  await db.connection.collection('tickets').deleteMany({});
  await db.connection.collection('projects').deleteMany({});
});

afterAll(async () => {
  await db.connection.close();
  await mongoServer.stop();
});
