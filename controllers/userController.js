const User = require('../Models/userModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const factory = require('./handlerFactory');


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};


exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! please use /signup route instead'
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}



exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);


  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for update password. please use /update-password route',
        400
      )
    );
  }

  //filter the data which is coming from user
  const filteredBody = filterObj(req.body, 'name', 'email');

  //update the document of user

  updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  deleteUser = await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});


exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
//DO NOT update user password from this
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);