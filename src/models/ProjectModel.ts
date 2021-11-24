import mongoose, { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  name: String,
  projectOwner: {type: mongoose.Types.ObjectId, unique: true},
  members: [{ 
    firstname: String,
    lastname: String,
    email: String,
    hash: String,
    role: String,
    position: String
  }]
});
const projectModel = model('projects', projectSchema);

export default projectModel;
