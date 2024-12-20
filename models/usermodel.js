import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
  },
  photo: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    isLowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'please provide a password.'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confrim your password'],
    validate: {
      //this only work on save! and Create !
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same.',
    },
  },
});

userSchema.pre('save', async function (next) {
  //Only run this function if pasword was actually modified.
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
