import mongoose, { Schema, model } from 'mongoose';

const UpdateUserSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  firstname: String,
  lastname: String ,
  email: { type: String, unique: true },
  hash: { type: String, unique: true },
  role: String,
  position: String,
});
const UpdateUser = mongoose.models.users || model('users', UpdateUserSchema);
export default UpdateUser;
