const User = require('./../Models/userModel');
const catchAsync = require('../utility/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      user: newUser
    }
  });
});
