import mongoose, { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  id: mongoose.Types.ObjectId,
  name: String,
  status: String,
  description: String,
  projectOwner: { type: mongoose.Types.ObjectId, default: null, ref: 'users' },
  members: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
  advancement: Number,
});
const projectModel = model('projects', projectSchema);

export default projectModel;
