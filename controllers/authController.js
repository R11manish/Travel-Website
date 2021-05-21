const jwt = require('jsonwebtoken');
const User = require('./../Models/userModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'Success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  //1) checking email and password
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  //2) check if user and password is correct
  const user = await User.findOne({ email }).select('+password');
  //3) if everything is ok send username and password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});
