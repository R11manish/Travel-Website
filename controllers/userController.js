const User = require('../Models/userModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');


// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users')
//   },

//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

const multerStorage = multer.memoryStorage();


const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload only images .', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})


exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

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
  console.log(req.file.filename);


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
  if (req.file) filteredBody.photo = req.file.filename;

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