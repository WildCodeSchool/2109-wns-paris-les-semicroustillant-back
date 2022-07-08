import mongoose, { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
  id: mongoose.Types.ObjectId,
  created_by: mongoose.Types.ObjectId,
  name: String,
  status: String,
  description: String,
  project_owner: { type: mongoose.Types.ObjectId, default: null, ref: 'users' },
  members: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
});
const ProjectModel = model('projects', ProjectSchema);

export default ProjectModel;
