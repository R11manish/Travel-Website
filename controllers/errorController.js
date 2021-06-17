const AppError = require('../utility/appError');
const handleCastErrorDB = err => {
  const message = `invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
  const value = err.keyValue.name;
  const message = `Duplicate Field value : ${value} .please try another one`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//jwt error
const handleJWTError = () =>
  new AppError('invalid token , please try to log in again', 401);

const handleJWTExpiredToken = () =>
  new AppError('Ecpired Token , please login again', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'something went wrong',
      msg: err.message
    })
  }
};

const sendErrorProd = (err, req, res) => {
  //operational error , trusted error - send to the client
  //A) for api
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // unknown errors - hided from the client
    // 1) log on the error
    console.error('ERROR 🔥🔥', err);
    // 2) send generic message
    return res.status(500).json({
      status: 'Error',
      message: 'something went wrong!! please try again after some time'
    });

  }
  // B) for website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'something went wrong',
      msg: err.message
    })
  }
  // unknown errors - hided from the client
  // 1) log on the error
  console.error('ERROR 🔥🔥', err);
  // 2) send generic message
  return res.status(err.statusCode).render('error', {
    title: 'something went wrong',
    msg: 'something went wrong!! please try again after some time'
  })

};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message
    console.log(error);
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredToken();
    sendErrorProd(error, req, res);
  }
};