// import 'reflect-metadata';
// import { ApolloServer } from "apollo-server";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import projectController from './controllers/projects';

const db = 'semidb';
const app = express();

// Database
mongoose
  .connect(`mongodb://127.0.0.1:27017/${db}`, {
    autoIndex: true,
  })
  .then(() => console.log(`Connected to database ${db}`)) // eslint-disable-line no-console
  .catch((err) => console.log(err)); // eslint-disable-line no-console

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// const server = new ApolloServer({ schema: schema });
// app.post('/api/wilders', wilderController.create);
app.get('/api/projects', projectController.read);
// app.put('/api/wilders', wilderController.update);
// app.delete('/api/wilders', wilderController.delete);

// Start Server
app.listen(5000, () => console.log('Server started on 5000')); // eslint-disable-line no-console
