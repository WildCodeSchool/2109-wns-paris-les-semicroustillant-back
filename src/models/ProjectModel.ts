import mongoose, { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  id: mongoose.Types.ObjectId,
  name: String,
  status: String,
  description: String,
  projectOwner: mongoose.Types.ObjectId,
  members: [mongoose.Types.ObjectId],
});
const projectModel = model('projects', projectSchema);

export default projectModel;
