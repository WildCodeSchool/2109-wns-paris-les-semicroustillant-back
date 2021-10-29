import { Schema, model } from 'mongoose';

const UsersSchema = new Schema({
  firstname: String,
  lastname: String ,
  email: { type: String, unique: true },
  hash: { type: String, unique: true },
  role: String,
  position: String,
});
const UsersModel = model('users', UsersSchema);
export default UsersModel;
