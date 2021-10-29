import mongoose, { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  name: String,
  projectOwner: {type: mongoose.Types.ObjectId, unique: true},
  members: Array
  
});
const projectModel = model('projects', projectSchema);

export default projectModel;
