const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please fill the name '],
    maxLength: [10, 'maximum name value for the tour should be 40'],
    minLength: [4, 'minimum name value for the tour should be atleast 10']
  },

  email: {
    type: String,
    required: [true, 'please provide your email address'],
    unique: true,
    validate: [validator.isEmail, 'please provide a valid email address']
  },

  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'please enter your password'],
    minLength: [6, 'This password is very short. please enter 6 character'],
    maxLength: [
      12,
      'This password is too long , you can enter your password upto 12 character'
    ]
  },

  confirmPassword: {
    type: String,
    required: [true, 'please enter your confirm password'],
    validate: {
      // only gonna to work on  CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same'
    }
  }
});

userSchema.pre('save', async function(next) {
  
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  //delete the  confirm password field
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
