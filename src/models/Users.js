import mongoose, { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
  email: String,
  hash: String,
  firstName: String,
  lastName: String,
  role: String,
  position: String,
   
});
const ticketModel = model('wilder', ticketSchema);

export default ticketModel;
