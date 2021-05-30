const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../Models/userModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const sendEmail = require('./../utility/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  //remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt
  });

  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) get and check the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'right now you are not logged in! please log in first to get access',
        401
      )
    );
  }
  // 2) verification of token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does not longer exist',
        401
      )
    );
  }
  // 4) check if user changed password after the token was issued.
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('user recently changed password! please log in again', 401)
    );
  }
  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['admin','lead-guide'], role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1 get user based on posted email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError('there is no user exist with this email address', 404)
    );
  }

  //2 generate the random reset token

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3 send it to users email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password ? enter your new password to this URL: ${resetURL}. we will proceed it.\n ignore this message if you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password  resend token is valid for (upto 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error. while sending the email. try again later!'
      ),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  //2) if token has not expired, and there is user, set the new password

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //3) update changedPasswordAt property for the user
  //4) log the user in , send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1 ) get user from collection
  const user = await User.findById(req.user.id).select('+password');
  //2) check if posted current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('your current password is wrong', 401));
  }

  //3) if so update password

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  //4) log in user in , send JWT
  createSendToken(user, 200, res);
});
