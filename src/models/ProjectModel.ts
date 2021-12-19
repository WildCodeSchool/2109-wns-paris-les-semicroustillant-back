import mongoose, { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  name: String,
  projectOwner: mongoose.Types.ObjectId,
  members: [
    {
      // Should be objectId instead, can create duplicates
      firstname: String,
      lastname: String,
      email: String,
      hash: String,
      role: String,
      position: String,
    },
  ],
});
const projectModel = model('projects', projectSchema);

export default projectModel;
