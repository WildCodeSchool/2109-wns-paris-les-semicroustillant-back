import mongoose, { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
  subject: String,
  status: String,
  users: Array,
  deadline: [Date],
  description: String,
  initial_time_estimated: Number,
total_time_spent: Number,
  advancement: Number,
  files: Array
   
});
const ticketModel = model('wilder', ticketSchema);

export default ticketModel;
