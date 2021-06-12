const Review = require('../Models/reviewModel');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const Factory = require('./handlerFactory');

//display all the reviews
exports.getAllReview = catchAsync(async (req, res, next) => {
  let filter = {}
  if (req.params.tourId) filter = { tour: req.params.tourId }
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

//function to create a review
exports.createReview = catchAsync(async (req, res, next) => {
  //Allow nested Routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const createReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: createReview
    }
  });
});

exports.deleteReview = Factory.deleteOne(Review);

