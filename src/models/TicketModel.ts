import mongoose, { Schema, model } from 'mongoose';

const TicketSchema = new Schema({
  id: mongoose.Types.ObjectId,
  created_by: mongoose.Types.ObjectId,
  subject: String,
  status: String,
  deadline: Date,
  description: String,
  initial_time_estimated: Number,
  total_time_spent: Number,
  advancement: Number,
  project_id: { type: String, default: null },
  users: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
});
const TicketModel = model('tickets', TicketSchema);

export default TicketModel;
