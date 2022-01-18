import mongoose from 'mongoose';

async function createConnection(uri: string) {
  return mongoose.connect(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    autoIndex: true,
  });
}

export default createConnection;
