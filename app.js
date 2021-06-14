const express = require('express');
const morgan = require('morgan');
const path = require('path');
const AppError = require('./utility/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoute');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

// 1)GLOBAL  MIDDLEWARES
//serving static files
app.use(express.static(path.join(__dirname, 'public')));
// set security Http method
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit request from same ip
limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this ip. please try again in an hour'
});

app.use('/api', limiter);

//body parser , reading data from body into  req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSql query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);


//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers)
  next();
});
// 3) ROUTES
app.get('/', (req, res) => {
  res.status(200).render('base');
})
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//error handling   route
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
