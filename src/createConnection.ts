import mongoose from 'mongoose';

async function createConnection(uri: string) {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  };

  return mongoose.connect(uri, options);
}

export default createConnection;
