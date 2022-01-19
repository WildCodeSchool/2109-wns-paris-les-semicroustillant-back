import mongoose, { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  name: String,
  projectOwner: mongoose.Types.ObjectId,
  members: [mongoose.Types.ObjectId],
});
const projectModel = model('projects', projectSchema);

export default projectModel;
