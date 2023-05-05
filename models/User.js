const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
     type: String,
     required: true 
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 18,
    min: 18,
    max: 100
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  avatar: {
    type: Buffer //store binary image data
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // tokens: [{
  //   token: {
  //     type: String,
  //     required: true
  //   }
  // }]

  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
