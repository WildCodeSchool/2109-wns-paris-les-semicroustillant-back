import { Schema, model } from 'mongoose';

const UsersSchema = new Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, unique: true },
  hash: { type: String, unique: true },
  role: { type: String },
  position: { type: String },
});
const UsersModel = model('users', UsersSchema);
export default UsersModel;
