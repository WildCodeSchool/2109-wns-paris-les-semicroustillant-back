import mongoose, { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  id: mongoose.Types.ObjectId,
  firstname: String,
  lastname: String ,
  email: { type: String, unique: true },
  hash: { type: String, unique: true },
  role: String,
  position: String,
});
const UserModel = model('users', UserSchema);
export default UserModel;
