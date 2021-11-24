import mongoose, { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
  id: mongoose.Types.ObjectId,
  subject: String,
  status: String,
  users: Array,
  deadline: Date,
  description: String,
  initial_time_estimated: Number,
  total_time_spent: Number,
  advancement: Number,
  file_links: Array,
});
const TicketsModel = model('tickets', ticketSchema);

export default TicketsModel;
