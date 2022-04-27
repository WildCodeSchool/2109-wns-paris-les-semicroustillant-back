import mongoose, { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
  id: mongoose.Types.ObjectId,
  name: String,
  status: String,
  description: String,
  projectOwner: { type: mongoose.Types.ObjectId, default: null, ref: 'users' },
  members: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
  
  // NOT IN DATABASE MODEL IF NOT PERSISTED
  // completedTickets: { type: Number, default: null },
  // totalTickets: { type: Number, default: null },
});
const ProjectModel = model('projects', ProjectSchema);

export default ProjectModel;
