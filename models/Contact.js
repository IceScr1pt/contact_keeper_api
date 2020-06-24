const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  //connection between contact to a user,levrey user has their own contact
  user: {
    type: mongoose.Schema.Types.ObjectId,
    //refer the users collectoin
    ref: 'users',
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  type: {
    type: String,
    default: 'personal',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('contact', ContactSchema);
